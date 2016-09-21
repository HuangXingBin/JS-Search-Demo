var React = require('react');
var E = React.createElement;
ksa = require('ksana-simple-api');

var require_kdb = {
    fileName: "sample"
};

// toc = [];
// ksa.toc({ db : "jiangkangyur"}, (err, res) => {
//     console.log(res);
//     toc = res.toc;
// });
//
// tocArray = [];
// setTimeout(function () {
//     for(var i = 0; i < toc.length; i++) {
//         var tocObj = toc[i];
//         if (tocObj.d <= 1) {
//             tocArray.push(tocObj);
//         }
//     }
// }, 100);

/* 将toc以json格式下载至本地 */
uti = [];
toc = [];
newToc = [];
finalToc = [];
// 拿到array of strings(uti列表)
ksa.sibling({
    db : 'sample',
    vpos : 0
}, function (err, res) {
    uti = res.sibling;
});
// 拿到rawText
setTimeout(function () {
    ksa.fetch({
        db : 'sample',
        uti : uti
    }, function (err, res) {
        toc = res;
        toc.forEach(function (obj) {
            delete obj.text;
            delete obj.hits;
            obj.t = obj.uti;
            delete obj.uti;
        });
        newToc = toc.filter(function (obj) {
            return getToc(obj);
        });
        // console.table(newToc);
        finalToc = getFinalToc(newToc);
    })
}, 5000);
// 处理取得最终toc
function getToc(toc) {
    var text = toc.t;
    var textArray = text.split('.');
    var textHind = textArray[1];
    if (parseInt(textHind) - 1 === 0) {
        return true;
    } else {
        return false;
    }
}
// 再处理,获得直接用于adarsha的toc
function getFinalToc(toc) {
    var finalToc = [];
    finalToc = toc.map(function (obj) {
        var newObj = {
            d : 2,
            t : '',
            vpos : 0
        };
        newObj.t = ((obj.t).split('.'))[0];
        newObj.vpos = obj.vpos;
        return newObj;
    });
    return finalToc;
}


function isExist(obj) {
    return obj.hits && obj.hits.length > 0;
}

var ResultList = React.createClass({
    render : function () {
        var res = this.props.res;
        if (res && res.length > 0) {
            return (
                <div dangerouslySetInnerHTML={{__html : this.show().join("")}}>
                </div>
                // <div>{this.show()}</div>
            )
        } else {
            return <div>Not found</div>
        }
    },
    show : function () {
        return this.props.res.filter(isExist).map(function (obj) {
        // return this.props.res.map(function (obj) {
            var out = ksa.renderHits(obj.text, obj.hits, function (obj, text) {
                return obj.className?'<span class="'+obj.className+'">'+text+"</span>":text;
            }).join("");
            var title = '<div class="uti">' + obj.uti + '</div>';
            return title + '<div class="item">' + out + '</div>';
        })
    }
});

var MainComponent = React.createClass({
    render : function () {

        return (
            <div>
                <input ref="tofind" type="text"/>
                <button onClick={this.search}>Search</button>
                <ResultList res={this.state.res} />
            </div>
        )
    },

    getUtiArray : function () {
        // var utiArray = 2;

        ksa.sibling({
            db : require_kdb.fileName,
            vpos : 0
        }, function (err, res) {
            this.setState({ utiArray : res.sibling });
            // utiArray = res.sibling;
            console.log('输出所有章节', res.sibling);
        }.bind(this));

        // return utiArray;
    },

    getRawText : function () {
        ksa.fetch({
            db : require_kdb.fileName,
            uti : this.state.utiArray
        }, function (err, res) {
            this.setState({ res : res});
            console.log('输出原始字符串', res);
        }.bind(this));
    },

    getInitialState : function () {

        return {
            utiArray : null,
            res : null
        };
    },

    search : function () {
        var tofind = this.refs.tofind.getDOMNode().value;

        this.getUtiArray();
        this.getRawText();

        ksa.fetch({
            db : require_kdb.fileName,
            uti : this.state.utiArray,
            q : tofind
        }, function (err, res) {
            if (err) console.log(err);
            else this.setState({ res : res });
            console.log(res);
        }.bind(this));
    },
    focus : function () {
        if (this.refs.tofind) this.refs.tofind.getDOMNode().focus();
    },
    componentDidMount : function () {
        this.focus();
    },
    componentDidUpdate : function () {
        this.focus();
    }
});



module.exports = MainComponent;



