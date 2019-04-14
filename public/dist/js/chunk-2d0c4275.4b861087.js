(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c4275"],{"3a2c":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",e._b({attrs:{visible:e.visible,title:e.formData.id?e.$t("update"):e.$t("add"),"custom-class":"user-dialog min-w-600px","close-on-click-modal":!1,"close-on-press-escape":!1},on:{opened:e.dialogOpen,closed:e.dialogClose,"update:visible":function(t){e.visible=t}}},"el-dialog",e.$attrs,!1),[a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.submitLoading,expression:"submitLoading"}],ref:"form",attrs:{model:e.formData,rules:e.formRules,"validate-on-rule-change":!1,"label-width":"auto"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submitHandle()}}},[a("el-form-item",{attrs:{prop:"username",label:e.$t("module.username")}},[a("el-input",{attrs:{placeholder:e.$t("module.username"),readonly:!!e.formData.id,maxlength:"30"},model:{value:e.formData.username,callback:function(t){e.$set(e.formData,"username","string"===typeof t?t.trim():t)},expression:"formData.username"}})],1),e.isChangePassword?a("el-form-item",{attrs:{prop:"originalPassword",label:e.$t("module.originalPassword")}},[a("el-input",{attrs:{placeholder:e.$t("module.originalPassword"),maxlength:"30"},model:{value:e.formData.originalPassword,callback:function(t){e.$set(e.formData,"originalPassword","string"===typeof t?t.trim():t)},expression:"formData.originalPassword"}})],1):e._e(),e.isChangePassword||!e.formData.id?a("el-form-item",{attrs:{prop:"password",label:e.$t("module.password")}},[a("el-input",{attrs:{placeholder:e.$t("module.password"),maxlength:"30"},model:{value:e.formData.password,callback:function(t){e.$set(e.formData,"password","string"===typeof t?t.trim():t)},expression:"formData.password"}})],1):e._e(),e.isChangePassword||!e.formData.id?a("el-form-item",{attrs:{prop:"confirmPassword",label:e.$t("module.confirmPassword")}},[a("el-input",{attrs:{placeholder:e.$t("module.confirmPassword"),maxlength:"30"},model:{value:e.formData.confirmPassword,callback:function(t){e.$set(e.formData,"confirmPassword","string"===typeof t?t.trim():t)},expression:"formData.confirmPassword"}})],1):e._e(),a("el-form-item",{attrs:{prop:"realName",label:e.$t("module.realName")}},[a("el-input",{attrs:{placeholder:e.$t("module.realName"),maxlength:"30"},model:{value:e.formData.realName,callback:function(t){e.$set(e.formData,"realName","string"===typeof t?t.trim():t)},expression:"formData.realName"}})],1),a("el-form-item",{attrs:{prop:"gender",label:e.$t("module.gender")}},[a("el-radio",{attrs:{label:"1"},model:{value:e.formData.gender,callback:function(t){e.$set(e.formData,"gender",t)},expression:"formData.gender"}},[e._v(e._s(e.$t("gender.gender_1")))]),a("el-radio",{attrs:{label:"2"},model:{value:e.formData.gender,callback:function(t){e.$set(e.formData,"gender",t)},expression:"formData.gender"}},[e._v(e._s(e.$t("gender.gender_2")))]),a("el-radio",{attrs:{label:"0"},model:{value:e.formData.gender,callback:function(t){e.$set(e.formData,"gender",t)},expression:"formData.gender"}},[e._v(e._s(e.$t("gender.gender_0")))])],1),a("el-form-item",{attrs:{prop:"email",label:e.$t("module.email")}},[a("el-input",{attrs:{placeholder:e.$t("module.email"),maxlength:"30"},model:{value:e.formData.email,callback:function(t){e.$set(e.formData,"email","string"===typeof t?t.trim():t)},expression:"formData.email"}})],1),a("el-form-item",{class:{"margin-b-0":e.isChangePassword},attrs:{prop:"mobile",label:e.$t("module.mobile")}},[a("el-input",{attrs:{placeholder:e.$t("module.mobile"),maxlength:"30"},model:{value:e.formData.mobile,callback:function(t){e.$set(e.formData,"mobile","string"===typeof t?t.trim():t)},expression:"formData.mobile"}})],1),e.isChangePassword?e._e():a("el-form-item",{staticClass:"margin-b-0",attrs:{prop:"status",label:e.$t("module.status")}},[a("el-radio",{attrs:{label:"1"},model:{value:e.formData.status,callback:function(t){e.$set(e.formData,"status",t)},expression:"formData.status"}},[e._v(e._s(e.$t("module.enable")))]),a("el-radio",{attrs:{label:"0"},model:{value:e.formData.status,callback:function(t){e.$set(e.formData,"status",t)},expression:"formData.status"}},[e._v(e._s(e.$t("module.disable")))])],1)],1),a("template",{slot:"footer"},[a("el-button",{attrs:{type:"text"},on:{click:function(t){e.visible=!1}}},[e._v(e._s(e.$t("cancel")))]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.submitHandle()}}},[e._v(e._s(e.$t("confirm")))])],1)],2)},s=[],o=a("795b"),i=a.n(o),l=a("cebc"),n=a("75fc"),m=a("a78e"),u=a.n(m),d=a("720d"),c=a.n(d),f=a("b047"),p=a.n(f),g={name:"addOrUpdate",props:{isChangePassword:{type:Boolean,default:!1}},data:function(){return{imageUrl:null,visible:!1,submitLoading:!1,formData:{id:null,username:null,originalPassword:null,password:null,confirmPassword:null,realName:null,gender:"1",email:null,mobile:null,status:"1"}}},computed:{formRules:function(){var e={validator:this.onlyUsername,trigger:"blur"};return{username:[].concat(Object(n["a"])(this.$rules([{type:"required"},{type:"username"}])),[this.formData.id?null:e]),originalPassword:this.$rules([{type:"required"},{type:"password"}]),password:this.$rules([{type:"required"},{type:"password"}]),confirmPassword:this.$rules([{type:"required"},{type:"confirmPassword"}]),realName:this.$rules([{type:"required"}]),gender:this.$rules({type:"required"}),email:this.$rules([{type:"required"},{type:"email"}]),mobile:this.$rules([{type:"required"},{type:"mobile"}]),status:this.$rules({type:"required"})}}},methods:{dialogOpen:function(){var e=this;if(this.isChangePassword)this.formData=Object(l["a"])({},this.$store.state.userInfo);else if(this.formData.id){var t="/api/user/findOne",a={id:this.formData.id};this.$http.get(t,a).then(function(t){var a=t.ok,r=t.data,s=t.msg;a?(delete r["createTime"],e.formData=Object(l["a"])({},e.formData,r)):e.$message.error(s)})}},dialogClose:function(){this.$refs.form.resetFields()},onlyUsername:function(e,t,a){var r=this;this.$http.post("/api/user/findOne",{username:t}).then(function(e){var t=e.ok,s=e.data;t&&!s?a():a(r.$t("validate.onlyUsername"))}).catch(function(e){return e})},encrypt:function(e,t){var a=new c.a;return a.setPublicKey(e),a.encrypt(t)},submitHandle:p()(function(){var e=this;this.$refs.form.validate(function(t){if(t){var a=Object(l["a"])({},e.formData);delete a.confirmPassword,delete a.originalPassword,e.submitLoading=!0,e.formatParam(a).catch(function(t){e.$message.error(t),e.submitLoading=!1})}})},1e3,{leading:!0,trailing:!1}),formatParam:function(e){var t,a=this;return this.formData.id&&!this.isChangePassword?(t="/api/user/updateOne",delete e.password,this.submitForm(t,e)):this.$http.get("/util/getPublicKey").then(function(r){var s=r.ok,o=r.key,l=r.msg;return s&&o?(e.password=a.encrypt(o,e.password),a.isChangePassword?(t="/user/changePassword",e.originalPassword=a.encrypt(o,a.formData.originalPassword)):t="/user/signUp",a.submitForm(t,e)):i.a.reject(l)})},submitForm:function(e,t){var a=this;return this.$http.post(e,t).then(function(e){var t=e.ok,r=e.msg;return a.submitLoading=!1,t?a.isChangePassword?a.$http.get("/user/signOut").then(function(){var e=a.$t("prompt.title"),t=a.$t("prompt.success")+","+a.$t("prompt.restartLogin"),r={type:"success",showClose:!1,confirmButtonText:a.$t("confirm")};return u.a.remove("token"),a.$nextTick(function(){a.visible=!1}),a.$alert(t,e,r)}).then(function(){a.$router.push("login")}):void a.$message({message:a.$t("prompt.success"),type:"success",duration:500,onClose:function(){a.visible=!1,a.$emit("refreshList")}}):i.a.reject(r)})}}},h=g,b=a("2877"),$=Object(b["a"])(h,r,s,!1,null,null,null);t["default"]=$.exports}}]);
//# sourceMappingURL=chunk-2d0c4275.4b861087.js.map