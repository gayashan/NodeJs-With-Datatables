
function setup(app,handlers) {	
	app.post('/api/find/', handlers.data.findCollection );
	app.post('/api/remove/:collectionType', handlers.data.removeCollectionItem );
	app.post('/api/insert/', handlers.data.saveCollction );
	app.post('/api/colItemById/', handlers.data.getCollectionItemById );					
}
 
exports.setup = setup;