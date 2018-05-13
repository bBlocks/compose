function executeExample(element) {
	var script = document.createElement('script');
	script.innerHTML = htmlDecode(element.innerHTML);
	element.parentNode.parentNode.appendChild(script);
}

function htmlDecode(input){
	var e = document.createElement('div');
	e.innerHTML = input;
	// handle case of empty input
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

document.addEventListener('DOMContentLoaded', function() {
	var examples = document.querySelectorAll('code');
	for (var i =0; i<examples.length; i++) {
		var example = examples[i];
		var cls = example.getAttribute('class');
		if (cls == 'lang-javascript') {
			executeExample(example);
		}
	}

});