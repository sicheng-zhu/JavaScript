var http = require("http"); 
var fs = require("fs");
const querystring = require('querystring');
var manipulation = require("./manipulation");
var currentPath = process.cwd();

http.createServer(function(req, res) {
    var path = req.url.toLowerCase();
	var parameters;
	var key;
	
	// Get request type.
	if (path.substring(0, 4) === "/add" && path.search(/^[/][a][d][d][?]([a-z]*[=][a-z0-9%]*[&]){0,2}([a-z]*[=][a-z0-9%]*)$/) === 0) {
		parameters = querystring.parse(path.split("?").pop());
		path = "/add";	
	} else if (path.search(/^[/][a-z]*[\?][a-z]*[=][a-z0-9 ]*$/) === 0) {
		parameters = querystring.parse(path.split("?").pop());
		path = path.match(/[/][a-z]*/)[0];						
	} else if (path.search(/^[/][a-z]*$/) !== 0) {
		path = "";
	}
	
	switch(path) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
	        fs.createReadStream(currentPath + "/public/home.html").pipe(res);
            break;
		  
        case '/about':
            res.writeHead(200, {'Content-Type': 'application/json'}); 
	        fs.createReadStream(currentPath + "/package.json").pipe(res);	  
            break;
			
	    case '/getall':
            res.writeHead(200, {'Content-Type': 'text/plain'}); 		
		    res.end(JSON.stringify(manipulation.getAll()));
            break;
			
	    case '/get':
		    if (typeof parameters === "undefined") {
		        res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not found');
			    break;
		    }
			
	        key = Object.keys(parameters)[0];
			// Retrieve key and value from URL, and send to get method 
		    var empRecord = manipulation.get(key, parameters[key]);
			
		    if (empRecord === undefined) {
			    res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not found');
		    } else {
			    res.writeHead(200, {'Content-Type': 'text/plain'});
		        res.end("Searching for " + parameters[key] + ":\n" + 
					  JSON.stringify(empRecord));	
		    }

            break;
			
	    case '/delete':
            if (typeof parameters === "undefined") {
		        res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not found');
			    break;
		    }
			
		    key = Object.keys(parameters)[0];
		    var recordRemoved = manipulation.remove(key, parameters[key]);
			
			if (recordRemoved === false) {
			    res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end(parameters[key] + " not removed");
		    } else {
			    res.writeHead(200, {'Content-Type': 'text/plain'});
		        res.end(parameters[key] + " removed");	
		    }
			
            break;
			
		case '/add':
            if (typeof parameters === "undefined") {
		        res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Not found');
			    break;
		    }
			
			/* hasInsertedRecord variable is a flag from manipulation module
			 * indicating if a record has been added. 
			 */			
		    var hasInsertedRecord = manipulation.add(parameters);

			if (hasInsertedRecord === false) {
			    res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end("Record not added");
		    } else {
			    res.writeHead(200, {'Content-Type': 'text/plain'});
		        res.end("Record added");	
		    }
			
            break;
		  
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
            break;
    }
}).listen(process.env.PORT || 3000);