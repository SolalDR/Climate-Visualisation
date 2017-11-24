import Vue from 'vue'
import Vuex from 'vuex'
import countries from './data/earth.js';
import GeoData from './models/GeoData';

var geoData = new GeoData(countries);

Vue.use(Vuex)

const state = {
  count: 0,
  countries: geoData.countries,
  geocode: "AIzaSyBnwbe8HJoZudRFjADyOYmIFBTsK3JMc4U",
  coord: { lat: 0, lon: 0 },
  firstTime: true,
  year: null,
  currentCountry: null,
  limits: {
    co2: [-33.4, 149, 149 + 33.4]
  }
}

var store =  new Vuex.Store({ state })

export default store;
