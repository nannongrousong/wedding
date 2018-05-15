const http = require('http')

http.createServer((req, res) => {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    res.end('网站维护中......<br />请稍后访问......')
}).listen(80)