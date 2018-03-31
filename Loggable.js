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
	this.obj.date = getDateFormatYMDHM(); // new Date(Date.now()).toLocaleString();

	//this.obj = obj;
	//Originally used to: Add multiple attributes to an existing js object, but now clobbers prior date attribute.

	//for(var prop in obj) this.obj[prop] = obj[prop];
	//IDE warns: Possible iteration over unexpected (custom / inherited) members, probably missing hasOwnProperty check less.

	//acceptable implementation standard
	this.obj = addProperties(obj, this.obj);

}

Loggable.prototype.print = function () {
	let text = JSON.stringify(this.obj).replace(QUOTES_BEFORE_COLON,"$1:").replace(BRACES, "");
	console.log(text);
	(function appendLogFile() {
		//fs.appendFile(path.join(pathLog, "log-"+ this.obj.date +".txt"), text + "\r\n", (err) => {if (err) console.log(err) });
		//IDE warns: Invalid usage of this.  Checks for JavaScript this to be the same in closure and in outer context.
		//for now choosing less-performant solution of re-executing function getDateFormatYMD()
		//which also introduces the rare chance at the moment immediately prior/after midnight of reporting a few milliseconds of yesterdays timestamp into today's new logfile. deemed unimportant and ignoring for now.

		fs.appendFile(path.join(pathLog, "log-"+ getDateFormatYMD() +".txt"), text + "\r\n", (err) => {if (err) console.log(err) });
	})();
};


function getDateFormatYMDHM() {
	let d = new Date(Date.now());
	return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

function getDateFormatYMD() {
	let d = new Date(Date.now());
	return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
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


module.exports = Loggable;