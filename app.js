const express = require("express");
const https = require("https");
const app = express();
const body_parser = require("body-parser");
app.use(body_parser.urlencoded({extended:true}));
let words=[];
let used_words=[];
let letters=[];
let word;
let def;
let shown_letters = [];
const fs = require('fs');
const readline = require('readline');
let hints = [];
let number_of_hints = 0;
let synonyms=[];
let antonyms=[];
let shortdef=[];
let categories =["Synonym:", "Antonym:", "Definition:"]
let func = 0;

//the following function is used to get hints for a given word
function get_info(){
  let cat = Math.floor(Math.random()*3);
  if(number_of_hints<5){
  switch (cat){
    case 0 : if(synonyms){def=synonyms[number_of_hints];}
    else{
      def = antonyms[number_of_hints];
      //cat has to change to 1 so that the system "knows" that the hint is an antonym now
      cat=1;
    }
    break;
    case 1: if(antonyms){def= antonyms[number_of_hints];
    }
    else{
      def=synonyms[number_of_hints];
      cat=0;
    }
    break;
    case 2: if(shortdef){
      def = shortdef[number_of_hints];
    }
    else{
      def = synonyms[number_of_hints];
      cat=0;
    }
    break;
  }
  //rarely, def may still be undefined because of problems with getting information through the API
  if(def!=undefined){
    number_of_hints+=1;
      hints.push(categories[cat]+def);
    }
}
}


//this function was contributed by Dan Dascalescu and CamHart on StackOverFlow and was modified by me.
//url to original code:https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
async function processLineByLine() {
  //list_of_words is a text file that contains a list of over 5000 words
  const fileStream = fs.createReadStream(__dirname+'/list_of_words.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  for await (const line of rl) {
    words.push(line); // loads all the words from the database into words array
  }
  //the code below makes sure that the same word isn't picked twice in a single game.
  //This is a low probability given the size of the database of words,
  //but I account for it nonetheless.
  let word_not_used = false;
  while(word_not_used==false){
  word_not_used=true;
  let index = Math.floor(Math.random()*words.length);
  for(let i=0;i<used_words.length;i++){
    if(words[index]==used_words[i]){
      word_not_used=false;
    }
  }
  word = words[index]; // picks a random word from words array
}
  used_words.push(word);
  const letters_shown = word.length-6; //  6 letters will be hidden from the player
  let shown_letter = []; // this array will contain the indices of the letters
  // in word that are to be shown to the user from the beginning. It is populated
  //by the for loop below.
  while(shown_letter.length<letters_shown){
    let push = true;
    // letter indices will be picked randomly and pushed into shown_letter
    let letr = Math.floor(Math.random()*word.length);
    //This for loop prevents duplicates to make sure only 6 words are hidden
    for(let i=0; i<shown_letter.length;i++){
      if(letr==shown_letter[i]){
        push=false;
      }
    }
    if(push=true){
    shown_letter.push(letr);
  }
  }


//we're sorting shown_letter so that we don't need to use two for loops on line 104.
  shown_letter.sort(function(a,b){return a-b});

  let num=0;
  //letters contains all letters in the given word
  letters=[];
  //shown_letters contains the letters that the user sees (including blanks)
  shown_letters = [];
  for(let i=0; i<word.length;i++){
   if(i==shown_letter[num]){
   shown_letters.push(word[i]);
   num++;
 }
 else{
   shown_letters.push("_");
 }
   letters.push(word[i]);
  }
  hints=[];
  number_of_hints=0;
  const options = {
    host: 'dictionaryapi.com',
    port: '443',
    path: '/api/v3/references/thesaurus/json/' + word + '?key=d359ddc2-b81f-4734-9692-d3d544e0a440',
    method: "GET"
};
let body="";
https.get(options,function(response){
  response.on('data', function(data){
    body+=data;
  });
  response.on('end', function(){
    console.log(body);
    try{
    synonyms = JSON.parse(body)[0].meta.syns[0];
    antonyms = JSON.parse(body)[0].meta.ants[0];
    shortdef = JSON.parse(body)[0].shortdef;
  }
  //sometimes this specific API has trouble loading information on antonyms
  //and shortdefs, so we need a backup
  catch{
    synonyms = JSON.parse(body)[0];
  }
    console.log(synonyms);
    console.log(antonyms);
    console.log(shortdef);
    //We loop through get_info a large number of times to ensure that we get a
    //minimum number of hints (given the API's occasional issues)
    for(let i=0; i<40;i++){
    get_info();
  }
  //debugging statements
  console.log("Hints " +hints);
  console.log(letters);
  });
}
)
}


app.set("view engine", "ejs");

app.use(express.static("public"));


app.get("/", function(req, res){
  processLineByLine().then(res.render(__dirname+"/hangman.ejs", {words:shown_letters,
    draggable_letters:['a','b', 'c', 'd', 'e', 'f', 'g', 'h',
     'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
    'v', 'w', 'x', 'y', 'z'], letters:letters, hints:hints, func:func}));
})

//the code below is used to communicate the value of global variable func between server side and client side
//this allows the Hanged Man to persist even when the page is reloaded
app.post("/", function(req, res){
 func = Number(req.body.updated_func);
 res.redirect("/");
})

app.listen(3000, function(){
  console.log("Server on port 3000")});
