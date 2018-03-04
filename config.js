module.exports = {
	paths: {
		dirs	: {
			from 	: './src', // Source Location
			to	: './dist' // Dist Location
		},
		scss	: {
			// These files will be compiled individually
			files : [
				'./src/scss/app.scss'
			],
			// List of SCSS Include-Paths
			includePaths : [
			],
			settings: './src/scss/config.scss'
		},
		assets: {
			// List of source and target directories
			dirs : [
				{
					'from': './src/img/**/*',
					'to': 'img'
				},
				{
					'from': './src/font/**/*',
					'to': 'font'
				}
			]
		},
		js	: {
			// Every array contained in this array, will
			// be concatinated on copilation
			files : [
				[
					'./src/js/app.js'
				]
			]
		}
	},
	options: {
		// Sync-Task Option
		sync : {
			rel : true, // true if relative link
			value : '../' // path or URL
		},
		// Styleguide
		// Generates a styleguide form all files in the above scss tasks
		styleguide: {
			folder : 'styleguide',
			file : 'app.css' // file to include from the paths.to css folder
		},
		// Above the fold pagecrawler
		abovefold: {
			replace: [ // Replacing operation for the final json, to replace unwanted url-parts
				[
					'http://localhost:3000',
					''
				]
			],
			link: 'http://localhost:3000/',
			chunksize: 10,
			viewport: {
				width: 1920,
				height: 1080
			},
			types: [
				'document',
				'stylesheet',
				'script'
			],
			timeout: 5000
		}
	}
};