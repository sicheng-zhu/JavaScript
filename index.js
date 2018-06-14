const manipulation = require("./manipulation");
const express = require("express");
const dboperation = require("./dboperation");
const app = express();
let key;
let handlebars =  require("express-handlebars");
let bodyParser = require("body-parser");

app.engine(".html", handlebars({extname: '.html'}));
app.set('port', process.env.PORT || 3000);
app.set("view engine", ".html");
app.use(express.static(__dirname)); // set location for static files
app.use(require("body-parser").urlencoded({extended: true})); // parse form submissions
app.use('/', require('cors')()); // set Access-Control-Allow-Origin header for api route
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {			
	dboperation.getAll(function(empRecords) {					
		if (empRecords.length == 0) {
			res.type('text/html');
			res.status(200);			
			res.send("Empty");
		} else if (empRecords === "error") {
		    res.status(500).send("Database error. Please try later.");
		} else {
			let empList = empRecords;
			
			// Add URL to each employee
			for (let i = 0; i < empList.length; i++) {				
				empList[i].viewURL = "http://localhost:3000/detail?employeeid=" + empList[i].employeeid;
			}
			
			res.type('text/html');
	        res.status(200);
            res.render('home', {empList:  JSON.stringify(empList)});		
		}				 
	});
});

app.get('/about', (req, res) => {
	res.type('application/json');
	res.status(200);
	res.sendFile(__dirname + '/package.json');
});

// Detail page for each employee
app.get('/detail', (req, res) => {						
	key = Object.keys(req.query)[0];		
	
	dboperation.get(parseInt(req.query[key]), function(empRecord){
		if (empRecord === "error") { // If anything wrong, receive from dboperation.js
			res.status(500).send("Database error. Please try later.");
		} else {
			res.type('text/html'); 
	        res.status(200);
			let delURL = "http://localhost:3000/delete?employeeid=" + req.query[key];		
		    res.render('details', {employeeid: req.query.employeeid, empRecord: empRecord, delURL : delURL});
		}	    
	});		
});

// Get all records from database
app.get('/getall', (req, res) => {	
	dboperation.getAll(function(empRecords){
		if (empRecords.length == 0) {
			res.type('text/plain');
	        res.status(200);			
			res.send("Empty");
		} else if (empRecords === "error") {
			res.status(500).send("Database error. Please try later.");
		} else {
			res.type('text/plain');
	        res.status(200);
								
			res.json(empRecords.map((empRecords) => {
				return {
					employeeid: empRecords.employeeid, 
					name: empRecords.name, 
					degree: empRecords.degree
				};
			}));
		}				 
	});
});

// Get a single record from database
app.get('/get', (req, res) => {	
	key = Object.keys(req.query)[0];		
		
	dboperation.get(parseInt(req.query[key]), function(empRecord){
		if (empRecord === "error") {
			res.status(500).send("Database error. Please try later.");
		} else {
			res.type('text/html'); 
	        res.status(200);
			res.render('details', {employeeid: req.query.employeeid, empRecord: empRecord});
		}			 
	});		
});

// Delete one record by employee id
app.get('/delete/:id', (req, res) => {	
	key = req.params.id;	

	dboperation.remove(parseInt(key), function(empRecord){
		if (empRecord.n !== 0) {
			res.type('text/html');
	        res.status(200);
			// Get remaining record counts after deletion
			dboperation.getRecordCount(function(count){
                res.json({"deleted": count});
			});
		} else if (empRecord === "error") {
			res.status(500).send("Database error. Please try later.");
		} else {
			dboperation.getRecordCount(function(count){
				res.type('text/html');
	            res.status(200);
				res.json({"deleted": count});
			});
		}
	});
});

// The following two methods are used for REST add
app.get('/input', (req, res) => {
	res.type('text/html');
	res.status(200);
    res.render('add');
});

app.post('/add', (req, res) => {	
	res.type('text/plain'); 
	res.status(200);

	dboperation.addOrUpdate(req.body, function(empID){			    		
	    if (empID === undefined) {		
		    res.send(empID + " not added or updated");
	    } else {
		    res.send(empID + " added or updated");	
	    }
	});										 
});

// define 404 handler
app.use((req, res) => {
	res.type('text/plain'); 
	res.status(404);
	res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
	console.log('Express started'); 
});