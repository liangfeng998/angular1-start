"use strict";

webApp.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {
    // $locationProvider.html5Mode({enabled: true, rewriteLinks: true, requireBase: true});

    // $urlRouterProvider.when("", "/login");
    // $urlRouterProvider.otherwise(function () {
    //     window.location.href = "login.html";
    // });

    $stateProvider
        .state('demo', {
            url: '/system',
            views: {
                '': {templateUrl: 'views/view.html'},
                "nav@demo": {templateUrl: 'views/demo/nav.html'},
                "main@demo": {templateUrl: 'views/demo/list.html'}
            }
            //controller: ""
        })
        //列表
        .state('demo.list', {
            url: '/list',
            views: {
                "main@demo": {
                    templateUrl: 'views/demo/list.html',
                    controller: "myPurchaseCtrl",
                    resolve: loader(['mypurchase'], 'mypurchase')
                }
            }
        })
        //列表--详情页
        .state('demo.list.detail', {
            url: '/detail',
            views: {
                "main@demo": {
                    templateUrl: 'views/demo/detail.html',
                    controller: "myPurchaseCtrl",
                    resolve: loader(['mypurchase'], 'mypurchase')
                }
            }
        });


    function loader(arrayName, firstLevelMenu) {
        return {
            load: ['$q', function ($q) {
                var deferred = $q.defer(), random = '';
                // if (!storage.getItem('debug')) {
                //     random = Math.random();
                // }
                var map = arrayName.map(function (name) {
                    if (name.indexOf('.js') == -1) {
                        return loadScript('engine/controllers/' + name + ".js?" + random);
                    }
                    return loadScript(name);
                });
                $q.all(map).then(function (r) {
                    deferred.resolve();
                });
                return deferred.promise;
            }],
            init: ['$location', '$rootScope', function ($location, $rootScope) {
                config.refererPage = config.currentPage;
                config.currentPage = $location.url();
                //获取页头信息
                // $rootScope.userinfo = user.getUserInfo();
                // if (window.isIE9) {
                //     return user.init();
                // }
            }],
            menu: [ function () {
                if (firstLevelMenu) {

                }
            }]
        };
    }

}]);
