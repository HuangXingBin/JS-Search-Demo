var starttime = 0;

var startindexer = function (mkdbconfig) {
    var indexer = require('./indexer');
    
    var session = indexer.start(mkdbconfig);
    if (!session) {
        console.log('No file to index');
        return;
    }
    var getstatus = function () {
        var status = indexer.status();

        if (status.done) {
            var endtime = new Date();
            
        }
    }
}

var build = function (mkdbconfig) {
    var fs = require('fs');
    starttime = new Date();
    console.log('STAR', starttime);
    var glob = require('glob');
    var preprocessor = require('./preprocessor');
    
    if (typeof mkdbconfig.preprocessor === 'function') preprocessor = mkdbconfig.preprocessor;
    
    if (typeof mkdbconfig.glob === 'string') {
        if(mkdbconfig.glob.indexOf('.lst') === mkdbconfig.glob.length - 4) {
            var files = fs.readFileSync(mkdbconfig.glob, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            if (files.charCodeAt(0) === 0xFEFF) {
                files = files.slice(1);
            }
            files = files.split('\n');
            
            mkdbconfig.next = preprocessor(files.sort(), mkdbconfig);
            startindexer(mkdbconfig);
        } else {
            glob(mkdbconfig.glob, function (err, files) {
                mkdbconfig.next = preprocessor(files.sort(), mkdbconfig);
                startindexer(mkdbconfig);
            });
        }

    } else {
        mkdbconfig.next = preprocessor(mkdbconfig.glob);
        startindexer(mkdbconfig);
    }
};

module.exports = build;