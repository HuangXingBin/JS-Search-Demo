var fs = require('fs');
var _und = require('underscore');

var appName = 'Guhyagarbha';
// var tocName = 'སྒྱུ་འཕྲུལ་ ཆོས་སྡེའི་ གླེགས་བམ་། 11 - 20';
var tocName = 'སྒྱུ་འཕྲུལ་ ཆོས་སྡེའི་ གླེགས་བམ་། 1-10';
var bookName = 'སྒྱུ་འཕྲུལ་གྱི་་ཡིག་ཆ་སྐོར་ཕྱོགས་སྒྲིག་།'; // 原来经书文件夹的名字

var path = './Guhyagarbha';

var book_files_raw = fs.readdirSync(path);
var book_files = _und.rest(book_files_raw); //TODO 消除苹果的.DStore, window可能不用
book_files.sort(function (a, b) {
    return parseInt(a) - parseInt(b);
});
var book_files_length = book_files.length;

var xmlFile = 'sample.xml';
var bookTag = '<book id="tibetan">སྒྱུ་འཕྲུལ་ ཆོས་སྡེའི་ གླེགས་བམ་།</book>' + '\n' + '\n';

fs.writeFileSync(xmlFile, bookTag, {flag : 'a'});

for (var i = 0; i < book_files_length; i++) {
// for (var i = 0; i < 2; i++) {
    var text = fs.readFileSync(path + '/' + book_files[i], 'utf8');
    // console.log('iiiii', i, 'name', book_files[i]);
    var finalText = addSeg(text, i, null);

    fs.writeFileSync(xmlFile, finalText, {flag : 'a'});
}


function addSeg(text, index) {
    // 拆分每个txt文件,每隔30个句子
    // index : 单个文件索引, n : 章节数
    var r = /([^།]+།{1,2}){30}/g;
    var n = 1;
    var counter = '';
    // text = text.replace(r, '<_ id="1.1"/>\n$&\n');
    // 如果匹配到正则,则replace
    // 如果匹配不到,说明文本过短,则直接在头部添加标签
    if (r.test(text)) {
        return text.replace(r, function (match) {
            // 第四章暂时丢失,TODO
            if (index > 2) {
                counter = (index + 2) + '.' + (n++);
            } else if (index < 3) {
                counter = (index + 1) + '.' + (n++);
            }
            return '<_ id="' + counter + '"/>' + '\n' + match + '\n';
        });
    } else {
        console.log('这里有一个文件长度过短', index);
        // 第四章暂时丢失,TODO
        if (index > 2) {
            counter = (index + 2) + '.' + (n++);
        } else if (index < 3) {
            counter = (index + 1) + '.' + (n++);
        }
        return '<_ id="' + counter + '"/>' + '\n' + text + '\n';
    }

}