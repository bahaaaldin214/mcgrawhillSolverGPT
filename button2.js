function recieveLocal(key) {
  return new Promise((resolve, reject) => {
    return chrome.storage.local.get(`extension.${key}`, (data) => {
      if (chrome.runtime.lastError || !data[`extension.${key}`]) {
        return reject(chrome.runtime.lastError);
      } else {
        return resolve(JSON.parse(data[`extension.${key}`]));
      }
    });
  });
}

recieveLocal("question").then((result) => {
  if(!result?.question) return;
  
  textArea = document.querySelectorAll("textarea")[0]
  textArea.value = `${result.question}`;
  setTimeout(function(){
    textArea.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      keyCode: 13,
      bubbles: true,
      cancelable: true
    }));
    
  }, 500);
})
  