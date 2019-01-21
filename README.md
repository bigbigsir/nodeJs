# Node Service

> Node+Express+MongoDB实现的后台服务  

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm start

```
## API

调用路径有两种情况：
- 第一种：一段式，如：/getSession。这种方式直接根据路由说明来调用。
- 第二种：二段式，如：/user/find。其中第一段user表示请求的数据库集合名称，第二段表示请求的方法。


```
```