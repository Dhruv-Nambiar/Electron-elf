// const ipcRenderer = require('electron').ipcRenderer;
// const ipcMain = require('electron').ipcMain;
// //console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
// //监听消息改变模型

// //监听消息改变服装
// ipcRenderer.on('asynchronous-reply', function (event, arg) {
//     clickTexureButton();
//     db.set("now_texure",LAppDefine.THIS_TEXURE).write();
// });
// //监听模型声音设置的改变
// ipcRenderer.on('set-up-sound',function(event,arg) {
//     if(arg){
//         LAppDefine.AUDIO_ID = "my_audio";
//     }else{
//         LAppDefine.AUDIO_ID = "";
//     }
// });

// function clickTexureButton() {
//     document.getElementById("texure").click();
// }

// //文件拖放删除
// function initDragIn() {
//     window.ondragover = function (e) {
//         e.preventDefault();
//         e.dataTransfer.dropEffect = 'copy';
//         return false;
//     };

//     window.ondrop = function (e) {
//         e.preventDefault();
//         var files = [];
//         for (var i = 0; i < e.dataTransfer.files.length; ++i) {
//             console.log(e.dataTransfer.files[i].path);
//             files.push(e.dataTransfer.files[i].path);
//         }
//         ipcRenderer.send('deletefile', files);
//         return false;
//     };

//     window.ondragleave = function () {
//         return false;
//     };
// }


// initDragIn();

var LAppDefine = {
	// 调试，true时会在console里显示日志
	DEBUG_LOG: true,
	DEBUG_MOUSE_LOG: false, // 鼠标相关日志
	//  全部设定
	//这里配置canvsa元素的id
	CANVAS_ID: "mycanvas",
	//是否开启滚轮缩放，默认true
	IS_SCROLL_SCALE: false,
	// 画面最大缩放级别
	VIEW_MAX_SCALE: 2,
	// 画面最小缩放级别
	VIEW_MIN_SCALE: 0.8,

	VIEW_LOGICAL_LEFT: -1,
	VIEW_LOGICAL_RIGHT: 1,

	VIEW_LOGICAL_MAX_LEFT: -2,
	VIEW_LOGICAL_MAX_RIGHT: 2,
	VIEW_LOGICAL_MAX_BOTTOM: -2,
	VIEW_LOGICAL_MAX_TOP: 2,
	// 动作优先级常量
	PRIORITY_NONE: 0,
	PRIORITY_IDLE: 1,
	PRIORITY_NORMAL: 2,
	PRIORITY_FORCE: 3,

	//是否绑定切换模型按钮
	IS_BIND_BUTTON: true,
	//绑定按钮元素id
	BUTTON_ID: "Change",
	//是否开启模型切换完成之前禁止按钮点击的选项，默认为true
	IS_BAN_BUTTON: true,
	//设置按钮禁止状态时的class，可自定义样式，前提是IS_BAN_BUTTON为true
	BAN_BUTTON_CLASS: "inactive",
	//设置按钮正常状态时的class
	NORMAL_BUTTON_CLASS: "active",
	//衣服切换模式 目前只支持两种 sequence-顺序 random-随机
	//需事先配置好json文件里的textures属性
	//暂不支持保存功能
	TEXURE_CHANGE_MODE: "",
	IS_START_TEXURE_CHANGE: true,
	TEXURE_BUTTON_ID: "texure",
	/**
	 *  模型定义
			 自定义配置模型，同一数组内放置两个模型则为开启双模型
			三模型也只取数组里的前两个
			模型出现的顺序与数组一致
			这里请用相对路径配置
	*/
	MODELS: [
			// ["./model/xiaomai/xiaomai.model.json"],
			// ["./model/liang/2.json"],
			["./model/xiaomai/xiaomai.model.json"]
	],
	NAME: "",
	// 与外部定义的json文件匹配
	MOTION_GROUP_IDLE: "idle", // 空闲时
	MOTION_GROUP_TAP_BODY: "tap_body", // 点击身体时
	MOTION_GROUP_FLICK_HEAD: "flick_head", // 抚摸头部
	MOTION_GROUP_PINCH_IN: "pinch_in", // 放大时
	MOTION_GROUP_PINCH_OUT: "pinch_out", // 缩小时
	MOTION_GROUP_SHAKE: "shake", // 摇晃
	//如果有自定义的动作分组可以放在这里

	// 与外部定义json文件相匹配
	HIT_AREA_HEAD: "head",
	HIT_AREA_BODY: "body",
	//初始化的模型大小
	SCALE: 1.1,
	//新增属性，是否播放音频 默认为true
	IS_PLAY_AUDIO: true,
	THIS_TEXURE: 0,
	FLAG:true,
	//新增属性，audio标签id值
	AUDIO_ID: "my_audio"
};

window.ipcRender.receive('changemodel', (arg) => {
    var thisScale = LAppDefine.SCALE;
    var menu = db.get("menu");
    var models = [];
    if (arg != '') {
        for (var i in menu) {
            if (arg == menu[i]) {
                models.push(db.get("model_path")[i]);
                LAppDefine.SCALE = db.get("model_size")[i];
                LAppDefine.NAME = arg;
            }
        }
    }
    LAppDefine.MODELS = [models];
    document.getElementById("Change").click();
    modelScaling(LAppDefine.SCALE / (thisScale));
});