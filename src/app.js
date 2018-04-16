'use strict'

/**
 * Static Page API to handle module loading
 * @hideconstructor
 * @abstract
 * @throws {Error} If this abstract class is instantiated
 */
class Page{

	constructor(){
		throw new Error('Page can not be instantiated')
	}

	/**
	 * Pushes an event to the given module
	 * @param  {String} module - module name
	 * @param  {String} event  - event name
	 * @param  {Object} data   - Data to push to the module
	 * @return {Promise} Event Promise
	 */
	static pipe(module, event, data = {}){
		module = Page.get(module);
		return module.module.trigger(event, data);
	}

	/**
	 * Gets the Module Object by its name
	 * @param  {String} module - module name
	 * @return {Module}  found module object
	 */
	static get(module){
		module = Page.modules.reduce((val, item)=>{
			if (val === null && item.name === module) {
				return item;
			}
			return null;
		}, null);
		if (module === null) {
			throw new Error('Module named ' + name + ' could not be found');
		}
		return module;
	}

	/**
	 * Checks if a Module with the given is already registered
	 * @param  {String} name - Module name
	 * @return {Boolean} true if  Module already exists
	 */
	static moduleExists(name){
		let search = Page.modules.filter((item)=>{
			return item.name === name;
		})
		return search.length > 0;
	}

	/**
	 * Adds a module to the page stager
	 * @param {String}   name     module name
	 * @param {Class} className which extens the module class
	 */
	static addModule(name, className){
		if (!Page.modules) {
			Page.modules = [];
		}
		if (Page.moduleExists(name)) {
			throw new Error('Module named ' + name + ' already exists');
		}
		Page.modules.push({name: name, module: new className(name)});
	}

	/**
	 * Loads and initializes all added modules once the page is ready
	 */
	static dispatch(){

		// Prepare every module by calling th einit function
		Page.modules.forEach((module)=>{
			module.module.init();
		});

		// Triggering the ready hook in every module
		Page.modules.forEach((module)=>{
			module.module.trigger('modules-ready');
		});
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


/**
 * Module Class to integrate with the static Page-API
 * Modules need to extend this class and override the init() method
 */
class Module{

	constructor(name){
		this.name = name;
		this.events = {};
	}

	/**
	 * This method will be extended by every Page-Module
	 * @abstract
	 */
	init(){
		throw new Error('This method is abstract and needs to be implemented');
	}

	/**
	 * Registers a Module Event on the current module
	 * @param  {String}   event    - event name
	 * @param  {Function} callback - callback function for the event
	 */
	on(event, callback){
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(callback);
	}

	/**
	 * Kicksoff all events with the given name
	 * @param  {String} event - event name
	 * @param  {Object} data  - Data to pass to with the event
	 * @return {Promise} Promise resolving when every event was resolved
	 */
	trigger(event, data){
		if (!this.events[event]) {
			return new Promise((resolve)=>resolve());
		}
		return Promise.all(this.events[event].map((event)=>{
			return new Promise((resolve, reject)=>{
				event(resolve, reject, data);
			});
		}));
	}
}