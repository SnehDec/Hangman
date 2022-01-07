

let can = document.querySelector(".hangman-canvas");
let ctx = can.getContext("2d");

let word_letters = document.querySelectorAll(".hidden_word");

let word_letter = document.querySelectorAll("h1");
for (let i=0; i<word_letter.length; i++){
  word_letter[i].id = word_letters[i].innerHTML;
}


function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev){
  ev.preventDefault();
  if(ev.target.id ==ev.dataTransfer.getData("text")){
    ev.target.innerHTML = ev.target.id;
  }
  else{
    setTimeout(functions[func], 10).then(func++);
  }
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.innerHTML);
}

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

let func = parseInt($("#func")[0].innerHTML);


let functions = [draw_noose, draw_head, draw_torso,
  draw_left_arm, draw_right_arm, draw_left_leg, draw_right_leg];

let requested_hints = 0;
let hints = $(".hidden_hint");

if(func>0){
  for(let i=0; i<func;i++){
    setTimeout(functions[i], 1);
  }
}

$("#generate_hint").click(function(){
  if(hints.length-1<requested_hints){
    let word_exposed=true;
    for(let i=0; i<word_letter.length;i++){
      if(word_letter[i].innerHTML != word_letter[i].id){
        word_exposed=false;
      }
    }
    if(word_exposed==true){
      this.off("click");
    }
    let i = Math.floor(Math.random()*word_letter.length);
    while(word_letter[i].innerHTML==word_letter[i].id){
      i = Math.floor(Math.random()*word_letter.length);
    }
    word_letter[i].innerHTML = word_letter[i].id;
    setTimeout(functions[func], 10).then(func++);
  }
  else{
  let hint = hints[requested_hints].classList.remove("hidden_hint");
}
  requested_hints+=1;
})


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
