/**
 * Created by: MoJie
 * Date: 2018/9/3
 */
// function getUUID() {
//   let str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
//   return str.replace(/[xy]/g, c => {
//     return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
//   })
// }

// $.cookie('token', "", {expires: -1});
// console.log(document.cookie);

// $("#btn").on("click", function () {
//   let formData = new FormData($("#form")[0]);
//   formData.append("name", "Groucho");
//   formData.append("code", 123456);
//   formData.append("obj", JSON.stringify({name: "obj"}));
//   let xhr = new XMLHttpRequest();
//   xhr.open("POST", "/api/file/upload");
//   xhr.onload = function (oEvent) {
//
//   };
//   xhr.send(formData);
// });
// $("#img").on('click', function () {
//   $(this).attr('src', '/util/getCaptcha' + '?' + Date.now())
// });

// $.ajax({
//   url: "/user/getUserInfo",
//   type: "get",
//   // contentType: 'application/json',
//   // data: {name: "1"},
//   success: function (data) {
//     // let img = document.getElementById('img');
//     // img.src = 'data:image/jpg;base64,' + data;
//     // $("#form").append(data)
//     // console.log(data);
//   }
// });


// $.post('/api/role/add1', {
//    name:"mojie"
// }, function (data) {
//     console.log(data);
// });

// $.get('/api/role/findOne', {name:'mojie'}, function (data) {
//     console.log(data)
// });

// $.get('/user/signOut', {}, function (data) {
//     console.log(data)
// });

// $.post('/util', {string: "超课"}, function (data) {
//     console.log(data)
// });

// 登录
// $.get('/util/getPublicKey', function (data) {
//   var key = data.key;
//   var crypt = new JSEncrypt();
//   crypt.setPublicKey(key);
//   var pwd = 'admin'; //需要加密的账号密码
//   var encryptKey = crypt.encrypt(pwd); //使用公钥加密，得到密文
//   $.ajax({
//     url: '/user/signIn',
//     type: "post",
//     data: {code: 'admin', password: 'admin'},// encryptKey
//     success: function (data) {
//       $.cookie('token', data.token, {expires: 7});
//       console.log(data);
//     }
//   });
// });

// $.ajax({
//   url: '/user/getUserInfo',
//   type: "post",
//   success: function (data) {
//     console.log(data);
//   }
// });

// 注册
$.get('/util/getPublicKey', function (data) {
  let key = data.key;
  let crypt = new JSEncrypt();
  crypt.setPublicKey(key);
  $.ajax({
    url: '/user/signUp',
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({
      userName: 'admin1',
      code: 'admin',
      // password: 'admin'
    }),
    success: function (data) {
      console.log(data);
    }
  });
});

// let addData = [];
// for (let i = 1, len = 11; i < len; i++) {
//   addData.push({
//     name: "管理员" + i,
//     code: i
//   })
// }
// $.ajax({
//     url: "/api/role/add",
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify(addData),
//     success: function (data) {
//         console.log(data);
//     }
// });

// 创建关联
// $.ajax({
//   url: "/api/user/role/createJoin",
//   type: "post",
//   contentType: 'application/json',
//   data: JSON.stringify({
//     id: '5c8880718e6cf217d02a0afc',
//     joinId: '5c88765a1f405a044c78e867'
//   }),
//   success: function (data) {
//     console.log(data);
//   }
// });
// 删除关联
// $.ajax({
//     url: "/api/product/orders/removeJoin",
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify({
//         id: 1,
//         joinId: [1]
//     }),
//     success: function (data) {
//         console.log(data);
//     }
// });

// 关联查询
// $.ajax({
//   url: "/api/user/role/joinQuery",
//   type: "post",
//   contentType: 'application/json',
//   data: JSON.stringify({
//     id1: '5c8880718e6cf217d02a0afc'
//   }),
//   success: function (data) {
//     console.log(data);
//   }
// });

// $.ajax({
//     url: "/api/role/remove",
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify({
//         id:['5c4872821201a42064ca45ec','5c499368dee35d3dc4543b0e']
//     }),
//     success: function (data) {
//         console.log(data);
//     }
// });

// $.ajax({
//     url: '/login',
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify({name: '1234'}),
//     success: function (data) {
//         console.log(data);
//     }
// });

var data = {
  rows: 50,
  page: 1,
  exact1: true,
  name: "name1",
  code: 2,
  exact: true
};

var jsonData = JSON.stringify(data);

// $.ajax({
//     url: '/api/user/findPage',
//     type: "get",
//     contentType: 'application/json',
//     data: jsonData,
//     success: function (data) {
//         console.log(data);
//     }
// });
//
// let updateData1 = JSON.stringify({
//   filter: {name: "update1"},
//   update: {
//     name: "update"
//   }
// });
// let updateData2 = JSON.stringify({
//   id: 1,
//   product_orders: [1, 2]
// });

// $.ajax({
//     url: '/api/product/updateOne',
//     type: "PUT",
//     contentType: 'application/json',
//     data: updateData2,
//     success: function (data) {
//         console.log(data);
//     }
// });

// $.ajax({
//     url: '/api/user/updateMany',
//     type: "PUT",
//     contentType: 'application/json',
//     data: updateData1,
//     success: function (data) {
//         console.log(data);
//     }
// });
//
// let removeData = JSON.stringify({
//   _id: ["5c4872821201a42064ca45ec", "5c4016628e7aa50db048b39f"],
// });

// 删除文件
$.ajax({
  url: '/api/file/removeFile',
  type: "DELETE",
  contentType: 'application/json',
  data: JSON.stringify({
    id: ['5cad8634e403700e9cda0ba6', '5cad8634e403700e9cda0ba7', '5cad8634e403700e9cda0ba8']
  }),
  success: function (data) {
    console.log(data);
  }
});

