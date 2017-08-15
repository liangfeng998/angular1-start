"use strict";

webApp.directive('loadView', [function () {
    return {
        restrict: "E",
        templateUrl: function (elem, attr) {
            return attr.src + '?' + config.version;
        }
    };
}]);

//左侧菜单栏
webApp.directive('leftMenu', [function () {

    function judgeCurrentSelected(currentUrl, _CURRENTMENU_) {
        _.forEach(_CURRENTMENU_.child, function (val) {
            if (val.url && currentUrl.indexOf(val.url) > -1) {
                val.selected = true;
            } else {
                val.selected = false;
                _.forEach(val.child, function (valChild) {
                    if (valChild.url && currentUrl.indexOf(valChild.url) > -1) {
                        val.selected = true;
                    }
                    valChild.pageUrl = valChild.url ? ('.' + valChild.url) : '';
                });
            }
            //图标地址
            val.pageIconUrl = val.iconUrl ? ('.' + val.iconUrl) : 'img/left/sale/khgl.png';
            //是否含有二级菜单
            val.hasChild = val.child && val.child.length > 0 ? true : false;
            //有子菜单的菜单的url会为空，正在建设中的页面(_CURRENTMENU_.constructionUrl)的地址接口也会返回空
            val.pageUrl = val.url ? ('.' + val.url) : (val.hasChild ? '#' : '');
            // //最多5个字限制
            // val.menuName = val.menuName.length > 5 ? val.menuName.substr(0, 5) : val.menuName;
        });
    }

    return {
        restrict: "E",
        templateUrl: './views/module/left.html',
        controller: ['$scope', 'queryMenu', '$element', '$rootScope', '$location',  function ($scope, queryMenu, $element, $rootScope, $location) {
            //点击菜单
            $scope.menuClick = function (url, event) {
                $('.nav-left .menu-link').removeClass('active');
                if ($location.path() == url) {
                    event.preventDefault();
                }
            };

            if (queryMenu.getCurrentMenu()) {
                // 当前页面所属的大类名称(路由中配置的)与上个页面整理的左侧菜单中的大类名称相同，
                // 则不需要再次进行查询整理（为了提高速度）
                if (queryMenu.getCurrTopMenuName() == queryMenu.getCurrentMenu().topMenuName) {
                    $scope._CURRENTMENU_ = queryMenu.getCurrentMenu();
                    judgeCurrentSelected($location.path(), $scope._CURRENTMENU_);
                    return;
                }
            }
            //重新查询，然后整理菜单
            queryMenu.getMenus().then(function (data) {
                $scope._CURRENTMENU_ = data._CURRENTMENU_;
                judgeCurrentSelected($location.path(), $scope._CURRENTMENU_);
            });

        }]
    };
}]);

//顶端大蓝条
webApp.directive('headMain', [function () {
    return {
        restrict: "E",
        templateUrl: './views/module/headMain.html',
        controller: ['$scope', 'queryMenu', '$rootScope', '$location',  'user', function ($scope, queryMenu, $rootScope, $location, user) {
            //点击菜单
            $scope.menuClick = function (url, event) {
                if ($location.path() == url) {
                    event.preventDefault();
                    // $route.reload();
                }
            };
            $scope.userinfo = user.getUserInfo();
            $scope.strLogoUrl = $scope.userinfo.logoUrl ? decodeURIComponent($scope.userinfo.logoUrl + '&token=' + user.getToken() + '&secretNumber=' + user.getSecret()) : './img/logo-default.png';

            if (queryMenu.getCurrentMenu()) {
                // 当前页面所属的大类名称(路由中配置的)与上个页面整理的左侧菜单中的大类名称相同，
                // 则不需要再次进行查询整理（为了提高速度）
                if (queryMenu.getCurrTopMenuName() == queryMenu.getCurrentMenu().topMenuName) {
                    $scope._TOPMENU_ = queryMenu.getTopMenus();
                    return;
                }
            }
            //重新查询，然后整理菜单
            queryMenu.getMenus().then(function (data) {
                $scope._TOPMENU_ = data._TOPMENU_;
            });
        }]
    };
}]);

//价格权限控制
webApp.directive('pricepower', [function () {
    return {
        restrict: "AE",
        transclude: true,
        scope: {
            "powercode": "@"
        },                                                 
        // template: '<div style="display:inline-block;"><ng-transclude ng-if="power"></ng-transclude><span ng-if="!power" style="font-weight:bolder;">***</span></div>',
        template: '<ng-transclude ng-if="power"></ng-transclude><span ng-if="!power">***</span>',
        controller: ['$scope', 'user', function ($scope, user) {
            user.checkButtonPower(function () {

                $scope.power = user.hasBtnPower(config.price[$scope.powercode]);
            })
        }]
    };
}]);