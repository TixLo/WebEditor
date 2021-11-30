Array.prototype.insert = function(index, item) {
	this.splice(index, 0 ,item);
}

Array.prototype.first = function() {
	if (this.length == 0)
		return null;
	return this[0];
}

Array.prototype.last = function() {
	if (this.length == 0)
		return null;
	return this[this.length - 1];
}

Array.prototype.secondLast = function() {
	if (this.length < 2)
		return null;
	return this[this.length - 2];
}

Array.prototype.swap = function(i1, i2) {
	if (this.length <= i1 || this.length <= i2)
			return;
	var elem = this[i1];
	this[i1] = this[i2];
	this[i2] = elem;
}

Array.prototype.del = function(i) {
	if (this.length <= i)
			return;
	this.splice(i, 1);
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}

// WebEditor global instance
var gEditor = null;
