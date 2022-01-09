# Hangman
A web-based Hangman Game 

#How It Works 

This is a web-based Hangman Game. It begins with a blank canvas, a partially-visible word (the rest of the letters being blanks to be filled in by the player) with a complete alphabet on-screen keyboard below it,
and a single hint in the form of a definition, synonym or antonym of the word. The "Hint" button below the visible hint can be used to generate up to four more hints 
(one at a time), after which, if the Hint button is clicked, some of the blanks will be filled in at the cost of a body part of the Hanged Man for each filled blank. The man 
will be drawn on the canvas so the player can keep track of their progress. The player fills in blanks by dragging letters from the on-screen keyboard and dropping them on the corresponding blank. 
If the word is successfully completely filled in before the man is hanged, a button appears at the bottom of the canvas which the player can use to move on to the next word.
This process repeats until the man is hanged, at which point the game ends. This is an untimed game. 

The words are read from a text file called "list_of_words" and the hints are obtained by sending a request to Merriam-Webster's Dictionary API. All this is done in the 
app.js file. The drag-and-drop functionality and the drawing of the man on the canvas are controlled by a JavaScript file, hangman_animation.js. The code contains detailed
comments that generally walk through the code and give clarification on specific lines. 


# Credit 

randomwordgenerator.com for providing the list of words used in this program,
Dan Dascalescu and CamHart on Stack Overflow for Node.js file-reading code (which I subsequently modified),
Merriam-Webster whose API I used in this program to grab definitions, synonyms and antonyms of words in the list. 
Links: 
Random Word Generator: https://randomwordgenerator.com/
Stack Overflow Post: https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
Merriam-Webster Dictionary API: https://dictionaryapi.com/
