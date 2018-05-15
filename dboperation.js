var employee = require("./model/employee");

// add or update a single record
function addOrUpdate(parameters, addOrUpdateCallBack) {
	let newEmp;
	
	// If employeeid is not empty.
	if (parameters.employeeid !== undefined) {				
		// Search by employeeid, and then decide if add or update a record.
		employee.findOne({"employeeid" : parameters.employeeid}, function (err, item) {
		    if (err) {
			    return next(err);
		    } 

			// Item found, update this record
		    if (item !== null) { 				
			    employee.updateOne(parameters, function(err, res) {        
					if (err) {
			            return next(err);												
		            } 
					
					addOrUpdateCallBack(parameters.employeeid);
				});                    
		    } else { // Item not found, add this record									
				newEmp = {"employeeid" : parameters.employeeid, "name" : parameters.name, "degree" : parameters.degree};				
				
				for (let prop in newEmp) {
                    if (newEmp[prop] === undefined) {
			            newEmp[prop] = "";
		            }
	            }
				
				employee.create(newEmp, function(err, res) {        
				    if (err) {
					    addOrUpdateCallBack(undefined);
			            return next(err);
		            } 
						
					addOrUpdateCallBack(newEmp.employeeid);
				});      								 
		    }
	    });										
	} else { // If employeeid is empty.		
		employee.find({}).sort({"employeeid": 'descending'}).limit(1).exec(function(err, item) { 
			if (err) {
				return next(err);
			} 
					
			newEmp = {"employeeid" : item[0].employeeid + 1, "name" : parameters.name, "degree" : parameters.degree};
			
			for (let prop in newEmp) {
                if (newEmp[prop] === undefined) {
			        newEmp[prop] = "";
		        }
	        }
			
			employee.create(newEmp, function(err, res) {        				
				if (err) {
					addOrUpdateCallBack(undefined);
			        return next(err);
		         } 
						
				addOrUpdateCallBack(newEmp.employeeid);
			});   
		});   	
	}			
}

// return all records
function getAll(getAllCallBack){
	employee.find({}, function(err, items) {
        if (err) {
            return next(err);
        } 

        getAllCallBack(items);                    
    });
}

// return a single record
function get(value, getCallBack) {
	employee.findOne({"employeeid" : value}, function (err, items) {
		if (err) {
			return next(err);
		} 
		
		getCallBack(items);
	});
}

// delete a single record
function remove(value, delateCallBack) {
	employee.deleteOne({"employeeid" : value}, function (err, items) {
		if (err) {
			return next(err);
		} 

		delateCallBack(items);
	});
}

// get counts of documents in db
function getRecordCount(getRecordCallBack) {
	employee.count({}, function (err, count) {
		if (err) {
			return next(err);
		} 

		getRecordCallBack(count);
	});
}

module.exports = {
    addOrUpdate: addOrUpdate,
    getAll: getAll,
    get: get,
    remove: remove,
	getRecordCount : getRecordCount
};