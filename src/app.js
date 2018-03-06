'use strict'

/**
 * Static Page API to handle module loading and piping data between them
 * @hideconstructor
 * @abstract
 * @throws {Error} If this abstract class is instantiated
 */
class Page{

	constructor(){
		throw new Error('Page can not be instantiated')
	}

	/**
	 * Adds a module to the page stager
	 * @param {String}   name     module name
	 * @param {Function} callback module callback
	 */
	static addModule(name, callback){
		if (!Page.modules) {
			Page.modules = [];
		}
		Page.modules.push({name: name, callback: callback});
	}

	/**
	 * Loads all added modules once the page is ready
	 */
	static dispatch(){
		if (Page.modules !== undefined) {
			Page.modules.forEach((module)=>{
				module.callback(module.name);
			});
		}
	}

	/**
	 * Adds the module dispatcher to document.ready event
	 */
	static prepare(){
		if ((document.attachEvent)?(document.readyState==='complete'):(document.readyState!=='loading')){
			Page.dispatch();
		} else {
			document.addEventListener('DOMContentLoaded', Page.dispatch);
		}
	}
}
Page.prepare();