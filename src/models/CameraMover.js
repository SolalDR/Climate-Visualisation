import GeoUtil from './GeoUtil';
import Easing from './Easing';
import Event from './Event';

class CameraMover extends Event {

  constructor(camera) {
    super()
    this.camera = camera;
    this.coords = {
      start: null,
      end: null,
      current: null
    }
    this.animate = false;
    this.current = null;
    this.duration = 600;
    this.counter = 0;
    this.timingFunction = "easeInCubic";
    this.eventsList = ['end'];
  }

  launchAnimation() {
    this.counter = 0;
    this.animate = true;
  }

  get radius() {
    return this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
  }

  moveTo(coord) {
    this.coords.start = GeoUtil.cartToCoord(new THREE.Vector3().copy(this.camera.position).applyAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI/2 ), this.radius);
    this.coords.end = JSON.parse(JSON.stringify(coord));
    this.coords.current = new THREE.Vector3().copy(this.coords.start);
    this.coords.diff = {
      lat: this.coords.end.lat - this.coords.start.lat,
      lon: this.coords.end.lon - this.coords.start.lon
    }
    this.launchAnimation();
  }

  update(delta){
    if(this.animate) {
      this.counter += delta;
      var advancement = Easing.easeInOutCubic(Math.min(1, this.counter/this.duration));

      this.coords.current = GeoUtil.coordToCart({
        lat: this.coords.start.lat + this.coords.diff.lat * advancement,
        lon: this.coords.start.lon + this.coords.diff.lon * advancement
      }, this.radius).applyAxisAngle( new THREE.Vector3( 1, 0, 0 ), -Math.PI/2 );

      this.camera.position.copy(this.coords.current);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      if(advancement >= 1) {
        this.animate = false;
        this.dispatch("end")
      }
    }
  }
}

export default CameraMover
