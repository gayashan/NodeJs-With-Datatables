
var _ = require('underscore');
var config = require('../../config');
var moment = require('moment');

var COLLECTION = {
	'PERSON': 'person',    
};

var utcDate = function(){	
	return new Date( moment().toISOString() );
};

function DataHandler( db ){	
		
	return {

		removeCollectionItem: function(req, res ){
			var colName = req.params.collectionType;
			
			var col;
			
			if( colName )
				col = COLLECTION[ colName.toUpperCase() ];
			
			if( col && req.body.item ){
				var id = db.toObjectId( req.body.item._id );
				db[col].remove( {_id: id }, function( err, result ){
					 if (err) throw err;
					 
					 console.log( 'Remove item Result: ', result );
					 
					 res.type('application/json');
					 res.statusCode = 200;
					 res.json( {'Results': result } );
				});
				
			}else if(!col){
				res.type('application/json');
				res.statusCode = 400;
				res.json( {'Error': 'Invalid type ' + colName } );
			}else{
				res.type('application/json');
				res.statusCode = 400;
				res.json( {'Error': 'Item is not defined' } );
			}
		},
		
		getCollectionItemById: function( req, res ){
			
			var type = req.body.type;
			res.type('application/json');
			if( !type ){
				res.statusCode = 500;
				res.json( {Error: 'Source type is undefined.'  } );
			}
			
			var col = COLLECTION[ type.toUpperCase().trim()];
			console.log( type.toUpperCase(), col );
			
			if( !col ){
				res.statusCode = 500;
				res.json( {Error: 'Invalid source type : ' +  type  } );
			}
			else{
				db[col].findOne( { _id: db.toObjectId( req.body.id ) },function( err, result ){
				    if (err)
				    	console.log('Error: ', err );
	
				    res.type('application/json');
					res.statusCode = 200;
					res.json( result );
				});		
			}	
		},
		
		findCollection: function( req, res ){
			
			var type = req.body.type;
			res.type('application/json');
			if( !type ){
				res.statusCode = 500;
				res.json( {Error: 'Source type is undefined.'  } );
			}
			
			var col = COLLECTION[ type.toUpperCase().trim()];
			console.log( type.toUpperCase(), col );
			
			if( !col ){
				res.statusCode = 500;
				res.json( {Error: 'Invalid source type : ' +  type  } );
			}
			else{
				req.body.skip = req.body.skip || 0;
				req.body.limit = req.body.limit || 100;
				var sortBy = req.body.sort || { created: -1 };				
				var  options = req.body.options || {};
				
				db[col].find( req.body.query, options ).sort( sortBy ).skip(req.body.skip).limit(req.body.limit).toArray( function( err, result ){
				    if (err)
				    	console.log('Error: ', err );
	
				    res.type('application/json');
					res.statusCode = 200;
					res.json( result );
				});		
			}	
		},
		
		saveCollction: function( req, res ){
			console.log('Saving ', req.body.type );
			res.type('application/json');
			var col = COLLECTION[ req.body.type ];			
			
			delete req.body.type;
			
			if( col ){
				req.body.updated = utcDate();
				
				if( req.body._id ){
					console.log(req.body );
					var id = db.toObjectId( req.body._id );
					console.log('Incoming Data >>>: ', req.body ) ;
					delete req.body._id;
					db[col].update( { _id: id }, { $set: req.body } , function ( err, result ) {
						res.statusCode = 200;
						console.log('Updated form>>>: ', result ) ;
						res.json( { updated: id } );
					});	
				}else{
					
					req.body.created = utcDate();
					
					db[col].insert( req.body , function ( err, result ) {
						res.statusCode = 200;
						console.log('Saved form>>> ' ) ;
						res.json( { _id : result[0]._id } );						
					});	
				}
			}else{
				res.statusCode = 500;
				res.json( {Error: 'Undefined Collection:' + req.body.type } );
			}
				
		},
	}
}

exports.load = function( db ){
	return new DataHandler( db );
}
