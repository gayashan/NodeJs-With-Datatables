
module.exports = {

	"nodeServer":{
		host:"localhost",
		port:3000
	},	
	"dbLocal": {
		"mongo": {
			url: 'localhost:27017',
			database: 'test_project'
		}
	},
	"dbProduction": {
		"mongo": {
			url: 'sa:1qaz2wsx@ds011369.mlab.com:11369',
			database: 'test_project'
		}
	},
	"logger": {
		"api": "logs/api.log",
		"exception": "logs/exceptions.log"
	}		
};
