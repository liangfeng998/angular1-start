"use strict";

var app = angular.module('app.filters', []);

//多语言过滤器
webApp.filter("T", ['$translate', function ($translate) {
    return function (word, key) {
        //优先处理key值
        if (key) {
            return $translate.instant(key);
        } else {
            return $translate.instant(word);
        }
    };
}]);

webApp.filter('range', [function () {
    return function (input) {
        var ret = [];
        var total = parseInt(input);
        for (var i = 0; i < total; i++)
            ret.push(i);
        return ret;
    };
}]);

webApp.filter('zcurrency', ["$filter", function ($filter) {
    var currencyList = {
        "CN": {"symbol": "￥", "fractionSize": "2"},
        "US": {"symbol": "$", "fractionSize": "2"}
    };

    return function (currency, type) {
        return $filter('currency')(currency, currencyList[type].symbol, currencyList[type].fractionSize);
    };
}]);

//大 分页
webApp.filter('paginateBig', [function () {
    return function (tatal, current) {
        var ret = [];
        var min = current - 4;
        var max = current + 3;
        if (min < 0) {
            min = 0;
        }
        if (max > tatal) {
            max = tatal;
        }
        for (var i = min; i < max; i++)
            ret.push(i);
        return ret;
    };
}]);

//小数转百分数
webApp.filter('turnPercent', [function () {
    return function (num) {
        num = num ? num : 0;
        return (Math.round(num * 10000) / 100).toFixed(2) + '%';
    };
}]);

webApp.filter('min', [function () {
    return function (input, param) {
        var v1 = parseInt(input);
        var v2 = parseInt(param);

        if (v1 < v2) {
            return v1;
        } else {
            return v2;
        }
    };
}]);

webApp.filter('max', [function () {
    return function (input, param) {
        var v1 = parseInt(input);
        var v2 = parseInt(param);

        if (v1 > v2) {
            return v1;
        } else {
            return v2;
        }
    };
}]);
