/**
 * Created by: MoJie
 * Date: 2018/9/3
 */
function getUUID() {
  let str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return str.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

// $.cookie('token', "", {expires: -1});
// console.log(document.cookie);

$("#btn").on("click", function () {
  let formData = new FormData($("#form")[0]);
  formData.append("name", "Groucho");
  formData.append("code", 123456);
  formData.append("obj", JSON.stringify({name: "obj"}));
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/file/upload");
  xhr.onload = function (oEvent) {

  };
  xhr.send(formData);
});
$("#img").on('click', function () {
  $(this).attr('src', '/util/getCaptcha' + '?' + Date.now())
});

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
$.get('/util/getPublicKey', function (data) {
  let key = data.key;
  let crypt = new JSEncrypt();
  crypt.setPublicKey(key);
  let pwd = '123456'; //需要加密的账号密码
  let encryptKey = crypt.encrypt(pwd); //使用公钥加密，得到密文
  $.ajax({
    url: '/user/signIn',
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({code: '123456', captcha: '10', password: encryptKey}),
    success: function (data) {
      console.log(data);
    }
  });
});

// 注册
// $.get('/util/getPublicKey', function (data) {
//     let key = data.key;
//     let crypt = new JSEncrypt();
//     crypt.setPublicKey(key);
//     for (let i = 10; i--;) {
//         let pwd = '12345' + i; //需要加密的账号密码
//         let encryptKey = crypt.encrypt(pwd); //使用公钥加密，得到密文
//         $.ajax({
//             url: '/user/signUp',
//             type: "post",
//             contentType: 'application/json',
//             data: JSON.stringify({
//                 name: 'name' + i,
//                 code: '12345' + i,
//                 password: encryptKey
//             }),
//             success: function (data) {
//                 console.log(data);
//             }
//         });
//     }
// });

let addData = [];
for (let i = 1, len = 11; i < len; i++) {
  addData.push({
    name: "管理员" + i,
    code: i
  })
}
// $.ajax({
//     url: "/api/role/add",
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify(addData),
//     success: function (data) {
//         console.log(data);
//     }
// });

// $.ajax({
//     url: "/api/product/orders/createJoin",
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify({
//         id: 2,
//         joinIds: [1,3]
//     }),
//     success: function (data) {
//         console.log(data);
//     }
// });

// $.ajax({
//     url: "/api/product/orders/removeJoin",
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify({
//         id: 1,
//         joinIds: [1]
//     }),
//     success: function (data) {
//         console.log(data);
//     }
// });

// $.ajax({
//     url: "/api/product/orders/joinQuery",
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify({
//         id: 1
//     }),
//     success: function (data) {
//         console.log(data);
//     }
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

let updateData1 = JSON.stringify({
  filter: {name: "update1"},
  update: {
    name: "update"
  }
});
let updateData2 = JSON.stringify({
  id: 1,
  product_orders: [1, 2]
});

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

let removeData = JSON.stringify({
  _id: ["5c4872821201a42064ca45ec", "5c4016628e7aa50db048b39f"],
});

// $.ajax({
//     url: '/api/role/remove',
//     type: "DELETE",
//     contentType: 'application/json',
//     data: removeData,
//     success: function (data) {
//         console.log(data);
//     }
// });

