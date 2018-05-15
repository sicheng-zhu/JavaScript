var mongoose = require("mongoose");

// remote db connection settings. For security, connectionString should be in a separate file not committed to git
var connectionString = "mongodb://sichengzhu:zhusicheng19880312@ds119640.mlab.com:19640/meanemployee";
mongoose.connect(connectionString);

// local db connection settings 
// var ip = process.env.ip || '127.0.0.1';
// mongoose.connect('mongodb://' +ip+ '/<DB_NAME>');
//mongoose.connect('mongodb://' +ip+ '/meanemployee');

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));

// define employee model in JSON key/value pairs
// values indicate the data type of each key
var mySchema = mongoose.Schema({
   employeeid: { type: Number, required: true },
   name: String,
   degree: String
}); 

module.exports = mongoose.model('employee', mySchema);
