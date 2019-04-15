# Node
> Node(10.15.3)+Express(4.16.0)+MongoDB(4.0.6)实现的后台服务;  
> 主要实现功能：token接口权限、用户登录注册、验证码校验、文件上传、常用api接口；  
> 本项目为前端提供数据调试、前后端数据交互实践。

## 目录结构

```
├── common                     # 公用文件夹
│   ├── token.js               # token生成校验
├── language                   # 国际化的错误提示语
├── mongodb                    # 连接mongodb
├── pem                        # 密匙文件，用于生成token和加密用户密码
├── mongodb                    # 连接mongodb
├── public                     # 前端资源文件夹
├── router                     # 路由文件夹
│   ├── index.js               # 路由拦截文件
│   ├── api.js                 # api路由
│   ├── user.js                # 用户路由
│   ├── util.js                # 工具路由
├── app.js                     # 入口文件 初始化
├── config.js                  # 配置文件
└── package.json               # package.json
```
## api接口   
> 因为没有实际业务支撑，为了简单易用，接口路径都包含了操作信息，需按照要求书写  
> 例如：/api/user/find，此例中，api指路由前缀，user指要操作的数据集合名称，find指要进行的操作  
> 并没有限定请求方法类型，具体请根据实际请求编写。建议遵循RESTful风格   

``` javascript
{
  ok: 1, // 1后台处理成功 0后台处理失败
  data: {}, // 后台处理成功后，返回的数据。某些请求不需要操作数据的可能没有该字段
  msg: 'success', // 操作反馈信息
  error: 'errorMsg'// 后台处理失败返回的字段，包含后台错误原因
}
```
> 以下文档 xxx 代表要操作的collection名称

|类型|请求路径|参数|参数描述|是否必填|返回值| 返回值描述|
|:-|:-|:-|:-|:-|:-|:-|
| 新增 | /api/xxx/add | Object/Array | 需要增加的单条或多条数据，新增多条传Array | 是 | data | 增加的数据，单条返回Object，多条返回Array |
| 查询 | /api/xxx/find | Object | 查询参数，默认为模糊查询，需要精确查询需指定exact属性为true，如果某个查询条件为数组，数组中的某一项值匹配，就会返回该数据 | 是 | data | 返回查询结果Array |
| 单条查询 | /api/xxx/findOne | Object | 查询参数 | 是 | data | 与查询条件完全匹配的第一条数据Object |
| 分页查询 | /api/xxx/findPage | Object | 查询参数，默认为模糊查询，需要精确查询需指定exact属性为true，page、pagesize分页查询必须字段 | 是 | data | 返回分页数据Object，rows字段为数据Array |
| 单条更新 | /api/xxx/updateOne | Object | 修改参数，必须包含id字段 | 是 | data | 返回修改状态，无具体数据 |
| 多条更新 | /api/xxx/updateMany | Object | 修改参数，必须包含filter，update字段，且均为Object，修改filter字段匹配的数据，更新为update字段的数据 | 是 | data | 返回修改状态，无具体数据 |
| 删除 | /api/xxx/remove | Object | 删除参数，如果某一字段为Array，会删除数组中匹配的每一条数据，如{id:[1,2,3]} | 是 | data | 返回删除状态，无具体数据 |
| 文件上传 | /api/xxx/upload | Object | 文件数据，也可以附带其他参数 | 是 | data | 上传后的文件数据Array |
| 删除文件 | /api/xxx/removeFile | Object | 删除参数，依据数据id或url字段删除文件和数据 | 是 | data | 返回删除状态，无具体数据 |   

## user接口

> todo 

## util接口

> todo 


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at 127.0.0.1:3000
node app
```

