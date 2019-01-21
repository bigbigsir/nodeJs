/**
 * Created by: MoJie
 * Date: 2018/9/3
 */


// $.post('/api/user/add', {name: "1234"}, function (data) {
//     console.log(data)
// });

// $.get('/api/user/findPage', {rows: 50, page: 15, name: "name1", code: 2, exact1:true,exact: true}, function (data) {
//     console.log(data)
// });
// $.post('/util/getPinYin', {string: "超课"}, function (data) {
//     console.log(data)
// });

let addData = [];
for (let i = 1, len = 11; i < len; i++) {
    addData.push({
        name: "name" + i,
        code: i
    })
}
//
// $.ajax({
//     url: "/api/user/add",
//     type: "post",
//     contentType: 'application/json',
//     data: JSON.stringify(addData),
//     success: function (data) {
//         console.log(data);
//     }
// });
$.ajax({
    url: '/login',
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({name: 'name4'}),
    success: function (data) {
        console.log(data);
    }
});
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
//     type: "post",
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
    // "_id" : "5c3fead46f1af7579c1634cb",
    name: "update"
});
// $.ajax({
//     url: '/api/user/updateOne',
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
    _id: ["5c4016628e7aa50db048b39e", "5c4016628e7aa50db048b39f"],
    code: [5]
});
// $.ajax({
//     url: '/api/user/remove',
//     type: "DELETE",
//     contentType: 'application/json',
//     data: removeData,
//     success: function (data) {
//         console.log(data);
//     }
// });