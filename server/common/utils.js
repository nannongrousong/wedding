const https = require('https')

/**
 * https的get请求
 * @param {String} url 请求地址
 * @param {Function} callBack 回调函数。param1:操作结果,param2:返回的数据
 */
const httpsGet = (url, callBack) => {
    https.get(url, (req, res) => {
        let data = '';
        req.on('data', (d) => {
            data += d;
        });
        req.on('end', () => {
            callBack(true, data);
        })
    }).on("error", (err) => {
        console.error(`https请求失败，地址${url}。错误信息\r\n`);
        console.error(err);
        callBack(false)
    });
}

/**
 * 获取时间格式字符串。返回YYYY-MM-DD
 * @param {Date} date 时间
 */
const getYYYYMMDD = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
}

module.exports = {
    httpsGet: httpsGet,
    getYYYYMMDD: getYYYYMMDD
}