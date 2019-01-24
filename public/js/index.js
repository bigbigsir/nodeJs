/**
 * Created by: MoJie
 * Date: 2018/9/3
 */
// $.cookie('token', "", {expires: -1});
// console.log(document.cookie);

$("#btn").on("click", function () {
    let oMyForm = new FormData($("#form")[0]);
    oMyForm.append("name", "Groucho");
    oMyForm.append("code", 123456);
    oMyForm.append("obj", JSON.stringify({name: "obj"}));
    let oReq = new XMLHttpRequest();
    oReq.open("POST", "/api/file/upload", true);
    oReq.onload = function (oEvent) {

    };
    oReq.send(oMyForm);
});

// $.ajax({
//     url: "/api/file/removeFile",
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify({
//         id: ['5c49babfe056c83798e78202']
//     }),
//     success: function (data) {
//         console.log(data);
//     }
// });

// $.post('/api/role/remove', {id:'5c4977bd265ac048603e1200'}, function (data) {
//     console.log(data)
// });

// $.get('/api/user/findOne', {name:1}, function (data) {
//     console.log(data)
// });

// $.get('/user/signOut', {}, function (data) {
//     console.log(data)
// });

// $.post('/util', {string: "超课"}, function (data) {
//     console.log(data)
// });

// $.get('/util/getPublicKey', function (data) {
//     let key = data.key;
//     let crypt = new JSEncrypt();
//     crypt.setPublicKey(key);
//     let pwd = 'mojie1'; //需要加密的账号密码
//     let encryptKey = crypt.encrypt(pwd); //使用公钥加密，得到密文
//     $.ajax({
//         url: '/user/signIn',
//         type: "post",
//         contentType: 'application/json',
//         data: JSON.stringify({name: 'mojie1', password: encryptKey}),
//         success: function (data) {
//             console.log(data);
//         }
//     });
// });

// $.get('/util/getPublicKey', function (data) {
//     let key = data.key;
//     let crypt = new JSEncrypt();
//     crypt.setPublicKey(key);
//     for (let i = 10; i--;) {
//         let pwd = 'mojie' + i; //需要加密的账号密码
//         let encryptKey = crypt.encrypt(pwd); //使用公钥加密，得到密文
//         $.ajax({
//             url: '/user/signUp',
//             type: "post",
//             contentType: 'application/json',
//             data: JSON.stringify({
//                 name: 'mojie' + i,
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
        name: "name" + i,
        code: i
    })
}

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
    id: "5c4872821201a42064ca45ec",
    name: "update"
});

// $.ajax({
//     url: '/api/role/updateOne',
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