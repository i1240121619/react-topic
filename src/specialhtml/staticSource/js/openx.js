function getQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i")
    var string = window.location.href
    var r=string.split("?")[1]?string.split("?")[1].match(reg):''
    if (r != null) return decodeURI(r[2])
    return null
}//getQueryString:获取url参数
function saveLocal(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj))
}//保存数据到本地

function getLocal(key) {
    let getKey = localStorage.getItem(key)
    return JSON.parse(getKey)
}//获取本地数据

function delLocal(key) {
    localStorage.removeItem(key)
}//删除本地数据

function saveSession(key, obj) {
    sessionStorage.setItem(key, JSON.stringify(obj))
}//保存数据到本地

function getSession(key) {
    let getKey = sessionStorage.getItem(key)
    return JSON.parse(getKey)
}//获取本地数据

function delSession(key) {
    sessionStorage.removeItem(key)
}//删除本地数据

// Private array of chars to use
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
};

// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
// by minimizing calls to random()
Math.uuidFast = function() {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
        if (i==8 || i==13 ||  i==18 || i==23) {
            uuid[i] = '-';
        } else if (i==14) {
            uuid[i] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join('');
};

// A more compact, but less performant, RFC4122v4 solution:
Math.uuidCompact = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};
var data={
    sessionId: Math.uuid(),
    auth_token: getQueryString('auth_token')||'',
    userCode: getQueryString('userCode')||'',
    device: getQueryString('device')||''
}
saveSession('_openx_head', data)
function wxShopToOpenXAjax(setting) {
    //设置全局服务器地址
    setting.type = 'POST'
    setting.contentType = 'application/json'
    setting.data._openx_head =data
    setting.data = JSON.stringify(setting.data)
    $.ajax(setting)
}//OPENX AJAX
