var React = require('react');
var E = React.createElement;
ksa = require('ksana-simple-api');

var require_kdb = {
    fileName: "sample"
};

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
        // return this.props.res.filter(isExist).map(function (obj) {
        return this.props.res.map(function (obj) {
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
        }.bind(this));

        // return utiArray;
    },

    getRawText : function () {
        ksa.fetch({
            db : require_kdb.fileName,
            uti : this.state.utiArray
        }, function (err, res) {
            this.setState({ res : res});
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



