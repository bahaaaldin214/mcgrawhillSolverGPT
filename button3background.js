function saveOnLocal(key, value){
  return new Promise((s, r) => {
    chrome.storage.local.set({[`extension.${key}`]: JSON.stringify(value)}, function(){
      s()
    });  
  });
}
  
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
console.log("1nd")

window.addEventListener('load', () => {
    console.log("button has not been found")

  const button = document.querySelector('[aria-label="High Confidence"]');
  console.log("button has been found")
  if (button) {
    console.log("correct tab ")
    setInterval(() => {
      recieveLocal("sumbit").then(async (o) => {
        const value = o?.value
        if (value == true) {
          await waiter(5000);
          button.click();
          await waiter(500);
          document.querySelector('.btn.btn-primary.next-button')?.click();
          saveOnLocal("sumbit", {value: false})
        }
      })
    }, 500)
  }
})