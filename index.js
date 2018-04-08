var http = require("http"); 
var fs = require("fs");
var currentPath = process.cwd();

http.createServer(function(req, res) {
    var path = req.url.toLowerCase();
	
    switch(path) {
      case '/':
        res.writeHead(200, {'Content-Type': 'text/html'});
	    fs.createReadStream(currentPath + "/public/home.html").pipe(res);
        break;
		  
      case '/about':
        res.writeHead(200, {'Content-Type': 'application/json'}); 
	    fs.createReadStream(currentPath + "/package.json").pipe(res);	  
        break;
		  
      default:
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found');
        break;
    }
}).listen(process.env.PORT || 3000);