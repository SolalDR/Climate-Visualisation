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
  firstTime: true
}

const mutations = {
  increment (state) {
    state.count++
  }
}

const actions = {
  increment: ({ commit }) => commit('increment')
}

const getters = {
  countPlural: ({ count }) => Math.min(count, 2)
}

var store =  new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store;
