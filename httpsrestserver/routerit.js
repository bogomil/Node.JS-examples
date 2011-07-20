/**
 * @author Bogomil "Bogo" Shopov <shopov.bogomil@gmail.com> 
 */

/**
 * Require modules
 */
var journey = require('journey');
var https = require('https');
var fs = require('fs');



/**
 * Initialize settings. If you need settings for something, this is a celver way to do it.
 */
var settings = require('./mconfigs');
eval(fs.readFileSync('mconfigs.js'), encoding="ascii");   

/**
 * Load the certificates for the HTTPS connection.
 */      

var privateKey = fs.readFileSync('../certs/privatekey.pem');
var certificate = fs.readFileSync('../certs/certificate.pem');

/**
 * Set options for the HTTPS server
 */
var options = {
  key: privateKey,
  cert: certificate
};

/**
 * Create a new virtual router to hadle the REST requests
 */

var mrouter = new (journey.Router)();



/**
 * Create the rooting table and assign the URL handlers. Look at the regexp examples. 
 * They are simple MongoDB operations, but you can use the logic for anything you need.
 */

mrouter.map(function () {
	


		/**
		 * Say Welcome to the user or dispay eany other info
		 */
	    this.root.bind(function (req, res) { res.send("Welcome to: "+settings.myapp) });
	    
	    /**
	     * Hanlde _GET
	     */
	    
	    // just /database
	    this.get('/databases').bind(function (req, res, id) {
	    		 //do something   		        
	    });
	    
	    
	    // databases/DATABASE_NAME
	    this.get(/^databases\/([A-Za-z0-9_]+)$/).bind(function (req, res, id) {
	        //do something
	    });
	
	    
	    // databases/DATABASE_NAME/collections
	    this.get(/^databases\/([A-Za-z0-9_]+)\/collections+$/).bind(function (req, res, dbid) {
	        res.send('show me collections on: '+dbid);
	    });
	    
	    // databases/DATABASE_NAME/collections/COLLECTION_NAME
	    this.get(/^databases\/([A-Za-z0-9_]+)\/collections+\/([A-Za-z0-9_]+)$/).bind(function (req, res, dbid, collid) {
	        res.send('show me '+collid + 'on:'+ dbid);
	    });
	    
	    // databases/DATABASE_NAME/collections/COLLECTION_NAME/documents
	    this.get(/^databases\/([A-Za-z0-9_]+)\/collections+\/([A-Za-z0-9_]+)\/documents+$/).bind(function (req, res, dbid, collid) {
	        res.send('show me all documents in '+collid + 'on:'+ dbid);
	    });
	    
	    // databases/DATABASE_NAME/collections/COLLECTION_NAME/documents/DOCUMENT_ID
	    this.get(/^databases\/([A-Za-z0-9_]+)\/collections+\/([A-Za-z0-9_]+)\/documents+\/([A-Za-z0-9_]+)$/).bind(function (req, res, dbid, collid, docid) {
	        res.send('show me document '+docid+ 'in '+collid + 'on: '+ dbid);
	    });
	    
	    /**
	     * _POST
	     */
	    
	    // create database
	    this.post('/databases').bind(function (req, res, data) {
	        res.send(data);
	    });
	    
	    
	    //create a new collection
	    this.post(/^databases\/([A-Za-z0-9_]+)\/collections+$/).bind(function (req, res, dbid, data) {
	        res.send('create new collection on: ' +dbid);
	    });
	    
	    // create s new document
	    this.post(/^databases\/([A-Za-z0-9_]+)\/collections+\/([A-Za-z0-9_]+)\/documents+$/).bind(function (req, res, dbid, collid, data) {
	        res.send('create new document in '+collid + ' collection on:'+ dbid);
	    });
	    
	    /**
	     * _PUT
	     */
	    
	    //rename a collection
	    this.put(/^databases\/([A-Za-z0-9_]+)\/collections+\/([A-Za-z0-9_]+)$/).bind(function (req, res, dbid, collid, data) {
	        res.send('reaname collection  '+collid + ' on db: '+ dbid);
	    });
	    
	    
	    this.put(/^databases\/([A-Za-z0-9_]+)\/collections+\/([A-Za-z0-9_]+)\/documents+\/([A-Za-z0-9_]+)$/).bind(function (req, res, dbid, collid, docid, data) {
	        res.send('update '+docid+ 'in '+collid + 'on: '+ dbid);
	    });
	    
	    
	    /**
	     * _DELETE
	     */
	    
	    //delete a database
	    this.del(/^databases\/([A-Za-z0-9_]+)$/).bind(function (req, res, id) {
	        res.send('delete: '+id);
	    });
	    
	    //delete a collection
	    this.del(/^databases\/([A-Za-z0-9_]+)\/collections+\/([A-Za-z0-9_]+)$/).bind(function (req, res, dbid, collid) {
	        res.send('delete collection '+collid + ' on:'+ dbid);
	    });
	    
	    //delete a document
	    this.del(/^databases\/([A-Za-z0-9_]+)\/collections+\/([A-Za-z0-9_]+)\/documents+\/([A-Za-z0-9_]+)$/).bind(function (req, res, dbid, collid, docid) {
	        res.send('delete document '+docid+ 'in '+collid + 'on: '+ dbid);
	    });


});


/**
 * Create and deploy the HTTPSs connection.
 */


https.createServer(options,function (request, response) {
    var body = "";

    request.addListener('data', function (chunk) { body += chunk });
    request.addListener('end', function () {
    	        
        mrouter.handle(request, body, function (result) {
        	
            response.writeHead(result.status, result.headers);
            response.end(result.body);
        });
    });
}).listen(settings.port,settings.host);
