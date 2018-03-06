const config 		= require('../config');
const AboveFold		= require('./class/abovethefoldgenerator.js');
const fs 			= require('fs');
const path 			= require('path');


function searchDirectory(classes, dir, match){
	dir = dir.replace(/\*+.*?/g, '').replace(/\/+/g, '/');

	let files = new Array(),
		current = fs.readdirSync(dir, 'utf8'),
		content,
		exp;

	current.forEach((item)=>{
		if (fs.lstatSync(dir + '/' + item).isDirectory()) {
			files = files.concat(searchDirectory(classes, dir + '/' + item, match));
		}
		else{
			let content = fs.readFileSync(dir + '/' + item, 'utf8');
			classes.forEach((name)=>{
				exp = new RegExp('\\.' + name + '(\\s|\\{|\\.|\\#)');
				if (content.match(exp) && item.match(match)) {
					files.push(dir + '/' + item);
				}
			});			
		}
	})
	return files;
}

let generator = new AboveFold(config.options.abovefold, config.paths);
generator.start().then((results)=>{
	let out = {
		full: [],
		pages: {}
	},
	name;
	for(pages in results){
		name = pages;
		config.options.abovefold.replace.forEach((proc)=>{
			name = name.replace(proc[0], proc[1]);
		});
		out.pages[name] = Array.from(new Set(searchDirectory(results[pages], config.paths.watch, new RegExp('(\\.scss|\\.css)','g'))));
		out.full = out.full.concat(out.pages[name]);
	}
	out.full = Array.from(new Set(out.full));
	fs.writeFile('abovethefold.json', JSON.stringify(out, null, 4), (e)=>{
		if (e) {
			console.log('An error occured during the creation of the abovethefold.json');
		}
		console.log('abovethefold.json written successfully');
	});
});