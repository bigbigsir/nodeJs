(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d8449532"],{3895:function(t,e,i){},"3eee":function(t,e,i){"use strict";var s=i("3895"),n=i.n(s);n.a},dd5f:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"container"},[i("div",{staticClass:"dew-figure-container"},[i("div",{staticClass:"dew-figure-header clearfix"},[i("span",{staticClass:"game-table"},[t._v(t._s(t.vid)+"桌")]),i("span",{staticClass:"timer-text"},[i("i",{staticClass:"icon-time"}),i("span",{staticClass:"monospaced-font"},[t._v(" 00"),i("span",[t._v(":")]),t._v(t._s(t.countdown>9?t.countdown:"0"+t.countdown)+" ")])])]),i("div",{staticClass:"scoreboard clearfix"},[i("span",{staticClass:"scoreboard-item"},[i("span",[t._v("庄")]),i("span",[t._v(t._s(t.banker))])]),i("span",{staticClass:"scoreboard-item"},[i("span",[t._v("和")]),i("span",[t._v(t._s(t.tie))])]),i("span",{staticClass:"scoreboard-item"},[i("span",[t._v("闲")]),i("span",[t._v(t._s(t.player))])])]),i("div",{staticClass:"canvas-container"},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.showShuffle,expression:"showShuffle"}],staticClass:"shuffle-wrapper"},[i("span",{staticClass:"shuffle-text"},[t._v("洗牌中")])]),t.showLoading?i("div",{staticClass:"loading-wrapper"},[i("span",{staticClass:"loading-text"},[t._v("loading...")])]):t._e(),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.showShuffle,expression:"!showShuffle"}],staticClass:"canvas-wrapper",attrs:{id:"canvasWrapper1"}},[i("canvas",{attrs:{id:"canvas1"}})])]),i("div",{staticClass:"button-wrapper"},[i("button",{staticClass:"submit-button",on:{click:function(){return null}}},[i("span",{staticClass:"button-text"},[t._v("快速入座")])])])])])},n=[],o=(i("99af"),i("cb29"),i("4de4"),i("4160"),i("fb6a"),i("159b"),i("2909")),r=i("5530"),l=i("2f62"),a={name:"dewFigure",data:function(){return{ctx:null,vid:"B001",columns:16,rows:6,cellSizeWidth:23,cellSizeHeight:23,lineWidth:1,resultColor:{banker:"#d55263",player:"#6e8df7",tie:"#4ea950"},showLoading:!0,showShuffle:!0,resultList:[],timer:null,countdown:0,timerText:null,lastGameCode:null}},computed:Object(r["a"])({},Object(l["e"])(["socketResultList"]),{origin:function(){return this.lineWidth/2},cellHeight:function(){return this.cellSizeHeight+this.lineWidth},cellWidth:function(){return this.cellSizeWidth+this.lineWidth},gridWidth:function(){return this.lineWidth+this.columns*this.cellWidth},gridHeight:function(){return this.lineWidth+this.rows*this.cellHeight},banker:function(){return this.resultList.filter((function(t){return"banker"===t.result})).length},player:function(){return this.resultList.filter((function(t){return"player"===t.result})).length},tie:function(){return this.resultList.filter((function(t){return"tie"===t.result})).length}}),mounted:function(){var t=document.getElementById("canvas1"),e=document.getElementById("canvasWrapper1"),i=t.getContext("2d"),s=window.devicePixelRatio;s&&(s=Math.ceil(s),s=s>2?s:4,t.width=this.gridWidth*s,t.height=this.gridHeight*s,t.style.width=this.gridWidth+"px",t.style.height=this.gridHeight+"px",e.style.width=this.gridWidth+"px",e.style.height=this.gridHeight+"px",i.scale(s,s)),this.ctx=i,this.formatResultList(this.socketResultList)},methods:{drawGrid:function(t){for(var e="#202020",i=this.origin;i<=this.gridWidth;i+=this.cellWidth)t.beginPath(),t.strokeStyle=e,t.lineWidth=this.lineWidth,t.moveTo(i,0),t.lineTo(i,this.gridHeight),t.stroke();for(var s=this.origin;s<=this.gridHeight;s+=this.cellHeight)t.beginPath(),t.strokeStyle=e,t.lineWidth=this.lineWidth,t.moveTo(0,s),t.lineTo(this.gridWidth,s),t.stroke()},drawCircle:function(t,e,i,s){var n="#141414",o=s,r=3,l=8;t.beginPath(),t.arc(e,i,l,0,360,!1),t.fillStyle=n,t.strokeStyle=o,t.lineWidth=r,t.fill(),t.stroke()},drawLine:function(t,e,i,s,n){t.beginPath(),t.moveTo(e[0],e[1]),t.lineTo(i[0],i[1]),t.lineWidth=s,t.strokeStyle=n,t.stroke()},drawText:function(t,e,i,s,n){t.beginPath(),t.font=n,t.fillStyle="#fff",t.textAlign="center",t.textBaseline="middle",t.fillText(s,e,i),t.stroke()},drawDewFigure:function(t){var e=this,i=this.formatBigRoadData(this.resultList).slice(-(this.columns-1));t.clearRect(0,0,this.gridWidth,this.gridHeight),this.drawGrid(t),i.forEach((function(i,s){i.forEach((function(i,n){var o=(s+1)*e.cellWidth-e.cellSizeWidth/2,r=(n+1)*e.cellHeight-e.cellSizeHeight/2;if(e.drawCircle(t,o,r,i.color),i.tieNumber){var l=3,a=s*e.cellWidth+e.origin,c=n*e.cellHeight+e.origin;e.drawLine(t,[a+l,c+e.cellHeight-l],[a+e.cellWidth-l,c+l],2,e.resultColor.tie),i.tieNumber>1&&i.tieNumber<10?e.drawText(t,Math.ceil(o),Math.ceil(r),"2","16px Calibri"):i.tieNumber>10&&e.drawText(t,o,Math.ceil(r),"18","12px Calibri")}}))})),t.closePath()},formatItemData:function(t){var e={pair:t.pair};return t.banker_val>t.player_val?e.result="banker":t.banker_val<t.player_val?e.result="player":e.result="tie",e},formatBigRoadData:function(){var t,e,i,s=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],o=0,l=[],a=!1;return n.forEach((function(n){t=l[l.length-1],e=t&&t[t.length-1],a="tie"!==n.result&&(i!==n.result||t&&t.length>=s.rows),a&&l.push([]),t=l[l.length-1],"tie"===n.result?(e?(e.tieNumber+=1,o=0):o+=1,i=e&&e.result):(t.push(Object(r["a"])({},n,{tieNumber:o,color:s.resultColor[n.result]})),o=0,i=n.result)})),l},countdownFunc:function(t){var e=this;this.timerText=null,clearInterval(this.timer),0===this.countdown&&(this.timerText=t),this.timer=setInterval((function(){e.countdown>0?e.countdown--:(e.timerText=t,clearInterval(e.timer))}),1e3)},newShoes:function(){this.countdown=0,this.countdownFunc("洗牌中"),this.showShuffle=!0,this.resultList=[],this.drawDewFigure(this.ctx)},newRound:function(t){this.showShuffle=!1,this.countdown=t,this.countdownFunc("结算中")},closeRound:function(t){this.countdown=0,this.countdownFunc("发牌中"),this.resultList=[].concat(Object(o["a"])(this.resultList),[this.formatItemData(t)]),this.drawDewFigure(this.ctx)},formatResultList:function(t){t=t[this.vid]||{},console.log(t);var e,i,s=t.roundRes||{},n=[];for(e in s)s.hasOwnProperty(e)&&(i=this.formatItemData(s[e]),n.push(i));n.length?(this.resultList=n,this.newRound(t.seconds),this.drawDewFigure(this.ctx)):this.newShoes(),this.showLoading=!1}},sockets:{connect_error:function(t){console.log("connect_error:\n",t)},connect_timeout:function(t){console.log("connect_timeout:\n"),console.log(t)},reconnect_error:function(t){console.log("reconnect_error\n"),console.log(t)},reconnect_failed:function(t){console.log("reconnect_failed\n"),console.log(t)},"result list":function(t){this.formatResultList(JSON.parse(t))},"new shoes":function(t){t=JSON.parse(t),t.vid===this.vid&&(this.newShoes(),console.log("new shoes:\n",t))},"new round":function(t){t=JSON.parse(t),t.vid===this.vid&&(this.newRound(t.seconds),console.log("new round:\n",t))},"close round":function(t){t=JSON.parse(t),t.vid===this.vid&&this.lastGameCode!==t.gmcode&&(this.closeRound(t),console.log("close round:\n",t))}}},c=a,h=(i("3eee"),i("2877")),u=Object(h["a"])(c,s,n,!1,null,"0cd04e1a",null);e["default"]=u.exports}}]);
//# sourceMappingURL=chunk-d8449532.8107c3d5.js.map