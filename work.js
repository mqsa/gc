const window = {};
importScripts('./dist/markGC.js');

self.markGC = (d, l) => window.markGC(d, l, (msg) => {
  self.postMessage({ type: 'progress', data: msg });
});

self.addEventListener(
  'message',
  e => {
    self.postMessage(
      { type: 'end', data: self.markGC(e.data.data, e.data.len) })
  }
);
