import Country from "./Country";
import Request from "./Request";
import Water from "./../data/precipitation.gen.js";
import Temperature from "./../data/temperature-earth.gen.js";

class GeoData {

  constructor(geojson) {
    this.genFormatData(geojson);
  }


  static getWaterElevation() {
    return {
      min: 0,
      max: 32.435,
      datas: Water
    }
  }

  static getTemperature(){
    return Temperature
  }

  genFormatData(geojson) {
    var countries = {};

    for(var i=0; i < geojson.features.length; i++) {

      countries[geojson.features[i].properties.iso_a2] = new Country(geojson.features[i]);
    }
    this.countries = countries;
  }

  static getCountryFromCoord(coord, callback) {
    var api = "AIzaSyBnwbe8HJoZudRFjADyOYmIFBTsK3JMc4U";

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.lat},${coord.lon}&key=${api}`);
    xhr.onload = () => {
        if (xhr.status === 200)
          callback(GeoData.formatGoogleResponse(JSON.parse(xhr.responseText)));
    };
    xhr.send();
  }

  static formatGoogleResponse(response) {
    if( response.results.length ) {
      for(var i=0; i < response.results[0].address_components.length; i++) {
        var component = response.results[0].address_components[i];
        if(component.types.indexOf("country") >= 0)
          return component.short_name;
      }
    }
    return null;
  }


	static adaptData() {
        var data = [];
        for(var i = 0; i < datas.length; i++) {
            if(datas[i][2] == 1) {
                data.push(datas[i]);
            }
            if(datas[i][2] == 0) {
                console.log(datas[i]);
            }
        }
        for(var i=0; i<data.length; i++){
            datas.push([ data[i][0], data[i][1], 0 ])
        }
    }
}

export default GeoData

