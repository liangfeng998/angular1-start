//定义本地存储对象
window.storage = (function () {
    var Cookie = {
        write: function (key, value, duration) {
            var d = new Date();
            d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * (duration || 7));
            document.cookie = key + "=" + encodeURI(value) + "; expires=" + d.toGMTString();
        },
        read: function (key) {
            var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
            if (arr != null)
                return decodeURIComponent(arr[2]);
            return "";
        }
    };
    return {
        getItem: function (key) {
            return window.localStorage ? localStorage.getItem(key) : Cookie.read(key);
        },
        setItem: function (key, val) {
            if (window.localStorage) {
                localStorage.setItem(key, val);
            } else {
                Cookie.write(key, val);
            }
        },
        removeItem: function (key) {
            if (window.localStorage) {
                localStorage.removeItem(key);
            } else {
                Cookie.write(key, '', -1);
            }
        }
    };
})();

/**param
 * 将对象格式化成字符串保存（只能保存对象）
 * @param key
 * @param value
 */
Storage.prototype.put = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};
Storage.prototype.get = function (key) {
    var value = this.getItem(key);
    if (!value) {
        return '';
    }
    try {
        return JSON.parse(value);
    }catch(e){
        return '';
    }
};

//日期转为时间戳
//开始时间--（适用于搜索条件中结束时间为年月日不带时分秒，则取当日00:00:00秒的时间，以及开始和结束时间带时分秒的情况）
function formateDateSt(date) {
    if (_.isEmpty(date)) {
        //log("时间格式不对");
        return;
    }
    var format_time = date.replace(/-/g, '/');
    return new Date(format_time).getTime();
}
//结束时间--（搜索条件中结束时间为年月日不带时分秒，则取当日23:59:59秒的时间）
function formateDateEd(date) {
    if (_.isEmpty(date)) {
        //log("时间格式不对");
        return;
    }
    var format_time = date.replace(/-/g, '/');
    return new Date(format_time).getTime() + (1000 * 60 * 60 * 24 - 1);
}

//四舍五入小数 num-被格式化小数 place保留小数位数
//is_fix：是否补零
function round_num(num, place, is_fix) {
    if (isNaN(Number(num))) {
        return 0;
    }
    place = isNaN(Number(place)) ? 2 : place;//金额默认两位

    var format = Math.round(num * Math.pow(10, place)) / Math.pow(10, place);
    if (is_fix) {
        return format.toFixed(place);
    } else {
        return format;
    }
}

/*big.js
 *运算封装(对异常值进行了处理)
 * */
/**
 * 相除
 * @param a 加数
 * @param b 加数
 * @returns {number} 返回值
 */
function big_add_d(a, b) {
    a = isNaN(Number(a)) ? 0 : a;
    b = isNaN(Number(b)) ? 0 : b;
    return big_add(a, b);
}
// 相减
function big_minus_d(a, b) {
    a = isNaN(Number(a)) ? 0 : a;
    b = isNaN(Number(b)) ? 0 : b;
    return Number(Big(a).minus(b).toString());
}
// 相乘
function big_mul_d(a, b) {
    a = isNaN(Number(a)) ? 1 : a;
    b = isNaN(Number(b)) ? 1 : b;
    return Number(Big(a).times(b).toString());
}
/**
 * 相除
 * @param a 除数
 * @param b 被除数
 * @returns {number} 返回值
 */
function big_div_d(a, b) {
    a = isNaN(Number(a)) ? 0 : a;
    b = isNaN(Number(b)) ? 1 : b;
    return Number(Big(a).div(b).toString());
}

//big.js 运算封装 + - * /
function big_add(a, b) {
    return Number(Big(a).plus(b).toString());
}
function big_minus(a, b) {
    return Number(Big(a).minus(b).toString());
}
function big_mul(a, b) {
    if (isNaN(a)) {
        return NaN;
    }
    return Number(Big(a).times(b).toString());
}
function big_div(a, b) {
    if (isNaN(a) || isNaN(b)) {
        return NaN;
    }
    return Number(Big(a).div(b).toString());
}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
//yyyy-MM-dd hh:mm:ss 
function dateFormat(date, fmt) {
    var date = new Date(date);
    var o = {
        "M+": date.getMonth() + 1, //月份   
        "d+": date.getDate(), //日   
        "h+": date.getHours(), //小时   
        "m+": date.getMinutes(), //分   
        "s+": date.getSeconds(), //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


/**
 *js中更改日期
 * y年， m月， d日， h小时， n分钟，s秒
 */
function dateAfter(date, part, value) {
    var nd = new Date(date.getTime());
    switch (part) {
        case "y":
            nd.setFullYear(date.getFullYear() + value);
            break;
        case "m":
            nd.setMonth(date.getMonth() + value);
            break;
        case "d":
            nd.setDate(date.getDate() + value);
            break;
        case "h":
            nd.setHours(date.getHours() + value);
            break;
        case "n":
            nd.setMinutes(date.getMinutes() + value);
            break;
        case "s":
            nd.setSeconds(date.getSeconds() + value);
            break;
        default:

    }

    return nd;
}