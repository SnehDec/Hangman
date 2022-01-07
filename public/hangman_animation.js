//This file handles the Hangman animation and rendering of the hints

let can = document.querySelector(".hangman-canvas");
let ctx = can.getContext("2d");

function draw_noose(){
  ctx.moveTo(0, 0);
  ctx.lineTo(200, 0);
  ctx.stroke();
  ctx.moveTo(100, 0);
  ctx.lineTo(100, 30);
  ctx.stroke();
}

function draw_head(){
  ctx.beginPath();
  ctx.arc(100, 55, 25, 0, 2 * Math.PI);
  ctx.stroke();
}

function draw_torso(){
  ctx.moveTo(100, 80);
  ctx.lineTo(100, 130);
  ctx.stroke();

}

function draw_right_arm(){
  ctx.moveTo(100, 100);
  ctx.lineTo(120, 100);
  ctx.stroke();
}

function draw_left_arm(){
  ctx.moveTo(100, 100);
  ctx.lineTo(80, 100);
  ctx.stroke();
}

function draw_left_leg(){
  ctx.moveTo(100, 130);
  ctx.lineTo(80, 150);
  ctx.stroke();
}

function draw_right_leg(){
  ctx.moveTo(100, 130);
  ctx.lineTo(120, 150);
  ctx.stroke();
}

//the value of func is grabbed from the server, which renders it as a hidden value
//on the webpage
let func = parseInt($("#func")[0].innerHTML);


let functions = [draw_noose, draw_head, draw_torso,
  draw_left_arm, draw_right_arm, draw_left_leg, draw_right_leg];

//The following code enables the Hanged Man to be persistent when the page reloads
//to generate a new word.
  if(func>0){
    for(let i=0; i<func;i++){
      setTimeout(functions[i], 1);
    }
  }

//word_letters contain all the letters of the word
let word_letters = document.querySelectorAll(".hidden_word");

//word_letter contains the letters that are shown to the user as well as the blanks
let word_letter = document.querySelectorAll("h1");
for (let i=0; i<word_letter.length; i++){
  //Each blank is assigned an id that corresponds
  // to the letter that is supposed to be filled into that blank
  word_letter[i].id = word_letters[i].innerHTML;
}

//The following code handles the drag-and-drop functionality
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.innerHTML);
}

function drop(ev){
  ev.preventDefault();
  //if the letter dragged by the user into a blank is the same as the id
  //assigned to that blank, the blank gets filled in.
  //Otherwise, the next part of the Hanged Man is drawn by updating
  //global variable func.
  if(ev.target.id ==ev.dataTransfer.getData("text")){
    ev.target.innerHTML = ev.target.id;
  }
  else{
    setTimeout(functions[func], 10).then(func++);
  }
}

//requested_hints keeps track of how many times the user hits the Hint button
let requested_hints = 0;
//The hints are all rendered as hidden synonyms/antonyms/definitions
// on the webpage by the server,
//to be revealed by pressing a button.
let hints = $(".hidden_hint");

//The following code reveals hints when the Hint button is pressed.
$("#generate_hint").click(function(){
  //If the user exceeds the number of available hints (usually 5), one blank gets
  //filled in each time the user hits the Hint button, with a penalty of proceeding
  // with the Hanging of the Man
  if(hints.length-1<requested_hints){
    //if the entire word has been exposed already, this button stops working.
    //This prevents the while loop on line 129 from going on indefinitely.
    let word_exposed=true;
    for(let i=0; i<word_letter.length;i++){
      if(word_letter[i].innerHTML != word_letter[i].id){
        word_exposed=false;
      }
    }
    if(word_exposed==true){
      this.off("click");
    }
    //The code below picks a random unfilled blank to fill in, and proceeds
    //to the next step of hanging the man.
    let i = Math.floor(Math.random()*word_letter.length);
    while(word_letter[i].innerHTML==word_letter[i].id){
      i = Math.floor(Math.random()*word_letter.length);
    }
    word_letter[i].innerHTML = word_letter[i].id;
    setTimeout(functions[func], 10).then(func++);
  }
  //if the number of hints is less than 5/the number of hints available on the page,
  //the hidden hints get revealed. There is no penalty for these hints.
  else{
  let hint = hints[requested_hints].classList.remove("hidden_hint");
}
  requested_hints+=1;
})

//The timer below checks whether the user has finished filling in the given word.
//If yes, the program reveals a hidden button on the screen that the user can
//click to move on to the next word. Thus button is actually a form submit
//button that simultaneously sends the value of func back to the server, which
//again renders it on the web page so that the Hanged Man persists upon reloading the page.
//If the man is completely hanged (func=functions.length), the game ends and the timer
//stops.
let timer = setInterval(function(){  let next_word = true;
  for(let i=0; i<word_letter.length;i++){
    if(word_letter[i].innerHTML!=word_letter[i].id){
      next_word=false;
    }
  }
  if(next_word){
    if(func<functions.length){
     $("#send_func")[0].value = func;
     $("#next_word").css("visibility", "visible");
   }
     clearInterval(timer);
  }}, 10);
