var React=require("react");
var E=React.createElement;
ksa=require("ksana-simple-api");

/**//*<resultList res={this.state.res ? isExist(this.state.res) : null} />*/


// var maincomponent = React.createClass({
//   getInitialState:function() {
//     return {result:[],tofind:"潜龙"};
//   },
//   search:function() {
//     ksa.excerpt({db:"sample",q:this.state.tofind},function(err,data){
//       if (err) console.error(err);
//       else this.setState({result:data});
//         console.log(data);
//     }.bind(this));
//   }
//   ,renderItem:function(item,idx) {
//     return <div>{ksa.renderHits(item.text,item.hits,function(o,t){return E("span",o,t)})}</div>
//   },
//   setTofind:function(e) {
//     this.setState({tofind:e.target.value})
//   },
//   render: function() {
//     return <div><input ref="tofind" value={this.state.tofind} onChange={this.setTofind}></input>
//     <button onClick={this.search} >Search</button>
//       {this.state.result.map(this.renderItem)}
//     </div>;
//   }
// });
// module.exports=maincomponent;

// ksa.excerpt({
//     db : "sample",
//     q : "大人"
// }, function (err, res) {
//     if (err) console.log(err);
//     else console.log(res);
//     obj = res;
//
//     var out = ksa.renderHits(res[0].text, res[0].hits, function (obj, text) {
//         console.log(obj);
//         return obj.className ? '<span class="'+ obj.className + '">' + text + "</span>" : text;
//     }).join("");
//
//     console.log(out);
// });
//
// console.log('========');



ksa.next({db:"sample",uti:"周易.乾",count:2},function(err,res){
	console.log("fetch next 2 pages from current uti");
    console.log(err);
	console.log(res);

	ksa.prev({db:"sample",uti:"周易.乾",count:2},function(err,res2){
		console.log("fetch prev 2 pages from uti");
		console.log(res2);
        console.log(err);
	});

});

// fetch : uti或者vpos是必需的
// 只传入uti,返回uti文本。不能只传入q,必须传入uti或vpos。
ksa.fetch({
    db : "sample",
    uti : "周易.乾"
    // q : "君子終日乾乾"
}, function (err, res) {
    if (err) console.log(err);
    else console.log('fetch', res);
});
// sibling : 拿到所有uti
ksa.sibling({
    db : "sample",
    vpos : 0
}, function (err, res) {
    if (err) console.log(err);
    else console.log('sibling', res);
    utiArray = res.sibling;
    console.log(utiArray);
});
// excerpt不需要uti或者vpos,但是会返回hits,text,uti,vpos等信息
// q 和db是必需的
ksa.excerpt({
    db : "sample",
    q : "周",
    // count : 3 // 3个uti
}, function (err, res) {
    if (err) console.log(err);
    else console.log(res);

    // 可以再返回下一页
    var lastpage = res[res.length - 1].uti;

    // ksa.excerpt({
    //     db : "sample",
    //     q : '下',
    //     from : lastpage,
    //     count : 2
    // }, function (err, res) {
    //     console.log(res);
    // })
});





// 查询:出现每段,以及每段的命中部分。
// 显示:每段标题,以及正文命中部分的前后二十个字
// 使用uti或者vpos查询


//以下是dev2014的内容
var kde=Require('ksana-document').kde;  // Ksana Database Engine
var kse=Require('ksana-document').kse; // Ksana Search Engine
var bootstrap=Require("bootstrap");  
var fileinstaller=Require("fileinstaller");  // install files to browser sandboxed file system
 var require_kdb=[{  //list of ydb for running this application
  filename:"yijing.kdb"  , url:"yijing/yijing.kdb" , desc:"周易(開明書店斷句本)"
}];    
var main = React.createClass({
  getInitialState: function() {
    return {res:null,db:null };
  },
  onReady:function(usage,quota) {  //handler when kdb is ready
    if (!this.state.db) kde.open("yijing",function(db){
        this.setState({db:db});  
        this.dosearch();
    },this);      
    this.setState({dialog:false,quota:quota,usage:usage});
  },
  autosearch:function() {
    clearTimeout(this.timer);
    this.timer=setTimeout(this.dosearch.bind(this),500);
  },
  dosearch:function() {   
    var tofind=this.refs.tofind.getDOMNode().value; // fetch user input
    //add fulltext:true to display all text
    kse.search(this.state.db,tofind,{range:{maxhit:100}},function(data){ //call search engine
      this.setState({res:data});  //react will update UI
    });
  }, 
  openFileinstaller:function(autoclose) { // open file dialog, autoclose==true for initalizing application
    return <fileinstaller quota="128M" autoclose={autoclose} needed={require_kdb} 
                     onReady={this.onReady}/>
  },   
  renderinputs:function() {  // input interface for search
    if (this.state.db) {
      return ( 
        <div><input size="10" className="tofind" ref="tofind"  onInput={this.autosearch} defaultValue="龍"></input>
        <span className="pull-right"><button onClick={this.fileinstallerDialog}>File installer</button></span>
        </div>
        )      
    } else {
      return <span>loading database....</span>
    }
  },
  fileinstallerDialog:function() { //open the file installer dialog
      this.setState({dialog:true});
  },
  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
      return (
        <div>{this.state.dialog?this.openFileinstaller():null}
          {this.renderinputs()}
          <resultlist res={this.state.res}/>
        </div>
      );
    }
  },
  focus:function() {
      if (this.refs.tofind) this.refs.tofind.getDOMNode().focus();
  },
  componentDidMount:function() {
      this.focus();
  },
  componentDidUpdate:function() {
      this.focus();
  } 
});
var resultlist=React.createClass({  //should search result
  show:function() {
    return this.props.res.excerpt.map(function(r,i){ // excerpt is an array 
      return <div>
      <div className="pagename">{r.pagename}</div>
        <div className="resultitem" dangerouslySetInnerHTML={{__html:r.text}}></div>
      </div>
    }); 
  }, 
  render:function() {
    if (this.props.res) {
      if (this.props.res.excerpt&&this.props.res.excerpt.length) {
          return <div>{this.show()}</div>
      } else {
        return <div>Not found</div>
      }
    }
    else {
      return <div>type keyword to search</div>
    } 
  }
});

module.exports=main;