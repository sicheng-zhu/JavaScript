const manipulation = require("./manipulation");
const express = require("express");
const dboperation = require("./dboperation");
const app = express();
let key;
let handlebars =  require("express-handlebars");

app.engine(".html", handlebars({extname: '.html'}));
app.set('port', process.env.PORT || 3000);
app.set("view engine", ".html");
app.use(express.static(__dirname)); // set location for static files
app.use(require("body-parser").urlencoded({extended: true})); // parse form submissions
app.use('/', require('cors')()); // set Access-Control-Allow-Origin header for api route

app.get('/', (req, res) => {
	dboperation.getAll(function(empRecords){
		if (empRecords.length == 0) {
			res.type('text/html');
			res.status(200);
			
			res.send("Empty");
		} else if (empRecords === "error") {
		    res.status(500).send("Database error. Please try later.");
		} else {
			let empList = empRecords;
			
			for (let i = 0; i < empList.length; i++) {				
				empList[i].viewURL = "http://localhost:3000/detail?employeeid=" + empList[i].employeeid;
			}
			
			res.type('text/html');
	        res.status(200);
            res.render('home', {empList: empList});			
		}				 
	});
});

app.get('/about', (req, res) => {
	res.type('application/json');
	res.status(200);
	res.sendFile(__dirname + '/package.json');
});

app.get('/detail', (req, res) => {						
	key = Object.keys(req.query)[0];		
	
	dboperation.get(parseInt(req.query[key]), function(empRecord){
		if (empRecord === "error") {
			res.status(500).send("Database error. Please try later.");
		} else {
			res.type('text/html'); 
	        res.status(200);
			let delURL = "http://localhost:3000/delete?employeeid=" + req.query[key];		
		    res.render('details', {employeeid: req.query.employeeid, empRecord: empRecord, delURL : delURL});
		}	    
	});		
});

// getall
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

// get
app.get('/get', (req, res) => {	
	key = Object.keys(req.query)[0];		
	
	// need to update from viewURL to delURL after localhost:3000/ is called.
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

// delete
app.get('/delete', (req, res) => {	
	key = Object.keys(req.query)[0];	

	dboperation.remove(parseInt(req.query[key]), function(empRecord){
		if (empRecord.n !== 0) {
			res.type('text/html');
	        res.status(200);
			dboperation.getRecordCount(function(count){
				res.render('delete', {employeeid: req.query.employeeid, isRecordRemoved: true, recordRemain : count});
			});
		} else if (empRecord === "error") {
			res.status(500).send("Database error. Please try later.");
		} else {
			dboperation.getRecordCount(function(count){
				res.type('text/html');
	            res.status(200);
				res.render('delete', {employeeid: req.query.employeeid, isRecordRemoved: false, recordRemain : count});
			});
		}
	});
});

// The following two methods are route for REST add
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