import Country from "./Country"
import GeoUtil from "./GeoUtil.js"
import Event from './Event'

import vertex from './../glsl/earth/shader.vert'
import fragment from './../glsl/earth/shader.frag'

import {Vector3, Vector2, Mesh, SphereGeometry, MeshStandardMaterial, LineBasicMaterial, Geometry, Line, BufferGeometry, BufferAttribute, ShaderMaterial, Points} from 'three';

class Earth extends Event {

  //http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualavg/tas/1961/1999/FRA

  static get SIZE(){ return 6371 ;}
	static get STYLE_POINT(){ return 1 ;}
	static get STYLE_TRIANGLE(){ return 2 ;}
	static get MESS_STATE() {return 3; }
	static get ORDONATE_STATE() {return 4; }

	constructor(args) {
		super(args)
    this.firstTime = args.firstTime;
		this.eventsList = ['noiseEnd', 'noiseStart', 'load'];
    console.log(this.firstTime)
		this.geometry;
		this.material;
		this.mesh;
		this.shaders = { fragment: fragment, vertex: vertex }
		this.radius = args.size ? args.size : Earth.SIZE;
		this.ratio = this.radius / Earth.SIZE
		this.datas = args.datas;
		this.datasType = args.datasType;
		this.countries = [];
		this.nbPoints = 0;
		this.vertices = [];
		this.faces = [];
		this.uniforms = {
			u_time: { type: "f", value: 0 },
			start: { type: "f", value: 0 },
			end: { type: "f", value: 0 },
			powerNoise: { type: "f", value: 1 },
			u_target: { type: "vec3", value: new Vector3(0, 0, 0) }
		};

    if(!this.firstTime) {
      this.uniforms.powerNoise.value = 0;
      this.animTarget = false ;
      this.animTarget = Earth.ORDONATE_STATE;
    } else {
      //this.uniforms.powerNoise.value = 0;
      this.ordonate = true;
    }
	}

	set ordonate(ordonate){
		if(ordonate) {
			this.animTarget = Earth.ORDONATE_STATE;
			this.needNoiseUpdate = true;
		} else {
			this.animTarget = Earth.MESS_STATE;
			this.needNoiseUpdate = true;
			this.casterHelper.scale.copy(new Vector3(0, 0, 0));
		}
	}

  createCasterHelper(){
    var geometry = new SphereGeometry(5, 32, 32);
    var material = new MeshStandardMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0
    });
    this.casterHelper = new Mesh(geometry, material);
    this.casterHelper.rotation.x = -Math.PI/2;
    this.casterHelper.name = "CasterTarget";
    this.casterHelper.scale.copy(new Vector3(0, 0, 0));
  }

	loadGeojson(){
		for(var i=0; i<this.datas.features.length; i++) {
			this.countries.push(new Country(this.datas.features[i]));
			this.countries[i].genCartesian(this.radius);
			this.countries[i].startRank = this.nbPoints;
			this.vertices = this.vertices.concat( this.countries[i].geometry.points);
			if(this.countries[i].nameLong === "France") {
				this.uniforms.start = this.countries[i].startRank*3;
				this.uniforms.end = this.countries[i].startRank*3 + this.countries[i].geometry.points.length*3;
				console.log(this.countries[i].geometry.points)
			}
			this.nbPoints += this.countries[i].geometry.points.length;
		}
	}

	loadRawDatas() {
    var vec = new Vector3(0, 0, 0);
		for(var i=0; i<this.datas.length; i++) {
			this.vertices.push(GeoUtil.coordToCart({
				lon: this.datas[i][2],
				lat: this.datas[i][1]
			}, this.radius + this.datas[i][0]*0.5))
		}
	}

	createTriangleFromPoint(vec) {
		// var quaternion = new THREE.Quaternion();
		// quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );

		// var vector = new THREE.Vector3( 1, 0, 0 );
		// vector.applyQuaternion( quaternion );
	}

	getGeoCoord(point) {
		var result = GeoUtil.cartToCoord(point, this.radius)
		return result;
	}

	genVertices(){
		switch(this.datasType) {
			case "geojson": this.loadGeojson(); break;
			case "raw": this.loadRawDatas(); break;
		}
    if( this.style == Earth.STYLE_TRIANGLE ) {
			var radius = 0.3;
			var postVertices = [];
      var vertices
			for(var i=0; i<this.vertices.length; i++) {
				postVertices.push()
			}
		}
		this.nbPoints = this.vertices.length;
	}

	// Gen buffer from vertices
	genBuffer(){
		var l = this.nbPoints*3;
		this.buffer = new Float32Array(l);
		for(var i=0, j=0; i<this.nbPoints; i+=3, j++) {
			this.buffer[i] 		= this.vertices[j].x
			this.buffer[i + 1] 	= this.vertices[j].y
			this.buffer[i + 2] 	= this.vertices[j].z
		}
		return this.buffer;
	}

	// Gen geometry
	genGeometry(){
		this.geometry = new BufferGeometry();
		this.geometry.addAttribute( 'rank', new BufferAttribute( new Float32Array(this.nbPoints*3).map((i, r) => {return r}), 3))
		this.geometry.addAttribute( 'position', new BufferAttribute( this.buffer, 3))
	}

	genFaces(){
		for(var i=0; i<this.vertices.length; i++) {
			//this.faces.push(new THREE.Face)
		}
	}

	// Gen shader material
	genMaterial() {
		this.material = new ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: this.shaders.vertex,
        fragmentShader: this.shaders.fragment,
        transparent: true
    });
	}

	// Create Object3D component
	initObject3d() {
		this.genVertices();
		this.genBuffer()

		if(this.buffer && this.shaders) {
			this.genGeometry();
			this.genMaterial();

      this.mesh = new Points(this.geometry, this.material);
      this.mesh.rotation.x = -Math.PI/2;

	     return this.mesh;
		}
	}

	updateNoisePower() {
		this.uniforms.needsUpdate = true;
		if(this.animTarget == Earth.ORDONATE_STATE) {
			this.uniforms.powerNoise.value -= 0.01;
			if(this.uniforms.powerNoise.value < 0) {
				this.uniforms.powerNoise.value = 0;
				this.needNoiseUpdate = false;
				this.casterHelper.scale.copy(new Vector3(1, 1, 1));
				this.dispatch(['noiseEnd', 'noiseChange']);
			}
		} else {
			this.uniforms.powerNoise.value += 0.01;
			if(this.uniforms.powerNoise.value > 1) {
				this.uniforms.powerNoise.value = 1;
				this.needNoiseUpdate = false;
				this.dispatch(['noiseEnd', 'noiseChange']);
			}
		}
	}


	// RAF
	update(counter, target) {
		//this.mesh.rotation.z += 0.001
		this.uniforms.needsUpdate = true;
		this.uniforms.u_time.value = counter;
		// console.log(target)
		this.uniforms.u_target.value = target ? target : new Vector3();
		if(this.needNoiseUpdate) this.updateNoisePower();
	}
}

export default Earth;
