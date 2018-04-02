module.exports = {

	Employee : function() {
		this.name = "";
		this.address = "";
	},

	Expense : function() {
		this.date = "";
		this.category = "";
		this.expDescription = "";
		this.preTaxAmount = "";
		this.taxName = "";
		this.taxAmount = "";
	},

	employees : [],

	expenses : []
};