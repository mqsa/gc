function handleFiles(files) {
  // Check for the various File API support.
  if (window.FileReader) {
    // FileReader are supported.
    getAsText(files[0]);
  } else {
    alert('FileReader are not supported in this browser.');
  }
}

function getAsText(fileToRead) {
  var reader = new FileReader();
  // Read file into memory as UTF-8
  reader.readAsText(fileToRead);
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}

function loadHandler(event) {
  var csv = event.target.result;
  processData(csv);
}

function processData(csv) {
  var allTextLines = csv.replace(/\"/g, '').split(/\r\n|\n/);
  var lines = [];
  for (var i = 0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    var tarr = [];
    for (var j = 0; j < data.length; j++) {
      tarr.push(data[j]);
    }
    lines.push(tarr);
  }

  const worker = new Worker('work.js');
  worker.postMessage({
    data: lines.splice(1),
    len: document.getElementById('minChainLength').value
  });
  worker.onmessage = function (event) {
    const { type, data } = event.data;
    if (type === 'progress') {
      document.getElementById('progress').style = `width: ${eval(data) * 100}%`;
    }
    if (type === 'end') {
      const scc = data.filter(row => row[0] !== null);
      const nodes = [...new Set([
        ...scc.map(c => c[1]),
        ...scc.map(c => c[2]),
      ])].map(x => ({ id: x }));

      const links = scc.map(c => ({ source: c[2], target: c[1] }));
      document.querySelector('#links').value =
        'ID,' + lines[0] + '\n' +
        scc.map(r => r.join(',')).join('\n');
      draw('#root', nodes, links);
    }
  };
}

function errorHandler(event) {
  if (event.target.error.name == "NotReadableError") {
    alert("Canno't read file !");
  }
}
