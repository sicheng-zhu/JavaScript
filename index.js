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

app.get('/', (req, res) => {
	res.type('text/html');
	res.status(200);
	
	dboperation.getAll(function(empRecords){
		if (empRecords.length == 0) {
			res.send("Empty");
		} else {
			let empList = empRecords;
			
			for (let i = 0; i < empList.length; i++) {
				empList[i].viewURL = "http://localhost:3000/detail?employeeid=" + empList[i].employeeid;
			}
			
            res.render('home', {empList: empList});			
		}				 
	});
});

app.get('/about', (req, res) => {
	res.type('application/json');
	res.status(200);
	res.sendFile(__dirname + '/package.json');
});

app.get('/getall', (req, res) => {
	res.type('text/plain');
	res.status(200);
	
	dboperation.getAll(function(empRecords){
		if (empRecords.length == 0) {
			res.send("Empty");
		} else {
            res.send(JSON.stringify(empRecords));			
		}				 
	});
});

app.get('/get', (req, res) => {	
	key = Object.keys(req.query)[0];	

	res.type('text/html'); 
	res.status(200);
	
	// need to update from viewURL to delURL after localhost:3000/ is called.
	dboperation.get(parseInt(req.query[key]), function(empRecord){
		res.render('details', {employeeid: req.query.employeeid, empRecord: empRecord});			 
	});		
});

app.get('/delete', (req, res) => {	
	key = Object.keys(req.query)[0];

	res.type('text/html');
	res.status(200);

	dboperation.remove(parseInt(req.query[key]), function(empRecord){
		if (empRecord.n !== 0) {
			dboperation.getRecordCount(function(count){
				res.render('delete', {employeeid: req.query.employeeid, isRecordRemoved: true, recordRemain : count});
			});
		} else {
			dboperation.getRecordCount(function(count){
				res.render('delete', {employeeid: req.query.employeeid, isRecordRemoved: false, recordRemain : count});
			});
		}
	});
});

app.get('/add', (req, res) => {	
	key = Object.keys(req.query)[0];

	res.type('text/plain'); 
	res.status(200);

	dboperation.addOrUpdate(req.query, function(empID){			    		
	    if (empID === undefined) {		
		    res.send(empID + " not added or updated");
	    } else {
		    res.send(empID + " added or updated");	
	    }
	});										 
});

app.get('/detail', (req, res) => {						
	key = Object.keys(req.query)[0];	

	res.type('text/html'); 
	res.status(200);
	
	dboperation.get(parseInt(req.query[key]), function(empRecord){		
	    let delURL = "http://localhost:3000/delete?employeeid=" + req.query[key];		
		res.render('details', {employeeid: req.query.employeeid, empRecord: empRecord, delURL : delURL});
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