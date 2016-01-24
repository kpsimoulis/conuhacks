var calendarSrc;

function exportInputs() {
  downloadFileFromText('myschedule.ics', calendarSrc);
}

function downloadFileFromText(filename, content) {
  var a = document.createElement('a');
  var blob = new Blob([ content ], {type : "text/plain;charset=UTF-8"});
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click(); //this is probably the key - simulating a click on a download link
  delete a;// we don't need this anymore
}

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    calendarSrc = request.source;
    if (calendarSrc) {
      document.getElementById('download0').innerHTML = "Download Schedule";
      document.getElementById('download0').disabled = false;
    }
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');
  document.getElementById('download0').onclick = exportInputs;

  chrome.tabs.executeScript(null, {
    file: "main.js", allFrames: true
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;