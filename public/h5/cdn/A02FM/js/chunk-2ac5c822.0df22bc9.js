(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2ac5c822"],{"0d13":function(t,e,s){"use strict";var r=s("6aba"),n=s.n(r);n.a},"61f7":function(t,e,s){"use strict";s.d(e,"a",(function(){return i})),s.d(e,"d",(function(){return c})),s.d(e,"c",(function(){return u})),s.d(e,"b",(function(){return d}));var r=/^[cC]\w{4,10}/,n=/^1\d{10,11}$/,a=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,o=/^\d{10}/;function i(t){return r.test(t)}function c(t){return n.test(t)}function u(t){return a.test(t)}function d(t){return o.test(t)}},"6aba":function(t,e,s){},aa88:function(t,e,s){"use strict";s.r(e);var r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"sign"},[s("div",{staticClass:"sign__header clearfix"}),s("h1",{staticClass:"sign__title"},[t._v(" 开户成功 ")]),t.isFast?t._e():s("p",{staticClass:"sign__tips"},[t._v(" 您可以使用手机号发送验证码或账号密码登录 ")]),s("form",{staticClass:"form",on:{submit:function(t){t.preventDefault()}}},[s("div",{staticClass:"form__item"},[s("div",{staticClass:"form__content"},[s("label",{staticClass:"form__label--prefix",attrs:{for:"sign_up_acc"}},[t._v("账户ID：")]),s("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.loginName,expression:"loginName",modifiers:{trim:!0}}],ref:"acc",staticClass:"form__input sign-up-form__input",attrs:{readonly:t.readonlyAcc,id:"sign_up_acc",placeholder:"c开头5-10位数字或字母",maxlength:"11",type:"text"},domProps:{value:t.loginName},on:{input:function(e){e.target.composing||(t.loginName=e.target.value.trim())},blur:function(e){return t.$forceUpdate()}}}),!0===t.readonlyAcc?s("button",{staticClass:"form__suffix form__suffix-button border",on:{click:t.toggleAcc}},[t._v(" 点击修改 ")]):!1===t.readonlyAcc?s("button",{staticClass:"form__suffix form__suffix-button border",on:{click:t.updateAcc}},[t._v(" 确定 ")]):t._e()])]),s("div",{staticClass:"form__item"},[s("div",{staticClass:"form__content"},[s("label",{staticClass:"form__label--prefix",attrs:{for:"sign_up_pwd"}},[t._v("密码：")]),s("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.password,expression:"password",modifiers:{trim:!0}}],ref:"pwd",staticClass:"form__input sign-up-form__input",attrs:{readonly:t.readonlyPwd,id:"sign_up_pwd",placeholder:"6-16位数字及字母组成",maxlength:"16",type:"text"},domProps:{value:t.password},on:{input:function(e){e.target.composing||(t.password=e.target.value.trim())},blur:function(e){return t.$forceUpdate()}}}),!0===t.readonlyPwd?s("button",{staticClass:"form__suffix form__suffix-button border",on:{click:t.togglePwd}},[t._v(" 点击修改 ")]):!1===t.readonlyPwd?s("button",{staticClass:"form__suffix form__suffix-button border",on:{click:t.updatePwd}},[t._v(" 确定 ")]):t._e()])]),t.isFast?s("div",{staticClass:"form__item"},[s("label",{staticClass:"form__label",attrs:{for:"sign_in_parent"}},[t._v(" 好友推荐码（选填） ")]),s("div",{staticClass:"form__content form__content--suffix"},[s("input",{directives:[{name:"model",rawName:"v-model.trim",value:t.parentId,expression:"parentId",modifiers:{trim:!0}}],staticClass:"form__input sign-up-form__input",attrs:{readonly:t.readonlyParentId,id:"sign_in_parent",placeholder:"推荐码由10位数字组成",maxlength:"10",type:"text"},domProps:{value:t.parentId},on:{input:function(e){e.target.composing||(t.parentId=e.target.value.trim())},blur:function(e){return t.$forceUpdate()}}}),t.readonlyParentId?t._e():s("button",{staticClass:"form__suffix form__suffix-button border",on:{click:t.updateParentId}},[t._v(" 确定提交 ")])])]):t._e(),t._m(0),s("button",{staticClass:"form__button form__button--full",on:{click:function(){return null}}},[t._v(" 立即存款 ")]),s("button",{staticClass:"form__button form__button--empty border",on:{click:function(e){return t.$router.replace("/")}}},[t._v(" 进入首页 ")])]),t._m(1)])},n=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("h3",{staticClass:"newbie-offer"},[t._v(" 新会员专享，"),s("a",{staticClass:"newbie-offer__link c-primary",attrs:{href:"javascript:void (0);"}},[t._v("存款5重好礼")]),t._v("，最高赠送礼金5,000元。 ")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("p",{staticClass:"sign__notes sign-up-success__notes"},[t._v(" 凯发娱乐支持USDT "),s("span",{staticClass:"sign__notes-strong"},[t._v("安全 • 方便")]),t._v(" 匿名买卖、不受银行监管 ")])}],a=s("5530"),o=s("2f62"),i=s("61f7"),c={name:"sign_up_success",beforeRouteEnter:function(t,e,s){t.params.loginName&&t.params.password?s():s("/")},data:function(){return{loginName:null,password:null,parentId:null,readonlyAcc:!0,readonlyPwd:!0,readonlyParentId:!1,isFast:!1}},computed:{_password:function(){return"readonly"===this.readonlyPwd?this.password:this.$route.params.password}},created:function(){this.isFast=this.$route.params.isFast,this.password=this.$route.params.password,this.loginName=this.$route.params.loginName},methods:Object(a["a"])({},Object(o["b"])(["login","getCustomerInfo"]),{toggleAcc:function(){this.readonlyAcc=!1,this.$refs.acc.focus()},togglePwd:function(){this.readonlyPwd=!1,this.$refs.pwd.focus()},updateAcc:function(){var t=this,e={type:1,password:this.$encrypted(this._password),userAccount:this.loginName};Object(i["a"])(this.loginName)?this.$api.modifyTempLoginName(e).then((function(e){var s=e.head,r=e.body;if("0000"===s.errCode)return t.readonlyAcc="readonly",t.login({loginName:r.loginName,verifyStr:t._password})})).then((function(e){var s=e.head;s&&"0000"===s.errCode&&t.$toast.success("修改成功")})).catch((function(t){return console.log(t)})):this.$toast.error("请输入c开头5-11位数字或字母")},updatePwd:function(){var t=this,e={newPassword:this.$encrypted(this.password),oldPassword:this.$encrypted(this.$route.params.password)};Object(i["c"])(this.password)?this.$api.modifyPwd(e).then((function(e){var s=e.head;"0000"===s.errCode&&(t.readonlyPwd="readonly",t.$toast.success("修改成功"))})):this.$toast.error("密码由6-16位数字及字母组成")},updateParentId:function(){var t=this,e={changeParentId:1,parentId:this.parentId};Object(i["b"])(this.parentId)?this.$api.modify(e).then((function(e){var s=e.head;"0000"===s.errCode&&(t.readonlyParentId=!0,t.$toast.success("修改成功"))})):this.$toast.error("推荐码由10位数字组成")}})},u=c,d=(s("0d13"),s("2877")),l=Object(d["a"])(u,r,n,!1,null,"5f6e7c1f",null);e["default"]=l.exports}}]);
//# sourceMappingURL=chunk-2ac5c822.0df22bc9.js.map