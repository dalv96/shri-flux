const _prefix = 'id_';

class Dispatcher {
    constructor() {
        this._callbacks = {};
        this._lastID = 1;
    };

    register(callback) {
        const id = _prefix + this._lastID++;
        this._callbacks[id] = callback;
        return id;
    };

    unregister(id) {
        delete this._callbacks[id];
    }

    dispatch(payload) {
        for (let cb in this._callbacks) {
            this._callbacks[cb](payload);
        }
    };
}

class Store {
    constructor(data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }

    bind(event, fct) {
		this._events = this._events || {};
		this._events[event] = this._events[event] || [];
		this._events[event].push(fct);
    }
    
	unbind(event, fct) {
		this._events = this._events || {};
		if ( event in this._events === false ) return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
    }
    
	trigger(event) {
		this._events = this._events || {};
		if( event in this._events === false ) return;
		for (var i = 0; i < this._events[event].length; i++) {
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}
}