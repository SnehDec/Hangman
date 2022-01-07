const express = require("express");
const https = require("https");
const app = express();
const body_parser = require("body-parser");
app.use(body_parser.urlencoded({extended:true}));
let words=[];
let used_words = [];
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


function get_info(){
  let cat = Math.floor(Math.random()*3);
  if(number_of_hints<5){
  switch (cat){
    case 0 : if(synonyms){def=synonyms[number_of_hints];}
    else{
      def = antonyms[number_of_hints];
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
  if(def!=undefined){
    number_of_hints+=1;
      hints.push(categories[cat]+def);
    }
}
}

async function processLineByLine() {
  const fileStream = fs.createReadStream(__dirname+'/list_of_words.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  for await (const line of rl) {
    words.push(line);
  }
  word = words[Math.floor(Math.random()*words.length)];
  used_words.push(word);
  const letters_shown = word.length-4;
  let shown_letter = [];
  for(let i=0; i<letters_shown;i++){
    shown_letter.push(Math.floor(Math.random()*word.length));
  }
  let num=0;
  letters=[];
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
  catch{
    synonyms = JSON.parse(body)[0];
  }
    console.log(synonyms);
    console.log(antonyms);
    console.log(shortdef);
    for(let i=0; i<40;i++){
    get_info();
  }
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

app.post("/", function(req, res){
 func = Number(req.body.updated_func);
 res.redirect("/");
})

app.listen(3000, function(){
  console.log("Server on port 3000")});
