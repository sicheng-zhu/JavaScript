let employee = [{employeeid : 1, name : "Nancy Davolio", degree : "Bachelor"},
				{employeeid : 2, name : "Andrew Fuller", degree : "Doctor"},
				{employeeid : 3, name : "Janet Leverling", degree : "Bachelor"},
				{employeeid : 4, name : "Margaret Peacock", degree : "Bachelor"},
				{employeeid : 5, name : "Steven Buchanan", degree : "Bachelor"}];

function add(parameters) {
	let newEmp;
	
	if (parameters.employeeid !== undefined) {
		for (let i = 0; i < employee.length; i++) {
			if (employee[i].employeeid.toString() === parameters.employeeid) {					
				return false;
			}
		}
				
		newEmp = {employeeid : Number(parameters.employeeid), name : parameters.name, degree : parameters.degree};
	} else {			
		newEmp = {employeeid : employee[employee.length - 1].employeeid + 1, name : parameters.name, degree : parameters.degree};
	}
		
	for (let prop in newEmp) {
        if (newEmp[prop] === undefined) {
			newEmp[prop] = "";
		}
	}
	
	employee.push(newEmp);	
	return true;
}

function getAll() {
	return employee;
}

function get(key, value) {
	let isValidKeyName = false;

	for (let keyWord in employee[0]) {		
		if (key === keyWord) {
			isValidKeyName = true;
		}
	}

	if (!isValidKeyName) {	
		return undefined;
	}
	
	for (let i = 0; i < employee.length; i++) {
		if (employee[i][key].toString() === value) {	
			return employee[i];
		}
	}	

	return undefined;
}

function remove(key, value) {
	let isValidKeyName = false;

	for (let keyWord in employee[0]) {		
		if (key === keyWord) {
			isValidKeyName = true;
		}
	}

	if (!isValidKeyName) {					    
		return false;
	}
	
	for (let i = 0; i < employee.length; i++) {
		if (employee[i][key].toString() === value) {
			employee.splice(i, 1);
			return true;
		}
	}	
	
	return false;
}

function getRecordCount() {
	return employee.length;
}

module.exports = {
    add: add,
    getAll: getAll,
    get: get,
    remove: remove,
	getRecordCount : getRecordCount
};