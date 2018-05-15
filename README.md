# 介绍
  之前在掘金上无意中看到一篇文章，是关于"婚礼大屏互动，微信请柬一站式解决方案"[作者项目地址](https://github.com/iammapping/wedding)。我觉得很有创意，自己也想做一个，然后..就动手了呗。
  由于我界面设计比较烂，界面上整体上还是参考了原作者，不过代码还都是我自己写的....
  

# 运行
* 数据库脚本
  db/init.sql
* 修改配置项
  config/client.config.js
  config/server.config.js
* 安装依赖 
  > npm install 
* 打包前台
  > npm run build 
* 启动服务器
  > npm run express-server
* 微信页面授权（可选）
  微信页面授权获取用户昵称、头像地址，便于在弹幕中显示；用于抽奖，限制每天抽奖次数等。
  但微信页面授权需要有备案的域名，如果没有你可以用（[NATAPP](https://natapp.cn/)，内网穿透）先测试看看。
  这边测试跑，没有微信授权也可以，做法在server/routers/index.js中设置了默认用户。
  微信公众号开发相关资料。[测试账号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
  [微信公众号开发文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432)
  

# 待做
* vendor
* 域名备案，发布在微信公众号
* 按需加载模块时，[css报错](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/456)
* 并发量大时mysql数据库可能会有部分连接超时
* 多机型(pc+Android+ios)测试

# 踩过的坑
* [箭头函数作类方法](https://stackoverflow.com/questions/31362292/how-to-use-arrow-functions-public-class-fields-as-class-methods)

* [ExtractTextPlugin 插件在高版本的webpack](https://blog.csdn.net/gezilan/article/details/80020417)

* [express禁止默认指向index.html](https://stackoverflow.com/questions/25166726/express-serves-index-html-even-when-my-routing-is-to-a-different-file)

* [路由切换时报错：Can't call setState (or forceUpdate) on an unmounted component.](https://stackoverflow.com/questions/47923656/when-route-changes-in-my-react-app-i-clearinterval-and-app-breaks?noredirect=1&lq=1)

* [如何控制CSS打包的顺序，样式覆盖、优先级问题](https://github.com/ant-design/babel-plugin-import/issues/94)

* [antd-mobile Modal.Prompt 无法输入问题，官方说v2.1.6已修复，但这个问题仍存在(ios10.3.3)，然后我就尝试用v2.1.6，没问题...被坑的好惨](https://mobile.ant.design/changelog-cn)