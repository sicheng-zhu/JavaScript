'use strict'
var http = require("http"); 
var fs = require("fs");
const querystring = require('querystring');
var manipulation = require("./manipulation");
var currentPath = process.cwd();
const express = require("express");
const app = express();
var key;
let handlebars =  require("express-handlebars");

app.engine(".html", handlebars({extname: '.html'}));
app.set('port', process.env.PORT || 3000);
app.set("view engine", ".html");
app.use(express.static(__dirname)); // set location for static files
app.use(require("body-parser").urlencoded({extended: true})); // parse form submissions

app.get('/', (req, res) => {
	let empList = manipulation.getAll();
	res.type('text/html');
	res.status(200);	
	
	for (var i = 0; i < empList.length; i++) {
		empList[i].viewURL = "http://localhost:3000/detail?employeeid=" + empList[i].employeeid;
	}
	
	res.render('home', {empList: empList});
});

app.get('/about', (req, res) => {
	res.type('application/json');
	res.status(200);
	res.sendFile(__dirname + '/package.json');
});

app.get('/getall', (req, res) => {
	res.type('text/plain');
	res.status(200);
	res.send(JSON.stringify(manipulation.getAll()));
});

app.get('/get', (req, res) => {	
	key = Object.keys(req.query)[0];	
	let empRecord = manipulation.get(key, req.query[key]);
	
	res.type('text/html'); 
	res.status(200);
			    
	res.render('details', {employeeid: req.query.employeeid, empRecord: empRecord });
});

app.get('/delete', (req, res) => {	
	key = Object.keys(req.query)[0];	
	var isRecordRemoved = manipulation.remove(key, req.query[key]);
	
	res.type('text/html'); 
	res.status(200);			
	
	res.render('delete', {employeeid: req.query.employeeid, isRecordRemoved: isRecordRemoved, recordRemain : manipulation.getRecordCount()});
});

app.get('/add', (req, res) => {	
	key = Object.keys(req.query)[0];
	/* 
	 * hasInsertedRecord variable is a flag from manipulation module
	 * indicating if a record has been added. 
	 */
	var hasInsertedRecord = manipulation.add(req.query);
	
	res.type('text/plain'); 
	res.status(200);
	
	if (hasInsertedRecord === false) {		
		res.send(req.query[key] + " not added");
	} else {
		res.send(req.query[key] + " added");	
	}								 
});

app.get('/detail', (req, res) => {	
	key = Object.keys(req.query)[0];	
	let empRecord = manipulation.get(key, req.query[key]);
	let delURL = "http://localhost:3000/delete?employeeid=" + req.query[key];
	
	res.type('text/html'); 
	res.status(200);
			    
	res.render('details', {employeeid: req.query.employeeid, empRecord: empRecord, delURL : delURL});
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