import base64 from 'base-64';
import utf8 from 'utf8';

export function getUserAgent() {
    var UserAgentName = ''
    var userAgent = navigator.userAgent
    var ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        UserAgentName = "Weixin"
    } else {

        if (userAgent.indexOf("Android") != -1 || userAgent.indexOf("SAMSUNG") != -1) {
            UserAgentName = "Android"
        } else if (userAgent.indexOf("iPhone") != -1 || userAgent.indexOf("iPad") != -1 || userAgent.indexOf("IOS") != -1) {
            UserAgentName = "IOS"
        } else {
            UserAgentName = "PcOrUC"
        }

    }
    return UserAgentName
}//getUserAgent:判断客服端浏览器内核

export function trim(str){
    return str.replace(/\s/g, "");
}//去掉所有空格

export function trimLeftRight(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}//删除左右两端的空格

export function saveLocal(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj))
}//保存数据到本地

export function getLocal(key) {
    let getKey = localStorage.getItem(key)
    return JSON.parse(getKey)
}//获取本地数据

export function delLocal(key) {
    localStorage.removeItem(key)
}//删除本地数据

export function saveSession(key, obj) {
    sessionStorage.setItem(key, JSON.stringify(obj))
}//保存数据到本地

export function getSession(key) {
    let getKey = sessionStorage.getItem(key)
    return JSON.parse(getKey)
}//获取本地数据

export function delSession(key) {
    sessionStorage.removeItem(key)
}//删除本地数据

export function requireAuthonEnter(nextState, replace) {
    if (!tool.hasLogin()) {
        replace({pathname: '/login'})
    }
}//requireAuth:利用onEnter判断是否登陆状态，否则跳转到登录页面

export function hasLogin() {
    let whetherLogin = getLocal('user')
    if (whetherLogin) return true
    else return false;
}//hasLogin判断登录状态

export function cues(obj) {

    if (document.querySelector('.cues')) return
    var newDiv = document.createElement("div")
    newDiv.className = "cues"
    document.body.appendChild(newDiv)
    newDiv.innerHTML = '<div class="cues-box cues_animation_in"><div class="cues-box-icon"><i class="cues-toast-icon ' + obj.type + '-icon"></i></div><div class="cues-box-content">' + obj.txt + '</div></div>'
    setTimeout(function () {
        var cuesbox = document.querySelector('.cues-box')
        cuesbox.className = 'cues-box cues_animation_out'
        cuesbox.addEventListener("webkitAnimationEnd", function () {
            document.querySelector('.cues').remove(true)
        })

    }, 1000)

}//cues:提示层

export function loadingIn(){
    if (document.querySelector('.yp_loading_toast')) return
    var newDiv = document.createElement("div")
    newDiv.className = "yp_loading_toast"
    document.body.appendChild(newDiv)
    newDiv.innerHTML = '<div class="yp_mask_transparent"></div><div class="yp_toast"><div class="yp_loading"><div class="yp_loading_leaf yp_loading_leaf_0"></div><div class="yp_loading_leaf yp_loading_leaf_1"></div><div class="yp_loading_leaf yp_loading_leaf_2"></div><div class="yp_loading_leaf yp_loading_leaf_3"></div><div class="yp_loading_leaf yp_loading_leaf_4"></div><div class="yp_loading_leaf yp_loading_leaf_5"></div><div class="yp_loading_leaf yp_loading_leaf_6"></div><div class="yp_loading_leaf yp_loading_leaf_7"></div><div class="yp_loading_leaf yp_loading_leaf_8"></div><div class="yp_loading_leaf yp_loading_leaf_9"></div><div class="yp_loading_leaf yp_loading_leaf_10"></div><div class="yp_loading_leaf yp_loading_leaf_11"></div></div><p class="yp_toast_content">Loading</p></div>'

}//loading提示层出现

export function loadingOut(){
    if (!document.querySelector('.yp_loading_toast')) return
    document.querySelector('.yp_loading_toast').remove(true)
}//loading提示层消失

export function dialog(obj,callback1,callback2){
    if (document.querySelector('.js_dialog')) return
    var newDiv = document.createElement("div")
    newDiv.className = "js_dialog yp-popIn"
    document.body.appendChild(newDiv)
    newDiv.innerHTML = '<div class="js_dialog yp-popIn"><div class="yp-mask"></div><div class="yp-dialog"><div class="yp-dialog__hd"><strong class="yp-dialog__title">' + obj.title + '</strong></div><div class="yp-dialog__bd">' + obj.content + '</div><div class="yp-dialog__ft"><a href="javascript:;" class="yp-dialog__btn yp-dialog__btn_default">取消</a><a href="javascript:;" class="yp-dialog__btn yp-dialog__btn_primary">确定</a></div></div></div>'
    var a1=document.querySelector('.yp-dialog__btn_default')
    var a2=document.querySelector('.yp-dialog__btn_primary')
    a1.addEventListener('click', function(){
        callback1()
        newDiv.className = "js_dialog yp-popOut"
        newDiv.addEventListener("webkitAnimationEnd", function () {
            this.remove(true)
        })
    }, false);
    a2.addEventListener('click', function(){
        callback2()
        newDiv.className = "js_dialog yp-popOut"
        newDiv.addEventListener("webkitAnimationEnd", function () {
            this.remove(true)
        })
    }, false);

}//dialog对话框

export function getQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i")
    var string = window.location.href
    var r=string.split("?")[1].match(reg)
    if (r != null) return decodeURI(r[2])
    return null
}//getQueryString:获取url参数

export function jump(key) {
    window.location.href = key
}//jump:跳转网址

export function jumpNotReturn(key) {
    window.location.replace(key)
    event.returnValue=false
}//jumpNotReturn:跳转网址不能返回

export function urlData(){
    let urlDatastr=getQueryString('urlData')||alert('找不到urlData字段')
    if(urlDatastr.indexOf("#")==0){
        alert('找不到urlData字段不能为空')
        return ''
    }else{
        return eval("("+utf8.decode(base64.decode(urlDatastr.split('#')[0]))+")")//base64解码成对象
    }//if
}//urlData:获取base64 ulr参数以及解码  urlData=tool.urlData()

export function href(str){
    let urlArr=window.location.href.split(str)
    return urlArr[0]
}//getUrl:获取根目录域名

export function wxShopToOpenXAjax(setting) {
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
    //设置全局服务器地址
    setting.type = 'POST'
    setting.contentType = 'application/json'
    setting.data._openx_head =getSession('_openx_head')
    setting.data = JSON.stringify(setting.data)
    $.ajax(setting)
}//OPENX AJAX