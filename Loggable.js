const QUOTES_BEFORE_COLON = /"([^(")]+)":/g;
const BRACES = /[{}']+/g;

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

//ensures empty folder `logs` exists without fuss.
const pathLog = path.join(__dirname, 'logs');
mkdirp(pathLog);


function Loggable (obj)
{
	this.obj = {};
	this.obj.date = getDateFormatYMDHM();
	this.obj = addProperties(obj, this.obj);

}

Loggable.prototype.print = function () {
	let text = JSON.stringify(this.obj).replace(QUOTES_BEFORE_COLON,"$1:").replace(BRACES, "");
	console.log(text);
	(function appendLogFile() {
		fs.appendFile(path.join(pathLog, "log-"+ getDateFormatYMD() +".txt"), text + "\r\n", (err) => {if (err) console.log(err) });
	})();
};


function getDateFormatYMDHM() {
	let d = new Date(Date.now());
	return d.getFullYear() + "-" + padLeft((d.getMonth()+1), "0") + "-" + padLeft(d.getDate(), "0") + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

function getDateFormatYMD() {
	let d = new Date(Date.now());
	return d.getFullYear() + "-" + padLeft((d.getMonth()+1), "0") + "-" + padLeft(d.getDate(), "0");
}

function addProperties(objSource, objTarget) {
	for (let prop in objSource) {
		if (objSource.hasOwnProperty(prop)) {
			// prop is not inherited
			objTarget[prop] = objSource[prop];
		}
	}
	return objTarget;
}

function padLeft(str, padding){
	return (padding + str).slice(-(padding.length+1));
}

module.exports = Loggable;