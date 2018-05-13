var marked = require('marked');

var fs = require('fs');
const rs = fs.createReadStream('./README.md');
const ws = fs.createWriteStream('./docs/readme.html');
var Transform = require('stream').Transform;
var transformer = new Transform();
transformer._transform = function(data, encoding, cb) {
	// do transformation
	var html = `<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.css"/>
	<style>
		.markdown-body {
			box-sizing: border-box;
			min-width: 200px;
			max-width: 980px;
			margin: 0 auto;
			padding: 45px;
		}

		@media (max-width: 767px) {
			.markdown-body {
				padding: 15px;
			}
		}
	</style>
	<script src="../compose.umd.js"></script>
</head>
<body>
<article class="markdown-body">
${marked(data.toString())}</article>
<script src="demo.js"></script>
</body>
</html>`;
	this.push(html);
	cb();
}

rs.pipe(transformer).pipe(ws);

rs.on('end', function() {
	console.log('done', arguments);
});
