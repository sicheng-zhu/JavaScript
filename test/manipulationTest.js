var expect = require("chai").expect;
var manipulation = require("../manipulation");

describe("Employee module", () => {
	// Two test cases below test get method
	// positive test case
	it("returns requested employee", function() {
		var result = manipulation.get("employeeid", "1");
		expect(result).to.deep.equal({employeeid : 1, name : "Nancy Davolio", degree : "Bachelor"});
	});
	
	// negative test case
	it("fails w/ getting invalid employee", () => {
		var result = manipulation.get("employeeid", "0");
		expect(result).to.be.undefined;
	});
	
	// Two test cases below test add method	
	// positive test case
	it("adds requested employee", function() {
		manipulation.add({employeeid : 6, name : "Michael Suyama", degree : "Master"});
		var result = manipulation.get("employeeid", "6");
		expect(result).to.deep.equal({employeeid : 6, name : "Michael Suyama", degree : "Master"});
	});
	
	// negative test case	
	it("fails w/ adding duplicated employee", () => {
		var result = manipulation.add({employeeid : "1", name : "Michael Suyama", degree : "Master"});
		expect(result).to.be.false;
	});
	
	// Two test cases below test remove method	
	// positive test case
	it("deletes requested employee", function() {
		var result = manipulation.get("employeeid", "1");
		expect(result).to.deep.equal({employeeid : 1, name : "Nancy Davolio", degree : "Bachelor"});
		
		manipulation.remove("employeeid", "1");
		result = manipulation.get("employeeid", "1");
		expect(result).to.be.undefined;
	});

	// negative test case	
	it("fails w/ deleting invalid employee", () => {
		var result = manipulation.get("employeeid", "0");
		expect(result).to.be.undefined;
		
		result = manipulation.remove("employeeid", "0");
		expect(result).to.be.false;
	});
});