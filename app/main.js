const ipcRenderer = require('electron').ipcRenderer;
const ipcMain = require('electron').ipcMain;
//console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
//监听消息改变模型
console.log('s')
ipcRenderer.on('changemodel', function (event, arg) {
    console.log(arg);
    var thisScale = LAppDefine.SCALE;
    var menu = db.get("menu").value();
    var models = [];
    if (arg != '') {
        for (var i in menu) {
            if (arg == menu[i]) {
                models.push(db.get("model_path").value()[i]);
                LAppDefine.SCALE = db.get("model_size").value()[i];
                LAppDefine.NAME = arg;
            }
        }
    }
    LAppDefine.MODELS = [models];
    document.getElementById("Change").click();
    modelScaling(LAppDefine.SCALE / (thisScale));
});
//监听消息改变服装
ipcRenderer.on('asynchronous-reply', function (event, arg) {
    clickTexureButton();
    db.set("now_texure",LAppDefine.THIS_TEXURE).write();
});
//监听模型声音设置的改变
ipcRenderer.on('set-up-sound',function(event,arg) {
    if(arg){
        LAppDefine.AUDIO_ID = "my_audio";
    }else{
        LAppDefine.AUDIO_ID = "";
    }
});

function clickTexureButton() {
    document.getElementById("texure").click();
}

//文件拖放删除
function initDragIn() {
    window.ondragover = function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return false;
    };

    window.ondrop = function (e) {
        e.preventDefault();
        var files = [];
        for (var i = 0; i < e.dataTransfer.files.length; ++i) {
            console.log(e.dataTransfer.files[i].path);
            files.push(e.dataTransfer.files[i].path);
        }
        ipcRenderer.send('deletefile', files);
        return false;
    };

    window.ondragleave = function () {
        return false;
    };
}


initDragIn();