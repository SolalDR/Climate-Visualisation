class Event {

  constructor() {
    this.events = [];
    this.eventsAvailables = [];
  }

  eventExist(event, callback){
    var exist = false; 
    if( this.events[event] ) {
      for(var i=0; i<this.events[event].length; i++){
        if( this.events[event] == callback ){
          exist = true; 
        }
      }
    }
    return exist; 
  }

  dispatch(event){
    if( this.events[event] && this.events[event].length ){
      for(var i=0; i<this.events[event].length; i++ ){
        var callback = this.events[event][i];
        callback.call(this);
      }
    }
  }

  on(event, callback){
    if( !this.events[event] && parseInt(this.eventsList.indexOf(event)) ) {
      this.events[ event ] = [];
    }
    if( this.events[event] && !this.eventExist(event, callback) ) {
      this.events[event].push(callback);
    }
  }


  off(event, callback){
    if( this.events[event] ){
      for(i=0; i<this.events[event].length; i++){
        if( this.events[event][i] == callback ){
          this.events[event].slice(i, 1);
        }
      }
    }
  }
}

export default Event;