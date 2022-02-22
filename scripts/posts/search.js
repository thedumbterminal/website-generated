'use strict';

var postSearch = {};

postSearch._data = postData;	//Load from js include

postSearch.handler = function(element){
	var query = element.value;
	var results = [];
	if(query !== ''){
		results = postSearch._search(query);
		gtag('event', 'search', {
			event_category: 'engagement',
			event_label: query
		});
	}
	postSearch._displayResults(results);
	return false;
};

postSearch._search = function(query){
	var options = {
		keys: ['title'],
		shouldSort: true,
		tokenize: true,
		threshold: 0.2
	};
	var fuse = new Fuse(postSearch._data, options);
	return fuse.search(query);
};

postSearch._displayResults = function(results){
	var allContainer = document.getElementById('allPosts');
	var resultsContainer = document.getElementById('searchResults');
	
	if(results.length){
		allContainer.style.display = 'none';
		while(resultsContainer.hasChildNodes()){	//clear any previous results
			resultsContainer.removeChild(resultsContainer.lastChild);
		}
		for(var i = 0; i < results.length; i++){
			var li = document.createElement('li');
			var a = document.createElement('a');
			var title = document.createTextNode(results[i].title);
			a.appendChild(title);
			a.href = results[i].link;
			li.appendChild(a);
			resultsContainer.appendChild(li);
		}
		resultsContainer.style.display = 'block';
	}
	else{
		resultsContainer.style.display = 'none';
		allContainer.style.display = 'block';
	}
}