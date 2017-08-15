"use strict";

var webApp = angular.module('webApp', ['ui.router', 'ngSanitize',  'ngResource','ngCookies'])
    .run(["$rootScope",  function ($rootScope) {
// var webApp = angular.module('webApp', ['ui.router', 'ngSanitize', 'ngCookies', 'ngResource', 'pascalprecht.translate'])
//     .run(["$rootScope", "$cookies", "$cacheFactory", "user", function ($rootScope, $cookies, $cacheFactory, user) {
        $rootScope.engineStarted = true;
        // $rootScope.decodeURIComponent = decodeURIComponent;
        //user.vertifyToken();
        //$rootScope.$watch("userinfo", function(nv, ov){
        //    log("user info change===================");
        //});
    }])
    .config(['$httpProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$stateProvider',
    // .config(['$httpProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$stateProvider', '$translateProvider',
        function ($httpProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider) {

            webApp.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service,
                state: $stateProvider
            };

            //多语言
            // var lang = window.localStorage.lang || 'zh-cn';
            // $translateProvider.preferredLanguage(lang);
            // $translateProvider.useStaticFilesLoader({
            //     prefix: 'vendors/language/',
            //     suffix: '.json'
            // });

            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';

            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = [function (data) {
                /**
                 * The workhorse; converts an object to x-www-form-urlencoded serialization.
                 * @param {Object} obj
                 * @return {String}
                 */
                var param = function (obj) {
                    var query = '';
                    var name, value, fullSubName, subName, subValue, innerObj, i;
                    //log(obj);
                    for (name in obj) {
                        value = obj[name];
                        if (value instanceof Array) {
                            log("Array");
                            for (i = 0; i < value.length; ++i) {
                                subValue = value[i];
                                fullSubName = name + '[' + i + ']';
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        }
                        else if (value instanceof Object) {
                            log("object");
                            for (subName in value) {
                                subValue = value[subName];
                                if (subValue != null) {
                                    // fullSubName = name + '[' + subName + ']';
                                    //user.userName = hmm & user.userPassword = 111
                                    fullSubName = name + '.' + subName;
                                    // fullSubName =  subName;
                                    innerObj = {};
                                    innerObj[fullSubName] = subValue;
                                    query += param(innerObj) + '&';
                                }
                            }
                        }
                        else if (value !== undefined) //&& value !== null
                        {
                            log("undefined");
                            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                        }
                    }

                    return query.length ? query.substr(0, query.length - 1) : query;
                };

                return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
            }];

            $httpProvider.defaults.useXDomain = true;
            // delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }]);
