var marked = require('marked');

var fs = require('fs');
var Transform = require('stream').Transform;

function convert(src, dest) {

	const rs = fs.createReadStream(src);
	const ws = fs.createWriteStream(dest);
	var transformer = new Transform();
	transformer._transform = function (data, encoding, cb) {
		// do transformation
		var html = `<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet"
href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/styles/default.min.css">
	<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.12.0/build/highlight.min.js"></script>
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
<script src="../tools/demo.js"></script>
</body>
</html>`;
		this.push(html);
		cb();
	}

	rs.pipe(transformer).pipe(ws);

	rs.on('end', function () {
		console.log('done', arguments);
	});
}

convert('README.md', 'docs/index.html');
convert('fun.md', 'docs/fun.html');
