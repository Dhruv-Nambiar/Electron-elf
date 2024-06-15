// Import the necessary Electron components.
const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;

// White-listed channels.
const ipc = {
    'render': {
        // From render to main.
        'send': [
            'openDetailsWindow'
        ],
        // From main to render.
        'receive': [
            'submitted-form',
            'changemodel'
        ],
        // From render to main and back again.
        'sendReceive': [
            'search'
        ]
    }
};

// Exposed protected methods in the render process.
contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods.
    'ipcRender', {
        // From render to main.
        send: (channel, args) => {
            let validChannels = ipc.render.send;
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, args);
            }
        },
        // From main to render.
        receive: (channel, listener) => {
            let validChannels = ipc.render.receive;
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`.
                ipcRenderer.on(channel, (event, ...args) => listener(...args));
            }
        },
        // From render to main and back again.
        invoke: (channel, args) => {
            let validChannels = ipc.render.sendReceive;
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, args);
            }
        }
    }
);

contextBridge.exposeInMainWorld('dow', {send: (arg) => {console.log(arg)}})

const path = require("path");
var dbPath = path.join(__dirname, '/db/db.json')
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(dbPath);
const db = low(adapter);
console.log(db.get("menu").value());
contextBridge.exposeInMainWorld('db', {get: (arg) => {return db.get(arg).value()}})