var fs = require('fs');

var txt = fs.readFileSync('tibetan.txt', 'utf8');

console.log(txt);

txt = txt.replace(/(\d{1,4}\.\d{1,4})/g, "<_ id=\"$1\"/>\n<chapter>$1</chapter>\n" );

console.log(txt);

fs.writeFileSync('sample.xml', txt, 'utf8');
