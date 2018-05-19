let compose =  require("../compose.umd.js");
var _ = Object.assign(_ || {}, compose);
console.log(_.mix({test:1}, {test:2}));
