"use strict";

webApp.register.controller("loginCtrl", ['$scope', 'user', "urest", "rest", "$location", '$routeParams', '$cookies', '$resource', "$q", "$timeout", function ($scope, user, urest, rest, $location, $routeParams, $cookies, $resource, $q, $timeout) {
    $scope.account = ""; // 帐号
    $scope.password = ""; // 密码
    //设定title
    user.setPageTitle('登录');
    //有邀约码
    if ($routeParams.invitationCode) {
        $scope.hasInvite = true;
    }
    vertifyToken();

    if (localStorage.getItem('rememberme')) {
        $scope.rememberMe = true;
        $scope.account = localStorage.getItem('rem_account');
        $scope.password = localStorage.getItem('rem_pwd');
    }
    //登录后不需要返回的页面路径
    var noReturnUrl = [
        "/register/step1",
        "/register/step2_1",
        "/register/step2_2",
        "/register/step3_1",
        "/register/step3_2",
        "/register/step3_3",
        "/register/step4",
        "/forgetPW"
    ];

    //是否显示 验证码的标记 后台传回  
    $scope.isDisplayVerifyCode = 0;
    $scope.submiting = false;
    $scope.login = function () {
        $scope.submiting = true;
        var resourceLogin = $resource(config.userUrl + "usersystem/login/memberLogin/v1");
        if (!$scope.password) {
            $scope.password = $('#txtPwd').val();
        }
        $scope.pwdMd5 = hex_md5(hex_md5($scope.password));

        var param = {
            "account": ($scope.account) ? $scope.account : "",
            "password": ($scope.pwdMd5) ? $scope.pwdMd5 : "",
            "verifyKey": ($scope.verifyKey) ? $scope.verifyKey.toString() : "",
            "verifyCode": ($scope.verifyCode) ? $scope.verifyCode : "",
            "dataSource": 1,
            "uniqueCode": "",
            "pushUniqueCode": ""
        };
        $timeout(function () {
            $scope.submiting = false;
        }, 5000);
        resourceLogin.save(JSON.stringify(param), function (response) {
            //成功
            if (response.retCode == '01210') {
                //记住我
                if ($scope.rememberMe) {
                    $scope.rememberMeFunc();
                } else {
                    $scope.clearRememberMeFunc();
                }
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                $cookies.put('userName', $scope.account, {'expires': expireDate, 'path': '/'});
                $cookies.put('pwd', $scope.pwdMd5, {'expires': expireDate, 'path': '/'});

                //person表示邀约个人,company表示邀约交易伙伴
                //邀约个人时先不查询个人信息(将用户已有账号加入新公司后再调用)
                if ($routeParams.invitationSource == 'person') {
                    // $scope.submiting = false;
                    relatePerson($scope.account);
                } else {
                    user.setToken(response.token);
                    user.setSecret(response.secretNumber);
                    getUserInfo().then(function (resp) {
                        // $scope.submiting = false;
                        //优先处理邀约码
                        //person表示邀约个人,company表示邀约交易伙伴
                        if ($routeParams.invitationSource == 'company') {
                            relateCompany(resp);
                        } else if (!parseInt(resp.companyId)) {
                            //个人用户登录跳转到注册页
                            $location.url("register/step2_1");
                        } else if (!_.isEmpty(config.refererPage)) {
                            //登录页特殊处理 (不需要返回的页面路径)
                            for (var url in noReturnUrl) {
                                if (config.refererPage.indexOf(noReturnUrl[url]) > -1) {
                                    $location.path("index");
                                    return false;
                                }
                            }
                            $location.path(config.refererPage);
                        } else {
                            checkNavigateTo();
                            // $location.path("index");
                            // $location.replace();
                        }
                    },function(){
                        $location.path('login');
                    });
                    getLogo();
                }
            } else {
                user.clearUserInfo();
                $scope.isDisplayVerifyCode = response.isDisplayVerifyCode;
                if (response.retCode == '01211') {
                    zhlModalTip('帐号或密码错误');
                } else if (response.retCode == '01213') {
                    zhlModalTip('请输入帐号和密码以及验证码');
                } else if (response.retCode == '01214') {
                    zhlModalTip('帐号、密码或验证码有误');
                } else {
                    zhlModalTip(response.retMsg);
                }
                $scope.submiting = false;
            }
        });
    };
    // 取得用户信息
    function getUserInfo(callback) {
        var deferred = $q.defer();
        var rest_info = $resource(config.userUrl + "usersystem/login/getTokenList/v1");
        var param = {
            "token": user.getToken(),
            "secretNumber": user.getSecret()
        };
        rest_info.save(JSON.stringify(param), function (response) {
            //成功
            if (response.retCode == '01230') {
                user.setUserInfo(response);
                deferred.resolve(response);
            } else {
                user.clearUserInfo();
                deferred.reject(response);
            }
            if (typeof callback == 'function') {
                callback(response);
            }
            if (window.isIE9) {
                $scope.$apply();
            }
        });
        return deferred.promise;
    }

    //获取企业logo
    function getLogo() {
        var resourceLogo = $resource(config.userUrl + 'usersystem/company/getCompanyByCurrentUser/v1');
        var param = {
            commonParam: {
                dataSource: 1,
                interfaceVersion: 0,
                mobileModel: 0,
                mobileSysVersion: 0,
                sourcePage: window.location.pathname,
                sourceSystem: 1
            }
        };
        param.token = user.getToken();
        param.secretNumber = user.getSecret();
        resourceLogo.save(JSON.stringify(param), function (data) {
            if (data.errorCode == "0") {
                user.setUserInfo(data.companyInfo);
                if (window.isIE9) {
                    $scope.$apply();
                }
            }
        });
    }

    // 根据用户是否有我的采购菜单，则跳转到我的采购工作台；
    // 如果没有我的采购菜单，则跳转到我的销售工作台
    function checkNavigateTo() {
        urest.get("usersystem/menu_management/getMenuByMember/v1", {}, function (response) {
            var hasMyPurchase = false;//是否含有我的采购菜单
            if (response.errorCode == '0') {
                _.forEach(response.menuSet, function (val) {
                    if (val.menuId == config.myPurchaseId) {
                        hasMyPurchase = true;
                        return false;
                    }
                });
            }
            if (hasMyPurchase) {
                $location.path("mypurchase");
            } else {
                $location.path("mysale");
            }
        });
        // $scope.submiting = false;
    }

    //邀约-企业
    function relateCompany(userinfo) {
        if (!parseInt(user.getCompanyId())) {
            $location.path("register/step2_2/" + $routeParams.invitationCode);
            return;
        }
        var param = {
            "companyId": user.getCompanyId(),
            "companyCode": userinfo.companyCode,
            "companyName": userinfo.companyName,
            "invitationCode": $routeParams.invitationCode
        };
        rest.get("B01_saveInviteByCode", param, function (data) {
            if (!data.success) {
                zhlModalTip(data.errorMsg);
                $scope.submiting = false;
                return;
            }
            // 1.跳转往客户邀约清单；
            // 2.跳转向供应商邀约清单
            if (data.invitationType == 1) {
                $location.path("customer/customer_my/3");
            } else {
                $location.path("supply/supply_my/3");
            }
        });
    }

    //邀约-个人
    function relatePerson(account) {
        var param = {
            invitationCode: $routeParams.invitationCode,
            account: account
        };
        urest.get("usersystem/register/joinCompanyPc/v1", param, function (data) {
            if (data.errorCode == "0") {
                var resourceLogin = $resource(config.userUrl + "usersystem/login/memberLogin/v1");
                var param = {
                    "account": ($scope.account) ? $scope.account : "",
                    "password": ($scope.pwdMd5) ? $scope.pwdMd5 : "",
                    "verifyKey": ($scope.verifyKey) ? $scope.verifyKey.toString() : "",
                    "verifyCode": ($scope.verifyCode) ? $scope.verifyCode : "",
                    "dataSource": 1,
                    "uniqueCode": "",
                    "pushUniqueCode": ""
                };
                resourceLogin.save(JSON.stringify(param), function (response) {
                    //成功
                    if (response.retCode == '01210') {
                        user.setToken(response.token);
                        user.setSecret(response.secretNumber);
                        getUserInfo().then(function () {
                            $location.path("index");
                        });
                        getLogo();
                    }
                });
            } else if (data.errorCode == "02174") {
                zhlModalTip('该账号已有关联公司');
                $scope.submiting = false;
            } else {
                zhlModalTip('邀请码错误');
                $scope.submiting = false;
            }
        });
    }

    //我要体验
    $scope.experienceBt = function () {
        $scope.account = "zhlb2b007";
        $scope.password = "123";
        $scope.login();
    };
    //记住密码
    $scope.rememberMeFunc = function () {
        localStorage.setItem("rememberme", 1);
        localStorage.setItem("rem_account", $scope.account);
        localStorage.setItem("rem_pwd", $scope.password);
        // var expireDate = new Date();
        // expireDate.setDate(expireDate.getDate() + 7);
        // $cookies.put("rememberme", 1, {'expires': expireDate, 'path': '/'});
        // $cookies.put("rem_account", $scope.account, {'expires': expireDate, 'path': '/'});
        // $cookies.put("rem_pwd", $scope.password, {'expires': expireDate, 'path': '/'});
    };

    //取消-记住密码
    $scope.clearRememberMeFunc = function () {
        localStorage.removeItem('rememberme');
        localStorage.removeItem('rem_account');
        localStorage.removeItem('rem_pwd');
        // $cookies.remove("rememberme");
        // $cookies.remove("rem_account");
        // $cookies.remove("rem_pwd");
    };

    //刷新验证码图片
    $scope.getImgVerify = function () {
        $scope.verifyKey = Math.random();
        $scope.imgUrl = config.userUrl + 'usersystem/login/getVerifyCode/v1?verifyKey=' + $scope.verifyKey;
    };

    // 验证token是否合法, 同时更新用户信息
    // 如果存在不合法token，则清除原来的不合法token
    function vertifyToken() {
        var param = {};
        param.serviceId = "tokenVerify";
        param.token = user.getToken();
        if (_.isEmpty(param.token)) {
            user.clearUserInfo();
            return;
        }
        urest.get("usersystem/login/getTokenList/v1", param, function (data) {
            //token有效
            if (data.retCode != "01230") {
                user.clearUserInfo();
            }
        });
        //token是否被强制刷新
        function testToken() {
            var param = {};
            param.token = user.getToken();
            console.log(param.token);
            urest.get("usersystem/login/checkTokenUpdate/v1", param, function (data) {
                if (data.errorCode == "03131") {
                    zhlModalTip("该用户已在其他地方被登录", "", "", '温馨提示');
                } else {
                    return false;
                }
            });
        }

        testToken();
    }


    $scope.getImgVerify();
}]);

