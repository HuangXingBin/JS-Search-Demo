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


var xmlFile = 'chapterNames.txt';

// 去掉两边空格和数字
var bookNames = book_files.map(function (book) {
    return (book.replace(/\d+/g, '').trim()).split('.')[0].trim();
});

fs.writeFileSync(xmlFile, JSON.stringify(bookNames), {flag : 'a'});

