{
    let prompt = [];
    let type = document.querySelectorAll("h2")[0].innerText;
    let div = document.querySelectorAll("p");
    prompt[0] = div[0].innerText;
    switch(type){
      case "Multiple Select Question":
        prompt[0] = div[1].innerText;
        prompt[1] = Array.from(document.querySelector("fieldset")
         .querySelectorAll("p")) 
         .filter(node => node !== undefined)
         .map(node => node.innerHTML)

        break;
      case "Multiple Choice Question":
        
        prompt[0] =  div[1].innerText;
        prompt[1] = Array.from(document.querySelector(".responses-container")
         .querySelectorAll("p")) 
         .filter(node => node !== undefined)
         .map(node => node.innerHTML)

        break;
      case "Fill in the Blank Question":
        prompt[0] = "Type: Fill in the Blank Question, please respond with 1 word and one word only";
        prompt[1] = [div[1].innerText]
        break;
      case "True or False Question":
        prompt = [div[1].innerText, ["True", "or False"]];
        break;

      }
    
    prompt;
  }