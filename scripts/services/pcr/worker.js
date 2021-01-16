var numErrors = null;
var startText = null;

self.addEventListener('message', function(e) {
	numErrors = e.data.numErrors;
	startText = e.data.startText;
	self.runError();
}, false);

//run the pcr calculation
self.runError = function(){
	for(var i = 1; i <= numErrors; i++){
		startText = self.addError(startText);
	}
	//now respond to the main code
	self.postMessage(
		{
			num: numErrors + " errors",
			text: startText
		}
	);
	self.close();
}

//alters a single text character in the given string
self.addError = function(text){
	var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";			
	var indexToUse = Math.floor(Math.random() * chars.length);
	var charToUse = chars.charAt(indexToUse);
	var indexToReplace = Math.floor(Math.random() * text.length);
	while(text.charAt(indexToReplace) == " "){	//if we are repalcing a space pick anoterh random character
		indexToReplace = Math.floor(Math.random() * text.length);
	}
	var newText = text.substr(0, indexToReplace) + charToUse + text.substr((indexToReplace + 1));
	return newText;
}
