import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  ping: () => ipcRenderer.send('ping'),
  onPong: (callback) => ipcRenderer.on('pong', callback)
});
