// popup.js
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

function waiter(x) {
  return new Promise(resolve => setTimeout(resolve, x));
}

let start = false;

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  
  executeScript("waiter.js")

  const [button1, button2, button3] = [1, 1, 1].map((value, i) => document.querySelector("#button"+(i+1)));
  const output = document.getElementById("output");
  // Add a click event listener to the button
  
  setInterval(async ()=> {
    recieveLocal("status").then(({value}) => output.innerText = value + new Date().toLocaleTimeString())
  }, 500)

  button1.addEventListener('click', async function() {
    
    // Send a message to the background script to save the message
    

    button3.style.display = "inline-block";

    executeScript("button1.js", function(prompt){
      
      const question = `
question: ${prompt[0]}
      
please select the best option(S?). Here are your options: ${prompt[1].reduce((a, c, i )  =>  a + (i+1) + ": "  + " " + c + " \n ", "\n")}
      `,

      key = Math.random();
      saveOnLocal('question', {
        key,
        question
      }).then(() => {
        saveOnLocal("status", {key, value: "question: " + prompt[0] + ", asked at: " + new Date().toLocaleTimeString()})
        saveOnLocal("current", {value: "start1"});
      });
      
    });
  });

  button2.addEventListener('click', async function() {
    // Send a message to the background script to save the message
    const checkLocal= await recieveLocal('question');
    
    if(!checkLocal || !checkLocal.question) {
      saveOnLocal("status", {value: "scanning for answer but no question, deleting in 5 seconds"});
      setTimeout(() => {
        saveOnLocal("status", {value: "Ready to scan question"});
      }, 5000);
    }
    const {question} = checkLocal;
  
    executeScript("button2.js", async function(result, tabs){
      saveOnLocal("status", {value: "question found, scanning for answers, asked at: " + new Date().toLocaleTimeString() })
      //do some code to automatically select answer 
      saveOnLocal("current", {value: "start2"});
      saveOnLocal('question', null);


      waiter(2000).then(() => { //question should now be excuted, give time to  answer
        saveOnLocal("sumbit", {value: true})
      });
      await waiter(10000);
      recieveLocal("current").then(async ({value}) => {
        
       start = true;
      })
      
    });
  });

  function loop(){
    requestAnimationFrame(loop);
    if(start){
      button2.dispatchEvent(new Event('click'));
    }
  }
  loop();

  button3.addEventListener('click', function(){
    recieveLocal("current").then(({value}) => {
      
      if(value == "start2"){
        
        executeScript("button3.js", async () => {
          //fake button1 press
          await waiter(1000);
          start = true;
          button1.dispatchEvent(new Event('click'));
          //quuestion is being asked, so it shouldn't try to sumbit yet
          saveOnLocal("sumbit", {value: false})
        })
      }
    });
  });
});


function executeScript(file, callback){

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // Execute a content script to retrieve the page content
    
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: [file]
    }, (result) => {
      if(callback) callback(result[0].result)
    });
    
  })
   
}