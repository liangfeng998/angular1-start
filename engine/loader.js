"use strict";

// 设定依载入顺序执行及BashPath         //别在改CacheBust:true 了 火狐不兼容
var cacheBust=true;
if (getCookie('debug')) {
    cacheBust=false;
}
cacheBust=false;
$LAB.setOptions({AlwaysPreserveOrder:true, BasePath:config.rootUrl, CacheBust:cacheBust})

// 载入系统核心模組
// .script('engine/app.js')

// 载入核心服务
// .script('engine/services/user.js')

// 载入自订指令
// .script('engine/directives/currency.js')

// 载入通用函式
// .script('engine/common.js')

// 启动angularjs
.wait(function() {
    log('angularjs boot start');
    angular.bootstrap(document, ['webApp']);
    log('angularjs boot end');
});