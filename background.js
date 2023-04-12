function executeScript(file, callback, c){

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // Execute a content script to retrieve the page content
 
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: [file]
    }, callback);
    
  })
   
}

executeScript("button3background.js")
