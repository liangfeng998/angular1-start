var config = {
    version: "0.1",
    serviceUrl: "", // 服務接口位址
    serviceApi: "", //集成后台接口
     serviceHost: "",//服务主地址
    ossUrl: "", // oss 服务接口位址
    userUrl: "", // user 服务接口位址
    rootUrl: "", // 網站位址
    uploadTokenUrl: "", // 上传接口 - 生成token信息
    uploadFlashUrl: "", // 上传接口 - flash上传
    uploadUrl: "", // 上传接口
    viewPath: "", // view 路径
    inviteUser:"",//短信邮箱开通账户接口
    controllerPath: "", // controller 路径
    refererPage: "", // 上一页网址 
    currentPage: "", // 目前页面网址
    pageSize: 10, //业务页面每页显示的数据条数
    windowPageSize: 5, //开窗中的每页显示的数据条数
    myPurchaseId: 2, //我的采购菜单ID
    businessManageId: 1, //企业管理菜单ID
    mySaleId: 3, //我的销售菜单ID
    integrateId: 80, //集成管理菜单ID
    userCenterId: 4, //用户中心菜单ID
    price:{
        purchase:288,         //采购订单
        sale:290,             //销售订单
        custome:289,          //客户订单
        purchaseChange:291,   //采购变更
        saleChange:293,       //销售变更
        customeChange:292,    //客户变更
        purchaseReturn:294,   //采购退货
        saleReturn:296,       //销售退货
        customeReturn:295     //客户退货
    }
};

var __VERSION__ = "0.1";

var __HOST__ = window.location.host; // 網站 HOST
var __PROTOCAL__ = window.location.protocol; // 網站 PROTOCAL

var __UPLOAD_TOKEN_URL__ = ""; // 上传接口 - 生成token信息
var __UPLOAD_FLASH_URL__ = ""; // 上传接口 - flash上传
var __UPLOAD_URL__ = ""; // 上传接口
if (__HOST__ == "123.127.244.236:8080") { // 测试机
    config.rootUrl = "http://123.127.244.236:8080/";
    config.serviceUrl = "http://172.31.10.50:8081/supplyCenter/services/invokeRestfulSrv/supplyCloudService";
    config.serviceApi = "http://172.31.10.50:8081/supplyCenter/services/invokeRestfulSrv/supplyCloudService";
    config.serviceHost = "http://172.31.10.50:8081";
    config.userUrl = "http://172.31.10.168/";
    config.imUrl = "http://172.31.10.168:81/";
    config.transUrl = ""; //trans(支付相关接口)
    config.ossUrl = "http://172.31.10.168:19791/config/oss/api";
    config.viewPath = "/views/";
    config.controllerPath = "/engine/controllers/";
    config.inviteUser="http://172.31.10.180/";
} else if (__HOST__ == "outside-test-Frontend") { // 测试机
    config.rootUrl = "http://outside-test-Frontend/";
    config.serviceUrl = "http://outside-test-b2c/supplyCenter/services/invokeRestfulSrv/supplyCloudService";
    config.serviceApi = "http://outside-test-zlink/ZLink/services/invokeRestfulSrv/zlinkCloudService";
    config.serviceHost = "http://outside-test-zlink";
    config.userUrl = "http://outside-test-user/";
    config.imUrl = "http://outside-test-im/"; //hardy:已经修改
    config.transUrl = "http://outside-test-oss-trans"; //trans(支付相关接口)
    config.ossConfigUrl = "http://outside-test-oss-config/oss/config/api";
    config.ossNotifyUrl = "http://outside-test-oss-notify/oss/notify/api";
    config.ossLogUrl = "http://outside-test-oss-log/oss/log/api";
    config.ossUploadUrl = "http://outside-test-oss-upload/oss/upload/api";
    config.viewPath = "/views/";
    config.controllerPath = "/engine/controllers/";
    config.inviteUser="http://outside-test-Frontend/";
} else if (__HOST__ == "172.31.10.53") { // 开发机
    config.rootUrl = "http://172.31.10.53/zhl/";
    config.serviceUrl = "http://172.31.10.50:8081/supplyCenter/services/invokeRestfulSrv/supplyCloudService";
    config.serviceApi = "http://172.31.10.51:8888/ZLink/services/invokeRestfulSrv/zlinkCloudService";
    config.serviceHost = "http://172.31.10.51:8888";
    config.userUrl = "http://172.31.10.168/";
    config.imUrl = "http://172.31.10.168:81/";
    config.transUrl = "http://172.31.10.168:88"; //trans(支付相关接口)
    config.ossConfigUrl = "http://172.31.10.168:19790/oss/config/api";
    config.ossNotifyUrl = "http://172.31.10.155:19890/oss/notify/api";
    config.ossLogUrl = "http://172.31.10.168:19990/oss/log/api";
    config.ossUploadUrl = "http://172.31.10.168:20000/oss/upload/api";
    config.viewPath = "/zhl/views/";
    config.controllerPath = "/zhl/engine/controllers/";
    config.inviteUser="http://172.31.10.53/zhl/";
} else {
    //__VERSION__ = Math.random();
    config.rootUrl = "/";
    config.serviceUrl = "http://172.31.10.50:8081/supplyCenter/services/invokeRestfulSrv/supplyCloudService";
    config.serviceApi = "http://172.31.10.51:8888/ZLink/services/invokeRestfulSrv/zlinkCloudService";
    config.serviceHost = "http://172.31.11.122:8080";
    config.userUrl = "http://172.31.10.168/";
    config.imUrl = "http://172.31.10.168:81/";
    config.transUrl = "http://172.31.10.168:21000/"; //trans(支付相关接口)
    config.ossConfigUrl = "http://172.31.10.168:19790/oss/config/api";
    // config.ossNotifyUrl = "http://172.31.10.155:19890/oss/notify/api";
    config.ossNotifyUrl = "http://172.31.10.168:19890/oss/notify/api";
    config.ossLogUrl = "http://172.31.10.168:19990/oss/log/api";
    config.ossUploadUrl = "http://172.31.10.168:20000/oss/upload/api";
    config.viewPath = "/views/";
    config.controllerPath = "/engine/controllers/";
    config.inviteUser="http://172.31.10.180/";
}
