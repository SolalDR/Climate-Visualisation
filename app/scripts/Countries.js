class Countries {
	constructor() {
		this.countries = [];
	}

  findCountryBy(attr, value, single) {
    if(typeof this.countries[attr] !== "undefined") {
      var results = [];
      for(var i=0; i<this.countries.length; i++) {
        if(this.countries[i][attr] == value) {
          if ( single ) return this.countries[i];
          results.push(this.countries[i]);
        }
      }
      return results;
    }
    return null;
  }
}