var fs = require('fs');
var _ = require('underscore');

var firstTable = {
    'miraculous_script' : 'རྒྱུ་འཕྲུལ་ཡིག་ཆའི་ཚིག་མཛོད།',
    'teaching_book' : 'བཀའ་མའི་ ཆོས་སྡེའི་ གླེགས་བམ་་།'
};

var secondTable = {
    'miraculous_script' : {
        '01-14' : _.range(1, 15),
        '15-28' : _.range(15, 29),
        '29-42' : _.range(29, 43),
        '43-56' : _.range(43, 57),
        '57-70' : _.range(57, 71),
        '71-74' : _.range(71, 75)
    },
    'teaching_book' : {
        '53-66' : _.range(53, 67),
        '67-72' : _.range(67, 73)
    }
};

var prefix = {
    'ms' : 'རྒྱུ་འཕྲུལ་ཡིག་ཆའི་ཚིག་མཛོད།',
    'tb' : 'KAMA'
};

var path = {
    'ms' : './miraculous_script/txt',
    'tb' : './teaching_book/txt'
};

var ms_files = fs.readdirSync(path['ms']);
var ms_file_list = _.rest(ms_files);
var ms_file_length = ms_file_list.length;

var tb_files = fs.readdirSync(path['tb']);
var tb_file_list = _.rest(tb_files);
var tb_file_length = tb_file_list.length;

var xmlFile = 'sample.xml';
var bookTag = '<book id="tibetan">རྒྱུ་འཕྲུལ་ཡིག་ཆའི་ཚིག་མཛོད། KAMA</book>' + '\n' + '\n';

// console.log(ms_file_list, ms_file_length);
//
// console.log(tb_file_list, tb_file_length);

fs.writeFileSync(xmlFile, bookTag, {flag: 'a'});

for (var i = 0; i < ms_file_length; i++) {
    var text = fs.readFileSync(path['ms'] + '/' + ms_file_list[i], 'utf8');
    var finalText = addSeg(text, i, null);

    fs.writeFileSync(xmlFile, finalText, {flag: 'a'});
}



for (var i = 0; i < tb_file_length; i++) {
    var text = fs.readFileSync(path['tb'] + '/' + tb_file_list[i], 'utf8');
    var finalText = addSeg(text, i, 'KAMA');

    fs.writeFileSync(xmlFile, finalText, {flag: 'a'});
}



function addSeg(text, index, flag) {
    // 拆分每个txt文件,每隔30个句子
    // index : 单个文件索引, n : 章节数
    var r = /([^།]+།{1,2}){30}/g;
    var n = 1;
    // text = text.replace(r, '<_ id="1.1"/>\n$&\n');
    return text.replace(r, function (match) {
        var counter = (index + 1) + '.' + (n++);
        if (flag) counter = counter + ' ' + flag;
        return '<_ id="' + counter + '"/>' + '\n' + match + '\n';
    });
}