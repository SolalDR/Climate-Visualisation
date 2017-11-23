import vertex from './../glsl/blob/shader.vert'
import fragment from './../glsl/blob/shader.frag'
import Easing from './Easing';

import {Vector3, Vector2, Mesh, SphereGeometry, MeshStandardMaterial, LineBasicMaterial, Geometry, Line, BufferGeometry, BufferAttribute, ShaderMaterial, Points} from 'three';

class Blob {

  constructor(scene, firstTime, elevation) {
    this.counter = 0;
    this.geometry = new SphereGeometry( 3, 32, 32 );
    this.elevation = elevation;
    this.init = false;
    var uniforms = {
      u_time: { type: "f", value: 0 },
      u_rat: { type: "f", value: 5.},
      u_radius: {type:"f", value: firstTime ? 0 : 1 } }

    this.material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
    });

    var uniforms2 = JSON.parse(JSON.stringify(uniforms));
    uniforms2.u_rat.value = 10;
    this.material2 = new ShaderMaterial({
        uniforms: uniforms2,
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true
    });

    this.mesh = new Mesh( this.geometry, this.material );
    this.mesh2 = new Mesh( this.geometry, this.material2 );

    scene.add( this.mesh );
    scene.add( this.mesh2 );
  }

  scaleFromYear(year) {
    var scale = 1 + 0.4 * ((this.elevation.datas[year] - this.elevation.min) / (this.elevation.max - this.elevation.min));
    this.toScale(scale, 2)
  }

  toScale(target, duration){
    this.animation = {
      start: this.counter,
      end: this.counter + duration,
      duration: duration,
      from: this.material.uniforms.u_radius.value,
      to: target
    }
  }

  animate() {
    if(this.animation != null) {
      var advance = Easing.easeOutQuad((this.counter - this.animation.start) / this.animation.duration);
      var value = this.animation.from + (this.animation.to - this.animation.from) * advance
      this.material.uniforms.u_radius.value = value;
      this.material2.uniforms.u_radius.value = value;
      if( advance >= 1 ) 
        this.animation = null;
    }
  }

  update(counter) {
    this.counter = counter;

    this.material.uniforms.needsUpdate = true;
    this.material.uniforms.u_time.value = counter;

    this.material2.uniforms.needsUpdate = true;
    this.material2.uniforms.u_time.value = counter;

    this.animate();
  }

}

export default Blob
