import {Vector3} from 'three';

class GeoUtil {

	//Convertit les degré en radian
	static toRadian(deg){
	  return Math.PI * (deg) / 180;
	}

	static toDegre(rad){
	  return rad*180/Math.PI;
	}

	// cubic-bezier(0,.59,0,1)
	static  coordToCart(coord, r){
		return new Vector3(
			r * Math.cos(GeoUtil.toRadian(coord.lat)) * Math.cos(GeoUtil.toRadian(coord.lon)),
			r * Math.cos(GeoUtil.toRadian(coord.lat)) * Math.sin(GeoUtil.toRadian(coord.lon)),
			r * Math.sin(GeoUtil.toRadian(coord.lat)));
	}

	static  cartToCoord(coord, r){
		var coords = { lat: Math.asin(coord.z/r)*(180/Math.PI) }
		if (coord.x > 0) {
        coords.lon = Math.atan(coord.y/coord.x)*(180/Math.PI)
    } else if (coord.y > 0) {
        coords.lon = Math.atan(coord.y/coord.x)*(180/Math.PI) + 180
    } else {
        coords.lon = Math.atan(coord.y/coord.x)*(180/Math.PI) - 180
    }
    return coords;
  }
}

export default GeoUtil;
