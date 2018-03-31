const QUOTES_BEFORE_COLON = /\"([^(\")"]+)\":/g;
const BRACES = /[\{\}']+/g

function Loggable (obj)
{

	this.obj = obj;
	this.obj.date = new Date(Date.now()).toLocaleString();

	this.printA = function () {
		console.log(JSON.stringify(this.obj).replace(QUOTES_BEFORE_COLON,"$1:").replace(BRACES, ""));
	};

	Loggable.prototype.printC = function () {
		console.log(JSON.stringify(this.obj).replace(QUOTES_BEFORE_COLON,"$1:").replace(BRACES, ""));
	};

	Loggable.printD = function () {
		console.log(JSON.stringify(this.obj).replace(QUOTES_BEFORE_COLON,"$1:").replace(BRACES, ""));
	}
}

Loggable.prototype.printB = function () {
	console.log(JSON.stringify(this.obj).replace(QUOTES_BEFORE_COLON,"$1:").replace(BRACES, ""));
};

module.exports = Loggable;