// Global variables
var ID = null;
var editor;

DataGrid = function () {}

DataGrid.prototype.init = function ( ) {
	
    var self = this;

    self.getGridData();

    // Trigger save data
    $('#btnSave').click(function () {
        
        self.save();

    });

    // Reset form
     $('#btnReset').click(function () {
        
        self.reset();

    }); 
}

DataGrid.prototype.getGridData = function ( ) {

    var self = this;    

    var data = {
        type: 'PERSON',
        query:{}        
    }        

    $.ajax({
        cache: false,
        type: 'POST',                
        dataType: 'json',
        async: true,
        data : data,                
        url: HOST + "/find/",
        success: function (response) {                                 
            console.log( 'response: ', response );      
            self.renderGrid(response);
        },
        error: function (response, status, error) {
            console.log('Error while getting data', error);
            alert("Node server is not running..");
        }
    });

}

DataGrid.prototype.renderGrid = function ( gridData ) {   
    
    var self = this;

	editor = $('#example').DataTable( {
        data: gridData,
        destroy: true,        
        ordering: false,          
        columns: [
        	{
                data: null,
                defaultContent: '',
                className: 'select-checkbox',
                orderable: false
            },
            { data : "name" },
            { data : "age" },
            { data : "address" },
            {
                data: null,
                targets: -1,                
                defaultContent: '<button class="btn btn-default editIcon" >Edit</button>' + ' <button class="btn btn-danger deleteIcon" >Delete</button>'            
            }
        ],
        order: [ 1, 'asc' ],
        select: {
            style:    'os',
            selector: 'td:first-child'
        }        
    });
          
    $('#example tbody td .editIcon').off('click').on('click', function() {    	
        var nTr = $(this).parents('tr')[0]; 
        var data = editor.row( nTr ).data();       
        console.log('aData : ', editor.row( nTr ).data() );
        self.edit(data);
    });   

    $('#example tbody td .deleteIcon').off('click').on('click', function() {    	
        var nTr = $(this).parents('tr')[0];        
        var data = editor.row( nTr ).data(); 
        console.log('aData : ', editor.row( nTr ).data() );
        self.remove(data);
    });

}

DataGrid.prototype.save = function ( ) {
    
    var self = this;    

    var data = {
        type: 'PERSON',
        name : $('#inputName').val(),   
        age : $('#inputAge').val(),
        address : $('#inputAddress').val()
    }

    if(ID)
        data._id = ID;

    $.ajax({
        cache: false,
        type: 'POST',                
        dataType: 'json',
        async: true,
        data : data,                
        url: HOST + "/insert/",
        success: function (response) {                                 
            console.log( 'response: ', response );      
            alert('Data successfully saved');
            self.getGridData();
        },
        error: function (response, status, error) {
            console.log('Error while getting data', error);
        }
    });

}

DataGrid.prototype.reset = function ( ) {

    ID = null;
    $('#inputName').val(""); 
    $('#inputAge').val("");
    $('#inputAddress').val("");
    $('#btnSave').text('Save');

}

DataGrid.prototype.edit = function ( data ) {
    
    var self = this;   

    ID = data._id;
    $('#inputName').val(data.name); 
    $('#inputAge').val(data.age);
    $('#inputAddress').val(data.address);
    $('#btnSave').text('Update');

}

DataGrid.prototype.remove = function ( data ) {
    
    var self = this;       

    var data = {
        item: { _id : data._id}      
    }

    $.ajax({
        cache: false,
        type: 'POST',                
        dataType: 'json',
        async: true,
        data : data,                
        url: HOST + "/remove/PERSON",
        success: function (response) {                                 
            console.log( 'response: ', response );      
            self.getGridData();
            alert('Data successfully removed');
        },
        error: function (response, status, error) {
            console.log('Error while getting data', error);
        }
    });

}