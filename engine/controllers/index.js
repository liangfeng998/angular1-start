"use strict";

webApp.register.controller("indexCtrl", [ '$scope','user','$location', function( $scope, user, $location ){
    // 设定 title “首页”
    user.setPageTitle("首页");

    $scope._ = _;
}]);

