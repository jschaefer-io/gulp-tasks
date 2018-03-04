const puppeteer 	= require('puppeteer');
const fs 			= require('fs');

class AboveTheFoldGenerator{
	constructor(config, paths){
		this.paths = paths;
		this.config = config;
		this.urlList = new Set();
		this.done = new Set();
		this.results = {};
		this.urlList.add(this.config.link);
		this.classList = this.getClassesFromFiles();
	}

	/**
	 * Get all classes from the compiled css files
	 * @return {Set}
	 */
	getClassesFromFiles(){
		let classList = new Set();
		let dir = fs.readdirSync(this.paths.dirs.to + '/css/', 'utf8');
		dir.forEach((file)=>{
			let content = fs.readFileSync(this.paths.dirs.to + '/css/' + file, 'utf8'),
				classes = content.match(/\.(\w|-)+/g);
			if (classes) {
				classes.map((el)=>{
					classList.add(el.replace('.', ''));
				});
			}
		});
		return classList;
	}

	/**
	 * Removes all classes not in the compiled css files from the given classlist
	 * @param  {Array} classes
	 * @return {Array}
	 */
	filterClasses(classes){
		return classes.filter(className=>this.classList.has(className));
	}

	/**
	* Gets the above the fold classes
	* @param {Page} page
	*/
	async getClasses(page){
		return await page.evaluateHandle(() => {
			let items = Array.from(document.querySelectorAll('*')),
				body = document.body,
				classSet = new Set();
			for(let item in items){
				let positions = items[item].getBoundingClientRect(),
					classes = Array.from(items[item].classList);
				if (classes.length > 0 && positions.top + body.scrollTop <= window.innerHeight) {
					classes.forEach((className)=>{
						classSet.add(className);
					});
				}
			}
			return Array.from(classSet);
		});
	}

	/**
	 * Gets all internal links on the page
	 * @param  {Page} page
	 */
	async getLinks(page){
		return await page.evaluateHandle(()=>{
			let urlSet = new Set(),
				items = Array.from(document.querySelectorAll('a'));
			for(let item in items){
				if (items[item].href.indexOf(location.origin) === 0) {
					urlSet.add(items[item].href.replace(/#.*/,''));
				}
			}
			return Array.from(urlSet);	
		});
	}

	/**
	 * Crawls every page in the global urlSet until nothing is left
	 * or the chunk size has been reached
	 * @param  {Page} page
	 */
	async crawlUrl(page){
		let urlSet = new Array(),
			resHandle,
			result,
			i = 0;
		this.urlList.forEach((url)=>{
			if (i <= this.config.chunksize) {
				urlSet.push(url);
				i++;
			}
		});
		for (i = 0; i < urlSet.length; i++) {
			if (!this.done.has(urlSet[i])) {
				try{
					if (urlSet[i].match(/\.(jpeg|jpg|gif|png|pdf)$/)) {
						throw new Error('Link to Image called');
					}
					console.log('Crawl URL: ' + urlSet[i]);

					await page.goto(urlSet[i]);
					resHandle = await this.getClasses(page);
					this.results[urlSet[i]] = this.filterClasses(await resHandle.jsonValue());
					await resHandle.dispose();

					resHandle = await this.getLinks(page);
					result = await resHandle.jsonValue();
					result.forEach((link)=>{
						this.urlList.add(link);
					});
					await resHandle.dispose();
				}
				catch(e){
					console.log('Error Crawling: ' + urlSet[i]);
				}
			}
			this.done.add(urlSet[i]);
			this.urlList.delete(urlSet[i]);
		}
	}

	/**
	 * Main Bootstrap for the crawl task
	 */
	async start(){
		return new Promise((resolve, reject)=>{
			puppeteer.launch().then(async browser => {
				let page;	
				while(this.urlList.size > 0){
					page = await browser.newPage();
					page.setViewport({
						width: this.config.viewport.width,
						height: this.config.viewport.height
					});

					await page.setRequestInterception(true);
					page.on('request', request => {
						let types = this.config.types;
						if (types.indexOf(request.resourceType()) >= 0){
							request.continue();
						}
						else{
							request.abort();
						}
					});

					page.setDefaultNavigationTimeout(this.config.timeout);
					await this.crawlUrl(page);
				};
				await browser.close();
				resolve(this.results);
			});
		})
	}
}

module.exports = AboveTheFoldGenerator;