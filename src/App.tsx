import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";
import { QUIZ_DATABASE } from './quizDatabase';

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

type LessonData = {
  title: string;
  explanation: string;
  examples: string[];
  practice: string[];
  answers: string[];
  funFact: string;
  quiz: QuizQuestion[];
};

// --- LOCAL DATABASE (Walang API, Walang Limit!) ---
const lessonDatabase: Record<string, LessonData> = {
  // NEW ADDITIONAL LESSONS (OFFLINE MODE)
  "Pre-School-Mathematics": {
    title: "Counting 1 to 5",
    explanation: "Numbers are fun! Let's start by counting from 1 to 5 with our fingers. 🖐️\n\n1, 2, 3, 4, 5! Every time you point at something, give it a number!",
    examples: [
      "1 - One Shiny Sun ☀️",
      "2 - Two Happy Eyes 👀",
      "3 - Three Little Pigs 🐷🐷🐷"
    ],
    practice: [
      "Show 3 fingers! 🖐️",
      "Point to 1 nose! 👃",
      "Find 2 shoes! 👟👟"
    ],
    answers: ["Yes, 3 fingers up!", "Touch your nose!", "Point at your two matching shoes!"],
    funFact: "You have exactly 5 fingers on each hand!",
    quiz: []
  },
  "Pre-School-English": {
    title: "The Alphabet Song",
    explanation: "The alphabet has 26 letters! Singing the alphabet song helps us remember all of them. 🎵\n\nA B C D E F G... all the way to Z!",
    examples: [
      "A is for Apple 🍎",
      "B is for Bear 🐻",
      "C is for Cat 🐱"
    ],
    practice: [
      "What letter does Dog start with?",
      "Can you sing the A B C song?",
      "What letter comes after A?"
    ],
    answers: ["D for Dog!", "Sing loudly!", "B comes after A!"],
    funFact: "The most common letter used in English is the letter 'E'!",
    quiz: []
  },
  "Pre-School-Arts & Music": {
    title: "Colors Everywhere",
    explanation: "The world is full of beautiful colors. Red, Blue, and Yellow are the primary colors, which means they can mix to create all the other colors! 🎨",
    examples: [
      "Red Apple 🍎",
      "Yellow Sun ☀️",
      "Blue Ocean 🌊"
    ],
    practice: [
      "What color is a banana? 🍌",
      "What color is the sky? ☁️",
      "What color is a strawberry? 🍓"
    ],
    answers: ["Yellow!", "Blue!", "Red!"],
    funFact: "If you mix Red and Yellow, you make Orange! 🎨",
    quiz: []
  },
  "Fairy Tale": {
    title: "Cinderella & Peter Pan: The Magical Mystery",
    explanation: "Once upon a time, Cinderella's magical carriage lost its way and ended up in Neverland! She met Peter Pan, who offered to help her find her way back before midnight. But first, they have to solve some magical math and reading mysteries!",
    examples: [
      "Peter Pan's Flying: Peter Pan uses 'Pixie Dust' to fly. If he needs 10 pinches of dust to fly to the castle, and Tinkerbell gave him 5, how many more does he need? (Answer: 5!)",
      "Cinderella's Time: The clock strikes 11:00 PM. She must be home by 12:00 AM (Midnight). How many hours does she have left? (Answer: 1 Hour!)"
    ],
    practice: [
      "What did Cinderella lose at the royal ball?",
      "Who sprinkled magic dust to help Peter Pan fly?",
      "If Cinderella has 2 ugly stepsisters and Peter Pan brings 3 lost boys, how many friends do they have in total to help? (2 + 3 = ?)"
    ],
    answers: [
      "A glass slipper!",
      "Tinkerbell the fairy!",
      "They have 5 friends in total to help! (2 + 3 = 5)"
    ],
    funFact: "Did you know? Cinderella's slippers were originally made of fur in some old story versions, and 'Neverland' is actually a place where you never grow up!",
    quiz: [
      { question: "How many glass slippers did Cinderella lose?", options: ["One", "Two", "Three"], answer: "One" },
      { question: "Where does Peter Pan live?", options: ["Wonderland", "Neverland", "Narnia"], answer: "Neverland" },
      { question: "What color is Cinderella's ball gown?", options: ["Blue", "Red", "Black"], answer: "Blue" },
      { question: "What magical creature is Peter Pan's best friend?", options: ["Dragon", "Unicorn", "Fairy"], answer: "Fairy" },
      { question: "What did Cinderella's fairy godmother turn into a carriage?", options: ["Watermelon", "Apple", "Pumpkin"], answer: "Pumpkin" }
    ]
  },
  "Grade 5-Technology-Introduction to the Internet": {
    title: "Introduction to the Internet",
    explanation: "The Internet is like a giant, invisible spider web that connects computers all over the world!\n\nWhen your computer connects to the internet, it can 'talk' to other computers, which is how you can watch videos, play games, and read websites from anywhere on Earth.",
    examples: [
      "Websites: Like Google, YouTube, and Wikipedia are built on the internet.",
      "Email: Sending a letter digitally in seconds instead of using the post office.",
      "Wi-Fi: A way for your phone or computer to connect to the internet without any wires!"
    ],
    practice: [
      "What do we call the tool used to search for things online (like Google)?",
      "True or False: The internet only connects computers in the same city."
    ],
    answers: ["A Search Engine", "False! It connects the whole world!"],
    funFact: "The very first website ever created is STILL online! It was published in 1991 and is just a simple page with text explaining what exactly the 'World Wide Web' is.",
    quiz: [
      { question: "What is the Internet?", options: ["A) A global network of computers", "B) A type of video game", "C) A robot"], answer: "A) A global network of computers" },
      { question: "What does Wi-Fi let you do?", options: ["A) Print paper", "B) Connect to the internet without wires", "C) Take pictures"], answer: "B) Connect to the internet without wires" },
      { question: "Which of these is a popular search engine?", options: ["A) Microsoft Word", "B) Google", "C) Calculator"], answer: "B) Google" }
    ]
  },
  "Grade 1-Mathematics-Counting by 2s, 5s, and 10s": {
    title: "Skip Counting (2s, 5s, 10s)",
    explanation: "Skip counting is like taking big jumps on numbers instead of counting every single one!\n\nWhen we skip count, we count faster. We can skip count by 2s, 5s, or even 10s! It's like a fun number pattern.",
    examples: [
      "By 2s: 2, 4, 6, 8, 10... (Like counting pairs of shoes!)",
      "By 5s: 5, 10, 15, 20... (Like counting fingers on hands!)",
      "By 10s: 10, 20, 30, 40... (Like counting big piles of 10 blocks!)"
    ],
    practice: [
      "What comes next? 10, 20, 30, ___",
      "Count by 2s: 2, 4, ___",
      "Count by 5s: 5, 10, 15, ___"
    ],
    answers: ["40", "6", "20"],
    funFact: "Skip counting is the secret first step to learning multiplication! Once you know how to skip count, multiplying will be super easy later on.",
    quiz: [
      { question: "If you count by 10s, what comes after 50?", options: ["A) 51", "B) 60", "C) 100"], answer: "B) 60" },
      { question: "Which is counting by 5s?", options: ["A) 2, 4, 6", "B) 10, 20, 30", "C) 5, 10, 15"], answer: "C) 5, 10, 15" },
      { question: "What comes next in the 2s pattern? 2, 4, 6, 8, ___", options: ["A) 9", "B) 10", "C) 12"], answer: "B) 10" }
    ]
  },
  "Grade 4-Science-Weather and Climate": {
    title: "Weather vs. Climate",
    explanation: "Have you ever wondered why it rains today but is sunny tomorrow? That's weather! But what if a place is usually hot all year round? That's climate!\n\nWeather is what happens in the sky day-to-day. Climate is the average weather pattern in a place over a very long time (like 30 years!).",
    examples: [
      "Weather: 'It is raining outside right now.'",
      "Weather: 'Tomorrow it will be windy and cold.'",
      "Climate: 'The Philippines has a tropical climate, meaning it's mostly warm and humid all year.'",
      "Climate: 'Antarctica is a freezing cold desert.'"
    ],
    practice: [
      "Say if it's Weather or Climate: 'It might snow this weekend!'",
      "Say if it's Weather or Climate: 'Deserts are very dry and hot most of the year.'"
    ],
    answers: [
      "Weather!",
      "Climate!"
    ],
    funFact: "Earth's climate changes very slowly, but human activities like pollution and cutting down trees are causing 'Climate Change', which makes the earth warmer faster than normal.",
    quiz: [
      { question: "Which describes the condition of the atmosphere over a short period of time, like today or tomorrow?", options: ["A) Weather", "B) Climate", "C) Season"], answer: "A) Weather" },
      { question: "Which one is describing CLIMATE?", options: ["A) It is currently raining.", "B) The Philippines is a tropical country.", "C) We had a cloudy day yesterday."], answer: "B) The Philippines is a tropical country." },
      { question: "How long does it usually take to determine an area's climate?", options: ["A) A few days", "B) One week", "C) Around 30 years"], answer: "C) Around 30 years" }
    ]
  },
  "Grade 7-Mathematics-Linear Equations": {
    title: "Introduction to Linear Equations",
    explanation: "A linear equation is like a mathematical balance scale. What you do to one side of the equation, you MUST do to the other side to keep it balanced!\n\nWe usually have variables (like x or y) which represent unknown numbers. The goal is to isolate the variable on one side so we can find its value.",
    examples: [
      "Equation: x + 5 = 12",
      "To find x, we do the opposite of adding 5. We subtract 5 from BOTH sides.",
      "x + 5 (-5) = 12 (-5)",
      "x = 7"
    ],
    practice: [
      "Solve for m: m - 3 = 10",
      "Solve for y: y + 8 = 20",
      "Solve for a: 2a = 10"
    ],
    answers: ["m = 13", "y = 12", "a = 5"],
    funFact: "They are called 'linear' because if you graph all the possible answers (for equations with two variables like y = 2x), they create a perfectly straight line on a graph!",
    quiz: [
      { question: "What is the value of x in: x + 4 = 10?", options: ["A) 4", "B) 6", "C) 14"], answer: "B) 6" },
      { question: "What is the inverse (opposite) operation of addition?", options: ["A) Multiplication", "B) Subtraction", "C) Division"], answer: "B) Subtraction" },
      { question: "Solve for y: 3y = 15", options: ["A) 3", "B) 5", "C) 12"], answer: "B) 5" }
    ]
  },
  "Kinder-Mathematics-Counting Numbers 1-10": {
    title: "Counting Numbers 1-10",
    explanation: "Hello there little learner! Today we are going to embark on a magical counting adventure! Numbers are everywhere around us — from the toys in your room to the stars in the night sky. ⭐\n\nAre you ready to use your magical fingers? Counting helps us learn how many things we have. Let's count from 1 to 10 together, nice and loud!",
    examples: [
      "1 - One big bright sun in the sky! ☀️",
      "2 - Two cute little eyes to see the world! 👀",
      "3 - Three yummy red apples on a tree! 🍎",
      "4 - Four fast wheels on a zooming toy car! 🚗",
      "5 - Five wiggly fingers on your left hand! ✋",
      "6 - Six colorful building blocks to make a tower! 🧱",
      "7 - Seven beautiful colors in a glowing rainbow! 🌈",
      "8 - Eight squiggly legs on a friendly ocean octopus! 🐙",
      "9 - Nine bright balloons floating up in the air! 🎈",
      "10 - Ten tiny little toes on your feet! 👣"
    ],
    practice: [
      "Look down at your hands. How many fingers do you see in total? Try touching each one as you count!",
      "Can you jump up and down exactly 3 times like a bouncy bunny? 🐰",
      "Let's go on a scavenger hunt! Find 5 toys in your room and count them out loud.",
      "Clap your hands 7 times! 1, 2, 3, 4, 5, 6, 7! 👏"
    ],
    answers: [
      "You have 10 fingers! High ten!",
      "1... 2... 3 bunny jumps! Great job!",
      "1... 2... 3... 4... 5 toys lined up perfectly!",
      "7 loud claps!"
    ],
    funFact: "Did you know? You can count forward and even backward! When a rocket ship goes to space, they count backward: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1... BLAST OFF! 🚀",
    quiz: [
      {
        question: "How many suns are in the sky?",
        options: ["A) 3", "B) 1", "C) 5"],
        answer: "B) 1"
      },
      {
        question: "How many fingers do you have on ONE hand (without the other)?",
        options: ["A) 2", "B) 4", "C) 5"],
        answer: "C) 5"
      },
      {
        question: "Which number comes directly after 2?",
        options: ["A) 1", "B) 3", "C) 8"],
        answer: "B) 3"
      }
    ]
  },
  
  // KINDER - OTHER SUBJECTS
  "Kinder-English-The Alphabet": {
    title: "Learning the Alphabet (A, B, C)",
    explanation: "Hello superstar! Today we will step into the wonderful world of the ABCs! The English alphabet is a team of 26 magical letters.\n\nEvery single word you read, say, or write is made up of these amazing letters. Some are tall, some are small, and they all make different, funny sounds. Let's practice saying them together!",
    examples: [
      "Aa is for Apple! 🍎 - Aaaa! So crunchy and sweet.",
      "Bb is for Bear! 🐻 - Bbbb! A big, brown bear in the forest.",
      "Cc is for Cat! 🐱 - Cccc! Meow goes the soft little cat.",
      "Dd is for Dog! 🐶 - Dddd! Woof woof! A happy, playful puppy.",
      "Ee is for Elephant! 🐘 - Eeee! The biggest animal with a long trunk.",
      "Ff is for Fish! 🐟 - Ffff! Swimming swiftly in the ocean."
    ],
    practice: [
      "What letter comes right after A?",
      "Can you make the 'B' sound like bouncing a ball? B-B-B-Bounce!",
      "If 'C' makes a 'Cuh' sound, what animal starts with C?",
      "Sing the ABC song loudly with a big smile!"
    ],
    answers: [
      "The letter B!", 
      "B-b-b-b!", 
      "Cat, Camel, Cow, and Crab!",
      "♪ A-B-C-D-E-F-G... ♪"
    ],
    funFact: "The letter 'E' is the most commonly used letter in the whole English language! Look around; you'll see 'E' almost everywhere you look!",
    quiz: [
      { question: "What is the very first letter of the alphabet?", options: ["A) B", "B) Z", "C) A"], answer: "C) A" },
      { question: "Which animal starts with the letter 'D'?", options: ["A) Apple", "B) Dog", "C) Cat"], answer: "B) Dog" },
      { question: "What letter comes after C?", options: ["A) D", "B) B", "C) E"], answer: "A) D" }
    ]
  },
  "Kinder-Science-Our Five Senses": {
    title: "Our Five Super Senses!",
    explanation: "Did you know you have superpowers? It's true! Every human has 5 amazing 'super senses' that give our brains messages about the world around us.\n\nWithout them, we wouldn't know if a fire is hot, if a flower smells nice, or if ice cream tastes sweet. These senses use different parts of your face and body. Let's learn them all! 👁️👂👃👅🖐️",
    examples: [
      "Sight: We use our EYES to see the bright sunshine, colors, and our friends! ☀️👀",
      "Hearing: We use our EARS to listen to birds singing and our favorite music! 🎵👂",
      "Smell: We use our NOSE to smell a beautiful flower (or a stinky sock)! 🌸👃",
      "Taste: We use our TONGUE to taste yummy chocolate ice cream or sour lemons! 🍦👅",
      "Touch: We use our HANDS and skin to feel if a kitten is fluffy or a rock is hard! 🐈🖐️"
    ],
    practice: [
      "What part of your body do you use to watch your favorite cartoon?",
      "If mom bakes fresh cookies, which sense tells you they are ready before you even see them?",
      "Touch a pillow and then touch the floor. Which one is softer?",
      "What sense do you use to know if an apple is sweet or sour?"
    ],
    answers: [
      "Your eyes! (Sense of Sight) 👀", 
      "Your nose! (Sense of Smell) 👃", 
      "The pillow is softer! (Sense of Touch)",
      "Your tongue! (Sense of Taste) 👅"
    ],
    funFact: "Animals have super versions of our senses! Dogs have a sense of smell that is 100,000 times stronger than humans, and owls can see perfectly in the dark! 🦉",
    quiz: [
      { question: "Which body part do you use to smell a flower?", options: ["A) Ears", "B) Nose", "C) Mouth"], answer: "B) Nose" },
      { question: "We use our hands and our skin mainly to...", options: ["A) See", "B) Hear", "C) Touch and feel"], answer: "C) Touch and feel" },
      { question: "What sense tells you that a drum is making a loud drumming noise?", options: ["A) Hearing", "B) Sight", "C) Taste"], answer: "A) Hearing" }
    ]
  },
  "Kinder-Filipino-Mga Kulay": {
    title: "Mga Pangunahing Kulay (Colors)",
    explanation: "Magandang araw! Ngayon, pupunta tayo sa isang makulay na paglalakbay. Pag-aaralan natin ang mga kulay sa ating paligid.\n\nNapaisip ka na ba kung bakit makulay ang mundo? Kapag tumingin ka sa labas, may asul na langit, berdeng mga puno, at dilaw na araw! Tuklasin natin ang mga pangalan ng kulay sa wikang Filipino! 🌈",
    examples: [
      "Pula (Red) - Kulay ito ng umaapoy na bulkan at matamis na mansanas! 🍎",
      "Bughaw o Asul (Blue) - Ito ang kulay ng malawak na karagatan at maaliwalas na langit! 🌊",
      "Dilaw (Yellow) - Ito ang kulay ng mainit na araw at mga saging! ☀️🍌",
      "Luntian o Berde (Green) - Ito ang kulay ng maliliit na damo at malalaking puno! 🍃",
      "Kahel (Orange) - Kulay ng masarap na prutas na dalandan! 🍊",
      "Kayumanggi (Brown) - Kulay ng lupa at bark ng mga puno! 🪵"
    ],
    practice: [
      "Ano ang kulay ng malinaw na langit tuwing umaga?",
      "Kung titingnan mo ang isang hinog na saging, anong kulay nito?",
      "Ang firetruck at mga rosas ay kadalasang may anong kulay?",
      "Hanapin ang isang bagay sa inyong kwarto na kulay 'Luntian' or Berde."
    ],
    answers: [
      "Bughaw o Asul (Blue)", 
      "Dilaw (Yellow)", 
      "Pula (Red)",
      "Good job sa paghahanap ng berdeng bagay!"
    ],
    funFact: "Ang Pula, Bughaw, at Dilaw ay tinatawag na 'Mga Pangunahing Kulay' (Primary Colors). Mula sa tatlong kulay na ito, pwede mong gawin ang halos lahat ng kulay! Kapag pinaghalo mo ang Dilaw at Bughaw, magiging Luntian (Green) ito!",
    quiz: [
      { question: "Ano ang Tagalog ng kulay na 'Yellow'?", options: ["A) Pula", "B) Dilaw", "C) Bughaw"], answer: "B) Dilaw" },
      { question: "Anong kulay ang 'Red' sa Tagalog?", options: ["A) Dilaw", "B) Luntian", "C) Pula"], answer: "C) Pula" },
      { question: "Anong kulay ng manggang hindi pa hinog?", options: ["A) Luntian (Green)", "B) Bughaw", "C) Kayumanggi"], answer: "A) Luntian (Green)" }
    ]
  },
  "Kinder-Araling Panlipunan-Ang Aking Pamilya": {
    title: "Ang Aking Masayang Pamilya",
    explanation: "Kumusta, bata! Ang bawat bata ay mayroong kinabibilangang pamilya. Ang pamilya ay ang mga taong nagmamahal, nag-aalaga, at unang nagtuturo sa iyo ng magagandang asal.\n\nSila ang palagi mong kasama sa bahay, at sila ang pinakamahalagang grupo ng mga tao sa buong buhay natin! Kilalanin natin ang pangkat ng masayang pamilya! 👨‍👩‍👧‍👦❤️",
    examples: [
      "Tatay o Ama - Ang haligi ng tahanan. Siya ay masipag magtrabaho para sa pamilya at malakas na tagapagtanggol natin.",
      "Nanay o Ina - Ang ilaw ng tahanan. Siya ang masayang nag-aalaga, nagluluto ng pagkain, at nag-aaruga sa atin.",
      "Kuya - Ang nakatatandang kapatid na lalaki. Siya ay palaging nandiyan para kalaro at tumutulong satin.",
      "Ate - Ang nakatatandang kapatid na babae. Siya ay matalik nating kaibigan sa bahay na minsan ay tumutulong kay Nanay.",
      "Bunso - Ang pinakabata! Ikaw ba ang bunso? Ang bunso ay nagpapasaya sa lahat dahil sa kanyang kakulitan at cuteness!"
    ],
    practice: [
      "Sino ang tinatawag nating 'ilaw ng tahanan' na siyang nag-aaruga at nag-aalaga satin?",
      "Sino naman ang kumakayod at nagtatrabaho para sa mga pangangailangan ng pamilya (haligi ng tahanan)?",
      "Kung mayroon kang nakatatandang kapatid na babae, ano ang itatawag mo sa kanya?",
      "Bigyan ng isang napakahigpit na yakap at halik ang sinuman sa iyong pamilya ngayon!"
    ],
    answers: [
      "Ang ating minamahal na Nanay!",
      "Ang ating masipag na Tatay!",
      "Ate!",
      "Great job showing your true love to them!"
    ],
    funFact: "Ang bawat pamilya ay espesyal at iba-iba! May pamilya na napakalaki (kasama pati mga Lolo, Lola, Tito, at Tita sa iisang bahay), at mayroon din namang mas maliliit ngunit punong-puno ng pagmamahalan!",
    quiz: [
      { question: "Sino ang mga unang nagmamahal at nag-aalaga sayo sa bahay?", options: ["A) Ang mga pulis", "B) Ang doktor", "C) Ang aking pamilya"], answer: "C) Ang aking pamilya" },
      { question: "Ano ang madalas itawag sa nakatatandang kapatid na LALAKI?", options: ["A) Tatay", "B) Kuya", "C) Lolo"], answer: "B) Kuya" },
      { question: "Sino sa magkakapatid ang may pinakabatang edad?", options: ["A) Ang Bunso", "B) Si Kuya", "C) Si Ate"], answer: "A) Ang Bunso" }
    ]
  },

  // GRADE 1 - MATHEMATICS
  "Grade 1-Mathematics-Adding Numbers to 20": {
    title: "Adding Numbers up to 20",
    explanation: "Welcome to Grade 1 Math! Have you ever wondered what happens when we put groups of things together? That's called Addition! We use a special symbol called the plus sign (+) to show we are adding. Let's learn to add numbers up to 20 together! 🍎➕🍏",
    examples: [
      "1. 5 + 3 = 8 (If you have 5 apples and buy 3 more, you have 8 apples in total!)",
      "2. 10 + 5 = 15 (10 bright stars and 5 bright stars make 15 bright stars!)",
      "3. 12 + 7 = 19 (12 building blocks plus 7 more blocks equals 19 blocks!)",
      "4. 8 + 8 = 16 (8 slices of pizza plus 8 more slices is 16 slices!)",
      "5. 11 + 9 = 20 (11 colored pencils and 9 more make 20 pencils!)",
      "6. 14 + 2 = 16 (14 friendly frogs and 2 more frogs make 16 frogs!)",
      "7. 7 + 0 = 7 (If you add zero, the number stays exactly the same!)"
    ],
    practice: [
      "What is 6 + 4? Try using your fingers or drawing small circles to count!",
      "If you have 8 candies and your best friend gives you 5 more, how many candies do you have in total?",
      "Can you solve 13 + 5 in your head?",
      "What happens when you add 10 to a number like 4?"
    ],
    answers: [
      "10! Good job counting!", 
      "You have 13 candies now! Yummy!",
      "18!",
      "It becomes 14! Adding 10 is just putting a 1 in front of the number!"
    ],
    funFact: "The equal sign (=) was invented in 1557 by a Welsh mathematician named Robert Recorde. He was tired of writing 'is equal to' over and over again, so he just drew two identical flat lines!",
    quiz: [
      { question: "What is 7 + 5?", options: ["A) 11", "B) 12", "C) 13"], answer: "B) 12" },
      { question: "14 + 3 = ?", options: ["A) 17", "B) 16", "C) 18"], answer: "A) 17" },
      { question: "If you have 9 toys and buy 9 more, how many do you have?", options: ["A) 18", "B) 19", "C) 20"], answer: "A) 18" },
      { question: "What is 15 + 5?", options: ["A) 15", "B) 25", "C) 20"], answer: "C) 20" },
      { question: "Which number sentence is right?", options: ["A) 10 + 2 = 12", "B) 8 + 3 = 10", "C) 5 + 5 = 11"], answer: "A) 10 + 2 = 12" }
    ]
  },
  "Grade 1-Mathematics-Subtracting to 20": {
    title: "Subtracting Numbers up to 20",
    explanation: "Now that we know how to add, let's learn how to take away! Subtraction means removing things from a group. We use a special symbol called the minus sign (-) to show we are subtracting. Let's see what is left over! 🎈➖📍",
    examples: [
      "1. 10 - 2 = 8 (You have 10 balloons, and POP! 2 fly away. You have 8 left!)",
      "2. 15 - 5 = 10 (You bake 15 cookies, and your family eats 5. Only 10 are left!)",
      "3. 18 - 6 = 12 (There are 18 birds resting on a tree branch, and 6 fly up to the sky. 12 birds stay.)",
      "4. 20 - 10 = 10 (If you have 20 pesos and spend 10 pesos, you have 10 pesos left.)",
      "5. 13 - 3 = 10 (Taking away the ones leaves you with just the ten!)",
      "6. 9 - 9 = 0 (If you take away everything, you have zero left!)",
      "7. 16 - 4 = 12 (Counting backward: 15, 14, 13, 12!)"
    ],
    practice: [
      "What is 9 - 4? Try holding up 9 fingers and hiding 4 of them.",
      "You have 15 shiny stickers, and you give 3 to a good friend. How many do you have now?",
      "Can you count backward to solve 17 - 2?",
      "What is 12 minus 0?"
    ],
    answers: [
      "5! Look at your hand!", 
      "You have 12 stickers left!",
      "17... 16... 15! The answer is 15.",
      "Still 12! Taking away zero does nothing."
    ],
    funFact: "Did you know that subtracting is just counting backwards? If you start at number 10 and count back 3 times (9, 8, 7), you'll land perfectly on 7!",
    quiz: [
      { question: "What is 12 - 4?", options: ["A) 8", "B) 9", "C) 7"], answer: "A) 8" },
      { question: "19 - 8 = ?", options: ["A) 10", "B) 11", "C) 12"], answer: "B) 11" },
      { question: "If I have 15 candies and eat 5 of them, how many are left?", options: ["A) 5", "B) 10", "C) 15"], answer: "B) 10" },
      { question: "20 - 5 equals?", options: ["A) 10", "B) 25", "C) 15"], answer: "C) 15" },
      { question: "What is 8 - 0?", options: ["A) 0", "B) 8", "C) 80"], answer: "B) 8" }
    ]
  },
  "Grade 1-Mathematics-Place Value": {
    title: "Place Value: Tens and Ones",
    explanation: "As numbers get bigger and bigger, we need a smart way to count them! Place value helps us understand giant numbers. A big number can be broken into 'Tens' (groups of 10 tied together) and 'Ones' (the single leftovers). Let's pack some boxes of ten! 📦🍬",
    examples: [
      "1. The number 14 means we have 1 group of Ten, and 4 extra Ones.",
      "2. The number 25 means we have 2 whole groups of Ten, and 5 extra Ones.",
      "3. The number 30 means we have 3 groups of Ten, and exactly 0 extra Ones.",
      "4. The number 19 is 1 Ten and 9 Ones.",
      "5. The number 42 means 4 Tens and 2 Ones.",
      "6. The number 5 is just 0 Tens and 5 Ones!"
    ],
    practice: [
      "How many Tens and how many Ones make up the number 18?",
      "What magic number is made of 2 Tens and 3 Ones?",
      "If I have 3 boxes of 10 pencils, how many pencils do I have?",
      "What number has 1 Ten and 0 Ones?"
    ],
    answers: [
      "1 Ten and 8 Ones!", 
      "The number 23!",
      "30 pencils!",
      "The number 10!"
    ],
    funFact: "Every single time we get 10 'Ones', they group together and magically transform into 1 'Ten'! It's like putting 10 loose candies into a small box.",
    quiz: [
      { question: "The number 16 has how many Tens?", options: ["A) 6", "B) 1", "C) 16"], answer: "B) 1" },
      { question: "What number is exactly 3 Tens and 4 Ones?", options: ["A) 43", "B) 34", "C) 7"], answer: "B) 34" },
      { question: "How many ones are in the number 28?", options: ["A) 2", "B) 8", "C) 28"], answer: "B) 8" },
      { question: "If you have 2 Tens, what number is that?", options: ["A) 2", "B) 20", "C) 12"], answer: "B) 20" },
      { question: "What digit is in the tens place in the number 45?", options: ["A) 4", "B) 5", "C) 0"], answer: "A) 4" }
    ]
  },
  "Grade 1-Mathematics-Halves and Quarters": {
    title: "Fractions: Halves and Quarters",
    explanation: "Do you like sharing your snacks? A fraction is a piece of a whole! When we share things equally so that everyone gets the exact same size, we make fractions like halves and quarters. 🍕🍰",
    examples: [
      "1. One Half (1/2): Cutting a pizza straight down the middle into 2 equal pieces.",
      "2. One Quarter (1/4): Cutting a birthday cake into 4 equal pieces.",
      "3. Two Halves make one Whole! (Put the two pizza halves back together).",
      "4. Four Quarters make one Whole! (Four cake slices make the whole cake).",
      "5. If you fold a square paper in half, you get two rectangles.",
      "6. If you cut an apple into halves, you can share it with 1 friend."
    ],
    practice: [
      "If you cut a juicy apple into 2 equal pieces, what is one piece called?",
      "How many quarters do you need to make a whole circle?",
      "If you share a chocolate bar with 3 friends (4 of you total), what fraction does everyone get?",
      "Which is bigger: 1 whole pizza or 1 half of a pizza?"
    ],
    answers: [
      "One half (1/2)", 
      "Four quarters (4/4)!",
      "One quarter (1/4) each!",
      "1 whole pizza is definitely bigger!"
    ],
    funFact: "The word 'fraction' comes from the old Latin word 'fractio', which actually means 'to break'! When you make a fraction, you are breaking the whole thing into parts.",
    quiz: [
      { question: "What do you call one of 4 equal parts?", options: ["A) Half", "B) Whole", "C) Quarter"], answer: "C) Quarter" },
      { question: "Two halves equal a...", options: ["A) Whole", "B) Quarter", "C) Three"], answer: "A) Whole" },
      { question: "If you cut a shape into two equal pieces, each piece is a...", options: ["A) Quarter", "B) Half", "C) Third"], answer: "B) Half" },
      { question: "How many quarters make up one whole?", options: ["A) 2", "B) 3", "C) 4"], answer: "C) 4" },
      { question: "Which fraction is bigger?", options: ["A) One Half", "B) One Quarter", "C) They are the same"], answer: "A) One Half" }
    ]
  },
  "Grade 1-Mathematics-Telling Time": {
    title: "Telling Time (O'clock & Half Past)",
    explanation: "Tick-tock, tick-tock! Let's learn how to read an analog clock! The short hand on the clock tells the HOUR, and the long hand tells the MINUTE. Knowing time helps us know when it's time to play, and when it's time to sleep! ⏰🕰️",
    examples: [
      "1. O'clock: When the LONG hand points straight up pointing to 12. If the short hand is on 3, it's exactly 3:00.",
      "2. Half past: When the LONG hand points straight down pointing to 6 (it has went halfway around). If short hand is just past 4, it's 4:30.",
      "3. 8:00 (Eight o'clock) - Time for school! Short hand on 8, long hand on 12.",
      "4. 12:00 (Twelve o'clock) - Lunch time! Both the long and short hand are pointing at 12.",
      "5. 7:30 (Half past seven) - Almost bed time! Long hand on 6, short hand between 7 and 8."
    ],
    practice: [
      "Where is the long minute hand pointing at exactly 5:00?",
      "What time is it when the short hand is between 2 and 3, and the long hand is pointing straight down on 6?",
      "If both hands of the clock are pointing at the number 12, what time is it?",
      "Where does the minute hand go for 'half past'?"
    ],
    answers: [
      "Pointing straight up at the 12!", 
      "Half past 2 (or 2:30)!",
      "It is 12:00 (Twelve o'clock)!",
      "Pointing straight down at the 6!"
    ],
    funFact: "Did you know that the hands on all clocks always move to the right in a circle? Because of this, we call moving to the right in a circle 'clockwise'!",
    quiz: [
      { question: "O'clock means the long hand points to which number?", options: ["A) 6", "B) 12", "C) 3"], answer: "B) 12" },
      { question: "Half past means the long hand points to...", options: ["A) 6", "B) 12", "C) 9"], answer: "A) 6" },
      { question: "What hand tells us the hour?", options: ["A) The long hand", "B) The short hand", "C) The red hand"], answer: "B) The short hand" },
      { question: "If it is 4:00, where is the SHORT hand pointing?", options: ["A) 12", "B) 6", "C) 4"], answer: "C) 4" },
      { question: "If it is half past 9, what time does the clock say?", options: ["A) 9:00", "B) 9:30", "C) 8:30"], answer: "B) 9:30" }
    ]
  },

  // GRADE 2 - MATHEMATICS
  "Grade 2-Mathematics-Addition Regrouping": {
    title: "Addition with Regrouping",
    explanation: "Welcome to Grade 2! Do you remember how to add? Sometimes when we add the 'Ones' together, they make 10 or more! We can't put two numbers in the 'Ones' place, so we have to 'regroup' or 'carry over' that extra 10 to the Tens column! Let's be Math Superheroes! 🦸‍♂️➕",
    examples: [
      "1. 15 + 17: First, add the ones (5 + 7 = 12). Write down the 2, and carry over the 1 ten! Now add the tens: 1 + 1 + 1 = 3. The answer is 32!",
      "2. 28 + 14: Add the ones (8 + 4 = 12). Write 2, carry over the 1. Now the tens: 2 + 1 + 1 (the one you carried) = 4 tens! Total: 42.",
      "3. 36 + 25: 6 + 5 = 11. Write 1, carry 1. Tens: 3 + 2 + 1 (carried) = 6. Total: 61.",
      "4. 49 + 13: 9 + 3 = 12. Write 2, carry 1. Tens: 4 + 1 + 1 = 6. Total: 62.",
      "5. 75 + 16: 5 + 6 = 11. Write 1, carry 1. Tens: 7 + 1 + 1 = 9. Total: 91."
    ],
    practice: [
      "Try solving 36 + 15 on a piece of paper. Don't forget to carry the 1!",
      "If you have 48 marbles and get 25 more, how many do you have in total?",
      "Add the numbers: 57 + 24.",
      "What is 89 + 12?"
    ],
    answers: [
      "51! You carried the 1 perfectly!",
      "73 marbles! Wow, that's a lot!",
      "81! Great job adding!",
      "101! You just crossed into the hundreds!"
    ],
    funFact: "Carrying numbers allowed the ancient humans to build super tall pyramids and big buildings by making sure all the heavy weights added up perfectly!",
    quiz: [
      { question: "What is 27 + 14?", options: ["A) 31", "B) 41", "C) 51"], answer: "B) 41" },
      { question: "19 + 23 = ?", options: ["A) 42", "B) 32", "C) 41"], answer: "A) 42" },
      { question: "When you add 8 + 5, what number do you carry over to the tens place?", options: ["A) 8", "B) 5", "C) 1"], answer: "C) 1" },
      { question: "If you have 35 and add 26, the answer is:", options: ["A) 51", "B) 61", "C) 71"], answer: "B) 61" },
      { question: "What is 78 + 14?", options: ["A) 92", "B) 82", "C) 91"], answer: "A) 92" }
    ]
  },
  "Grade 2-Mathematics-Subtraction Regrouping": {
    title: "Subtraction with Regrouping (Borrowing)",
    explanation: "When you try to subtract a number, but the top number in the 'Ones' place is too small, what do you do? You borrow 1 Ten from your neighbor in the Tens column! It's like borrowing sugar from your neighbor! 🏃‍♂️💨",
    examples: [
      "1. 32 - 15: 2 is too small to subtract 5. Borrow 1 ten from the 3 (it becomes 2). Now the ones becomes 12. 12 - 5 = 7. Tens: 2 - 1 = 1. Total: 17.",
      "2. 54 - 28: 4 is too small. Borrow from 5 (it becomes 4). 14 - 8 = 6. Tens: 4 - 2 = 2. Total: 26.",
      "3. 41 - 19: Borrow from 4 (it becomes 3). 11 - 9 = 2. Tens: 3 - 1 = 2. Total: 22.",
      "4. 83 - 46: Borrow from 8 (becomes 7). 13 - 6 = 7. Tens: 7 - 4 = 3. Total: 37.",
      "5. 70 - 25: You can't subtract 5 from 0! Borrow from 7 (becomes 6). 10 - 5 = 5. Tens: 6 - 2 = 4. Total: 45."
    ],
    practice: [
      "What is 45 - 18? Don't forget to cross out the 4 and make it a 3!",
      "You have 62 shiny coins and spend 29. How many are left?",
      "Solve this on your paper: 50 - 17.",
      "What is 91 - 34?"
    ],
    answers: [
      "27!",
      "33 coins left!",
      "33!",
      "57!"
    ],
    funFact: "Borrowing is also called 'renaming' by some teachers because you literally rename 1 Ten into 10 Ones to make subtracting easier!",
    quiz: [
      { question: "To solve 41 - 15, we borrow from the 4 to make the 1 into a...", options: ["A) 11", "B) 10", "C) 12"], answer: "A) 11" },
      { question: "43 - 26 = ?", options: ["A) 17", "B) 27", "C) 16"], answer: "A) 17" },
      { question: "What is 80 - 35?", options: ["A) 55", "B) 45", "C) 50"], answer: "B) 45" },
      { question: "When you compute 52 - 18, what do you borrow from?", options: ["A) The 2", "B) The 8", "C) The 5"], answer: "C) The 5" },
      { question: "What is 74 - 29?", options: ["A) 45", "B) 55", "C) 35"], answer: "A) 45" }
    ]
  },
  "Grade 2-Mathematics-Intro to Multiplication": {
    title: "Getting into Multiplication",
    explanation: "Are you ready for a shortcut? Multiplication is a super-fast way to add the EXACT SAME number over and over again! We use an 'x' sign for it. It just means 'groups of'. Let's unlock this math secret! 🌟✖️",
    examples: [
      "1. '3 x 2' means 3 groups of 2. (2 + 2 + 2 = 6)",
      "2. '4 x 5' means 4 groups of 5. (5 + 5 + 5 + 5 = 20)",
      "3. '2 x 10' means 2 groups of 10. (10 + 10 = 20)",
      "4. '5 x 2' means 5 groups of 2. (2+2+2+2+2 = 10)",
      "5. '1 x 8' means just 1 group of 8. The answer is still 8!"
    ],
    practice: [
      "How do you write '2 groups of 4' using a multiplication sign?",
      "What is 3 x 3? (Hint: 3 + 3 + 3)",
      "If you have 4 boxes and each box has 2 toys, how many toys do you have?",
      "What is 5 groups of 1?"
    ],
    answers: [
      "2 x 4 !",
      "9!",
      "8 toys! (4 x 2 = 8)",
      "5! (1+1+1+1+1 = 5)"
    ],
    funFact: "Any number multiplied by 1 stays the exact same (100 x 1 = 100). And any number multiplied by 0 always turns into 0! (1,000,000 x 0 = 0)!",
    quiz: [
      { question: "4 x 2 is the EXACT SAME as...", options: ["A) 4 + 2", "B) 2 + 2 + 2 + 2", "C) 4 + 4 + 4"], answer: "B) 2 + 2 + 2 + 2" },
      { question: "What is 5 x 3?", options: ["A) 15", "B) 8", "C) 10"], answer: "A) 15" },
      { question: "What does '3 x 10' mean?", options: ["A) 3 + 10", "B) 3 groups of 10", "C) 10 times 10 times 10"], answer: "B) 3 groups of 10" },
      { question: "What is 2 x 6?", options: ["A) 8", "B) 10", "C) 12"], answer: "C) 12" },
      { question: "If I have 0 groups of 5 (0 x 5), how much do I have?", options: ["A) 5", "B) 0", "C) 50"], answer: "B) 0" }
    ]
  },
  "Grade 2-Mathematics-Measuring": {
    title: "Measuring Length (cm and m)",
    explanation: "How long is your pencil? How tall is your house? We measure how long or tall things are using Centimeters (cm) for small things, and Meters (m) for big things! Let's get out our rulers! 📏🏡",
    examples: [
      "1. A new pencil is about 15 centimeters (cm) long.",
      "2. A real family car is about 4 meters (m) long.",
      "3. 1 whole meter is equal to exactly 100 centimeters!",
      "4. Your eraser is probably only 4 or 5 centimeters (cm) long.",
      "5. A swimming pool could be 10 meters (m) long."
    ],
    practice: [
      "Would you measure a tiny ant using centimeters(cm) or meters(m)?",
      "How many centimeters are exactly in 2 meters?",
      "Would you measure the length of a soccer field in cm or m?",
      "If a stick is 50 cm long, and you put another 50 cm stick next to it, how long is it total?"
    ],
    answers: [
      "Centimeters (cm) of course!",
      "200 centimeters! (100 + 100)",
      "Meters (m) because it is very big!",
      "100 cm (which is the same as 1 meter!)"
    ],
    funFact: "The longest insect in the whole world is a giant stick insect that can grow to be over 60 centimeters long! That's longer than a typical ruler!",
    quiz: [
      { question: "What is the BEST way to measure a small textbook?", options: ["A) Meters", "B) Centimeters", "C) Kilometers"], answer: "B) Centimeters" },
      { question: "100 cm is perfectly equal to...", options: ["A) 1 Meter", "B) 10 Meters", "C) 2 Meters"], answer: "A) 1 Meter" },
      { question: "Are meters used for big things or small things?", options: ["A) Big things", "B) Small things", "C) Microscopic things"], answer: "A) Big things" },
      { question: "What does 'cm' stand for?", options: ["A) Centimajors", "B) Centimeters", "C) Cool meters"], answer: "B) Centimeters" },
      { question: "If a door is 2 meters tall, how many centimeters is that?", options: ["A) 20 cm", "B) 200 cm", "C) 100 cm"], answer: "B) 200 cm" }
    ]
  },

  // GRADE 2 - OTHER SUBJECTS
  "Grade 2-English-Adjectives": {
    title: "Describing Words (Adjectives)",
    explanation: "Welcome to Grade 2 English! Do you want to learn how to paint a picture using only words? Adjectives are special describing words! They tell us how a Noun looks, feels, tastes, or sounds. Without adjectives, sentences are very boring. Let's make them exciting! 🎨📝",
    examples: [
      "1. The apple is RED and SWEET. (The words 'red' and 'sweet' describe the apple).",
      "2. The FLUFFY dog barked loudly. (The word 'fluffy' describes how the dog feels).",
      "3. I saw a HUGE, SCARY monster! ('Huge' and 'scary' describe the monster).",
      "4. My hands are COLD. ('Cold' describes the hands).",
      "5. I love eating SALTY popcorn. ('Salty' describes how the popcorn tastes)."
    ],
    practice: [
      "Can you find the adjective in this sentence: 'The giant elephant drank water.'",
      "Think of two adjectives you could use to describe ice cream!",
      "If you see a bright star, what is the adjective?",
      "Add an adjective to this sentence: 'The ___ cat slept.'"
    ],
    answers: [
      "The adjective is 'Giant'!",
      "Maybe 'Cold', 'Sweet', 'Yummy', or 'Soft'!",
      "The adjective is 'bright'!",
      "The 'lazy' cat slept! (Or black cart, cute cat...)"
    ],
    funFact: "You can stack many adjectives together! Like a 'big, scary, green' alien! But fun fact: in English, there's secretly an invisible rule for the exact order you MUST put them in (Opinion, Size, Age, Shape, Color)!",
    quiz: [
      { question: "Which of these words is an Adjective?", options: ["A) Run", "B) Happy", "C) Boy"], answer: "B) Happy" },
      { question: "Find the adjective in: 'The hot sun shines.'", options: ["A) Sun", "B) Shines", "C) Hot"], answer: "C) Hot" },
      { question: "What does an adjective do?", options: ["A) It names a place", "B) It describes a noun", "C) It is an action word"], answer: "B) It describes a noun" },
      { question: "Which word describes how something tastes?", options: ["A) Blue", "B) Huge", "C) Sour"], answer: "C) Sour" },
      { question: "If someone tells you a joke, you would describe it as...", options: ["A) Funny", "B) Square", "C) Rough"], answer: "A) Funny" }
    ]
  },
  "Grade 2-Science-Animals and Habitats": {
    title: "Animals and Their Habitats",
    explanation: "Let's explore the planet in Grade 2 Science! A 'Habitat' is the natural home or environment of an animal, plant, or other organism. It provides the animal with food, water, and a safe place to sleep and raise their babies! Different animals are built for different habitats. 🌍🦁",
    examples: [
      "1. Ocean: A massive saltwater habitat. Sharks, whales, octopuses, and colorful fish live here.",
      "2. Forest: Filled with trees and shade. Bears, deer, owls, and foxes call the forest home.",
      "3. Desert: Very hot and dry with lots of sand! Camels, rattlesnakes, and scorpions live here.",
      "4. Jungle or Rainforest: Wet, warm, and crowded with life! Monkeys, parrots, and tigers live here.",
      "5. Arctic (Polar): Freezing cold and covered in ice! Polar bears, penguins, and seals love the ice."
    ],
    practice: [
      "If you are a fish, which habitat is your home?",
      "Where would you go to find a camel?",
      "Why does a polar bear live in the Arctic and not the Desert?",
      "What kind of animals might you see hiding in a forest tree?"
    ],
    answers: [
      "The Ocean! (Or a lake/river).",
      "The hot, dry Desert!",
      "Because it has thick fur to stay warm in the freezing cold. It would overheat in a desert!",
      "Birds, squirrels, or monkeys!"
    ],
    funFact: "Camels have thick eyelashes and can close their nostrils to keep the desert sand out of their eyes and nose during a giant sandstorm!",
    quiz: [
      { question: "What is a habitat?", options: ["A) An animal's natural home", "B) A type of food", "C) A spaceship"], answer: "A) An animal's natural home" },
      { question: "Which animal lives in an Ocean habitat?", options: ["A) Bear", "B) Shark", "C) Camel"], answer: "B) Shark" },
      { question: "Where do Polar Bears live?", options: ["A) The tropical Rainforest", "B) The freezing Arctic", "C) The hot Desert"], answer: "B) The freezing Arctic" },
      { question: "A Forest is a habitat full of...", options: ["A) Sand", "B) Ice", "C) Trees"], answer: "C) Trees" },
      { question: "Why do animals need a habitat?", options: ["A) For shoes", "B) For food, water, and shelter", "C) To play video games"], answer: "B) For food, water, and shelter" }
    ]
  },
  "Grade 2-Filipino-Pangngalan": {
    title: "Pangngalan (Nouns sa Filipino)",
    explanation: "Magandang araw uli! Ngayon ay pag-aaralan natin ang 'Pangngalan'. Ito ay ang mga salitang tumutukoy o nagpapangalan sa isang Tao, Bagay, Hayop, Pook (Lugar), o Pangyayari. Katumbas ito ng 'Noun' sa Ingles. Tara't alamin ang mga bahagi nito! 🇵🇭🌟",
    examples: [
      "1. Tao (Person): Nanay, Guro, Pulis, Nars, Lolo, Bata.",
      "2. Bagay (Thing): Lapis, Papel, Sapatos, Salamin, Upuan.",
      "3. Hayop (Animal): Kalabaw, Pusa, Aso, Ibon, Isda.",
      "4. Pook/Lugar (Place): Paaralan, Palengke, Bahay, Simbahan, Parke.",
      "5. Pangyayari (Event): Kaarawan (Birthday), Pasko, Pista, Bagong Taon."
    ],
    practice: [
      "Ang salitang 'Palengke' ay isang pangngalan para sa anong kategorya?",
      "Magbigay ng isang pangngalan na tumutukoy sa 'Tao'.",
      "Anong hayop ang tumatahol? Ito ay isang halimbawa ng pangngalan para sa Hayop.",
      "Sa anong pangyayari tayo nagbubukas ng regalo mula kay Santa Claus?"
    ],
    answers: [
      "Ito ay tumutukoy sa Pook o Lugar!",
      "Tatay, Kapatid, o Doktor!",
      "Aso!",
      "Tuwing Pasko!"
    ],
    funFact: "Nahahati ang pangngalan sa dalawa: Pantangi (Tiyak na ngalan at nagsisimula sa malaking letra tulad ng 'Juan') at Pambalana (Karaniwang ngalan tulad ng 'bata').",
    quiz: [
      { question: "Ang salitang 'Pusa' ay isang halimbawa ng pangngalang tumutukoy sa...", options: ["A) Bagay", "B) Hayop", "C) Pook"], answer: "B) Hayop" },
      { question: "Alin sa mga ito ang pangngalan na tumutukoy sa TAO?", options: ["A) Guro", "B) Papel", "C) Pasko"], answer: "A) Guro" },
      { question: "Ang 'Paaralan' ay pangngalan para sa...", options: ["A) Hayop", "B) Tao", "C) Pook o Lugar"], answer: "C) Pook o Lugar" },
      { question: "Alin sa mga sumusunod ang tumutukoy sa PANGYAYARI?", options: ["A) Kaarawan", "B) Lapis", "C) Aso"], answer: "A) Kaarawan" },
      { question: "Ang salitang sasakyan (car) ay anong uri ng pangngalan?", options: ["A) Tao", "B) Bagay", "C) Pangyayari"], answer: "B) Bagay" }
    ]
  },
  "Grade 2-Araling Panlipunan-Ang Aking Komunidad": {
    title: "Ang Aking Komunidad",
    explanation: "Maligayang pagdating sa Grade 2 Araling Panlipunan! Ngayon, pag-aaralan natin ang tungkol sa 'Komunidad'. Ang komunidad ay binubuo ng pangkat ng mga tao na naninirahan sa iisang lugar at nagtutulungan. Dito tayo nag-aaral, naglalaro, at namumuhay nang masaya! 🏘️🤝",
    examples: [
      "1. Pamilya: Ang pinakamaliit na bahagi ng komunidad. Dito nagsisimula ang lahat.",
      "2. Paaralan (School): Dito pumupunta ang mga mag-aaral upang matuto magbasa at magsulat kasama ang mga guro.",
      "3. Ospital o Health Center: Dito gumagamot ng mga may sakit ang mga doktor at nars.",
      "4. Simbahan o Pook Sambahan: Dito sama-samang nagdarasal ang mga tao.",
      "5. Pamilihan o Palengke: Dito tayo bumibili ng ating makakain at mga damit.",
      "6. Barangay Hall: Dito tumatakbo ang Kapitan para panatilihin ang kapayapaan at tulungan ang mga tao."
    ],
    practice: [
      "Kung ikaw ay may matinding lagnat at ubo, saang bahagi ng komunidad ka dapat pumunta?",
      "Saan mo binibili ang mga sariwang gulay at isda?",
      "Anong lugar sa komunidad ang pinupuntahan mo upang matuto ng iba't ibang sagot sa mga tanong?",
      "Sino ang namumuno sa ating pamahalaang pambarangay?"
    ],
    answers: [
      "Sa Ospital o Health Center upang magpagamot!",
      "Sa Pamilihan o Palengke!",
      "Sa ating Paaralan!",
      "Ang Kapitan ng Barangay!"
    ],
    funFact: "Ang pagtutulungan ng mga kapitbahay at tao sa isang komunidad para maayos ang isang problema (tulad ng pagbubuhat ng bahay kubo) ay tinatawag nating 'Bayanihan' sa Pilipinas!",
    quiz: [
      { question: "Saan kadalasang nagkikita-kita ang mga bata at guro upang mag-aral?", options: ["A) Sa Ospital", "B) Sa Paaralan", "C) Sa Palengke"], answer: "B) Sa Paaralan" },
      { question: "Sino ang nag-aalaga sa mga taong may sakit sa komunidad?", options: ["A) Doktor at Nars", "B) Pulis at Bumbero", "C) Tindero at Tindera"], answer: "A) Doktor at Nars" },
      { question: "Anong tawag sa pangkat ng mga taong naninirahan sa iisang pook na nagtutulungan?", options: ["A) Komunidad", "B) Kaaway", "C) Turista"], answer: "A) Komunidad" },
      { question: "Saan ka pupunta upang bumili ng bigas at ulam?", options: ["A) Simbahan", "B) Paaralan", "C) Palengke"], answer: "C) Palengke" },
      { question: "Ang Kapitan ng Barangay ay makikita natin sa...", options: ["A) Barangay Hall", "B) Hospital Delivery Room", "C) Loob ng eskwelahan"], answer: "A) Barangay Hall" }
    ]
  },

  // GRADE 3 - MATHEMATICS
  "Grade 3-Mathematics-Multiplication and Division": {
    title: "Multiplication and Division",
    explanation: "Welcome to Grade 3 Math! Are you ready to become a math ninja? Multiplication is a fast way of adding the same number over and over again, while Division is exactly the opposite—it's all about sharing things equally! Let's master these super skills! 🥷✖️➗",
    examples: [
      "1. 5 x 4 = 20 (Imagine 5 boxes, and each box has 4 delicious donuts! You have 20 donuts in total!)",
      "2. 7 x 3 = 21 (If 7 bright stars each have 3 points, there are 21 points altogether!)",
      "3. 9 x 4 = 36 (9 groups of 4 cool cars make 36 cars!)",
      "4. 12 ÷ 3 = 4 (If you have 12 slices of pizza and share them equally among 3 friends, everyone gets 4 slices! Yum!)",
      "5. 20 ÷ 5 = 4 (20 shiny coins shared with 5 kids means 4 coins each!)",
      "6. 8 x 8 = 64 (A chessboard has 8 rows of 8 squares, which makes 64 squares in total!)",
      "7. 100 ÷ 10 = 10 (If you divide 100 candies into 10 bags, each bag gets 10 candies!)"
    ],
    practice: [
      "If you buy 6 packs of pencils, and each pack has 5 pencils, how many pencils do you have?",
      "If you have 24 apples and you want to put them into 4 baskets equally, how many apples go in each basket?",
      "What is 9 x 6?",
      "Can you figure out what 35 ÷ 7 is?"
    ],
    answers: [
      "You have 30 pencils! (6 x 5 = 30)",
      "6 apples in each basket! (24 ÷ 4 = 6)",
      "54! Excellent multiplication!",
      "5! Because 5 x 7 is 35."
    ],
    funFact: "Did you know you can use your 10 fingers to easily multiply by 9? To find 9x4, put down your 4th finger. You'll see 3 fingers on the left and 6 on the right. The answer is 36!",
    quiz: [
      { question: "What is 8 x 5?", options: ["A) 35", "B) 40", "C) 45"], answer: "B) 40" },
      { question: "If you share 18 cookies among 3 friends, how many does each friend get?", options: ["A) 5", "B) 6", "C) 7"], answer: "B) 6" },
      { question: "What is 7 x 7?", options: ["A) 49", "B) 42", "C) 56"], answer: "A) 49" },
      { question: "Calculate 30 ÷ 5.", options: ["A) 5", "B) 7", "C) 6"], answer: "C) 6" },
      { question: "Which equation is correct?", options: ["A) 4 x 4 = 15", "B) 20 ÷ 4 = 4", "C) 6 x 3 = 18"], answer: "C) 6 x 3 = 18" }
    ]
  },
  "Grade 3-Mathematics-Intro to Division": {
    title: "Introduction to Division",
    explanation: "Division is sharing equally! We use the division sign (÷). It's the opposite of multiplication! 🍕➗",
    examples: [
      "12 ÷ 3 = 4 (12 candies shared among 3 kids means 4 candies each!)",
      "20 ÷ 5 = 4 (20 pencils shared among 5 kids means 4 pencils each!)"
    ],
    practice: [
      "If you have 15 apples and 3 baskets, how many apples go in each basket?",
      "What is 16 ÷ 4?"
    ],
    answers: ["5 apples per basket", "4"],
    funFact: "Division is the only math operation where you CANNOT switch the numbers. 10 ÷ 2 is not the same as 2 ÷ 10!",
    quiz: [
      { question: "What is 18 ÷ 2?", options: ["A) 8", "B) 9", "C) 10"], answer: "B) 9" },
      { question: "24 cookies shared with 4 friends:", options: ["A) 6 each", "B) 8 each", "C) 5 each"], answer: "A) 6 each" }
    ]
  },
  "Grade 3-Mathematics-Fraction Number Line": {
    title: "Fractions on a Number Line",
    explanation: "Fractions aren't just shapes, they live on the Number Line between 0 and 1! ✨📏",
    examples: [
      "If you divide the line between 0 and 1 into 4 jumps, the first jump is 1/4.",
      "The next is 2/4, then 3/4, then 4/4 (which is exactly 1!)"
    ],
    practice: [
      "What comes right after 1/3 on a number line divided into thirds?",
      "Is 2/4 right in the middle of 0 and 1?"
    ],
    answers: ["2/3", "Yes, 2/4 is the exact same as 1/2!"],
    funFact: "Fractions that represent the same spot (like 1/2 and 2/4 and 3/6) are called 'Equivalent Fractions'.",
    quiz: [
      { question: "Which comes first on the number line?", options: ["A) 3/4", "B) 1/4", "C) 4/4"], answer: "B) 1/4" },
      { question: "What fraction is exactly at the middle of 0 and 1?", options: ["A) 1/3", "B) 1/2", "C) 1/4"], answer: "B) 1/2" }
    ]
  },
  "Grade 3-Mathematics-Area and Perimeter": {
    title: "Area and Perimeter",
    explanation: "Perimeter is the distance AROUND a shape. Area is the space INSIDE the shape! 🔲📐",
    examples: [
      "Perimeter: Add all the outside sides. A square with sides of 5cm has perimeter = 5+5+5+5 = 20cm.",
      "Area: Length times Width (L x W). That same square's area is 5 x 5 = 25 square cm!"
    ],
    practice: [
      "What is the perimeter of a rectangle with length 4 and width 2?",
      "What is the area of a rectangle with length 7 and width 3?"
    ],
    answers: ["12 (4+4+2+2)", "21 (7 x 3)"],
    funFact: "If you want to build a fence, you measure perimeter. If you want to paint a wall, you measure area!",
    quiz: [
      { question: "Which one measures the INSIDE space?", options: ["A) Perimeter", "B) Area", "C) Length"], answer: "B) Area" },
      { question: "Area of a 4x4 square?", options: ["A) 16", "B) 8", "C) 12"], answer: "A) 16" }
    ]
  },
  "Grade 3-Mathematics-Data and Graphs": {
    title: "Data and Bar Graphs",
    explanation: "A Bar Graph is a cool picture that shows us how many of each thing we have using tall bars! 📊📈",
    examples: [
      "If 5 kids like dogs, the 'Dog' bar goes up to number 5.",
      "If 8 kids like cats, the 'Cat' bar goes up to number 8."
    ],
    practice: [
      "If an Apple bar is on 10, and a Banana bar is on 4, how many more kids like Apples?",
      "Look at a graph with 'Red: 6' and 'Blue: 5'. What is the most popular color?"
    ],
    answers: ["6 more kids (10 - 4 = 6)", "Red"],
    funFact: "Graphs make it super easy for our brains to spot patterns without doing any math!",
    quiz: [
      { question: "A tall bar on a graph means...", options: ["A) A larger amount", "B) A smaller amount", "C) Nothing"], answer: "A) A larger amount" },
      { question: "If Pizza is at 9 and Burger is at 6, difference?", options: ["A) 15", "B) 4", "C) 3"], answer: "C) 3" }
    ]
  },

  // GRADE 1 - OTHER SUBJECTS
  "Grade 1-English-Nouns": {
    title: "Nouns (Naming Words)",
    explanation: "Welcome to English class! Today we will learn about very special words called Nouns. A Noun is a special naming word. It gives a name to a Person, Place, Thing, or Animal! Everything around you right now has a name, and those names are all Nouns! 🐶🏡👨‍👩‍👦",
    examples: [
      "1. Person Nouns: Teacher, Doctor, Boy, Girl, Mom, Dad, Baby.",
      "2. Place Nouns: School, Park, House, Zoo, Beach, Hospital.",
      "3. Thing Nouns: Pencil, Book, Apple, Toy Car, Bag, Shirt, Chair.",
      "4. Animal Nouns: Dog, Cat, Elephant, Bird, Fish, Monkey.",
      "5. Look at this sentence: 'The BOY threw the BALL at the PARK.' Boy, Ball, and Park are all Nouns!"
    ],
    practice: [
      "Look around your room right now. Name 3 'Thing' nouns you see!",
      "Is an 'Apple' a person, a place, or a thing?",
      "Who is your favorite 'Person' noun in the world?",
      "Can you find the noun in this sentence: 'The cat sleeps.'"
    ],
    answers: [
      "Maybe you see a Bed, a toy, or a book! Those are all thing nouns.", 
      "It's a Thing (and a yummy one)!", 
      "Mom or Dad!",
      "The noun is 'cat' (an animal)!"
    ],
    funFact: "Every single thing in the universe that you can see and touch has a name, which means there are probably millions and millions of Nouns in the English language!",
    quiz: [
      { question: "Which of these words is a Noun for an ANIMAL?", options: ["A) Run", "B) Cat", "C) Blue"], answer: "B) Cat" },
      { question: "Is the word 'School' a person, place, or thing?", options: ["A) Place", "B) Person", "C) Thing"], answer: "A) Place" },
      { question: "Find the Noun in this sentence: 'The happy boy.'", options: ["A) The", "B) Happy", "C) Boy"], answer: "C) Boy" },
      { question: "Which of these is a Noun for a THING?", options: ["A) Jump", "B) Banana", "C) Fast"], answer: "B) Banana" },
      { question: "True or False: 'Doctor' is a noun for a place.", options: ["A) True", "B) False", "C) I don't know"], answer: "B) False" }
    ]
  },
  "Grade 1-Science-Living Things": {
    title: "Living vs. Non-Living Things",
    explanation: "Welcome to Science! Did you know everything in the world is either Living or Non-Living? Living things are alive! They need air to breathe, food to eat, and water to drink. They grow bigger over time and can have babies. Non-Living things do not need to eat or drink, and they never grow. 🌱🪨",
    examples: [
      "1. Living Things: You! Trees, Dogs, Birds, Flowers, Bugs, Fish.",
      "2. Living Things need basic things to survive: Sunlight, water, and food.",
      "3. Non-Living Things: Rocks, Toys, Cars, Water, Clouds, Books, Shoes.",
      "4. A plant starts as a seed and GROWS into a big tree. It is Living!",
      "5. A stone never grows, even if it sits outside for 100 years. It is Non-Living!"
    ],
    practice: [
      "Does a rock need to drink water when it gets hot? Is a rock living or non-living?",
      "Does a cute puppy grow bigger? Is a puppy living or non-living?",
      "Look outside! Is a tree living or non-living?",
      "What about your favorite stuffed toy bear?"
    ],
    answers: [
      "No, a rock doesn't drink. It is Non-Living.", 
      "Yes, a puppy grows into a dog! It is Living.",
      "A tree is Living! It grows and drinks water from the soil.",
      "Non-Living! It does not eat or grow."
    ],
    funFact: "Even though water in a river moves really fast and seems alive, it is actually Non-Living because it doesn't breathe air, eat food, or grow bigger!",
    quiz: [
      { question: "Which one of these is ALIVE (Living)?", options: ["A) A rock", "B) A tree", "C) A toy car"], answer: "B) A tree" },
      { question: "Do Non-Living things need to eat food every day?", options: ["A) Yes", "B) No", "C) Only on Sundays"], answer: "B) No" },
      { question: "What do living things do?", options: ["A) Stay the same size forever", "B) Grow and change", "C) Run on batteries"], answer: "B) Grow and change" },
      { question: "Is a smartphone living or non-living?", options: ["A) Living because it talks", "B) Non-living", "C) Living because it is smart"], answer: "B) Non-living" },
      { question: "Which of these is a need for a living thing?", options: ["A) Water", "B) Electricity", "C) Clothes"], answer: "A) Water" }
    ]
  },
  "Grade 1-Filipino-Mga Patinig": {
    title: "Mga Patinig at Katinig",
    explanation: "Magandang araw! Sa ating alpabetong Filipino, mayroon tayong mga letrang nakagrupo sa dalawa. Sila ay tinatawag na Patinig (Vowels) at Katinig (Consonants). Napakahalaga nila dahil pinagsasama natin sila upang makabuo ng mga salita! Ang mga Patinig ay pito sa Alpabetong Filipino (A, E, I, O, U). Ang lahat ng natitirang letra (tulad ng B, K, M, N) ay mga Katinig! 🇵🇭✨",
    examples: [
      "1. Patinig (A) - Aso 🐶  (Ang aso ay malambing at tahol ng tahol!)",
      "2. Patinig (E) - Elepante 🐘 (Napakalaking hayop na may mahabang ilong!)",
      "3. Patinig (I) - Ibon 🐦  (Ang ibon ay malayang lumilipad sa asul na langit!)",
      "4. Patinig (O) - Orasan ⏰ (Tumutulong sa atin upang malaman ang oras!)",
      "5. Patinig (U) - Ulan 🌧️ (Patak ng tubig mula sa makapal na ulap!)",
      "6. Katinig (B) - Bibe 🦆  (Quack quack! Ang bibe ay mahilig lumangoy sa sapa!)",
      "7. Katinig (M) - Manok 🐓 (Tilaok ng tilaok kapag umaga!)"
    ],
    practice: [
      "Ano ang unang letra ng salitang 'Eroplano'? Ito ba ay patinig o katinig?",
      "Pumili ng isang letrang katinig sa salitang 'Pusa'.",
      "Ang salitang 'Bata' ay nagsisimula sa anong letra? Ito ba ay Patinig o Katinig?",
      "Magbigay ng isang salita na nagsisimula sa letrang 'O'."
    ],
    answers: [
      "'E' at ito ay Patinig!",
      "Maaaring 'P' o kaya 'S'! Pareho silang katinig.",
      "Nagsisimula sa 'B' at ito ay Katinig!",
      "Otso, Orasan, Okra!"
    ],
    funFact: "Alam mo ba na ang modernong Alpabetong Filipino ay may 28 na letra? Kasama na dito ang mga banyagang letra tulad ng X at Z, pati na rin ang mga letrang mula sa Espanyol gaya ng Ñ (enye) at ang nakagawiang Ng (enji)!",
    quiz: [
      { question: "Alin sa mga sumusunod ang halimbawa ng Patinig?", options: ["A) K", "B) O", "C) T"], answer: "B) O" },
      { question: "Ano ang unang letra ng salitang 'Araw'?", options: ["A) a", "B) r", "C) w"], answer: "A) a" },
      { question: "Ang letrang 'S' ay isang halimbawa ng...", options: ["A) Patinig", "B) Katinig", "C) Pareho"], answer: "B) Katinig" },
      { question: "Ilan ang Patinig sa ating pangunahing alpabeto?", options: ["A) 5", "B) 10", "C) 3"], answer: "A) 5" },
      { question: "Ano sa mga ito ang hindi kabilang sa Patinig?", options: ["A) E", "B) U", "C) P"], answer: "C) P" }
    ]
  },
  "Grade 1-Araling Panlipunan-Ako ay Natatangi": {
    title: "Ako ay Natatangi (I Am Unique)",
    explanation: "Tayo ay nasa Araling Panlipunan! Ngayon, pag-aaralan natin ang isang napakagandang katotohanan: Ikaw ay natatangi. Ano ibig sabihin ng natatangi? Ibig sabihin, wala kang katulad sa buong mundo! Kahit libu-libong bata ang nandiyan, nag-iisa ka lang at lahat tayo ay espesyal sa ating sariling paraan! 🌟👦👧",
    examples: [
      "1. Pangalan: Mayroon kang sariling pangalan at apelyido na ibinigay sayo ng iyong magulang upang ipakilala ka.",
      "2. Hitsura: May sarili kang kulay ng buhok, hugis ng mata (singkit man o bilog), at kulay ng balat (kayumanggi man o maputi).",
      "3. Kagustuhan: May paborito kang pagkain (tulad ng fried chicken) na maaaring hindi paborito ng iba mong kalaro!",
      "4. Kakayahan: Magaling kang gumuhit o magkulay, habang ang iba ay halimbawang magaling kumanta.",
      "5. Pamilya: Bawat isa sa atin ay nabibilang sa magkakaibang pamilya."
    ],
    practice: [
      "Ano ang iyong buong pangalan at sino nagbigay nito sa iyo?",
      "Ano ang paborito mong kulay at bakit sa palagay mo ito ay maganda?",
      "Ano ang isang bagay na gustong-gusto mong ginagawa (hobby)?",
      "Tumingin ka sa salamin, ano ang nagustuhan mo sa iyong hitsura?"
    ],
    answers: [
      "Ang ganda ng iyong pangalan!", 
      "Wow, maganda nga ang kulay na yan!",
      "Ang galing mo naman dun!",
      "Lahat ng bahagi mo ay espesyal!"
    ],
    funFact: "Alam mo ba na kahit ang magkapatid na kambal (twins) na parehong-pareho ang hitsura ay mayroon pa ring pagkakaiba? Halimbawa, magkaiba pa rin ang kanilang mga fingerprints o linya sa daliri!",
    quiz: [
      { question: "Mayroon bang ibang bata na eksaktong kapareho mo sa lahat ng bagay?", options: ["A) Oo, madami sa aming paaralan", "B) Wala, ako ay natatangi sa buong mundo", "C) Siguro"], answer: "B) Wala, ako ay natatangi sa buong mundo" },
      { question: "Sino ang nagbigay ng iyong pangalan noong ikaw ay ipinanganak?", options: ["A) Pulis", "B) Kalaro", "C) Magulang"], answer: "C) Magulang" },
      { question: "Bakit tayo tinawag na 'natatangi'?", options: ["A) Dahil lahat tayo ay pareho lang ng paborito", "B) Dahil may sarili tayong katangian na iba sa iba", "C) Dahil magkakamukha tayong lahat"], answer: "B) Dahil may sarili tayong katangian na iba sa iba" },
      { question: "Ano sa mga sumusunod ang kakayahan mo bilang bata?", options: ["A) Magmaneho ng sasakyan", "B) Mag-drawing gamit ng krayola", "C) Lumipad"], answer: "B) Mag-drawing gamit ng krayola" },
      { question: "Ang kagustuhan mo ba sa pagkain ay dapat pareho sa kagustuhan ng kapatid mo?", options: ["A) Oo, palagi", "B) Hindi, pwede tayong iba-iba ng gusto", "C) Bawal maiba"], answer: "B) Hindi, pwede tayong iba-iba ng gusto" }
    ]
  },
  "Grade 3-English-Verbs": {
    title: "Verbs (Action Words)",
    explanation: "Welcome to Grade 3 English! Have you ever watched a superhero movie filled with running, jumping, and flying? All of those words are called Verbs! A verb is a magic word that shows ACTION or movement. It tells us what a person, animal, or thing is doing. Let's get moving! 🏃‍♂️✈️✨",
    examples: [
      "1. RUN - The fast cheetah loves to RUN across the field.",
      "2. JUMP - The frog can JUMP very high over the log.",
      "3. SING - The beautiful bird will SING a sweet song in the morning.",
      "4. DANCE - We DANCE gracefully at the birthday party.",
      "5. WRITE - The smart student will WRITE a long story in her notebook.",
      "6. EAT - The hungry bear wants to EAT the yummy honey.",
      "7. CRAWL - The tiny baby will CRAWL across the soft carpet."
    ],
    practice: [
      "Can you find the verb in this sentence: 'The happy dog barked loudly at the mailman.'?",
      "Think of two verbs (action words) that you do in the swimming pool!",
      "Identify the verb: 'My dad cooks dinner every night.'",
      "Which word is the action word? 'The rocket flies to the moon.'"
    ],
    answers: [
      "The verb is 'barked'!",
      "Swim, splash, dive, float—these are all verbs!",
      "The verb is 'cooks'!",
      "The verb is 'flies'!"
    ],
    funFact: "Are there verbs that don't show action? Yes! They are called 'state of being' verbs, like 'is', 'am', 'are', 'was', and 'were'. They just show that something exists!",
    quiz: [
      { question: "Which of these words is a VERB?", options: ["A) Beautiful", "B) Jump", "C) Apple"], answer: "B) Jump" },
      { question: "Find the action word: 'The cat sleeps all day.'", options: ["A) Sleep", "B) Cat", "C) All"], answer: "A) Sleep" },
      { question: "What is the verb in this sentence: 'We play basketball after school.'?", options: ["A) We", "B) Basketball", "C) Play"], answer: "C) Play" },
      { question: "Which word is NOT a verb?", options: ["A) Run", "B) Fast", "C) Read"], answer: "B) Fast" },
      { question: "Choose the verb that completes the sentence: 'The monkey loves to ____ bananas.'", options: ["A) Eat", "B) Yellow", "C) Tree"], answer: "A) Eat" }
    ]
  },
  "Grade 3-Science-The Solar System": {
    title: "Our Solar System",
    explanation: "3, 2, 1, Blast off! Welcome to Grade 3 Science. Today we are travelling to outer space! We live on a rocky planet called Earth. Our Earth travels around a giant glowing star called the Sun, along with 7 other amazing planets. This entire family of planets, moons, and rocks is called the Solar System! ☀️🪐🚀",
    examples: [
      "1. The Sun: The giant, super-hot star in the middle of our solar system. It gives us light and heat!",
      "2. Mercury: The smallest planet and the one closest to the scorching Sun.",
      "3. Venus: The hottest planet in our solar system, completely covered in thick yellowish clouds.",
      "4. Earth: Our beautiful blue and green home! It's the ONLY planet we know of that has living things.",
      "5. Mars: Known as the 'Red Planet' because of its rusty red dirt and rocks.",
      "6. Jupiter: The absolute biggest planet! It is a gas giant with a famous 'Great Red Spot' that is actually a giant storm.",
      "7. Saturn: The planet with the most beautiful, bright rings made of icy rocks.",
      "8. Uranus: An ice giant that spins completely on its side!",
      "9. Neptune: The farthest planet from the Sun, making it the coldest and windiest."
    ],
    practice: [
      "Which planet in our solar system is known as the 'Red Planet'?",
      "What is the massive glowing star perfectly in the center of our solar system?",
      "Which planet has the biggest and brightest rings?",
      "Why is Earth so special compared to the other planets?"
    ],
    answers: [
      "Mars is the Red Planet!",
      "The Sun!",
      "Saturn!",
      "Because it is the only one with liquid water and living things like us!"
    ],
    funFact: "One day on the planet Venus is actually longer than a whole year on Venus! It orbits the Sun faster than it spins on its own axis.",
    quiz: [
      { question: "Which is the absolute biggest planet?", options: ["A) Earth", "B) Jupiter", "C) Mars"], answer: "B) Jupiter" },
      { question: "What do all the planets orbit (travel around)?", options: ["A) The Moon", "B) Earth", "C) The Sun"], answer: "C) The Sun" },
      { question: "Which planet is known as the Red Planet?", options: ["A) Venus", "B) Mars", "C) Saturn"], answer: "B) Mars" },
      { question: "Which planet is closest to the Sun?", options: ["A) Earth", "B) Mercury", "C) Neptune"], answer: "B) Mercury" },
      { question: "What are Saturn's rings mainly made of?", options: ["A) Cheese", "B) Ice and Rocks", "C) Hot gas"], answer: "B) Ice and Rocks" }
    ]
  },
  "Grade 3-Filipino-Pang-uri": {
    title: "Pang-uri (Adjectives sa Filipino)",
    explanation: "Magandang araw! Handa ka na bang magkulay ng mga salita? Sa Filipino, mayroon tayong tinatawag na 'Pang-uri' o Adjectives sa Ingles. Ang Pang-uri ay mga salitang naglalarawan (describing words) sa isang tao, bagay, hayop, o lugar. Ito ang nagpapaganda at nagpapalinaw sa ating mga kwento! 🇵🇭🎨",
    examples: [
      "1. Kulay: Pula, Asul, Luntian (Halimbawa: 'Pula ang paborito kong kotse.')",
      "2. Hugis: Bilog, Parisukat, Hugis-puso (Halimbawa: 'Bilog ang buwan mamayang gabi.')",
      "3. Laki: Malaki, Maliit, Mataas, Pandak (Halimbawa: 'Malaki ang elepante sa zoo.')",
      "4. Bilang o Dami: Isa, Sampu, Marami, Kaunti (Halimbawa: 'Marami akong laruan sa kwarto.')",
      "5. Katangian: Mabait, Maganda, Masipag, Matapang (Halimbawa: 'Mabait ang aming bagong guro.')",
      "6. Panlasa: Matamis, Maalat, Maanghang, Maasim (Halimbawa: 'Matamis ang manggang binili ni Nanay.')",
      "7. Pandama: Malambot, Magaspang, Malamig, Mainit (Halimbawa: 'Malamig ang hangin tuwing Pasko.')"
    ],
    practice: [
      "Ano ang pang-uri sa pangungusap na ito? 'Ang aso ni Juan ay matapang.'",
      "Magbigay ng dalawang pang-uri na naglalarawan sa isang sorbetes (ice cream).",
      "Hanapin ang salitang naglalarawan: 'Isinuot ko ang bago kong sapatos.'",
      "Anong pang-uri ang babagay sa salitang 'Bato'?"
    ],
    answers: [
      "Ang pang-uri ay 'matapang'!",
      "Malamig at matamis!",
      "Ang pang-uri ay 'bago'!",
      "Matigas, mabigat, o magaspang!"
    ],
    funFact: "Sa ating wika, kapag inulit ang ibang pang-uri, lalong tumitindi ang ibig sabihin nito! Halimbawa: Ang 'maganda' kapag ginawang 'magandang-maganda' ay nangangahulugang sobrang ganda talaga!",
    quiz: [
      { question: "Alin sa mga sumusunod ang halimbawa ng Pang-uri?", options: ["A) Tumakbo", "B) Malambot", "C) Pusa"], answer: "B) Malambot" },
      { question: "Ano ang pang-uri sa: 'Matamis ang pulang posporo'?", options: ["A) Posporo", "B) Matamis", "C) Ang"], answer: "B) Matamis" },
      { question: "Anong pang-uri ang naglalarawan sa hugis ng gulong?", options: ["A) Bilog", "B) Asul", "C) Mabait"], answer: "A) Bilog" },
      { question: "Sa pangungusap na 'Mataas ang puno', ano ang inilalarawan ng salitang mataas?", options: ["A) Araw", "B) Puno", "C) Bata"], answer: "B) Puno" },
      { question: "Alin ang HINDI pang-uri?", options: ["A) Maalat", "B) Malaki", "C) Kumanta"], answer: "C) Kumanta" }
    ]
  },
  "Grade 3-Araling Panlipunan-Mga Lalawigan": {
    title: "Mga Lalawigan sa Ating Rehiyon",
    explanation: "Magandang araw sa Araling Panlipunan 3! Alam mo ba kung saan ka nakatira? Ang buong Pilipinas ay hinati sa malalaking lugar na tinatawag na 'Rehiyon'. Sa loob ng bawat rehiyon, may nakapaloob na mga 'Lalawigan' (Provinces). Bawat lalawigan ay may sariling kwento, magagandang tanawin, at masasarap na pagkain! Sumakay na sa ating jeepney at mamasyal tayo! 🗺️🚐🥥",
    examples: [
      "1. Rehiyon III (Gitnang Luzon) ay may maraming lalawigan tulad ng Bulacan, Pampanga, at Nueva Ecija. Kilala ang kultura at pagkain nila rito!",
      "2. CALABARZON (Rehiyon IV-A) ay galing sa mga unang letra ng Cavite, Laguna, Batangas, Rizal, at Quezon.",
      "3. Cebu - Isang tanyag na lalawigan sa Visayas kung saan makikita ang krus ni Magellan.",
      "4. Bohol - Isang lalawigan sa Visayas na sikat sa Chocolate Hills at mga maliliit na Tarsier.",
      "5. Palawan - Ang lalawigang maraming naggagandahang dagat at underground river.",
      "6. Ilocos Norte - Isang lalawigan sa hilaga (north) na sikat sa mga windmills at Vigan empanada.",
      "7. Davao del Sur - Sa Mindanao matatagpuan ito, at dito makikita ang pinakamataas na bundok sa Pilipinas, ang Mount Apo!"
    ],
    practice: [
      "Sa anong lalawigan makikita ang sikat at magagandang Chocolate Hills?",
      "Kung ikaw ay naninirahan sa Cavite, anong rehiyon ang kinabibilangan mo?",
      "Ano ang tawag sa malaking bahagi ng bansa na nahahati sa maraming lalawigan?",
      "Anong lalawigan sa Visayas ang sikat kay Magellan?"
    ],
    answers: [
      "Makikita ang Chocolate Hills sa Bohol!",
      "Sa Rehiyon IV-A o CALABARZON!",
      "Ito ay tinatawag na Rehiyon!",
      "Ang lalawigan ng Cebu!"
    ],
    funFact: "Ang probinsya ng Palawan ay madalas tawaging 'The Final Frontier' ng Pilipinas dahil puno ito ng mga ligaw at hindi pa natutuklasang kalikasan!",
    quiz: [
      { question: "Ang mga titik ng CALABARZON ay nagsisimula sa mga probinsyang Cavite, Laguna, Batangas, Rizal, at ano pa?", options: ["A) Quino", "B) Quezon", "C) Quiz"], answer: "B) Quezon" },
      { question: "Sa anong lalawigan matatagpuan ang Chocolate Hills?", options: ["A) Bohol", "B) Palawan", "C) Batanes"], answer: "A) Bohol" },
      { question: "Ano ang tawag sa malalaking pook na binubuo ng mga lalawigan?", options: ["A) Rehiyon", "B) Barangay", "C) Sitio"], answer: "A) Rehiyon" },
      { question: "Ang Mount Apo ay matatagpuan sa Mindanao sa lalawigan ng...", options: ["A) Davao del Sur", "B) Cebu", "C) Ilocos Norte"], answer: "A) Davao del Sur" },
      { question: "Makikita ang Underground River sa lalawigan ng: ", options: ["A) Batangas", "B) Palawan", "C) Laguna"], answer: "B) Palawan" }
    ]
  },
  "Grade 4-Mathematics-Fractions": {
    title: "Adding and Subtracting Fractions",
    explanation: "Welcome to Grade 4 Math! Now that you know what a fraction is (a piece of a whole), let's learn how to ADD and SUBTRACT them! The golden rule of fractions is: You can only add or subtract them easily if the bottoms (the Denominators) are exactly the SAME. Let's slice some pizza! 🍕✂️",
    examples: [
      "1. 1/4 + 2/4 = 3/4. (The bottoms are both 4. Just add the tops! 1 + 2 = 3).",
      "2. 3/8 + 4/8 = 7/8. (Keep the 8 perfectly the same, just add 3 and 4).",
      "3. 5/6 - 1/6 = 4/6. (Bottom is the same, so just subtract the tops! 5 - 1 = 4).",
      "4. 9/10 - 2/10 = 7/10. (Easy! 9 minus 2 is 7, keep the 10).",
      "5. 1/3 + 1/3 = 2/3. (Add tops, keep bottom).",
      "6. 8/12 - 5/12 = 3/12. (Subtract the tops!).",
      "7. 3/5 + 2/5 = 5/5. (Wait, 5/5 is the same as ONE WHOLE!)"
    ],
    practice: [
      "What is 2/7 + 3/7?",
      "Solve this fraction subtraction: 8/9 - 4/9.",
      "If you eat 3/8 of a pizza, and your friend eats 2/8, how much pizza did you both eat in total?",
      "What is 4/10 + 6/10?"
    ],
    answers: [
      "5/7! Good job!",
      "4/9!",
      "You ate 5/8 of the pizza altogether!",
      "10/10, which means 1 whole!"
    ],
    funFact: "The line right between the top number and the bottom number of a fraction actually has a very fancy name. It is called a 'vinculum'!",
    quiz: [
      { question: "What is 3/5 + 1/5?", options: ["A) 4/10", "B) 4/5", "C) 2/5"], answer: "B) 4/5" },
      { question: "Solve 7/8 - 2/8.", options: ["A) 5/8", "B) 9/8", "C) 5/0"], answer: "A) 5/8" },
      { question: "When adding fractions with the same denominator, what do you add?", options: ["A) Only the tops", "B) Only the bottoms", "C) Top and bottom"], answer: "A) Only the tops" },
      { question: "What is 4/9 + 3/9?", options: ["A) 7/18", "B) 1/9", "C) 7/9"], answer: "C) 7/9" },
      { question: "5/6 minus 2/6 is...", options: ["A) 3/6", "B) 7/6", "C) 3/0"], answer: "A) 3/6" }
    ]
  },
  "Grade 4-English-Adverbs": {
    title: "Adverbs (Words that change Verbs)",
    explanation: "Welcome to Grade 4 English! You already know that adjectives describe nouns. But what describes an ACTION (a verb)? ADVERBS do! An adverb is a word that tells us HOW, WHEN, or WHERE an action happens. They add so much flavor to your sentences! Many adverbs end in '-ly'. 🏃‍♂️💨🕰️",
    examples: [
      "1. HOW it happened: The turtle walked SLOWLY. (How did he walk? Slowly).",
      "2. HOW it happened: The girl sang BEAUTIFULLY. (How did she sing? Beautifully).",
      "3. WHEN it happened: We will go to the park TOMORROW. (When? Tomorrow).",
      "4. WHEN it happened: I am eating my dinner NOW. (When? Now).",
      "5. WHERE it happened: Please look UP. (Where? Up).",
      "6. WHERE it happened: The children are playing OUTSIDE. (Where? Outside).",
      "7. HOW it happened: He QUICKLY caught the ball. (How? Quickly)."
    ],
    practice: [
      "Can you find the adverb in this sentence? 'The dog barked loudly.'",
      "Think of an adverb that tells WHEN you will do your homework.",
      "Identify the adverb: 'She carefully opened the fragile box.'",
      "If you look 'everywhere', is 'everywhere' an adverb?"
    ],
    answers: [
      "The adverb is 'loudly' (it tells HOW).",
      "Today, tomorrow, now, later, soon!",
      "The adverb is 'carefully'.",
      "Yes! It's an adverb that tells WHERE."
    ],
    funFact: "If you take an adjective and add 'ly' to the end, it almost always transforms into an adverb! Example: Quick (adjective) -> Quickly (adverb).",
    quiz: [
      { question: "Which of these words is an Adverb?", options: ["A) Cat", "B) Quickly", "C) Blue"], answer: "B) Quickly" },
      { question: "Find the adverb: 'The sun shines brightly.'", options: ["A) The", "B) Shines", "C) Brightly"], answer: "C) Brightly" },
      { question: "An adverb usually describes a...", options: ["A) Noun", "B) Verb", "C) Pronoun"], answer: "B) Verb" },
      { question: "In the sentence 'We will leave tomorrow.', what kind of adverb is 'tomorrow'?", options: ["A) How", "B) Where", "C) When"], answer: "C) When" },
      { question: "Which adverb fits best? 'He ran _____ to win the race.'", options: ["A) Slowly", "B) Fast", "C) Beautifully"], answer: "B) Fast" }
    ]
  },
  "Grade 4-Science-Life Cycles": {
    title: "Life Cycles of Animals",
    explanation: "Welcome to Grade 4 Science! Everything that is living goes through a cycle. A 'Life Cycle' shows the amazing stages an animal goes through from the time it is born until it becomes an adult. Some animals simply grow bigger, while others completely transform in a process called Metamorphosis! 🐛🦋🐸",
    examples: [
      "1. The Human Cycle: Baby -> Toddler -> Child -> Teenager -> Adult.",
      "2. The Chicken Cycle: Egg -> Hatchling (baby chick) -> Adult Chicken.",
      "3. The Butterfly Cycle (Complete Metamorphosis): Egg -> Caterpillar (Larva) -> Pupa (Chrysalis) -> Beautiful Adult Butterfly!",
      "4. The Frog Cycle (Metamorphosis): Egg -> Tadpole (swims in water) -> Froglet (grows legs) -> Adult Frog (lives on land).",
      "5. The Sea Turtle Cycle: Egg buried in sand -> Hatchling making its way to the ocean -> Adult Sea Turtle.",
      "6. The Ladybug Cycle: Egg -> Larva -> Pupa -> Adult Ladybug with spots.",
      "7. The Dog Cycle: Puppy -> Adolescent -> Adult Dog -> Senior Dog."
    ],
    practice: [
      "What is the hard shell called where a caterpillar transforms into a butterfly?",
      "What is a baby frog that swims in the water called?",
      "What happens to a tadpole when it turns into a froglet?",
      "Do humans go through a complete metamorphosis like a butterfly?"
    ],
    answers: [
      "It is called a Pupa or Chrysalis!",
      "It is called a Tadpole!",
      "It grows four legs and its tail begins to shrink!",
      "No, we just grow bigger! Butterflies completely change their entire body shape."
    ],
    funFact: "A caterpillar spends almost its entire life just eating! It can eat through a whole leaf in minutes so it has enough energy to turn into a butterfly.",
    quiz: [
      { question: "What is the very first stage in a butterfly's life cycle?", options: ["A) Pupa", "B) Egg", "C) Caterpillar"], answer: "B) Egg" },
      { question: "What does a tadpole turn into immediately before becoming an adult frog?", options: ["A) Egg", "B) Pupa", "C) Froglet"], answer: "C) Froglet" },
      { question: "What is the process called when an animal completely transforms its body shape?", options: ["A) Photosynthesis", "B) Metamorphosis", "C) Magic"], answer: "B) Metamorphosis" },
      { question: "What comes right after the Egg stage for a chicken?", options: ["A) Adult", "B) Pupa", "C) Hatchling (Chick)"], answer: "C) Hatchling (Chick)" },
      { question: "A Pupa or Chrysalis belongs to the life cycle of which animal?", options: ["A) Dog", "B) Butterfly", "C) Human"], answer: "B) Butterfly" }
    ]
  },
  "Grade 4-Filipino-Pang-abay": {
    title: "Pang-abay (Adverbs sa Filipino)",
    explanation: "Magandang araw! Kung ang Pang-uri ay panlarawan sa Pangngalan (Noun), ang 'Pang-abay' naman ay mga salitang naglalarawan kung PAANO, KAILAN, o SAAN ginawa ang isang kilos o Pandiwa (Verb)! Halintulad nito ang Adverbs sa Ingles. Bigyang buhay natin ang mga kilos! 🏃‍♂️🕰️",
    examples: [
      "1. Pamaraan (Paano/How): Tumakbo nang MABILIS ang magnanakaw. (Paano tumakbo? Mabilis).",
      "2. Pamaraan (Paano/How): Ang sanggol ay natutulog nang MAHIMBING. (Paano natutulog? Mahimbing).",
      "3. Pamanahon (Kailan/When): Aalis tayo BUKAS papuntang Maynila. (Kailan aalis? Bukas).",
      "4. Pamanahon (Kailan/When): LINGGO-LINGGO akong nagsisimba. (Kailan nagsisimba? Linggo-linggo).",
      "5. Panlunan (Saan/Where): Naglalaro sila ng taguan SA LIKOD-BAHAY. (Saan naglalaro? Sa likod-bahay).",
      "6. Panlunan (Saan/Where): Nagbakasyon kami SA PALAWAN. (Saan nagbakasyon? Sa Palawan).",
      "7. Pamaraan (Paano/How): MASAYANG umawit ang mga bata. (Paano umawit? Masaya)."
    ],
    practice: [
      "Hanapin ang Pang-abay na Pamaraan (Paano) sa pangungusap: 'Dahan-dahan niyang binuksan ang pinto.'",
      "Magbigay ng isang Pang-abay na Pamanahon (Kailan).",
      "Sa pangungusap na 'Naligo ang bata sa ilog', ano ang Pang-abay na Panlunan (Saan)?",
      "Anong uri ng pang-abay ang salitang 'mamayang gabi'?"
    ],
    answers: [
      "Ang pang-abay ay 'Dahan-dahan' (Slowly).",
      "Kahapon, Kanina, Ngayon, Bukas, o Mamaya!",
      "Ang pang-abay na panlunan ay 'sa ilog'!",
      "Ito ay Pang-abay na Pamanahon (Kailan)!"
    ],
    funFact: "Ang Pang-abay ay hindi lang naglalarawan ng Pandiwa! Pwede rin itong maglarawan ng kapwa niya Pang-abay o kaya'y isang Pang-uri (Halimbawa: 'Totoong maganda' - ang 'totoong' ay pang-abay na naglalarawan sa 'maganda').",
    quiz: [
      { question: "Ang salitang 'Bukas' ay anong uri ng Pang-abay?", options: ["A) Pamaraan", "B) Pamanahon", "C) Panlunan"], answer: "B) Pamanahon" },
      { question: "Ano ang pang-abay sa pangungusap na: 'Ang pagong ay naglakad nang mabagal.'?", options: ["A) Mabagal", "B) Pagong", "C) Naglakad"], answer: "A) Mabagal" },
      { question: "Kung ang kilos ay ginawa sa 'Parke', ito ay Pang-abay na...", options: ["A) Pamaraan (Paano)", "B) Panlunan (Saan)", "C) Pamanahon (Kailan)"], answer: "B) Panlunan (Saan)" },
      { question: "Tukuyin ang Pang-abay: 'Sabay-sabay silang kumanta.'", options: ["A) Silang", "B) Kumanta", "C) Sabay-sabay"], answer: "C) Sabay-sabay" },
      { question: "Ang Pang-abay ay karaniwang naglalarawan sa isang...", options: ["A) Pangngalan (Tao/Bagay)", "B) Pandiwa (Kilos/Action)", "C) Kulay"], answer: "B) Pandiwa (Kilos/Action)" }
    ]
  },
  "Grade 4-Araling Panlipunan-Ang Pilipinas": {
    title: "Ang Pilipinas (Isang Kapuluan)",
    explanation: "Mabuhay! Sa Araling Panlipunan 4, mas kikilalanin natin ang ating inang bayan: Ang Pilipinas! Ang ating bansa ay isang 'Kapuluan' o Archipelago. Ibig sabihin, tayo ay binubuo ng napakaraming pulo o isla na napapaligiran ng tubig. Mayroon tayong mahigit 7,600 na isla! 🇵🇭🏝️",
    examples: [
      "1. Luzon: Ang pinakamalaking pulo sa buong Pilipinas. Dito matatagpuan ang Maynila, ang ating kabisera.",
      "2. Visayas: Ang grupo ng mga isla sa gitna ng Pilipinas. Dito matatagpuan ang Cebu at Bohol.",
      "3. Mindanao: Ang pangalawang pinakamalaking pulo, na matatagpuan sa pinakatimog (south) na bahagi.",
      "4. Klima: Tayo ay isang bansang tropikal! Tag-araw (mainit) at Tag-ulan lamang ang dalawang panahon natin.",
      "5. Lokasyon: Matatagpuan ang Pilipinas sa Timog-Silangang Asya (Southeast Asia)."
    ],
    practice: [
      "Ano ang tatlong pangunahing grupo ng mga isla sa Pilipinas?",
      "Ano ang tawag sa isang bansa na binubuo ng maraming isla?",
      "Ano ang pinakamalaking pulo sa ating bansa?",
      "Ilang panahon (seasons) lamang mayroon sa ating bansang tropikal?"
    ],
    answers: [
      "Luzon, Visayas, at Mindanao!",
      "Kapuluan o Archipelago!",
      "Ang Luzon!",
      "Dalawa lang: Tag-araw at Tag-ulan!"
    ],
    funFact: "Alam mo ba na ang Pilipinas ay ipinangalan kay King Philip II ng Espanya noong sinakop tayo ng mga Kastila? Kung susumahin, tayo ay may humigit-kumulang 7,641 na pulo! Nakakabilib diba?",
    quiz: [
      { question: "Ano ang tawag sa bansang binubuo ng maraming pulo o isla?", options: ["A) Kapatagan", "B) Kapuluan (Archipelago)", "C) Tangway"], answer: "B) Kapuluan (Archipelago)" },
      { question: "Alin ang PINAKAMALAKING pulo sa Pilipinas?", options: ["A) Visayas", "B) Mindanao", "C) Luzon"], answer: "C) Luzon" },
      { question: "Ilan ang pangunahing malalaking grupo ng isla sa Pilipinas?", options: ["A) Tatlo (Luzon, Visayas, Mindanao)", "B) Isa", "C) Lima"], answer: "A) Tatlo (Luzon, Visayas, Mindanao)" },
      { question: "Ano ang kabisera (capital) ng Pilipinas na matatagpuan sa Luzon?", options: ["A) Cebu", "B) Maynila", "C) Davao"], answer: "B) Maynila" },
      { question: "Saang bahagi ng asya matatagpuan ang Pilipinas?", options: ["A) Timog-Silangang Asya", "B) Hilagang Asya", "C) Kanlurang Asya"], answer: "A) Timog-Silangang Asya" }
    ]
  },
  "Grade 5-Mathematics-Decimals": {
    title: "Understanding Decimals",
    explanation: "Welcome to Grade 5 Math! You've mastered whole numbers and fractions, but what happens when you need to be perfectly precise, like measuring exactly how fast you ran a race, or counting money? That's where DECIMALS come in! A decimal is just another way to write a fraction. The dot (decimal point) separates the WHOLE numbers from the PARTS of a number. Let's get precise! 📏⏱️💰",
    examples: [
      "1. Place Value: In 4.56, '4' is the whole number, '5' is in the TENTHS place, and '6' is in the HUNDREDTHS place.",
      "2. Money: ₱15.50 means 15 whole pesos and 50 out of 100 centavos! (Half a peso).",
      "3. Adding: 2.1 + 3.4 = ? Line up the dots first! 2.1 + 3.4 = 5.5.",
      "4. Subtracting: 8.7 - 4.2 = ? Line up the dots! 8.7 - 4.2 = 4.5.",
      "5. Comparing: Which is bigger, 0.4 or 0.45? Think of it like money! 0.40 is forty cents, 0.45 is forty-five cents. 0.45 is bigger!",
      "6. Converting: 1/2 as a decimal is exactly 0.5.",
      "7. Multiplying by 10: Just move the decimal point one step to the RIGHT! 2.34 x 10 = 23.4."
    ],
    practice: [
      "If you have ₱20.50 and you spend ₱10.25, how much is left?",
      "Which decimal is bigger: 1.2 or 1.15?",
      "Add these numbers: 5.4 + 2.3",
      "What digit is in the 'tenths' place in the number 18.93?"
    ],
    answers: [
      "You have ₱10.25 left! (20.50 - 10.25 = 10.25)",
      "1.2 is bigger! (Think of it as 1.20 vs 1.15)",
      "7.7! Good job lining up the decimal points.",
      "The 9 is in the tenths place!"
    ],
    funFact: "The word 'decimal' comes from the Latin word 'decimus', which means tenth! That's why base-10 math is so amazing—it's based on having ten fingers!",
    quiz: [
      { question: "What is 3.5 + 4.2?", options: ["A) 7.7", "B) 7.6", "C) 8.1"], answer: "A) 7.7" },
      { question: "Which decimal is the LARGEST?", options: ["A) 0.8", "B) 0.85", "C) 0.09"], answer: "B) 0.85" },
      { question: "How do you write 'five and three tenths' in numbers?", options: ["A) 5.03", "B) 53", "C) 5.3"], answer: "C) 5.3" },
      { question: "What place value is the '7' in 14.27?", options: ["A) Tenths", "B) Hundredths", "C) Ones"], answer: "B) Hundredths" },
      { question: "Subtract: 10.5 - 2.0 = ?", options: ["A) 8.5", "B) 8.0", "C) 12.5"], answer: "A) 8.5" }
    ]
  },
  "Grade 5-English-Conjunctions": {
    title: "Conjunctions (Connecting Words)",
    explanation: "Welcome to Grade 5 English! Have you ever wanted to combine two short, boring sentences into one super, exciting sentence? You need CONJUNCTIONS! Conjunctions are the 'superglue' of English. They attach words, phrases, or whole sentences together. The most famous ones are FANBOYS: For, And, Nor, But, Or, Yet, So! 🧩🔗",
    examples: [
      "1. AND (Joins things alike): I like chocolate AND vanilla ice cream.",
      "2. BUT (Shows a contrast): I wanted to play outside, BUT it started raining.",
      "3. OR (Gives a choice): Do you want a hamburger OR a hotdog?",
      "4. SO (Shows a result): I was very tired, SO I went to sleep early.",
      "5. BECAUSE (Gives a reason): I am wearing a jacket BECAUSE it is freezing outside.",
      "6. ALTHOUGH (Shows a surprising contrast): ALTHOUGH he was scared, the knight fought the dragon.",
      "7. IF (Presents a condition): IF you finish your homework, you can play video games."
    ],
    practice: [
      "Combine these: 'The movie was long. It was very funny.'",
      "Which conjunction fits? 'I am hungry, _____ I will eat a sandwich.'",
      "Identify the conjunction: 'You can have the red balloon or the blue balloon.'",
      "Which conjunction fits? 'I did not go to school _____ I was sick.'"
    ],
    answers: [
      "'The movie was long, BUT it was very funny.'",
      "SO! (I am hungry, SO I will eat...)",
      "The conjunction is 'or'!",
      "BECAUSE! (I did not go to school BECAUSE I was sick)."
    ],
    funFact: "Remember the acronym FANBOYS to easily recall the seven coordinating conjunctions: For, And, Nor, But, Or, Yet, So!",
    quiz: [
      { question: "Choose the best conjunction: 'I like pizza, ___ I don't like anchovies.'", options: ["A) and", "B) but", "C) or"], answer: "B) but" },
      { question: "Which word is a conjunction?", options: ["A) Because", "B) Quickly", "C) Apple"], answer: "A) Because" },
      { question: "Complete the sentence: 'We stayed inside _____ it was raining.'", options: ["A) but", "B) because", "C) although"], answer: "B) because" },
      { question: "What does the conjunction 'or' do?", options: ["A) Gives a reason", "B) Shows a result", "C) Gives a choice"], answer: "C) Gives a choice" },
      { question: "Choose the best conjunction: 'He studied hard, ___ he passed the test.'", options: ["A) so", "B) nor", "C) but"], answer: "A) so" }
    ]
  },
  "Grade 5-Science-Human Body Systems": {
    title: "The Human Body Systems",
    explanation: "Welcome to Grade 5 Science! Your body is the most incredible, complicated machine in the universe! But it doesn't just work as one blob. It is made of different 'Systems' (teams of organs) that work together perfectly to keep you alive, moving, and thinking. Let's meet the super-teams inside of you! 🧠🫀🫁💪",
    examples: [
      "1. Circulatory System: Featuring the Heart and Blood! It pumps oxygen and nutrients to every part of your body.",
      "2. Respiratory System: Featuring the Lungs! It pulls oxygen from the air into your blood, and pushes out carbon dioxide.",
      "3. Digestive System: Featuring the Stomach and Intestines! It breaks down your delicious food taking out the energy and nutrients.",
      "4. Skeletal System: Featuring 206 Bones! It gives your body shape and protects your soft organs (like your skull protecting your brain!).",
      "5. Muscular System: Featuring over 600 Muscles! It works with your bones to let you run, smile, and jump.",
      "6. Nervous System: Featuring the Brain and Nerves! It is the 'boss' that sends lightning-fast electrical messages so you can think and feel.",
      "7. The Integumentary System: This is your Skin, Hair, and Nails! Its job is to protect your insides from germs and keep your temperature safe."
    ],
    practice: [
      "Which body system acts like the transportation highway, pumping blood everywhere?",
      "If you eat an apple, which system breaks it down for energy?",
      "What is the ultimate 'boss' organ that controls the Nervous System?",
      "Which system brings fresh oxygen into your body when you breathe in?"
    ],
    answers: [
      "The Circulatory System!",
      "The Digestive System!",
      "The Brain!",
      "The Respiratory System!"
    ],
    funFact: "If you laid out all the blood vessels in an adult human body end-to-end, they would wrap around the Earth roughly two and a half times! That's over 100,000 kilometers!",
    quiz: [
      { question: "Which organ pumps blood throughout your body?", options: ["A) Lungs", "B) Heart", "C) Brain"], answer: "B) Heart" },
      { question: "Which system is responsible for pulling oxygen from the air?", options: ["A) Respiratory System", "B) Skeletal System", "C) Digestive System"], answer: "A) Respiratory System" },
      { question: "The skull's main job is to protect which organ?", options: ["A) Heart", "B) Brain", "C) Stomach"], answer: "B) Brain" },
      { question: "Which system breaks down food so your body can use the nutrients?", options: ["A) Circulatory", "B) Nervous", "C) Digestive"], answer: "C) Digestive" },
      { question: "Your skin, hair, and nails are part of which system?", options: ["A) Integumentary", "B) Muscular", "C) Skeletal"], answer: "A) Integumentary" }
    ]
  },
  "Grade 5-Filipino-Pandiwa": {
    title: "Ang Pandiwa (Aspekto ng Kilos)",
    explanation: "Magandang araw sa Grade 5! Handa na bang kumilos? Napag-aralan mo na ang Pandiwa, mga salitang nagpapakita ng aksyon o kilos. Ngunit alam mo ba na nag-iiba ang itsura ng Pandiwa depende kung KAILAN ito nangyari? Tinatawag natin itong 'Aspekto ng Pandiwa'. Parang time travel ng salita, aalamin natin ang nakaraan, kasalukuyan, at hinaharap! ⏳🏃‍♂️🚀",
    examples: [
      "1. Naganap / Perpektibo (Past Tense): Tapos na ang kilos. Halimbawa: NAGLARO ako kahapon. KUMAIN siya ng saging kanina.",
      "2. Nagaganap / Imperpektibo (Present Tense): Kasalukuyang ginagawa ang kilos. Halimbawa: NAGLALARO ako ngayon. KUMAKAIN siya ng saging habang naglalakad.",
      "3. Magaganap / Kontemplatibo (Future Tense): Gagawin pa lamang ang kilos. Halimbawa: MAGLALARO ako bukas. KAKAIN siya ng saging mamayang gabi.",
      "4. Kilos: Basa. Naganap: NAGBASA. Nagaganap: NAGBABASA. Magaganap: MAGBABASA.",
      "5. Kilos: Akyat. Naganap: UMAKYAT. Nagaganap: UMAAKYAT. Magaganap: AAKYAT.",
      "6. Kilos: Sulat. Naganap: SUMULAT. Nagaganap: SUMUSULAT. Magaganap: SUSULAT.",
      "7. Kilos: Takbo. Naganap: TUMAKBO. Nagaganap: TUMATAKBO. Magaganap: TATAKBO."
    ],
    practice: [
      "Ano ang Aspektong Magaganap (Future) ng pandiwang 'tulog'?",
      "Tukuyin ang aspekto: 'Nagluluto si Nanay ng ulam ngayon.'",
      "Ano ang Aspektong Naganap (Past) ng pandiwang 'kanta'?",
      "Tukuyin ang aspekto: 'Pupunta kami sa mall sa lingo.'"
    ],
    answers: [
      "Matutulog!",
      "Nagaganap / Imperpektibo (Present Tense) dahil nangyayari ngayon!",
      "Kumanta!",
      "Magaganap / Kontemplatibo (Future Tense) dahil sa linggo pa!"
    ],
    funFact: "Sa Wikang Tagalog/Filipino, hindi natin kailangang magdagdag ng panibagong salita tulad ng 'will' sa Ingles para maging future tense; inuulit lamang natin ang unang pantig ng salitang ugat! (Halimbawa: basa -> magBAbasa).",
    quiz: [
      { question: "Alin ang Pandiwang nasa Aspektong Naganap (Tapos na)?", options: ["A) Kakain", "B) Kumain", "C) Kumakain"], answer: "B) Kumain" },
      { question: "Ano ang aspekto ng pandiwang 'Susulat'?", options: ["A) Naganap", "B) Nagaganap", "C) Magaganap"], answer: "C) Magaganap" },
      { question: "Alin ang halimbawa ng Aspektong Nagaganap (Kasalukuyan)?", options: ["A) Nagbabasa", "B) Nagbasa", "C) Magbabasa"], answer: "A) Nagbabasa" },
      { question: "Ano ang salitang gagamitin kung bukas mo pa lalabhan ang damit?", options: ["A) Naglaba", "B) Naglalaba", "C) Maglalaba"], answer: "C) Maglalaba" },
      { question: "Ang salitang 'Umakyat' ay anong aspekto?", options: ["A) Perpektibo (Naganap)", "B) Imperpektibo (Nagaganap)", "C) Kontemplatibo (Magaganap)"], answer: "A) Perpektibo (Naganap)" }
    ]
  },
  "Grade 5-Araling Panlipunan-Panahon ng mga Espanyol": {
    title: "Ang Pananakop ng mga Espanyol",
    explanation: "Mabuhay! Sa kasaysayan natin, matagal na panahon tayong napasailalim sa kamay ng mga dayuhan. Noong 1521, dumaong ang grupo ni Ferdinand Magellan sa Pilipinas, at nagsimula ang 333 na taong pananakop ng bansang Espanya! Malaki ang naging pagbabago sa ating kultura, relihiyon, at paraan ng pamumuhay dahil sa kanila. ⚔️⛪📜",
    examples: [
      "1. Relihiyon: Ang mga Espanyol ang nagdala ng relihiyong Kristiyanismo (Katolisismo) sa Pilipinas. Ang Sto. Niño sa Cebu ay isa sa mga unang krus at imahen na dinala dito.",
      "2. Relihiyon at Pista: Tinuruan ang mga Pilipino na magdiwang ng mga Fiesta para sa mga kinikilang Santo (Patron Saints) ng bawat bayan.",
      "3. Ekspedisyon: Taong 1521 nang dumating si Ferdinand Magellan, pero napatay siya ni Lapu-Lapu sa Labanan sa Mactan.",
      "4. Pagpapangalan: Ipinangalan ang Pilipinas ni Ruy López de Villalobos mula kay Haring Felipe II (King Philip II) ng Espanya. 'Las Islas Filipinas'.",
      "5. Sining at Wika: Maraming salitang Kastila ang ginagamit natin hanggang ngayon (Hal: bintana mula sa 'ventana', silya mula sa 'silla').",
      "6. Kultura: Natuto ang mga sinaunang Pilipino na magsuot ng Barong Tagalog at Baro't Saya, pati na ang pagkain ng adobo at pan de sal.",
      "7. Edukasyon: Nagtayo sila ng mga unang paaralan ngunit kadalasan para lang ito sa pag-aaral ng relihiyon noong umpisa."
    ],
    practice: [
      "Sino ang namuno sa unang ekspedisyon ng mga Espanyol na nakarating sa Pilipinas, na namatay sa Mactan?",
      "Anong pangunahing relihiyon ang ipinakilala at pinalaganap ng mga Kastila sa Pilipinas?",
      "Kanino isinunod ang pangalang 'Pilipinas'?",
      "Ilang daang taon sinakop ng mga Espanyol ang Pilipinas?"
    ],
    answers: [
      "Si Ferdinand Magellan!",
      "Kristiyanismo o Katolisismo!",
      "Kay Haring Felipe II ng Espanya!",
      "Aabot ng 333 taon!"
    ],
    funFact: "Ang pambansang bayani natin na si Jose Rizal ay isinilang habang nasa ilalim pa rin tayo ng pananakop ng mga Kastila. Ang kanyang mga nobela ang gumising sa kamalayan ng mga Pilipino para lumaban para sa kalayaan!",
    quiz: [
      { question: "Sino ang matapang na Pilipino na tumalo kay Magellan sa Mactan?", options: ["A) Jose Rizal", "B) Andres Bonifacio", "C) Lapu-Lapu"], answer: "C) Lapu-Lapu" },
      { question: "Ilang taon naging kolonya ng Espanya ang Pilipinas?", options: ["A) 100 taon", "B) 333 taon", "C) 50 taon"], answer: "B) 333 taon" },
      { question: "Anong pangunahing relihiyon ang dinala ng mga Espanyol sa Pilipinas?", options: ["A) Islam", "B) Budismo", "C) Katolisismo"], answer: "C) Katolisismo" },
      { question: "Sino ang hari ng Espanya kung saan isinunod ang pangalang 'Pilipinas'?", options: ["A) Haring Fernando", "B) Haring Felipe II", "C) Haring Carlos"], answer: "B) Haring Felipe II" },
      { question: "Anong taon unang nakarating sina Ferdinand Magellan sa Pilipinas?", options: ["A) 1521", "B) 1898", "C) 1945"], answer: "A) 1521" }
    ]
  },

  "Grade 6-Mathematics-Fractions, Decimals, Percents": {
    title: "Fractions, Decimals, and Percents",
    explanation: "Welcome to Grade 6 Math! Did you know that Fractions, Decimals, and Percents are actually just three different costumes for the EXACT SAME number? They all show 'parts of a whole'. A percent literally means 'per century' or 'out of 100'. Let's learn how these three shape-shift! 🍕🔢💯",
    examples: [
      "1. The Classic Half: 1/2 is the same as finding the middle! As a decimal it's 0.50, and as a percent it's 50%.",
      "2. The Quarter: 1/4 of a pizza is 25% of it, which is 0.25 as a decimal! (Think of a quarter coin out of a dollar).",
      "3. Three-Quarters: 3/4 = 0.75 = 75%.",
      "4. The Whole: 1 whole = 1.00 = 100%.",
      "5. Decimal to Percent: Just move the decimal point TWO jumps to the RIGHT! 0.45 becomes 45%.",
      "6. Percent to Decimal: Move the decimal point TWO jumps to the LEFT! 80% becomes 0.80.",
      "7. Fraction to Decimal: Divide the top number by the bottom number! 1 ÷ 4 = 0.25."
    ],
    practice: [
      "If you got 90% on your test, what is that as a decimal?",
      "Convert the decimal 0.35 into a percent.",
      "Which is bigger: 1/2 or 60%?",
      "Write 25% as a fraction in its simplest form."
    ],
    answers: [
      "0.90! (Or just 0.9)",
      "35%!",
      "60% is bigger! (Because 1/2 is only 50%).",
      "1/4!"
    ],
    funFact: "The percent sign '%' actually evolved from a symbol originally written as 'P cento' in Italy during the 1400s!",
    quiz: [
      { question: "What is 0.75 as a percentage?", options: ["A) 7.5%", "B) 75%", "C) 0.075%"], answer: "B) 75%" },
      { question: "What is 1/2 as a decimal?", options: ["A) 0.2", "B) 0.12", "C) 0.5"], answer: "C) 0.5" },
      { question: "Which is the largest value?", options: ["A) 40%", "B) 1/4", "C) 0.50"], answer: "C) 0.50" },
      { question: "Convert 8% to a decimal.", options: ["A) 0.8", "B) 0.08", "C) 8.0"], answer: "B) 0.08" },
      { question: "Which fraction is equal to 100%?", options: ["A) 1/100", "B) 10/10", "C) 1/2"], answer: "B) 10/10" }
    ]
  },
  "Grade 6-English-Prepositions": {
    title: "Prepositions (Position Words)",
    explanation: "Welcome to Grade 6 English! Imagine you lose your phone. Where is it? ON the table? UNDER the bed? IN your bag? All of those perfectly helpful location words are PREPOSITIONS! A preposition usually tells us WHERE a noun is, WHEN an event happens, or the DIRECTION something is moving. 📍🗺️🕒",
    examples: [
      "1. IN (Inside something): The cat is IN the box.",
      "2. ON (Touching the surface): The book is ON the table.",
      "3. AT (A specific point or location): I will meet you AT the bus stop.",
      "4. UNDER (Below something): The dog is hiding UNDER the bed.",
      "5. BETWEEN (In the middle of two things): The park is BETWEEN the school and the library.",
      "6. TIME PREPOSITIONS: We use AT for exact times (at 3 PM), ON for days (on Monday), and IN for months/years (in October).",
      "7. MOVEMENT: He walked ACROSS the street. They went INTO the spooky house."
    ],
    practice: [
      "Which preposition fits best? 'Please put the plates _____ the table.'",
      "Identify the preposition: 'The sneaky mouse ran behind the refrigerator.'",
      "Which preposition is correct for a day? 'We have a party _____ Saturday.'",
      "Find the preposition: 'The moon shines brightly above the trees.'"
    ],
    answers: [
      "ON! (Please put the plates ON the table).",
      "The preposition is 'behind'!",
      "ON! (We have a party ON Saturday).",
      "The preposition is 'above'!"
    ],
    funFact: "A funny trick to remember many prepositions of place is to think of a cloud: A bird can fly OVER it, UNDER it, THROUGH it, AROUND it, or PAST it! All of those are prepositions!",
    quiz: [
      { question: "Choose the correct preposition: 'The keys are ___ my pocket.'", options: ["A) on", "B) at", "C) in"], answer: "C) in" },
      { question: "Which preposition shows time?", options: ["A) between", "B) at", "C) under"], answer: "B) at" },
      { question: "Find the preposition: 'He walked across the old bridge.'", options: ["A) walked", "B) across", "C) old"], answer: "B) across" },
      { question: "Choose the correct word: 'My birthday is ___ December.'", options: ["A) in", "B) on", "C) at"], answer: "A) in" },
      { question: "Where is the bird if it's 'between' two trees?", options: ["A) On top of them", "B) In the middle of them", "C) Under them"], answer: "B) In the middle of them" }
    ]
  },
  "Grade 6-Science-Ecosystems": {
    title: "Ecosystems and Food Webs",
    explanation: "Welcome to Grade 6 Science! You aren't just living on Earth; you are part of a giant, wonderfully messy web of life called an ECOSYSTEM! An ecosystem is a community where living things (plants, animals, bugs) interact with non-living things (water, sunlight, dirt). Everyone has a job to do to keep nature balanced! 🌍🌿🦅",
    examples: [
      "1. Producers: Plants and trees are 'producers' because they magically make their own food using sunlight (Photosynthesis)!",
      "2. Consumers: Animals are 'consumers'. We must EAT things to survive. Herbivores eat plants, Carnivores eat meat, Omnivores eat both!",
      "3. Decomposers: Fungi, mushrooms, and earthworms! They are nature's recyclers. They eat dead things and turn them back into rich soil.",
      "4. The Food Chain: Sun -> Grass (Producer) -> Grasshopper (Consumer) -> Frog (Consumer) -> Snake (Consumer).",
      "5. Food Web: In real life, animals eat many different things, creating a huge 'web' instead of a single chain.",
      "6. Abiotic Factors: The NON-living parts of the ecosystem that are super important (like water, sunlight, rocks, and the temperature).",
      "7. Biotic Factors: All the LIVING things in the ecosystem!"
    ],
    practice: [
      "Are humans Producers or Consumers?",
      "What is the very first source of energy for almost all food chains?",
      "What do we call animals like cows that ONLY eat plants?",
      "True or False: Rocks and water are 'Abiotic' (non-living) factors."
    ],
    answers: [
      "Humans are Consumers! (We don't make food in our leaves!)",
      "The Sun! ☀️",
      "Herbivores!",
      "True!"
    ],
    funFact: "If decomposers (like bugs and mushrooms) didn't exist, the Earth would be completely buried in dead leaves, trees, and animals! Thank you, recyclers!",
    quiz: [
      { question: "Which of the following is a 'Producer'?", options: ["A) Lion", "B) Mushroom", "C) Apple Tree"], answer: "C) Apple Tree" },
      { question: "What do 'Decomposers' do?", options: ["A) Hunt other animals", "B) Make food from the sun", "C) Break down dead matter"], answer: "C) Break down dead matter" },
      { question: "Animals that eat BOTH plants and meat are called...", options: ["A) Omnivores", "B) Carnivores", "C) Herbivores"], answer: "A) Omnivores" },
      { question: "Which is an 'Abiotic' (non-living) part of an ecosystem?", options: ["A) A snake", "B) Sunlight", "C) A pine tree"], answer: "B) Sunlight" },
      { question: "Where does the energy in a food web originally come from?", options: ["A) The soil", "B) The Sun", "C) Water"], answer: "B) The Sun" }
    ]
  },
  "Grade 6-Filipino-Tayutay": {
    title: "Ang Tayutay (Figures of Speech)",
    explanation: "Magandang araw sa Grade 6! Alam mo bang kaya nating pagandahin at kulayan ang ating mga sasabihin? Ito ay sa pamamagitan ng 'Tayutay' (Figures of Speech). Ito ay mga salita o pahayag na may malalim, makulay, at nakatagong kahulugan upang mas maging masining ang ating tula, kwento, at pananalita! 🎭✨",
    examples: [
      "1. Pagtutulad (Simile): Simpleng paghahambing at GUMAGAMIT ng mga salitang 'parang', 'tulad ng', 'kasing'. Halimbawa: 'Ikaw ay PARANG bituin sa dilim.'",
      "2. Pagwawangis (Metaphor): Direktang paghahambing at HINDI na gumagamit ng 'parang'. Halimbawa: 'Ikaw ANG bituin sa aking dilim.'",
      "3. Pagmamalabis (Hyperbole): Sobra-sobra o eksaherado na imposibleng mangyari. Halimbawa: 'Namuti ang mata ko kakahintay sa iyo!' (Hindi pwedeng mamuti ang mata!)",
      "4. Pagsasatao (Personification): Binibigyan ng katangian ng tao ang isang bagay. Halimbawa: 'Sumasayaw ang mga dahon sa pag-ihip ng hangin.'",
      "5. Paghihimig (Onomatopoeia): Paggamit ng tunog upang ilarawan ang salita. Halimbawa: 'Dumagundong ang kulog.'",
      "6. Pagtutulad (Simile): 'Kasing-tigas ng bato ang kanyang ulo.'",
      "7. Pagwawangis (Metaphor): 'Si Nanay ang ilaw ng tahanan.'"
    ],
    practice: [
      "Anong uri ng tayutay ito: 'Tila yelo sa lamig ang kanyang kamay.'?",
      "Anong uri ng tayutay ito: 'Bumabaha ng luha sa kanyang kwarto dahil sa lungkot.'?",
      "Gawing Pagwawangis (Metaphor) ang : 'Ang puso niya ay parang bato.'",
      "Anong uri ng tayutay ito: 'Nagulat ang mga bulaklak nang umulan.'?"
    ],
    answers: [
      "Pagtutulad (Simile) dahil may salitang 'Tila'!",
      "Pagmamalabis (Hyperbole) dahil imposibleng magbaha ng luha!",
      "Ang sagot ay: 'Bato ang kanyang puso.' (Inalis ang parang).",
      "Pagsasatao (Personification) dahil hindi naman ginugulat ang bulaklak!"
    ],
    funFact: "Ang paboritong gamitin ng mga Pilipino sa araw-araw ay Pagmamalabis! Palagi nating sinasabi ang 'Mamatay-matay ako sa tawa!', kahit hindi naman literal na nakamamatay ang pagtawa!",
    quiz: [
      { question: "Anong tayutay ang gumagamit ng mga salitang 'tulad ng' o 'parang'?", options: ["A) Pagwawangis", "B) Pagtutulad", "C) Pagsasatao"], answer: "B) Pagtutulad" },
      { question: "Anong tayutay ang: 'Umusok ang ilong ko sa galit!'?", options: ["A) Pagmamalabis (Hyperbole)", "B) Paghihimig", "C) Pagtutulad"], answer: "A) Pagmamalabis (Hyperbole)" },
      { question: "Alin ang halimbawa ng Pagsasatao (Personification)?", options: ["A) Matigas na tila bakal", "B) Tumawa ang langit", "C) Maingay ang aso"], answer: "B) Tumawa ang langit" },
      { question: "Anong tayutay ang walang ginagamit na 'parang'? Halimbawa: 'Isa siyang leon sa labanan.'", options: ["A) Pagtutulad", "B) Pagsasatao", "C) Pagwawangis (Metaphor)"], answer: "C) Pagwawangis (Metaphor)" },
      { question: "Anong uri ng tayutay ang: 'Bumagsak! ang mga baso.'", options: ["A) Paghihimig (Tunog)", "B) Pagmamalabis", "C) Pagwawangis"], answer: "A) Paghihimig (Tunog)" }
    ]
  },
  "Grade 6-Araling Panlipunan-Panahon ng mga Amerikano": {
    title: "Ang Panahon ng mga Amerikano",
    explanation: "Mabuhay! Pagkatapos bilhin ng Amerika ang Pilipinas mula sa Espanya, pumasok tayo sa bagong yugto ng kasaysayan! Kung ang mga Espanyol ay nagdala ng relihiyon, ang mga Amerikano naman ay nagdala ng makabagong Sistema ng Edukasyon, Kalusugan, at Transportasyon. Tara, balikan natin ang panahong ito! 🇺🇸📚🚆",
    examples: [
      "1. Pampublikong Edukasyon: Pinayagang makapag-aral nang LIBRE ang mga batang Pilipino kahit hindi mayaman. (Noong panahon ng Kastila, bawal ito sa ordinaryong tao).",
      "2. Ang Thomasites: Sila ang mga unang Amerikanong guro na dumating sa Pilipinas sakay ng barkong U.S.S. Thomas para magturo ng Ingles.",
      "3. Wika: Ang wikang Ingles ang ginamit bilang pangunahing lengguwahe sa paaralan at pamahalaan.",
      "4. Halalan at Pamahalaan: Itinuro ng mga Amerikano ang demokrasya kung saan pwedeng bumoto ang mga tao ng kanilang gustong pinuno.",
      "5. Transportasyon at Komunikasyon: Nagpagawa ng maraming tulay, kalsada, riles ng tren, at ipinakilala ang telepono at radyo!",
      "6. Kalusugan: Nagturo sila ng wastong kalinisan o 'hygiene', nagtayo ng mga ospital (tulad ng PGH), at nagbigay ng bakuna laban sa kolera at smallpox.",
      "7. Kagamitan: Dumating ang mga sasakyan, sinehan, at mga damit na yari sa cotton at sapatos!"
    ],
    practice: [
      "Ano ang pangalan ng sikat na grupo ng mga gurong Amerikano na dumating sa Pilipinas?",
      "Anong wika ang naging opisyal na itinuro nila sa mga paaralan?",
      "Ano ang pinakamalaking pagbabago sa edukasyon na ibinigay ng mga Amerikano?",
      "Ano ang tawag sa sistema ng pamahalaan kung saan ang mga tao ay may karapatang bumoto?"
    ],
    answers: [
      "Ang mga Thomasites!",
      "Wikang Ingles!",
      "Binuksan ang mga paaralan ng LIBRE para sa lahat ng mga bata!",
      "Demokrasya!"
    ],
    funFact: "Ang pambansang laro nating Basketball ay itinuro at ipinakilala ng mga Amerikano noong 1910! Kaya naman sobrang sikat nito sa ating bansa hanggang ngayon!",
    quiz: [
      { question: "Ano ang tawag sa mga Amerikanong guro na nakasakay sa U.S.S. Thomas?", options: ["A) Pensionados", "B) Thomasites", "C) Hukbalahap"], answer: "B) Thomasites" },
      { question: "Anong sikat na wika ang ipinalaganap ng mga Amerikano?", options: ["A) Espanyol", "B) Tagalog", "C) Ingles"], answer: "C) Ingles" },
      { question: "Alin ang pangunahing naiambag ng mga Amerikano sa Pilipinas?", options: ["A) Relihiyong Katolisismo", "B) Libreng Pampublikong Edukasyon", "C) Panitikang Korido"], answer: "B) Libreng Pampublikong Edukasyon" },
      { question: "Anong laro ang dinala at ipinasikat ng mga Amerikano sa Pilipinas?", options: ["A) Sepak Takraw", "B) Sipa", "C) Basketball"], answer: "C) Basketball" },
      { question: "Anong sistema ng gobyerno ang itinuro kung saan makakaboto ang mga tao?", options: ["A) Monarkiya", "B) Demokrasya", "C) Diktatoryal"], answer: "B) Demokrasya" }
    ]
  },

  // GRADE 7
  "Grade 7-Mathematics-Integers": {
    title: "Integers and Operations",
    explanation: "Welcome to High School Math! You are used to whole numbers, but what happens when you go below zero? Enter the world of INTEGERS! Integers are all the whole numbers and their negative opposites, plus zero. They are super important for things like measuring freezing temperatures, tracking money you owe, and plotting points on a graph. Let's master the rules of positives and negatives! 📉❄️➕➖",
    examples: [
      "1. Number Line Basics: Numbers to the right of zero are positive (+). Numbers to the left of zero are negative (-).",
      "2. Adding same signs: (-3) + (-4) = -7. (If you owe 3 dollars, and borrow 4 more, you owe 7 dollars).",
      "3. Adding opposite signs: 5 + (-3) = 2. (Subtract the numbers and keep the sign of the bigger number).",
      "4. Subtracting negatives: 5 - (-2) = 7. (Subtracting a negative is the exact same as adding a positive! Two negatives make a positive hook).",
      "5. Multiplying same signs: (-4) x (-4) = 16. (A negative times a negative equals a POSITIVE!).",
      "6. Multiplying opposite signs: (-5) x 3 = -15. (A negative times a positive equals a NEGATIVE!).",
      "7. Division rules are the same as multiplication! (-20) ÷ (-4) = 5, but (-20) ÷ 4 = -5."
    ],
    practice: [
      "What is (-8) + (-5)?",
      "Solve this tricky one: 10 - (-5).",
      "What is (-6) x 7?",
      "If the temperature is -2 degrees, and it drops by 4 degrees, what is the new temperature?"
    ],
    answers: [
      "-13!",
      "15! (Because subtracting a negative becomes addition: 10 + 5).",
      "-42!",
      "It becomes -6 degrees!"
    ],
    funFact: "The concept of negative numbers was first used in ancient China around 200 BC! They used red counting rods for positive numbers and black rods for negative numbers (which is actually the opposite of how accountants use 'in the red' today!).",
    quiz: [
      { question: "What is (-7) + 3?", options: ["A) -10", "B) -4", "C) 10"], answer: "B) -4" },
      { question: "Solve: -8 - (-3) = ?", options: ["A) -5", "B) -11", "C) 5"], answer: "A) -5" },
      { question: "A negative number multiplied by a negative number results in a...", options: ["A) Negative number", "B) Zero", "C) Positive number"], answer: "C) Positive number" },
      { question: "What is (-9) x 4?", options: ["A) 36", "B) -36", "C) -13"], answer: "B) -36" },
      { question: "What is (-25) ÷ (-5)?", options: ["A) 5", "B) -5", "C) 20"], answer: "A) 5" }
    ]
  },
  "Grade 7-English-Subject-Verb Agreement": {
    title: "Subject-Verb Agreement",
    explanation: "Welcome to Grade 7 English! Do you want your sentences to sound perfectly grammatical? The most important rule in writing is 'Subject-Verb Agreement'. The rule is simple: If the subject is SINGULAR (one), the verb must be SINGULAR (usually ends in 's'). If the subject is PLURAL (many), the verb must be PLURAL (no 's'). Let's match them up! ✍️👯‍♂️",
    examples: [
      "1. Singular Subject -> Singular Verb (adds 's'): The DOG (singular) BARKS (singular) loudly.",
      "2. Plural Subject -> Plural Verb (no 's'): The DOGS (plural) BARK (plural) loudly.",
      "3. Tricky 'I' and 'You': Although singular, they take plural verbs! (I run. You jump.)",
      "4. Phrases in between: 'The box of chocolates IS on the table.' (The subject is 'box', not 'chocolates'!).",
      "5. Compound subjects with AND: 'Jack and Jill ARE going up the hill.' (Two people = plural).",
      "6. Compound subjects with OR/NOR: 'Neither the teacher nor the STUDENTS ARE here.' (The verb agrees with the subject closest to it).",
      "7. Indefinite pronouns: 'Everyone', 'Someone', 'Nobody' always take SINGULAR verbs! (Everyone IS happy)."
    ],
    practice: [
      "Choose the correct verb: 'The cat (play/plays) with the yarn.'",
      "Choose the correct verb: 'A basket of apples (is/are) on the counter.'",
      "Choose the correct verb: 'Everybody (want/wants) a slice of pizza.'",
      "Choose the correct verb: 'My brother and my sister (walk/walks) to school.'"
    ],
    answers: [
      "'Plays' (Singular cat takes singular verb).",
      "'Is' (The subject is basket!).",
      "'Wants' ('Everybody' acts as a singular unit).",
      "'Walk' (Two people = plural)."
    ],
    funFact: "In English, adding an 's' to a noun makes it PLURAL (cats), but adding an 's' to a verb makes it SINGULAR (runs). They are complete opposites!",
    quiz: [
      { question: "Which sentence is correct?", options: ["A) The cars drives fast.", "B) The car drive fast.", "C) The car drives fast."], answer: "C) The car drives fast." },
      { question: "A flock of birds ___ flying overhead.", options: ["A) are", "B) is", "C) am"], answer: "B) is" },
      { question: "Neither my friend nor I ___ going to the party.", options: ["A) am", "B) is", "C) are"], answer: "A) am" },
      { question: "Everyone in the class ___ finished the test.", options: ["A) have", "B) has", "C) having"], answer: "B) has" },
      { question: "The dogs in the backyard ___ loudly every night.", options: ["A) barks", "B) barking", "C) bark"], answer: "C) bark" }
    ]
  },
  "Grade 7-Science-The Scientific Method": {
    title: "The Scientific Method",
    explanation: "Welcome to Grade 7 Science! Have you ever wondered why grass is green, why things fall down, or how a volcano erupts? Scientists don't just guess the answers; they use a structured, foolproof process called 'The Scientific Method'. It is a step-by-step guide to solving mysteries and discovering the absolute truth about our world! 🧪🔬🕵️‍♂️",
    examples: [
      "1. Ask a Question: This is how it starts. 'Why do plants need sunlight?'",
      "2. Do Background Research: Read books or ask experts to see what is already known.",
      "3. Form a Hypothesis: Make an 'educated guess'. 'If I put a plant in the dark, then it will die, because it needs sun for food.'",
      "4. Conduct an Experiment: Test your hypothesis! Put one plant in the sun (Control Group) and one in a dark closet (Experimental Group).",
      "5. Variables: The thing you change is the Independent Variable (sunlight). What you measure is the Dependent Variable (plant growth).",
      "6. Analyze Data & Draw a Conclusion: Look at the results. Did the dark plant die? Does the data support your hypothesis?",
      "7. Communicate Results: Share your findings with the world so others can learn!"
    ],
    practice: [
      "In an experiment testing if fertilizer makes plants grow taller, what is the Independent Variable (the thing you change)?",
      "What do we call the 'educated guess' you make before the experiment starts?",
      "If your data does NOT support your hypothesis, was your experiment a failure?",
      "What is the final step of the scientific method?"
    ],
    answers: [
      "The fertilizer! You change the amount used.",
      "A Hypothesis!",
      "No! Finding out what doesn't work is just as important in science.",
      "Communicate your results!"
    ],
    funFact: "Sir Isaac Newton formulated the laws of gravity largely because he followed these very steps—starting by simply observing an apple falling from a tree and asking 'Why?'",
    quiz: [
      { question: "What is an 'educated guess' called in science?", options: ["A) Conclusion", "B) Hypothesis", "C) Variable"], answer: "B) Hypothesis" },
      { question: "What is the variable in an experiment that YOU change on purpose?", options: ["A) Independent Variable", "B) Dependent Variable", "C) Constant Variable"], answer: "A) Independent Variable" },
      { question: "Which step comes first in the Scientific Method?", options: ["A) Form a hypothesis", "B) Ask a question", "C) Conduct an experiment"], answer: "B) Ask a question" },
      { question: "What do you do in the 'Analyze Data' step?", options: ["A) Look at the information you gathered", "B) Guess what will happen", "C) Share your work"], answer: "A) Look at the information you gathered" },
      { question: "True or False: If an experiment proves your hypothesis wrong, you failed completely.", options: ["A) True", "B) False", "C) Only sometimes"], answer: "B) False" }
    ]
  },
  "Grade 7-Filipino-Ibong Adarna": {
    title: "Ang Koridong Ibong Adarna",
    explanation: "Mabuhay sa High School! Sa Grade 7, babasahin niyo ang isang sikat na klasikong panitikang Pilipino: Ang Ibong Adarna! Ito ay isang uri ng tulang tinatawag na 'Korido'. Ang kwento ay umiikot sa isang mahiwagang ibon na kayang magpagaling ng anumang sakit sa pamamagitan ng kanyang napakagandang awit, at ang paglalakbay ng tatlong magkakapatid na prinsipe upang hulihin ito. 🦅👑🗡️",
    examples: [
      "1. Anyo ng Korido: May 8 pantig (syllables) bawat linya, at may 4 na linya sa isang saknong. Binibigkas ito nang mabilis.",
      "2. Tagpuan: Ang Kaharian ng Berbanya, isang mapayapa at masaganang bayan.",
      "3. Ang Sakit ng Hari: Nagkasakit si Haring Fernando dahil sa isang masamang panaginip. Ang lunas lamang ay ang awit ng Ibong Adarna na nasa Bundok Tabor.",
      "4. Ang Tatlong Prinsipe: Sina Don Pedro (panganay, mayabang), Don Diego (pangalawa, sunud-sunuran), at Don Juan (bunso, mabait at matapang).",
      "5. Ang Kapangyarihan ng Ibon: Pitong beses itong nagpapalit ng kulay ng balahibo sa tuwing umaawit, at naglalapag ng dumi na nakakabato!",
      "6. Ang Ermitanyo: Isang matandang ketongin na tinulungan ni Don Juan. Siya ang nagturo ng lihim kung paano mahuhuli ang mahiwagang ibon.",
      "7. Ang Lihim (Sikreto): Kailangang hiwain ni Don Juan ang kanyang palad at patakan ng dayap para hindi makatulog sa awit, at gumamit ng gintong sintas para itali ang ibon."
    ],
    practice: [
      "Sino sa tatlong prinsipe ang tunay na nakahuli sa Ibong Adarna?",
      "Ano ang nangyayari sa mga taong nakakatulog sa awit ng Ibong Adarna at napapatakan ng dumi nito?",
      "Ilang pantig (syllables) mayroon sa isang linya ng Korido?",
      "Sino ang haring nagkasakit sa kwento?"
    ],
    answers: [
      "Si Don Juan, ang bunsong prinsipe!",
      "Sila ay nagiging bato! (Kaya naging bato sina Don Pedro at Don Diego).",
      "Walong (8) pantig!",
      "Si Haring Fernando ng kahariang Berbanya."
    ],
    funFact: "Ang Ibong Adarna ay isinulat noong panahon ng Kastila, ngunit hanggang ngayon ay HINDI kilala kung sino talaga ang orihinal na awtor o sumulat nito! Isa itong alamat na naipasa-pasa lamang.",
    quiz: [
      { question: "Saan naninirahan ang mahiwagang Ibong Adarna?", options: ["A) Bundok Tralala", "B) Bundok Tabor (Haring Punong Piedras Platas)", "C) Kaharian ng Berbanya"], answer: "B) Bundok Tabor (Haring Punong Piedras Platas)" },
      { question: "Ilang beses nagpapalit ng kulay at umaawit ang Ibong Adarna?", options: ["A) 3 beses", "B) 7 beses", "C) 10 beses"], answer: "B) 7 beses" },
      { question: "Ano ang ginamit ni Don Juan para hindi makatulog sa awit ng ibon?", options: ["A) Kape", "B) Hiwa sa palad na pinatakan ng dayap", "C) Matigas na unan"], answer: "B) Hiwa sa palad na pinatakan ng dayap" },
      { question: "Ano ang uring pampanitikan ng Ibong Adarna na may 8 pantig bawat linya?", options: ["A) Awit", "B) Epiko", "C) Korido"], answer: "C) Korido" },
      { question: "Sino ang panganay na kapatid na naunang naglakbay ngunit naging bato?", options: ["A) Don Diego", "B) Don Juan", "C) Don Pedro"], answer: "C) Don Pedro" }
    ]
  },
  "Grade 7-Araling Panlipunan-Heograpiya ng Asya": {
    title: "Heograpiya at Kasaysayan ng Asya",
    explanation: "Maligayang pagdating sa Grade 7 AP! Ang pag-aaralan natin sa buong taon ay ang ASYA! Ang Asya ang pinakamalaking kontinente sa buong mundo, at tahanan ng pinakamaraming tao. Dito matatagpuan ang mga pinakasinaunang kabihasnan at ang pinakamataas na bundok sa daigdig. Handa na bang maglibot? 🌏🏔️🎎",
    examples: [
      "1. Mga Rehiyon ng Asya: Nahahati ang Asya sa lima: Hilaga, Silangan (tulad ng Japan at China), Timog, Timog-Silangan (kung nasaan ang Pilipinas!), at Kanluran (Middle East).",
      "2. Pinakamataas na Bundok: Ang Mount Everest na matatagpuan sa Himalayas sa pagitan ng Nepal at China ay ang pinakamataas na bundok sa mundo.",
      "3. Pinakamalaking Bansa: Ang bansang Russia (na nasa Asya at Europe) at China ang pinakamalalaki sa rehiyon.",
      "4. Mga Sinaunang Kabihasnan: Sa Asya nagsimula ang sibilisasyon! Nandiyan ang Mesopotamia (sa itlog ng Tigris at Euphrates), Indus (sa India), at Huang Ho (sa China).",
      "5. Ang 'Ring of Fire': Isang malaking lugar sa Pacific Ocean na maraming bulkan at lindol. Ang Pilipinas at Japan ay nasa loob nito.",
      "6. Pinakamahabang Ilog: Ang Yangtze River sa China ay ang pinakamahabang ilog sa buong Asya.",
      "7. Klima: Dahil napakalaki ng Asya, nararanasan dito ang lahat ng klima—mula sa sobrang init sa disyerto ng Arabia, hanggang sa yelo ng Siberia!"
    ],
    practice: [
      "Sa anong rehiyon ng Asya nabibilang ang bansang Pilipinas?",
      "Ano ang pangalan ng pinakamataas na bundok sa buong mundo na nasa Asya?",
      "Ang Mesopotamia, na isa sa mga unang kabihasnan, ay matatagpuan sa pagitan ng anong dalawang ilog?",
      "Bakit madalas lumindol at pumutok ang bulkan sa Pilipinas at Japan?"
    ],
    answers: [
      "Sa Timog-Silangang Asya (Southeast Asia)!",
      "Ang Mount Everest!",
      "Ang Tigris at Euphrates!",
      "Dahil sila ay nasa loob ng Pacific Ring of Fire!"
    ],
    funFact: "Ang kontinente ng Asya ay napakalaki na sinasakop nito ang humigit-kumulang 30% ng kabuuang lupain sa buong mundo, at 60% ng populasyon ng tao ay nandito nakatira!",
    quiz: [
      { question: "Alin ang pinakamalaking kontinente sa buong daigdig?", options: ["A) Africa", "B) Europe", "C) Asya"], answer: "C) Asya" },
      { question: "Ang mga bansang China, Japan, at South Korea ay kabilang sa anong rehiyon?", options: ["A) Timog Asya", "B) Silangang Asya", "C) Kanlurang Asya"], answer: "B) Silangang Asya" },
      { question: "Ano ang pinakamahabang ilog na matatagpuan sa Asya (partikular sa China)?", options: ["A) Nile River", "B) Yangtze River", "C) Amazon River"], answer: "B) Yangtze River" },
      { question: "Ano ang tawag sa rehiyong nakapaligid sa Karagatang Pasipiko na nakakaranas ng maraming lindol?", options: ["A) Ring of Fire", "B) Earthquake Zone", "C) Volcanic Path"], answer: "A) Ring of Fire" },
      { question: "Anong sikat na bansa sa Asya ang itinuturing na pinakamataong bansa sa mahabang panahon bago inunahan ng India?", options: ["A) Russia", "B) Indonesia", "C) China"], answer: "C) China" }
    ]
  },

  // GRADE 8
  "Grade 8-Mathematics-Algebraic Expressions": {
    title: "Algebraic Expressions & Polynomials",
    explanation: "Welcome to Grade 8 Math! It's time to bring LETTERS into math! Algebra is like solving a mystery puzzle where letters (called Variables) stand for unknown numbers. An 'Expression' is a combination of numbers, variables, and operation symbols. Let's learn to speak the secret language of Algebra! 🧩🧮🔤",
    examples: [
      "1. Variables: A letter like 'x' or 'y' that represents an unknown number.",
      "2. Constants: A number on its own that never changes (like 7 or -4).",
      "3. Coefficients: The number attached to the front of a variable. In '5x', the 5 is the coefficient.",
      "4. Terms: The parts of an expression separated by + or - signs. '3x + 4' has TWO terms.",
      "5. Like Terms: Terms that have the EXACT SAME variable and exponent. (2x and 5x are 'like terms'. 3x and 3y are NOT).",
      "6. Combining Like Terms: You can add or subtract like terms! 4x + 3x = 7x. (Think: 4 apples + 3 apples = 7 apples).",
      "7. Evaluating: If an expression is '2x + 3' and we know x = 4, we plug it in: 2(4) + 3 = 8 + 3 = 11!"
    ],
    practice: [
      "What is the coefficient in the term '-8y'?",
      "How many terms are in the expression '4x - 2y + 7'?",
      "Simplify by combining like terms: '5x + 2x - 3x'.",
      "If x = 5, evaluate the expression '3x - 2'."
    ],
    answers: [
      "The coefficient is -8.",
      "There are 3 terms! (4x, -2y, and 7).",
      "It makes 4x! (5 + 2 - 3 = 4).",
      "The answer is 13! (3 times 5 is 15, minus 2 is 13)."
    ],
    funFact: "The word 'Algebra' comes from the Arabic word 'al-jabr', which means 'the reunion of broken parts'. It was coined by a Persian mathematician back in the 9th century!",
    quiz: [
      { question: "In the expression '7a + 4', what is the variable?", options: ["A) 7", "B) 4", "C) a"], answer: "C) a" },
      { question: "What do we call terms that have the exact same variables?", options: ["A) Different terms", "B) Like terms", "C) Constant terms"], answer: "B) Like terms" },
      { question: "Simplify the expression: '8x - 5x + 2x'.", options: ["A) 5x", "B) 15x", "C) 1x"], answer: "A) 5x" },
      { question: "If y = 3, what is the value of '4y + 5'?", options: ["A) 12", "B) 17", "C) 7"], answer: "B) 17" },
      { question: "Which of the following is a 'Constant'?", options: ["A) -12", "B) 3x", "C) x"], answer: "A) -12" }
    ]
  },
  "Grade 8-English-Active and Passive Voice": {
    title: "Active and Passive Voice",
    explanation: "Welcome to Grade 8 English! Sentences have a 'voice'. By changing the voice, you completely change the focus of your sentence. In the ACTIVE VOICE, the subject DOES the action (strong and direct). In the PASSIVE VOICE, the subject RECEIVES the action (often used when the action is more important than who did it). Let's master both! 🗣️🔄🎤",
    examples: [
      "1. ACTIVE: 'The dog chased the ball.' (Focus is on the dog doing the chasing.)",
      "2. PASSIVE: 'The ball was chased by the dog.' (Focus is on the ball.)",
      "3. ACTIVE: 'The chef cooked a delicious meal.'",
      "4. PASSIVE: 'A delicious meal was cooked by the chef.'",
      "5. PASSIVE (No doer): 'The bank was robbed.' (We use passive here because we don't know WHO robbed it, or it doesn't matter.)",
      "6. Transformation trick: The object of the active sentence becomes the subject of the passive sentence!",
      "7. Be Verb + Past Participle: All passive sentences MUST have a 'be' verb (is, was, were, are) plus a past participle verb (eaten, drawn, cooked)."
    ],
    practice: [
      "Is this Active or Passive? 'The letter was written by Sarah.'",
      "Make this Active sentence Passive: 'The cat ate the fish.'",
      "Make this Passive sentence Active: 'The car was washed by my dad.'",
      "Why might a news reporter say 'The window was broken' instead of 'Somebody broke the window'?"
    ],
    answers: [
      "It is Passive! (The letter received the action).",
      "Passive: 'The fish was eaten by the cat.'",
      "Active: 'My dad washed the car.'",
      "Because the important news is the broken window, not the unknown person who did it!"
    ],
    funFact: "Writers are usually taught to prefer the Active Voice because it sounds stronger and uses fewer words. However, scientists love the Passive Voice because it places the focus on the experiment, not on themselves!",
    quiz: [
      { question: "Identify the voice: 'The cake was beautifully decorated.'", options: ["A) Active Voice", "B) Passive Voice", "C) Neutral Voice"], answer: "B) Passive Voice" },
      { question: "Change to active voice: 'The song was sung by the choir.'", options: ["A) The choir sung the song.", "B) The choir sang the song.", "C) The song sang the choir."], answer: "B) The choir sang the song." },
      { question: "Which voice is generally considered stronger and more direct in writing?", options: ["A) Passive", "B) Active", "C) Both are equal"], answer: "B) Active" },
      { question: "Change to passive voice: 'The boy threw the rock.'", options: ["A) The rock was thrown by the boy.", "B) The rock threw the boy.", "C) The boy was thrown."], answer: "A) The rock was thrown by the boy." },
      { question: "What two things are ALWAYS required to make a verb passive in English?", options: ["A) An adjective and noun", "B) A 'be' verb and a past participle", "C) The word 'by'"], answer: "B) A 'be' verb and a past participle" }
    ]
  },
  "Grade 8-Science-Laws of Motion": {
    title: "Newton's Laws of Motion",
    explanation: "Welcome to Grade 8 Physics! Why do you fall forward when a bus suddenly stops? Why does a rocket go up when fire shoots down? Sir Isaac Newton, a brilliant scientist, figured out the exact rules for how EVERYTHING in the universe moves. He created Three Laws of Motion. Let's learn the rules of the universe! 🚀🍎🏎️",
    examples: [
      "1. The 1st Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion, UNLESS a force acts on it. (A soccer ball won't move until you kick it).",
      "2. Example of 1st Law: If you are riding a skateboard and hit a rock, the skateboard stops, but your body keeps moving forward! Wear a helmet!",
      "3. The 2nd Law (F = ma): Force equals Mass times Acceleration. The heavier an object is, the more force you need to move it.",
      "4. Example of 2nd Law: It is much easier to push an empty shopping cart (low mass) than a shopping cart full of giant watermelons (high mass).",
      "5. The 3rd Law (Action/Reaction): For every action, there is an equal and opposite reaction.",
      "6. Example of 3rd Law: When a swimmer kicks the wall backwards (action), the wall pushes the swimmer forward (reaction).",
      "7. Example of 3rd Law: A rocket shoots exhaust gases DOWN down down, which pushes the heavy rocket UP up up into space."
    ],
    practice: [
      "Which law explains why you need to wear a seatbelt in a fast car?",
      "If you push a toy car and a real car with the exact same strength, which law explains why the real car barely moves?",
      "When you jump off a small boat onto a dock, the boat moves backward. Which law is this?",
      "What is the nickname for Newton's First Law?"
    ],
    answers: [
      "The 1st Law (Inertia). Your body wants to keep moving at 60mph even if the car brakes suddenly!",
      "The 2nd Law! The real car has way more mass.",
      "The 3rd Law! Action (you jump forward) and Reaction (boat is pushed backward).",
      "The Law of Inertia!"
    ],
    funFact: "Sir Isaac Newton invented a new type of math called Calculus just so he could prove his laws of motion and gravity were correct! Talk about doing extra homework!",
    quiz: [
      { question: "Which law is also known as the Law of Inertia?", options: ["A) 1st Law", "B) 2nd Law", "C) 3rd Law"], answer: "A) 1st Law" },
      { question: "F = ma (Force equals Mass times Acceleration) represents which law?", options: ["A) 1st Law", "B) 2nd Law", "C) 3rd Law"], answer: "B) 2nd Law" },
      { question: "For every action there is an equal and opposite reaction. Which law?", options: ["A) 1st Law", "B) 2nd Law", "C) 3rd Law"], answer: "C) 3rd Law" },
      { question: "Why is an elephant harder to push than a mouse?", options: ["A) Elements", "B) The 1st Law", "C) The 2nd Law (More mass requires more force)"], answer: "C) The 2nd Law (More mass requires more force)" },
      { question: "If you slide a book on a table, why does it eventually stop moving?", options: ["A) It gets tired", "B) Friction acts as an unbalanced force against it", "C) It loses its mass"], answer: "B) Friction acts as an unbalanced force against it" }
    ]
  },
  "Grade 8-Filipino-Florante at Laura": {
    title: "Ang Awit na Florante at Laura",
    explanation: "Mabuhay! Sa Grade 8, babasahin mo ang isa sa pinakamahusay na akda sa literaturang Pilipino: Ang 'Florante at Laura' ni Francisco Balagtas. Isa itong 'Awit' (naiiba sa Korido) na punong-puno ng pag-ibig, pagtataksil, at kabayanihan. Isinulat ito ni Balagtas habang siya ay nasa loob ng kulungan! 🗡️💔🛡️",
    examples: [
      "1. Anyo ng Awit: Bawat linya ay may 12 pantig (syllables). Binibigkas ito nang mabagal o andante, at higit na makatotohanan ang kwento kaysa sa korido.",
      "2. Tagpuan: Nagsisimula ang kwento sa isang madilim at mapanglaw na gubat sa labas ng kaharian ng Albanya.",
      "3. Mga Pangunahing Tauhan: Florante (kristiyanong duke na nakatali sa puno), Laura (prinsesa at iniibig ni Florante), Aladin (prinsipeng Moro na nagligtas kay Florante), at Flerida (iniibig ni Aladin).",
      "4. Ang Kontrabida: Si Konde Adolfo! Isang mainggitin at sakim na tao na umagaw sa trono ng Albanya at nagpakulong kay Florante.",
      "5. Aral 1: Ang pag-iingat sa mga taong kunwari ay mabait pero sa loob ay palihim na kaaway (balat-kayo).",
      "6. Aral 2: Ang tunay na pagkakaibigan at pagtutulungan ay walang pinipiling relihiyon (tulad ng Kristiyanong si Florante at Morong si Aladin).",
      "7. Wastong Pagpapalaki: Itinuro sa akda na huwag palakihin ang bata sa layaw dahil baka hindi nito makayanan ang mga pagsubok sa buhay."
    ],
    practice: [
      "Ilang pantig (syllables) mayroon sa isang linya ng tula ng isang Awit?",
      "Sino ang pambansang makata na sumulat ng Florante at Laura habang nasa kulungan?",
      "Sino ang kontrabida na umagaw sa trono ng Albanya dahil sa matinding inggit kay Florante?",
      "Saan nagsimula ang tagpuan ng kwento kung saan nakatali si Florante?"
    ],
    answers: [
      "Labindalawang (12) pantig!",
      "Si Francisco Balagtas (kilala rin bilang Francisco Baltazar).",
      "Si Konde Adolfo!",
      "Sa isang madilim at mapanglaw na gubat."
    ],
    funFact: "Itinuturing na isang 'Obra Maestra' ang Florante at Laura. Nakapaloob daw sa kwentong ito ang mga patagong pagbatikos at hinaing ni Balagtas laban sa kalupitan ng mga Kastila sa mga Pilipino noong panahong iyon!",
    quiz: [
      { question: "Anong uri ng tulang pasalaysay ang Florante at Laura na may 12 pantig?", options: ["A) Korido", "B) Awit", "C) Epiko"], answer: "B) Awit" },
      { question: "Sino ang Morong prinsipe na nagligtas kay Florante mula sa dalawang leon?", options: ["A) Menandro", "B) Adolfo", "C) Aladin"], answer: "C) Aladin" },
      { question: "Sino ang makatang sumulat ng Florante at Laura?", options: ["A) Jose Rizal", "B) Francisco Balagtas", "C) Andres Bonifacio"], answer: "B) Francisco Balagtas" },
      { question: "Sino ang mapanlinlang at sakim na kontrabida sa kwento?", options: ["A) Konde Adolfo", "B) Sultan Ali-Adab", "C) Duke Briseo"], answer: "A) Konde Adolfo" },
      { question: "Saan nagsimula ang madulang kwento ni Florante?", options: ["A) Sa gitna ng dagat", "B) Sa palasyo ng Albanya", "C) Sa isang madilim at gubat na mapanglaw"], answer: "C) Sa isang madilim at gubat na mapanglaw" }
    ]
  },
  "Grade 8-Araling Panlipunan-Kasaysayan ng Daigdig": {
    title: "Kasaysayan ng Daigdig: Sinaunang Kabihasnan",
    explanation: "Kumusta, Grade 8! Sa AP ngayong taon, lalabas tayo ng Asya at pag-aaralan ang Kasaysayan ng BUONG DAIGDIG! Paano ba nagsimula ang mga pinaka-unang lungsod, batas, at imbensyon ng tao? Aalukin tayo ng mga Sinaunang Kabihasnan—ang mga duyan ng sibilisasyon. Mula sa pagiging palaboy (nomads), tayo ay natutong magtanim at nagtayo ng mga imperyo! 🌍🏛️🏺",
    examples: [
      "1. Mesopotamia: Ang pinakaunang kabihasnan (kilala ngayon bilang Iraq). Dito naimbento ang unang sistema ng pagsulat, ang 'Cuneiform', at ang gulong!",
      "2. Ehipto (Egypt): Sumibol sa pampang ng Nile River. Sikat sila sa kanilang mga Paraon (Pharaohs), mga Piramide (Pyramids), at pagsulat na 'Hieroglyphics'.",
      "3. Indus: Sa Timog Asya, sikat sa kanilang planado at malinis na lungsod na may mga poso negro pa (Mohenjo-Daro at Harappa).",
      "4. Tsina (China): Nagmula sa lambak ng Huang Ho. Itinayo ang Great Wall of China. Sila ang nakaimbento ng papel, pulbura (gunpowder), at compass.",
      "5. Kabihasnang Klasiko ng Greece: Dito nagmula ang konsepto ng Demokrasya (sa Athens) at sikat sa kanilang matatapang na mandirigma (sa Sparta).",
      "6. Kabihasnang Klasiko ng Rome: Isang malakas na imperyo na sikat sa batas, gladiators, at magagandang kalsada at tulay.",
      "7. Heograpiya: Halos lahat ng sinaunang sibilisasyon ay umusbong malapit sa mga ILOG, dahil ang tubig ang susi para makapagtanim (Agriculture)!"
    ],
    practice: [
      "Anong sinaunang kabihasnan ang nakaimbento ng unang sistema ng pagsulat na tinatawag na Cuneiform?",
      "Sa anong bansa nagmula ang mga Pyramids at Mummies?",
      "Anong heograpikal na anyo ang paboritong pagtayuan ng sibilisasyon dahil maganda itong pagtamnan?",
      "Saan nagmula ang sikat na sibilisasyon na nakaimbento ng pulbura at papel?"
    ],
    answers: [
      "Ang Mesopotamia!",
      "Sa Ehipto (Egypt)!",
      "Sa mga Ilog (Rivers) o lambak-ilog!",
      "Sa Tsina (China)!"
    ],
    funFact: "Ang sistema ng batas na Code of Hammurabi mula sa Mesopotamia ay may konseptong 'Mata sa mata, ngipin sa ngipin'. Ang parusa sa isang krimen ay tumutugma mismo sa krimeng ginawa!",
    quiz: [
      { question: "Aling sinaunang kabihasnan ang itinuturing na pinakamatanda sa buong daigdig?", options: ["A) Ehipto", "B) Tsina", "C) Mesopotamia"], answer: "C) Mesopotamia" },
      { question: "Ano ang tawag sa sinaunang sistema ng pagsulat na imbensyon ng mga Egyptian?", options: ["A) Hieroglyphics", "B) Cuneiform", "C) Calligraphy"], answer: "A) Hieroglyphics" },
      { question: "Alin ang karaniwang katangian ng heograpiya kung saan sumibol ang mga unang sibilisasyon?", options: ["A) Desyerto", "B) Lambak-Ilog", "C) Bundok"], answer: "B) Lambak-Ilog" },
      { question: "Sa anong klasikal na kabihasnan unang nagamit ang sistema ng 'Demokrasya'?", options: ["A) Rome", "B) Ehipto", "C) Greece (Athens)"], answer: "C) Greece (Athens)" },
      { question: "Sino ang mga kilalang hari na inililibing sa mga magagarbong piramide?", options: ["A) Emperador", "B) Paraon (Pharaoh)", "C) Presidente"], answer: "B) Paraon (Pharaoh)" }
    ]
  },

  // GRADE 9
  "Grade 9-Mathematics-Quadratic Equations": {
    title: "Quadratic Equations",
    explanation: "Welcome to Grade 9 Math! You've mastered straight lines, but life is full of curves. Enter Quadratic Equations! A quadratic equation creates a beautiful U-shaped curve called a Parabola. It's used to calculate the path of a bouncing ball, a rocket launching, or the shape of a bridge. The signature of a quadratic equation is the 'x squared' (x²). 📈🚀🎢",
    examples: [
      "1. Standard Form: The classic look of a quadratic equation is ax² + bx + c = 0. (The 'a' cannot be zero!).",
      "2. The Parabola: If you graph a quadratic equation, it looks like a 'U' (if 'a' is positive) or an upside-down 'U' (if 'a' is negative).",
      "3. The Roots/Solutions: We solve these equations to find where the curve crosses the x-axis. These are called the roots, zeros, or x-intercepts.",
      "4. Method 1: Factoring! Sometimes you can break the equation into two binomials. (e.g., x² + 5x + 6 = 0 becomes (x+2)(x+3) = 0).",
      "5. Method 2: Extracting Square Roots! Used when there is no 'bx' term. (e.g., x² - 9 = 0 -> x² = 9 -> x = 3 or -3).",
      "6. Method 3: The Quadratic Formula! The ultimate weapon that works on ANY quadratic equation: x = [-b ± √(b² - 4ac)] / 2a.",
      "7. The Vertex: The absolute highest or lowest point of the parabola curve."
    ],
    practice: [
      "What is the highest exponent/power of the variable in a quadratic equation?",
      "If a quadratic equation is x² = 25, what are the two possible values for x?",
      "What is the name of the U-shaped curve created by graphing a quadratic equation?",
      "In the equation 3x² + 4x - 5 = 0, what is the value of 'c'?"
    ],
    answers: [
      "The highest exponent is 2 (x²).",
      "x can be 5 or -5 (because 5x5=25, and -5x-5=25).",
      "It is called a Parabola!",
      "The value of 'c' is -5."
    ],
    funFact: "Satellite dishes and the shiny reflectors inside flashlights and car headlights are perfectly curved into parabolas to focus perfectly straight signals or beams of light!",
    quiz: [
      { question: "What is the standard form of a quadratic equation?", options: ["A) y = mx + b", "B) ax² + bx + c = 0", "C) A = πr²"], answer: "B) ax² + bx + c = 0" },
      { question: "What shape does a quadratic equation make when graphed?", options: ["A) A straight line", "B) A perfect circle", "C) A U-shaped Parabola"], answer: "C) A U-shaped Parabola" },
      { question: "What is the highest power of 'x' in a true quadratic equation?", options: ["A) 1", "B) 2", "C) 3"], answer: "B) 2" },
      { question: "How many solutions/roots does the equation x² = 16 have?", options: ["A) One (4)", "B) Two (4 and -4)", "C) None"], answer: "B) Two (4 and -4)" },
      { question: "What is the absolute highest or lowest point of a parabola called?", options: ["A) The Vertex", "B) The Axis", "C) The Root"], answer: "A) The Vertex" }
    ]
  },
  "Grade 9-English-Conditionals": {
    title: "Conditionals (If-Clauses)",
    explanation: "Welcome to Grade 9 English! Do you like thinking about 'What Ifs'? Conditionals are sentences that show a cause and effect, or a hypothetical situation. They always have an 'If' clause (the condition) and a 'Main' clause (the result). Let's learn to talk about facts, dreams, and regrets! 💭🤔🚦",
    examples: [
      "1. Zero Conditional (Facts & Truths): If you heat ice, it melts. (Always true. Uses Present + Present).",
      "2. First Conditional (Real future possibilities): If it rains tomorrow, we will cancel the picnic. (Very possible. Uses Present + Will/Future).",
      "3. Second Conditional (Unreal/Imaginary present or future): If I won the lottery, I would buy an island. (Not likely to happen. Uses Past + Would).",
      "4. Second Conditional tip: We often use 'were' for all subjects! 'If I were a bird, I would fly away.'",
      "5. Third Conditional (Regrets about the past): If I had studied harder, I would have passed the test. (Impossible to change now. Uses Past Perfect + Would have).",
      "6. Changing the order: You can swap the clauses! 'We will cancel the picnic if it rains.' (Notice: No comma needed when 'if' is in the middle!)",
      "7. Unless: 'Unless' means 'If not'. (Example: 'Unless you study, you will fail' = 'If you don't study, you will fail')."
    ],
    practice: [
      "Identify the conditional: 'If I drop an apple, it falls to the ground.'",
      "Complete the First Conditional: 'If you eat all your vegetables, you _____ got dessert.' (will get / would get)",
      "If I say 'If I had a million dollars, I would travel the world', is this likely to happen or just a dream?",
      "Rewrite this using 'Unless': 'If it doesn't rain, we will play outside.'"
    ],
    answers: [
      "Zero Conditional (It is a scientific fact!).",
      "Will get!",
      "It is a dream/imaginary. (Second Conditional).",
      "'Unless it rains, we will play outside.'"
    ],
    funFact: "In the Second Conditional, we say 'If I WERE you' instead of 'If I WAS you'. This is a leftover grammar rule from old English called the 'Subjunctive Mood'!",
    quiz: [
      { question: "Which conditional is used for scientific facts?", options: ["A) Zero Conditional", "B) First Conditional", "C) Second Conditional"], answer: "A) Zero Conditional" },
      { question: "Complete the sentence: 'If I ___ a billionaire, I would buy a castle.'", options: ["A) am", "B) was", "C) were"], answer: "C) were" },
      { question: "Which conditional expresses a regret about the past that cannot be changed?", options: ["A) First Conditional", "B) Second Conditional", "C) Third Conditional"], answer: "C) Third Conditional" },
      { question: "Complete: 'If you study hard, you ___ the exam.' (A real possibility of the future).", options: ["A) would pass", "B) will pass", "C) pass"], answer: "B) will pass" },
      { question: "What does 'unless' mean in conditional sentences?", options: ["A) If not", "B) Always", "C) Only when"], answer: "A) If not" }
    ]
  },
  "Grade 9-Science-Respiratory & Circulatory": {
    title: "Respiratory and Circulatory Systems",
    explanation: "Welcome to Grade 9 Science! You know what your heart and lungs do, but did you know they are the ultimate tag-team? Your Respiratory System (Lungs) and Circulatory System (Heart and Blood) work together to deliver the 'Fuel of Life' (Oxygen) to every tiny cell in your body, and carry out the trash (Carbon Dioxide). 🫀🫁🩸",
    examples: [
      "1. The Intake: You breathe in through your nose/mouth. Air travels down the Trachea (windpipe) into the Lungs.",
      "2. The Exchange (Alveoli): Inside the lungs are millions of tiny air sacs called Alveoli. Here, Oxygen sneaks into the blood, and Carbon Dioxide sneaks out to be exhaled.",
      "3. The Delivery System: Now the blood is rich with oxygen. It travels to the Heart.",
      "4. The Pump: The Heart pumps this oxygen-rich blood through tubes called Arteries to the rest of the body (muscles, brain, organs).",
      "5. The Return Trip: After the body uses the oxygen, it produces Carbon Dioxide. The blood, now poor in oxygen, travels back to the heart through Veins.",
      "6. The Loop: The heart pumps that dirty blood back to the lungs to drop off the carbon dioxide and pick up fresh oxygen. The cycle repeats!",
      "7. Capillaries: The tiniest blood vessels where the actual exchange of gases and nutrients happens in your body's tissues."
    ],
    practice: [
      "What are the tiny air sacs in the lungs called where gas exchange happens?",
      "Which blood vessels carry oxygen-rich blood AWAY from the heart?",
      "Which blood vessels carry blood BACK to the heart?",
      "What waste gas do we breathe out?"
    ],
    answers: [
      "Alveoli!",
      "Arteries!",
      "Veins!",
      "Carbon Dioxide (CO2)!"
    ],
    funFact: "Your heart beats about 100,000 times in a single day, pumping roughly 2,000 gallons of blood! It does this continually from before you are born until you die without ever stopping.",
    quiz: [
      { question: "What is the scientific name for the windpipe?", options: ["A) Esophagus", "B) Trachea", "C) Capillary"], answer: "B) Trachea" },
      { question: "Where does the exchange of oxygen and carbon dioxide take place in the lungs?", options: ["A) Bronchi", "B) Trachea", "C) Alveoli"], answer: "C) Alveoli" },
      { question: "What type of blood vessel carries blood AWAY from the heart to the body?", options: ["A) Vein", "B) Artery", "C) Capillary"], answer: "B) Artery" },
      { question: "What does the respiratory system bring into the body?", options: ["A) Carbon Monoxide", "B) Oxygen", "C) Carbon Dioxide"], answer: "B) Oxygen" },
      { question: "Which two systems work tightly together to deliver oxygen to your cells?", options: ["A) Respiratory and Digestive", "B) Respiratory and Circulatory", "C) Skeletal and Muscular"], answer: "B) Respiratory and Circulatory" }
    ]
  },
  "Grade 9-Filipino-Noli Me Tangere": {
    title: "Noli Me Tangere",
    explanation: "Mabuhay! Sa Grade 9, isang obra maestra ang magmumulat sa iyong isipan: Ang 'Noli Me Tangere' (Touch Me Not), ang unang nobela ng ating pambansang bayani na si Dr. Jose Rizal. Isinulat niya ito hindi gamit ang espada, kundi ang pluma, upang ibunyag ang mga pang-aabuso, bulok na sistema, at kalupitan ng mga prayle at pamahalaang Kastila sa Pilipinas. 📖🔥🇵🇭",
    examples: [
      "1. Ang Pamagat: Ang 'Noli Me Tangere' ay salitang Latin na nagangahulugang 'Huwag mo akong salingin' (Touch Me Not), na hango sa Bibliya.",
      "2. Crisostomo Ibarra: Ang pangunahing tauhan. Isang matalinong Pilipinong nag-aral sa Europa na may pangarap na magtayo ng paaralan sa San Diego para sa kanyang mga kababayan.",
      "3. Maria Clara: Ang maganda at mahinhing katipan ni Ibarra. Simbolo siya ng inang bayan at ng tipikal na dalagang Pilipina noong panahong iyon.",
      "4. Padre Damaso: Ang malupit at makapangyarihang kurang Pransiskano. Siya ang dating kura ng San Diego na may malaking galit kay Don Rafael (ama ni Ibarra).",
      "5. Elias: Isang misteryoso at matapang na bangkero at rebeldeng kaibigan ni Ibarra. Kumakatawan siya sa mga Pilipinong uhaw sa katarungan at handang lumaban para sa bayan.",
      "6. Sisa: Isang mapagmahal na ina kina Basilio at Crispin. Namatay sa pagdurusa at nabaliw dahil sa kalupitan na sinapit ng kanyang mga anak mula sa mga kura.",
      "7. Layunin ng Nobela: Nais ni Rizal na ipakita ang 'Kanser ng Lipunan' sa Pilipinas upang magising ang mga Pilipino na ipaglaban ang kanilang mga karapatan."
    ],
    practice: [
      "Ano ang ibig sabihin ng pamagat na 'Noli Me Tangere' sa Tagalog?",
      "Sino ang pangunahing tauhan na nag-aral ng pitong taon sa Europa at nangangarap magtayo ng paaralan?",
      "Sino ang ina nina Basilio at Crispin na nabaliw dahil sa nawalay ang mga anak?",
      "Bakit isinulat ni Dr. Jose Rizal ang nobelang ito?"
    ],
    answers: [
      "'Huwag mo akong salingin'.",
      "Si Juan Crisostomo Ibarra!",
      "Si Sisa.",
      "Upang isiwalat ang katotohanan tungkol sa mga pang-aabuso at kanser ng lipunan (ang mga Kastila) sa Pilipinas."
    ],
    funFact: "Isinulat ni Rizal ang kalahati ng Noli Me Tangere sa Madrid, Espanya. Ipinagpatuloy niya sa Paris, France, at tinapos sa Berlin, Germany! Halos wala siyang perang pampalimbag nito kung hindi lang siya tinulungan ng kaibigang si Maximo Viola.",
    quiz: [
      { question: "Ano ang kahulugan ng 'Noli Me Tangere'?", options: ["A) Bayang Magiliw", "B) Huwag mo akong salingin", "C) Kalayaan ngayon"], answer: "B) Huwag mo akong salingin" },
      { question: "Sino ang matapang at rebeldeng kaibigan ni Ibarra na nagligtas sa kanya?", options: ["A) Kapitan Tiago", "B) Padre Salvi", "C) Elias"], answer: "C) Elias" },
      { question: "Sino ang kurang Pransiskano na mortal na kaaway ni Ibarra at ng kanyang ama?", options: ["A) Padre Damaso", "B) Padre Florentino", "C) Padre Salvi"], answer: "A) Padre Damaso" },
      { question: "Sino ang kasintahan ni Ibarra na sumisimbolo sa Inang Bayan?", options: ["A) Sisa", "B) Maria Clara", "C) Paulita Gomez"], answer: "B) Maria Clara" },
      { question: "Ano ang sinisimbolo ni Sisa sa nobelang Noli Me Tangere?", options: ["A) Pilipinas na nagpapakasakit at nagdurusa", "B) Kagandahan at Karangyaan", "C) Ang Pagbabago"], answer: "A) Pilipinas na nagpapakasakit at nagdurusa" }
    ]
  },
  "Grade 9-Araling Panlipunan-Ekonomiks": {
    title: "Ekonomiks (Pamamahala ng Yaman)",
    explanation: "Maligayang pagdating sa Grade 9 AP! Nakaranas ka na bang mag-isip kung ano ang bibilhin dahil kulang ang iyong pera? Yan ay Ekonomiks! Ang Ekonomiks ay ang pag-aaral kung paano ginagamit ng mga tao at ng bansa ang kanilang LIMITADONG yaman upang matugunan ang kanilang WALANG KATAPUSANG pangangailangan at kagustuhan. 💸📊🛒",
    examples: [
      "1. Kakapusan (Scarcity): Ito ang pinakapuso ng Ekonomiks! Ang katotohanan na ang yaman sa mundo (tulad ng langis, tubig, pera) ay may hangganan, habang ang gusto ng tao ay walang hanggan.",
      "2. Pangangailangan (Needs): Mga bagay na DAPAT mayroon tayo para mabuhay (Pagkain, Damit, Tirahan).",
      "3. Kagustuhan (Wants): Mga bagay na nagpapagaan at nagpapasarap ng buhay, pero kaya nating mabuhay nang wala ito (Cellphone, Milk Tea, Sapatos na branded).",
      "4. Opportunity Cost: Ang halaga ng bagay na iyong ISINUKO o pinakawalan nang pumili ka ng ibang opsyon. (Ex: Pinili mong matulog kaysa mag-aral. Ang opportunity cost ay ang mataas na marka na sana ay nakuha mo).",
      "5. Supply: Ang dami ng produkto na handang ipagbili ng mga negosyante.",
      "6. Demand: Ang dami ng produkto na gustong bilhin ng mga tao. Kung mataas ang demand at kaunti ang supply, TATAAS ang presyo! (Law of Supply and Demand).",
      "7. Alokasyon: Ang tamang paghahati-hati at pamamahagi ng mga limitadong yaman o budget."
    ],
    practice: [
      "Ano ang tawag sa sitwasyon kung saan hindi sapat ang yaman para sa lahat ng gusto ng tao?",
      "Kung pinili mong bumili ng sapatos kaya di ka nakabili ng bag, ano ang tawag sa halaga ng isinuko mong 'bag'?",
      "Gumawa ng listahan, ang Wifi ba ay Needs o Wants?",
      "Ano ang kadalasan nangyayari sa presyo ng Payong kapag umuulan (tumaas ang demand)?"
    ],
    answers: [
      "Kakapusan (Scarcity).",
      "Opportunity Cost!",
      "Ito ay Wants (Kagustuhan), dahil mabubuhay ka pa rin kahit walang Wifi!",
      "Tataas ang presyo ng payong dahil mas maraming gustong bumili!"
    ],
    funFact: "Ang salitang Ekonomiks ay nagmula sa salitang Griyego na 'Oikonomia' na ang ibig sabihin ay 'Pamamahala ng Kabahayan' (household management).",
    quiz: [
      { question: "Ano ang pangunahing suliranin/problema sa Ekonomiks?", options: ["A) Maraming pera ang mga tao", "B) Kakapusan (Scarcity)", "C) Kawalan ng trabaho"], answer: "B) Kakapusan (Scarcity)" },
      { question: "Alin sa mga sumusunod ang 'Pangangailangan' (Needs)?", options: ["A) Paboritong Video Game", "B) Branded na sapatos", "C) Masusustansyang Pagkain"], answer: "C) Masusustansyang Pagkain" },
      { question: "Kung tataas ang demand ng baboy dahil magpapasko pero hindi sapat ang supply nito, ano ang mangyayari sa presyo?", options: ["A) Bababa ang presyo", "B) Tataas ang presyo", "C) Walang magbabago"], answer: "B) Tataas ang presyo" },
      { question: "Ano ang tawag sa isinakripisyo o walang kalabang alternatibo kapalit ng ginawang pagpili?", options: ["A) Opportunity Cost", "B) Trade-off", "C) Marginal Thinking"], answer: "A) Opportunity Cost" },
      { question: "Ano ang pinagmulan sa salitang Griyego ng salitang Ekonomiks?", options: ["A) Oikonomia", "B) Polis", "C) Demos"], answer: "A) Oikonomia" }
    ]
  },

  // GRADE 10
  "Grade 10-Mathematics-Polynomials": {
    title: "Polynomials",
    explanation: "Welcome to Grade 10 Math! You've learned about expressions and equations, now let's meet their big family: Polynomials! The word literally means 'many names' or 'many terms'. A polynomial is a math expression made of variables, coefficients, and exponents, all strung together with addition and subtraction. 🔢➕✖️",
    examples: [
      "1. What is a Polynomial? It's an expression like 4x³ + 2x² - 5x + 7. The exponents MUST be positive whole numbers (no negative exponents, no square roots of variables).",
      "2. The Degree: The highest exponent in the polynomial determines its 'Degree'. In 4x³ + 2x² - 5x + 7, the degree is 3.",
      "3. Monomial (1 term): 7x. Binomial (2 terms): 3x + 4. Trinomial (3 terms): x² + 5x + 6.",
      "4. Standard Form: Polynomials are written from the highest exponent down to the lowest exponent.",
      "5. Leading Coefficient: The number in front of the term with the highest degree.",
      "6. Adding/Subtracting: Only combine Like Terms! (Add precisely matching variables and exponents).",
      "7. Multiplying: We use the distributive property (FOIL method for binomials). Remember, x² times x³ equals x⁵ (add the exponents!)."
    ],
    practice: [
      "What is the degree of the polynomial: 5x⁴ - 3x² + x?",
      "Is an expression with 2 terms called a monomial or a binomial?",
      "Is '2x⁻² + 5' a polynomial? Why or why not?",
      "Write this in standard form: -2x + 4x³ + 7."
    ],
    answers: [
      "The degree is 4 (the highest exponent).",
      "Binomial!",
      "No! Polynomials cannot have negative exponents.",
      "4x³ - 2x + 7."
    ],
    funFact: "Polynomials are essentially the hidden backbone of almost all modern computer graphics! When you see a smooth 3D curve in a video game or animation, the computer is calculating polynomial equations to draw it.",
    quiz: [
      { question: "What is the degree of this polynomial: 7x⁵ - 3x³ + 2x - 1?", options: ["A) 7", "B) 5", "C) 3"], answer: "B) 5" },
      { question: "Which of the following is NOT a polynomial?", options: ["A) 3x² - 4", "B) x³ + 2x", "C) 5x⁻² + 3"], answer: "C) 5x⁻² + 3" },
      { question: "What do you call a polynomial with exactly three terms?", options: ["A) Monomial", "B) Binomial", "C) Trinomial"], answer: "C) Trinomial" },
      { question: "What is standard form?", options: ["A) Highest exponent down to lowest", "B) Lowest exponent up to highest", "C) Alphabetical order"], answer: "A) Highest exponent down to lowest" },
      { question: "If you multiply x³ by x⁴, what do you get?", options: ["A) x¹²", "B) x⁷", "C) 2x⁷"], answer: "B) x⁷" }
    ]
  },
  "Grade 10-English-Argumentative Writing": {
    title: "Argumentative Writing",
    explanation: "Welcome to Grade 10 English! It's time to win some debates! An Argumentative Essay isn't just about yelling your opinion; it is about proving why your opinion is the logical truth, backed up by solid evidence and facts. A great argumentative writer respectfully crushes the opposing view! 🗣️📝⚖️",
    examples: [
      "1. The Core: You take a firm STAND on an issue. (e.g., 'School uniforms should be mandatory').",
      "2. The Claim (Thesis): A strong, clear sentence stating your argument. This goes at the end of your introduction.",
      "3. The Evidence: The proof! Facts, statistics, expert quotes, and logical reasons that support your claim.",
      "4. The Counterclaim: The secret weapon! You actually state the OPPOSITE argument! ('Some people argue that uniforms destroy individuality...').",
      "5. The Rebuttal: The counter-punch! After stating the counterclaim, you immediately prove why it's WRONG. ('...However, studies show uniforms reduce bullying by 40%').",
      "6. Formal Tone: Avoid using 'I think' or 'In my opinion'. State your claim as a fact! ('Uniforms improve focus' instead of 'I think uniforms improve focus').",
      "7. The Conclusion: Restate your claim in a new way and leave the reader with a powerful final thought."
    ],
    practice: [
      "What is the sentence called that clearly states your main argument?",
      "Should you include the opposing viewpoint in your essay? What is it called?",
      "Why should you avoid saying 'I think' in an argumentative essay?",
      "What do you call the part where you prove the opposing viewpoint is wrong?"
    ],
    answers: [
      "The Claim or Thesis Statement.",
      "Yes! It is called the Counterclaim.",
      "Because it makes your argument sound weak. State your point firmly like a fact!",
      "The Rebuttal."
    ],
    funFact: "Lawyers use the exact same structure of Claim, Evidence, Counterclaim, and Rebuttal when arguing cases in court to convince a judge or jury!",
    quiz: [
      { question: "What is the heart of an argumentative essay?", options: ["A) Entertaining a story", "B) Taking a logical, factual stand on an issue", "C) Discussing your feelings"], answer: "B) Taking a logical, factual stand on an issue" },
      { question: "What is a 'Counterclaim'?", options: ["A) The opposing viewpoint", "B) A piece of evidence", "C) The conclusion paragraph"], answer: "A) The opposing viewpoint" },
      { question: "What is a 'Rebuttal'?", options: ["A) The writer's main argument", "B) Proving why the opposing viewpoint is wrong", "C) A fake statistic"], answer: "B) Proving why the opposing viewpoint is wrong" },
      { question: "How should you state your claim?", options: ["A) Strong and direct, like a fact", "B) By starting with 'I feel that...'", "C) As a vague question"], answer: "A) Strong and direct, like a fact" },
      { question: "Which is the BEST kind of evidence?", options: ["A) 'My friend said so'", "B) Statistics from a verified study", "C) A random website blog"], answer: "B) Statistics from a verified study" }
    ]
  },
  "Grade 10-Science-Introduction to Genetics": {
    title: "Introduction to Genetics",
    explanation: "Welcome to Grade 10 Science! Have you ever wondered why you have the same eye color as your mom, or curly hair like your grandpa? The answer lies in Genetics! Genetics is the study of how traits are passed from parents to offspring. It's the blueprint of life hidden inside every single one of your cells! 🧬🔬👁️",
    examples: [
      "1. DNA: The ultimate instruction manual! It is a long, twisted molecule (Double Helix) that holds the code for building you.",
      "2. Genes: Small sections of DNA. Each gene contains the recipe for a specific trait (like hair texture or dimples).",
      "3. Chromosomes: DNA is super long, so it packs itself tightly into X-shaped structures called Chromosomes. Humans have 46 chromosomes (23 from mom, 23 from dad).",
      "4. Alleles: Different versions of the same gene. For example, the gene for eye color has a brown allele and a blue allele.",
      "5. Dominant vs Recessive: Dominant traits (capital letters, 'B') will overpower and hide Recessive traits (lowercase letters, 'b').",
      "6. Genotype vs Phenotype: Genotype is the invisible letter code you carry (Bb). Phenotype is what you actually look like (Brown eyes!).",
      "7. Gregor Mendel: Known as the 'Father of Genetics', he discovered all these rules in the 1800s by studying pea plants!"
    ],
    practice: [
      "How many total chromosomes does a normal human cell have?",
      "If 'B' is dominant (Brown eyes) and 'b' is recessive (Blue eyes), what eye color will someone with a 'Bb' genotype have?",
      "What do we call the small sections of DNA that code for specific traits?",
      "Who is considered the Father of Genetics?"
    ],
    answers: [
      "46 chromosomes! (23 pairs).",
      "They will have Brown eyes, because the dominant B overpowers the b!",
      "Genes!",
      "Gregor Mendel!"
    ],
    funFact: "If you uncoiled all the DNA contained in just ONE of your microscopic cells, it would stretch out to be about 6 feet (2 meters) long!",
    quiz: [
      { question: "What shape is a DNA molecule?", options: ["A) A perfect circle", "B) A twisted ladder (Double helix)", "C) A single straight line"], answer: "B) A twisted ladder (Double helix)" },
      { question: "What is a 'Phenotype'?", options: ["A) The physical appearance of a trait", "B) The hidden genetic code", "C) The shape of the cell"], answer: "A) The physical appearance of a trait" },
      { question: "How many total chromosomes do humans inherit from their parents?", options: ["A) 23", "B) 46", "C) 100"], answer: "B) 46" },
      { question: "A trait that overpowers and hides another version of that trait is called...", options: ["A) Recessive", "B) Dominant", "C) Mutant"], answer: "B) Dominant" },
      { question: "Who is known as the 'Father of Genetics'?", options: ["A) Albert Einstein", "B) Isaac Newton", "C) Gregor Mendel"], answer: "C) Gregor Mendel" }
    ]
  },
  "Grade 10-Filipino-El Filibusterismo": {
    title: "El Filibusterismo",
    explanation: "Mabuhay! Sa Grade 10, pag-aaralan mo ang karugtong at sequel ng Noli Me Tangere: Ang 'El Filibusterismo' (Ang Paghahari ng Kasakiman). Kung ang Noli ay nobela ng lipunan na umaasang may pagbabago, ang El Fili ay nobelang pulitikal na galit at nag-uudyok ng direktang rebolusyon! Inialay ito ni Rizal sa tatlong paring martir (GomBurZa). 🧨🕰️⚖️",
    examples: [
      "1. Simoun: Ang mayamang mag-aalahas. Siya ay si Crisostomo Ibarra na nagbabalik pagkatapos ng 13 taon, punong-puno ng galit at nagpaplano ng paghihiganti at himagsikan.",
      "2. Basilio: Ang binatang anak ni Sisa na nag-aaral ng medisina. Una siyang tumanggi sa rebolusyon, ngunit sa huli ay sumali dahil sa kawalang-katarungan.",
      "3. Isagani: Isang idealistang mag-aaral na pamangkin ni Padre Florentino. Iniibig si Paulita Gomez ngunit itinapon ang bomba dahil ayaw madamay ang kasintahan.",
      "4. Kabesang Tales: Isang masipag na magsasaka na inagawan ng lupa ng mga prayle. Siya ay nagrebelde at naging bandido bilang si 'Matanglawin'.",
      "5. Ang Lampara: Ang simbolo ng himagsikan! Isang bombang nakatago sa loob ng lampara na sasabog sa kasalan at papatay sa lahat ng tiwaling opisyal.",
      "6. Paulita Gomez: Pamangkin ni Donya Victorina at katipan ni Isagani, ngunit nagpakasal kay Juanito Pelaez dahil siya ay mayaman.",
      "7. Ang Pagwawakas: Pumalpak ang himagsikan, uminom ng lason si Simoun, at itinapon ni Padre Florentino ang mga kayamanan ni Simoun sa dagat upang hindi na magamit sa kasamaan."
    ],
    practice: [
      "Sino si Simoun, ang mayamang mag-aalahas, sa totoong buhay?",
      "Ano ang nakatago sa loob ng lampara na ibibigay sana ni Simoun bilang regalo sa isang kasal?",
      "Sino ang binatang anak ni Sisa na naging estudyante ng medisina at kalaunan ay sumali kay Simoun?",
      "Kanino inialay ni Rizal ang El Filibusterismo?"
    ],
    answers: [
      "Siya si Crisostomo Ibarra!",
      "Isang malakas na bomba!",
      "Si Basilio.",
      "Sa tatlong paring martir: Gomez, Burgos, Zamora (GomBurZa)."
    ],
    funFact: "Halos hindi malimbag ang El Filibusterismo dahil inubusan si Rizal ng pera habang nasa ubra! Nailigtas siya ng isa pang kaibigang si Valentin Ventura na siyang nagbayad sa pag-iimprenta ng aklat.",
    quiz: [
      { question: "Ano ang totoong pagkakakilanlan ni Simoun, ang mag-aalahas?", options: ["A) Elias", "B) Crisostomo Ibarra", "C) Kapitan Tiago"], answer: "B) Crisostomo Ibarra" },
      { question: "Ano ang nakatago sa loob ng iniregalong lampara ni Simoun?", options: ["A) Ginto at diyamante", "B) Lason", "C) Isang bomba / Nitroglicerina"], answer: "C) Isang bomba / Nitroglicerina" },
      { question: "Kanino inialay ni Dr. Jose Rizal ang nobelang El Filibusterismo?", options: ["A) Sa Inang Bayan", "B) Sa GOMBURZA (Tatlong Paring Martir)", "C) Kay Maria Clara"], answer: "B) Sa GOMBURZA (Tatlong Paring Martir)" },
      { question: "Sino ang magsasakang inagawan ng lupa ng korporasyon ng mga prayle kaya namundok at naging tulisan?", options: ["A) Kabesang Tales", "B) Tandang Selo", "C) Basilio"], answer: "A) Kabesang Tales" },
      { question: "Sino ang matapat na paring nagtapon ng mga kayamanan ni Simoun sa kailaliman ng dagat sa pagtatapos ng kwento?", options: ["A) Padre Florentino", "B) Padre Damaso", "C) Padre Salvi"], answer: "A) Padre Florentino" }
    ]
  },
  "Grade 10-Araling Panlipunan-Kontemporaryong Isyu": {
    title: "Mga Kontemporaryong Isyu",
    explanation: "Kumusta, Grade 10! Hindi na tayo lilingon sa nakaraan; sa halip, haharapin natin ang mga problemang nangyayari sa DAIGDIG at PILIPINAS sa mismong sandaling ito. Ito ang mga 'Kontemporaryong Isyu'—mga isyung pangkasalukuyan na may epekto sa atin. Ito ay nagsasanay sa iyo na maging mulat, makialam, at makatulong na hanapan ito ng solusyon! 🌍🚨📰",
    examples: [
      "1. Climate Change at Disaster Risk: Ang mabilis at patuloy na pag-iinit ng mundo na nagdudulot ng matinding bagyo, baha, at sakuna. Ito rin ay tungkol sa kung paano tayo maghahanda rito.",
      "2. Isyung Pang-ekonomiya: Kabilang dito ang kawalan ng trabaho (Unemployment), Globalisasyon, at ang masakit na kahirapan sa ating bansa.",
      "3. Isyung Politikal at Pangkapayapaan: Mga problema sa gobyerno tulad ng Graft and Corruption at korapsyon, o mga isyu ng agawan ng teritoryo sa West Philippine Sea.",
      "4. Karapatang Pantao (Human Rights): Ang lahat ng isyu tungkol sa pag-aabuso, diskriminasyon, at Extrajudicial Killings.",
      "5. Isyung Kasarian at Lipunan (Gender Issues): Mga isyu tungkol sa karapatan ng mga kababaihan, at ng mga taong kabilang sa LGBTQ+ community.",
      "6. Migrasyon: Ang pag-lipat ng mga manggagawang Pilipino (OFWs) sa ibang bansa upang maghanap ng magandang buhay, at ang epekto nito sa pamilyang naiwan.",
      "7. Pagiging Aktibong Mamamayan: Hindi ka lang taga-masid; may tungkulin ka bilang kabataan na bumoto nang tama at gumawa ng solusyon (Civic Engagement)!"
    ],
    practice: [
      "Ano ang global na isyu na tumatalakay sa matinding init ng mundo na nagdudulot ng mga matitinding sakuna?",
      "Anong uri ng isyu ang tumatalakay sa mga isyung Graft and Corruption sa loob ng pamahalaan?",
      "Kung ikaw ay umaalis sa Pilipinas para magtrabaho abroad, anong isyu ang tinutukoy dito?",
      "Maaari bang makialam ang isang Grade 10 student sa mga kontemporaryong isyu?"
    ],
    answers: [
      "Climate Change!",
      "Ito ay Isyung Politikal!",
      "Ito ay Migrasyon (Migration)!",
      "Oo! Dahil apektado ang hinaharap ninyo, at maaari kayong mag-ambag bilang aktibong mamamayan."
    ],
    funFact: "Ang salitang 'Kontemporaryo' ay nagmula sa pagsasama ng salitang Latin na 'con' (kasama sa) at 'tempus' o 'tempor' (panahon). Ibig sabihin: 'Kasama sa kasalukuyang panahon'.",
    quiz: [
      { question: "Ano ang ibig sabihin ng Kontemporaryong Isyu?", options: ["A) Mga problema noong sinaunang panahon", "B) Mga usapin at problemang nararanasan sa kasalukuyang panahon", "C) Mga kwentong bayan at alamat"], answer: "B) Mga usapin at problemang nararanasan sa kasalukuyang panahon" },
      { question: "Aling isyu ang nakapokus sa epekto ng pagkaubos ng kagubatan at pag-init ng daigdig?", options: ["A) Human Rights", "B) Climate Change", "C) Korapsyon"], answer: "B) Climate Change" },
      { question: "Ang usapin tungkol sa Pantawid Pamilyang Pilipino Program (4Ps) at kahirapan ay nabibilang sa anong larangan?", options: ["A) Isyung Politikal", "B) Isyung Pangkapaligiran", "C) Isyung Pang-ekonomiya"], answer: "C) Isyung Pang-ekonomiya" },
      { question: "Ano ang tawag sa pag-alis at paglipat ng tao sa ibang lugar o bansa upang mamuhay at magtrabaho?", options: ["A) Migrasyon", "B) Korapsyon", "C) Diskriminasyon"], answer: "A) Migrasyon" },
      { question: "Ang pagnanakaw ng pondo ng bayan ng mga opisyal ng gobyerno ay isang uri ng...", options: ["A) Isyung Pangkalikasan", "B) Isyung Kasarian", "C) Graft and Corruption"], answer: "C) Graft and Corruption" }
    ]
  }
};

const grades = ["Pre-School", "Kinder", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"];
const subjects = ["Mathematics", "English", "Science", "Filipino", "Araling Panlipunan", "Technology", "Values Education", "Arts & Music"];

const crossoverStoryData = {
  title: "A Magical Encounter in Neverland",
  content: [
    "One quiet evening, as Cinderella was feeling lonely sitting by the ashes, a sprinkle of golden fairy dust suddenly drifted through her window.",
    "A small figure, no larger than a hand, darted around the room. It was Tinkerbell! And closely behind her flew a boy in green—Peter Pan.",
    "'You look like you need an adventure!' Peter declared with a cheeky smile. 'I'm taking you to Neverland!'",
    "With a dash of pixie dust and a happy thought, Cinderella found herself floating in the air. Out the window they flew, straight towards the second star to the right, and straight on 'til morning.",
    "In Neverland, Cinderella danced with the Lost Boys and taught them some manners, while Peter showed her how to play tricks on Captain Hook.",
    "When they encountered the mischievous mermaids at the lagoon, Cinderella's gentle voice and kindness won them over, turning them from grumpy sea-creatures into cheerful friends.",
    "But as the sun began to set, Cinderella looked thoughtfully at the sky. 'I belong in my own world, Peter,' she smiled softly. 'Though I have a stepmother and chores, I know that one day, my own dream will come true.'",
    "Peter Pan frowned. 'But you'll have to grow up there! Here, you can be a child forever.'",
    "Cinderella held his hand. 'Growing up is a great adventure too. We carry the magic in our hearts.'",
    "And so, with a tearful goodbye, Peter and Tinkerbell took her back. When she woke up the next morning, a single tiny green leaf from the Neverwood forest lay beside her—proof that the adventure was real."
  ],
  quiz: [
    { question: "Who suddenly entered Cinderella's room?", options: ["The Fairy Godmother", "Peter Pan and Tinkerbell", "Captain Hook", "The Lost Boys"], answer: "Peter Pan and Tinkerbell" },
    { question: "How did Cinderella fly?", options: ["Using a magical broom", "Riding a magic carpet", "With pixie dust and a happy thought", "Holding a magical umbrella"], answer: "With pixie dust and a happy thought" },
    { question: "What did Cinderella do when she met the mermaids?", options: ["She won them over with her gentle voice and kindness", "She played competitive games with them", "She ignored them", "She swam away quickly"], answer: "She won them over with her gentle voice and kindness" },
    { question: "Why did Cinderella decide to leave Neverland?", options: ["She was scared of Captain Hook", "She missed doing her chores", "She knew her own dream would come true in her world", "She didn't like flying"], answer: "She knew her own dream would come true in her world" },
    { question: "What did Cinderella find beside her the next morning?", options: ["A glass slipper", "A handful of pixie dust", "A treasure map", "A tiny green leaf from the Neverwood forest"], answer: "A tiny green leaf from the Neverwood forest" }
  ]
};

export default function LeddyLearnApp() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const addNotification = (text: string, icon: string) => {
    const newNotif = { id: Date.now(), text, time: 'Just now', icon };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
  };
  const [activeTab, setActiveTab] = useState('Home');
  const [storyState, setStoryState] = useState<'reading' | 'quiz' | 'completed'>('reading');
  const [storyQuizIndex, setStoryQuizIndex] = useState(0);
  const [storyScore, setStoryScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [goals, setGoals] = useState([
    { id: 1, text: 'Math Module', completed: true },
    { id: 2, text: 'English Quiz', completed: false },
    { id: 3, text: 'Fairy Tale', completed: false }
  ]);
  const [modalData, setModalData] = useState<{
    title: string; 
    message: string; 
    icon: string; 
    type?: 'stat' | 'lesson' | 'badge' | 'quiz' | 'locked';
    color?: string;
    details?: {label: string, value: string}[];
    actionText?: string;
  } | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: "Hello there! I'm Learnify by Leddy. What would you like to learn about today? Wait patiently as I'm still coming to life! 🤖✨" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Placeholder kid-friendly background music
    const bgMusic = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_c8b8f7dfcb.mp3'); 
    bgMusic.loop = true;
    bgMusic.volume = 0.2; // Low volume para di masakit sa tenga

    if (soundEnabled) { 
      bgMusic.play().catch(e => console.log('Audio play failed:', e));
    } else {
      bgMusic.pause();
    }

    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [soundEnabled]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentLesson, setCurrentLesson] = useState<LessonData | {title: string, content: string} | null>(null);
  const [currentLessonKey, setCurrentLessonKey] = useState<string | null>(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [activeTab, currentLesson]);

  // Real-time Progress Tracking
  const [userEXP, setUserEXP] = useState<number>(() => {
    const saved = localStorage.getItem('leddy_userEXP');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('leddy_completedLessons');
    return saved ? JSON.parse(saved) : [];
  });

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('leddy_unlockedBadges');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('leddy_userEXP', userEXP.toString());
  }, [userEXP]);

  useEffect(() => {
    localStorage.setItem('leddy_completedLessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('leddy_unlockedBadges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  const toggleGoal = (id: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        if (!goal.completed) {
          setUserEXP(prevEXP => prevEXP + 10);
          setModalData({
            title: 'Goal Completed!',
            message: `Awesome! You finished "${goal.text}" and earned 10 EXP!`,
            icon: '🎯'
          });
        }
        return { ...goal, completed: !goal.completed };
      }
      return goal;
    }));
  };

  const checkBadges = (type: 'lesson' | 'quiz', data?: any) => {
    const newBadges: string[] = [];
    
    if (type === 'lesson' && !unlockedBadges.includes('early_explorer')) {
      newBadges.push('early_explorer');
    }
    
    if (type === 'quiz' && data) {
      if (data.subject === 'Fairy Tale' && !unlockedBadges.includes('fairy_tale_hero')) {
        newBadges.push('fairy_tale_hero');
      }
      if (data.score === data.total && !unlockedBadges.includes('genius_apprentice')) {
        newBadges.push('genius_apprentice');
      }
    }

    if (newBadges.length > 0) {
      setUnlockedBadges(prev => {
         const next = Array.from(new Set([...prev, ...newBadges]));
         return next;
      });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      const ALL_BADGES = [
        { id: 'early_explorer', title: 'Early Explorer', icon: '🌟', desc: 'Maku-unlock pag natapos ang unang lesson.' },
        { id: 'fairy_tale_hero', title: 'Fairy Tale Hero', icon: '🏰', desc: 'Maku-unlock pag natapos ang Cinderella/Peter Pan quiz.' },
        { id: 'genius_apprentice', title: 'Genius Apprentice', icon: '🧠', desc: 'Maku-unlock pag nakakuha ng 100% score sa kahit anong quiz.' }
      ];
      const badgeConf = ALL_BADGES.find(b => b.id === newBadges[0]);
      if (badgeConf) {
        setTimeout(() => {
          setModalData({
            title: 'New Badge Unlocked!',
            message: `Awesome! You earned the ${badgeConf.title} badge! ${badgeConf.desc}`,
            icon: badgeConf.icon,
            type: 'badge',
            color: 'yellow',
            actionText: 'Celebrate!'
          });
        }, 500); // short delay to feel the confetti first
      }
    }
  };
   
  const currentLevel = Math.floor(userEXP / 1000) + 1;
  const nextLevelEXP = currentLevel * 1000;
  const expProgress = ((userEXP - (currentLevel - 1) * 1000) / 1000) * 100;

  // Quiz active states
  const [activeQuizSubject, setActiveQuizSubject] = useState<string | null>(null); 
  const [quizDifficulty, setQuizDifficulty] = useState<'Easy' | 'Moderate' | 'Hard' | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStatus, setQuizStatus] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [timeLeft, setTimeLeft] = useState(60);

  const handleLearnifySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    
    const userText = chatInput.trim();
    const newMessages = [...chatMessages, { role: 'user', text: userText }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);
    
    try {
      const apiKeyKey = process.env.GEMINI_API_KEY1 || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKeyKey });
      const formattedHistory = chatMessages.map(m => `${m.role === 'ai' ? 'Learnify' : 'Student'}: ${m.text}`).join('\n');
      const prompt = `You are "Learnify by Leddy", a helpful and encouraging AI teacher for elementary to high school students in the Philippines. You are currently talking to a student. Keep your answers concise, encouraging, and easy to understand. You can mix English and Tagalog.

IMPORTANT VISUAL RULE: When the student asks about a visual concept (like a specific plant, animal, place, or scientific phenomenon), you MUST include a picture to help them understand. To do this, include an image using Markdown format and this exact URL structure: ![description](https://image.pollinations.ai/prompt/{detailed_prompt_for_image}?width=600&height=400&nologo=true) 
Replace {detailed_prompt_for_image} with a clear, descriptive prompt for the image. Ensure the image is relevant to your explanation.

History:
${formattedHistory}

Student: ${userText}
Learnify:`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (response && response.text) {
        setChatMessages(prev => [...prev, { role: 'ai', text: response.text }]);
      } else {
        throw new Error("Failed to parse response");
      }
    } catch (error: any) {
      console.error("Gemini API Error: ", error);
      console.error(error.stack);
      const errorMessage = `Oops, my brain is taking a break. Please try again later! Error: ${error.message}`;

      setChatMessages(prev => [...prev, { role: 'ai', text: errorMessage }]);
    } finally {
      setIsChatLoading(false);
    }
  };
  const affirmations = [
    'Take a deep breath...',
    'You are learning and growing every day.',
    'It is okay to make mistakes.',
    'Peaceful thoughts, peaceful mind.'
  ];
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);

  useEffect(() => {
    if (activeTab === 'Peaceful Thoughts') {
      const interval = setInterval(() => {
        setCurrentAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeQuizSubject === 'Math Sprint Challenge' && quizStatus === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft <= 0 && quizStatus === 'playing' && activeQuizSubject === 'Math Sprint Challenge') {
      setQuizStatus('finished');
      setUserEXP(exp => exp + (quizScore * 50));
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStatus, activeQuizSubject, quizScore]);

  const generateMathSprintQuestion = () => {
    const ops = ['+', '-', 'x'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    if (op === '+') {
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      answer = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a - b;
    } else {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a * b;
    }
    
    // Generate options
    const options = [answer.toString()];
    while (options.length < 3) {
       const wrong = answer + (Math.floor(Math.random() * 10) - 5);
       if (wrong !== answer && !options.includes(wrong.toString()) && wrong >= 0) {
          options.push(wrong.toString());
       }
    }
    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    return {
       question: `${a} ${op} ${b} = ?`,
       options,
       answer: answer.toString()
    };
  };

  const startSubjectQuiz = (subject: string, diff: 'Easy' | 'Moderate' | 'Hard') => {
    const rawQuestions = QUIZ_DATABASE[subject]?.[diff] || [];
    const questions: QuizQuestion[] = rawQuestions.map(rq => ({
      question: rq.q,
      options: rq.options,
      answer: rq.a
    }));
    setQuizQuestions(questions);
    setQuizDifficulty(diff);
    setCurrentQIndex(0);
    setQuizScore(0);
    setQuizStatus('playing');
  };

  const startMathSprint = () => {
    setActiveQuizSubject('Math Sprint Challenge');
    setQuizDifficulty(null);
    setCurrentQIndex(0);
    setQuizScore(0);
    setTimeLeft(60);
    
    // generate first 10 immediately just as buffer, or infinite
    const qs = Array(50).fill(null).map(() => generateMathSprintQuestion());
    setQuizQuestions(qs);
    setQuizStatus('playing');
  };

  const handleQuizAnswer = (selectedAns: string) => {
    const isCorrect = selectedAns === quizQuestions[currentQIndex].answer;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    if (isCorrect) setQuizScore(newScore);
    
    if (currentQIndex + 1 < quizQuestions.length) {
       setCurrentQIndex(currentQIndex + 1);
    } else {
       setQuizStatus('finished');
       setUserEXP(exp => exp + (newScore * 20));
       checkBadges('quiz', { subject: activeQuizSubject, score: newScore, total: quizQuestions.length });
    }
  };

  const handleStartLearning = () => {
    // We will try to match the exact Grade and Subject prefix
    const searchKeyStart = `${selectedGrade}-${selectedSubject}`;
    let foundLesson = null;
    let foundKey = null;
    
    if (selectedGrade && selectedSubject) {
      for (const key in lessonDatabase) {
        if (key.startsWith(searchKeyStart)) {
           foundLesson = lessonDatabase[key];
           foundKey = key;
           break;
        }
      }
    }

    if (foundLesson) {
      setCurrentLesson(foundLesson);
      setCurrentLessonKey(foundKey);
    } else {
      setCurrentLesson({
        title: "Magic in progress... 🪄",
        content: "Learnify by Leddy is writing this lesson. Try another topic!"
      });
      setCurrentLessonKey(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] overflow-hidden bg-[url('/bg.png?v=2')] bg-cover bg-fixed bg-center font-sans text-slate-800">
      
      {/* SIDEBAR (Desktop & iPad Landscape) */}
      <div className="w-64 flex-shrink-0 h-full flex flex-col bg-[#111827] shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-20 hidden md:flex p-4 relative">
        {/* LOGO AREA */}
        <div className="flex-shrink-0 pt-4 pb-4 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl relative z-10 drop-shadow-md">📘</span>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <div className="relative">Leddy<sup className="text-yellow-400 text-sm absolute -right-3 -top-1 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] animate-[bounce_2s_infinite] rotate-12 inline-block">2</sup></div>
              <span className="text-[#3b82f6]">Learn</span>
            </h1>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-1.5 flex-1 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {[
            { id: 'Home', icon: '🏠' }, 
            { id: 'My Learning', icon: '📚' }, 
            { id: 'Quizzes', icon: '🏆' }, 
            { id: 'Achievements', icon: '🏅' }, 
            { id: 'Learnify by Leddy', icon: '🤖' },
            { id: 'Progress', icon: '📈' },
            { id: 'Messages', icon: '✉️' },
            { id: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentLesson(null); }}
              className={`text-left px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-3 w-full group ${
                activeTab === tab.id
                ? 'bg-blue-600/20 text-[#3b82f6] shadow-sm translate-x-1' 
                : 'text-slate-500 hover:bg-white hover:text-white hover:translate-x-1'
              }`}
            >
              <span className={`text-xl transition-transform ${activeTab === tab.id ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110 grayscale-[0.5]'}`}>{tab.icon}</span>
              <span className="tracking-wide text-sm">{tab.id}</span>
            </button>
          ))}
          
          <div className="mt-8 pt-6 border-t border-slate-100">
             <button 
                onClick={() => {
                  if (confirm("Are you sure you want to log out?")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="text-left px-5 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-600 transition-all w-full flex items-center gap-4"
             >
               <span className="text-[1.3rem] opacity-70">🌑</span>
               <span className="tracking-wide text-[15px]">Logout</span>
             </button>
          </div>
        </nav>

        {/* CUTE BOYS ILLUSTRATION (BOTTOM) */}
        <div className="flex-shrink-0 mt-auto p-6 relative pb-8">
           <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-blue-50 to-transparent pointer-events-none rounded-br-3xl"></div>
           <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 relative z-10 text-center flex flex-col items-center">
             <div className="w-full flex justify-center -mt-16 mb-2">
                <div className="text-[5rem] drop-shadow-xl animate-[bounce_4s_infinite] rotate-[-5deg]">👦🏻</div>
             </div>
             <p className="text-slate-800 font-extrabold text-[13px] mb-2 leading-snug tracking-tight">Keep learning, keep<br/>growing!</p>
             <p className="text-slate-500 text-[10px] font-bold w-full rounded-xl bg-slate-50 py-1.5 flex items-center justify-center gap-1 border border-slate-100">
               You're doing great! <span className="text-[14px]">⭐</span>
             </p>
           </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div ref={mainContentRef} className="flex-1 h-full overflow-y-auto relative z-0 flex flex-col items-center">
        
        {/* MOBILE & TABLET PORTRAIT HEADER (Inside scroll to slide away) */}
        <div className="md:hidden w-full flex-shrink-0 z-50 bg-white p-4 flex items-center justify-between border-b border-slate-100 shadow-sm relative">
          <div className="flex items-center gap-3">
            <div className="relative z-10 w-10 h-10 flex items-center justify-center">
              <span className="text-3xl relative z-10 drop-shadow-sm">📘</span>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <div className="relative">Leddy<sup className="text-yellow-400 text-lg absolute -right-3 -top-1 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] animate-[bounce_2s_infinite] rotate-12 inline-block">2</sup></div>
              <span className="text-[#3b82f6]">Learn</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 relative">
            {activeTab === 'Home' && <React.Fragment>
              <button onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }} className="w-9 h-9 bg-slate-50 text-xl flex items-center justify-center rounded-full border border-slate-100 relative cursor-pointer hover:bg-white transition-colors">
                 🔔
                 {unreadCount > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 mt-2 w-64 bg-white rounded-2xl shadow-xl z-50 border border-slate-100 p-4 animate-fade-in-up">
                   <div className="px-1 pb-3 border-b border-gray-50 mb-3 flex justify-between items-center">
                      <h4 className="font-extrabold text-slate-800 text-sm">Notifications</h4>
                   </div>
                   <div className="space-y-3">
                     {notifications.length === 0 ? (
                       <p className="text-center text-slate-500 text-xs font-bold py-4">No notifications yet</p>
                     ) : (
                       notifications.map((notif: any) => (
                         <div key={notif.id} onClick={() => setShowNotifications(false)} className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors flex gap-3 items-start border border-transparent">
                            <div className="text-xl mt-0.5 drop-shadow-sm">{notif.icon}</div>
                            <div>
                              <p className="text-[13px] font-bold text-slate-700 leading-snug">{notif.text}</p>
                              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mt-1">{notif.time}</p>
                            </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              )}
            </React.Fragment>}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center text-lg overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:bg-yellow-200 transition-colors">
              🧑🏻‍🎓
            </button>
          </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-[100] bg-[url('/bg.png?v=2')]/60 backdrop-blur-sm shadow-xl flex" onClick={() => setShowMobileMenu(false)}>
             <div className="w-64 bg-white h-full ml-auto shadow-2xl flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                   <h2 className="font-black text-slate-800 text-lg">Menu</h2>
                   <button onClick={() => setShowMobileMenu(false)} className="text-slate-500 hover:text-slate-600 font-bold text-2xl">&times;</button>
                </div>
                <div className="flex-col gap-2 p-4 flex overflow-y-auto pb-8">
                    {[
                      { id: 'Quizzes', icon: '🏆' }, 
                      { id: 'Progress', icon: '📈' },
                      { id: 'Messages', icon: '✉️' },
                      { id: 'Settings', icon: '⚙️' }
                    ].map((tab) => (
                      <button 
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setCurrentLesson(null); setShowMobileMenu(false); }}
                        className={`text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3 w-full border ${
                          activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'text-slate-500 hover:bg-slate-50 border-transparent'
                        }`}
                      >
                        <span className="text-xl">{tab.icon}</span>
                        <span className="tracking-wide text-[15px]">{tab.id}</span>
                      </button>
                    ))}

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <button 
                          onClick={() => {
                            if (confirm("Are you sure you want to log out?")) {
                              localStorage.clear();
                              window.location.reload();
                            }
                          }}
                          className="text-left px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all w-full flex items-center gap-3"
                      >
                        <span className="text-xl">🌑</span>
                        <span>Logout</span>
                      </button>
                    </div>
                </div>
             </div>
          </div>
        )}

        <div className="w-full max-w-7xl px-4 md:px-6 pt-4 pb-36 md:pb-10 relative flex-1">

        {/* DISPLAY TOP RIGHT HEADER (DESKTOP) */}
        <div className="hidden md:flex justify-end items-center gap-4 absolute top-6 right-8 z-30">
          {activeTab === 'Home' && <div className="relative">
            <button onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 relative hover:shadow-md transition-shadow cursor-pointer">
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">{unreadCount}</span>}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl z-50 border border-slate-100 p-4 animate-fade-in-up">
                 <div className="px-1 pb-3 border-b border-gray-50 mb-3 flex justify-between items-center">
                    <h4 className="font-extrabold text-slate-800 text-sm">Notifications</h4>
                 </div>
                 <div className="space-y-3">
                   {notifications.length === 0 ? (
                     <p className="text-center text-slate-500 text-xs font-bold py-4">No notifications yet</p>
                   ) : (
                     notifications.map((notif: any) => (
                       <div key={notif.id} onClick={() => setShowNotifications(false)} className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors flex gap-3 items-start border border-transparent">
                          <div className="text-xl mt-0.5 drop-shadow-sm">{notif.icon}</div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-700 leading-snug">{notif.text}</p>
                            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mt-1">{notif.time}</p>
                          </div>
                       </div>
                     ))
                   )}
                 </div>
              </div>
            )}
          </div>}
        </div>

        {/* CONTAINER FOR CONTENT */}
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-8 py-4 lg:py-6 xl:py-2">

        {currentLesson ? (
          /* LESSON VIEW */
          <div className={`max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl shadow-lg border-4 ${currentLesson.title.includes('Fairy Tale') || currentLesson.title.includes('Magical Mystery') ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 border-yellow-400 text-white shadow-[0_0_40px_rgba(250,204,21,0.3)]' : 'bg-white border-indigo-100'}`}>
            <button 
              onClick={() => setCurrentLesson(null)}
              className={`mb-6 px-6 py-2 font-bold rounded-full transition text-sm sm:text-base ${currentLesson.title.includes('Magical Mystery') ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
            >
              ← Back to Dashboard
            </button>
            <h2 className={`text-3xl sm:text-4xl font-extrabold mb-6 ${currentLesson.title.includes('Magical Mystery') ? 'text-yellow-400 drop-shadow-md' : 'text-indigo-800'}`}>{currentLesson.title}</h2>
            
            {'explanation' in currentLesson ? (
                <div className="space-y-8">
                    <p className={`text-lg sm:text-xl leading-relaxed font-medium ${currentLesson.title.includes('Magical Mystery') ? 'text-blue-100' : 'text-slate-700'}`}>
                        {currentLesson.explanation}
                    </p>
                    
                    <div className={`p-6 rounded-2xl border-2 ${currentLesson.title.includes('Magical Mystery') ? 'bg-indigo-800/50 border-indigo-500' : 'bg-blue-50 border-blue-100'}`}>
                        <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${currentLesson.title.includes('Magical Mystery') ? 'text-yellow-300' : 'text-blue-800'}`}>⭐ Examples</h3>
                        <ul className="list-none space-y-3">
                            {currentLesson.examples.map((ex, i) => (
                                <li key={i} className={`text-lg flex gap-3 ${currentLesson.title.includes('Magical Mystery') ? 'text-indigo-100' : 'text-slate-700'}`}>
                                   <span className="text-blue-500 font-black text-xl">•</span> 
                                   <span>{ex}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`p-6 rounded-2xl border-2 ${currentLesson.title.includes('Magical Mystery') ? 'bg-purple-800/50 border-purple-500' : 'bg-green-50 border-green-100'}`}>
                        <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${currentLesson.title.includes('Magical Mystery') ? 'text-purple-300' : 'text-green-800'}`}>🏋️ Let's Practice</h3>
                        <ul className="list-none space-y-3">
                            {currentLesson.practice.map((pr, i) => (
                                <li key={i} className={`text-lg flex gap-3 ${currentLesson.title.includes('Magical Mystery') ? 'text-indigo-100' : 'text-slate-700'}`}>
                                   <span className={`font-black text-xl ${currentLesson.title.includes('Magical Mystery') ? 'text-purple-400' : 'text-green-500'}`}>•</span> 
                                   <span>{pr}</span>
                                </li>
                            ))}
                        </ul>
                        <details className={`mt-6 pt-4 border-t-2 ${currentLesson.title.includes('Magical Mystery') ? 'border-purple-600/50' : 'border-green-200'}`}>
                            <summary className={`cursor-pointer font-bold outline-none select-none ${currentLesson.title.includes('Magical Mystery') ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-700 hover:text-green-800'}`}>
                                Reveal Practice Answers
                            </summary>
                            <ul className="list-none space-y-2 mt-4">
                                {currentLesson.answers && currentLesson.answers.map((ans, i) => (
                                    <li key={i} className={`text-md font-medium italic ${currentLesson.title.includes('Magical Mystery') ? 'text-indigo-200' : 'text-slate-600'}`}>- {ans}</li>
                                ))}
                            </ul>
                        </details>
                    </div>

                    <div className={`p-6 sm:p-8 rounded-2xl border-4 shadow-md relative overflow-hidden ${currentLesson.title.includes('Magical Mystery') ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40' : 'bg-gradient-to-r from-purple-100 to-pink-100 border-white'}`}>
                        <div className="absolute right-[-20px] top-[-20px] text-8xl opacity-20 select-none">💡</div>
                        <h3 className={`text-2xl font-black mb-2 ${currentLesson.title.includes('Magical Mystery') ? 'text-yellow-400' : 'text-purple-800'}`}>Did You Know?</h3>
                        <p className={`text-lg font-medium relative z-10 ${currentLesson.title.includes('Magical Mystery') ? 'text-yellow-100' : 'text-purple-900'}`}>{currentLesson.funFact}</p>
                    </div>

                    <div className={`p-6 rounded-2xl border-2 ${currentLesson.title.includes('Magical Mystery') ? 'bg-indigo-950 border-indigo-700/50' : 'bg-orange-50 border-orange-100'}`}>
                        <h3 className={`text-3xl font-black mb-6 text-center ${currentLesson.title.includes('Magical Mystery') ? 'text-cyan-400' : 'text-orange-600'}`}>Quiz Time! 📝</h3>
                        <div className="space-y-6">
                            {currentLesson.quiz.map((q, i) => (
                                <div key={i} className={`p-6 rounded-xl shadow-sm border ${currentLesson.title.includes('Magical Mystery') ? 'bg-indigo-900 border-indigo-700' : 'bg-white border-orange-100'}`}>
                                    <p className={`text-xl font-bold mb-4 ${currentLesson.title.includes('Magical Mystery') ? 'text-indigo-100' : 'text-slate-800'}`}>{i+1}. {q.question}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {q.options.map((opt, j) => (
                                            <div key={j} className={`border-2 p-3 rounded-lg font-medium cursor-pointer transition-colors ${currentLesson.title.includes('Magical Mystery') ? 'bg-indigo-800/80 border-indigo-600 text-indigo-200 hover:bg-yellow-500/20 hover:border-yellow-400 hover:text-yellow-300' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-orange-100 hover:border-orange-300'}`}>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                    <details className={`mt-4 pt-4 border-t group ${currentLesson.title.includes('Magical Mystery') ? 'border-indigo-700/50' : 'border-slate-100'}`}>
                                        <summary className={`cursor-pointer font-bold outline-none select-none inline-flex items-center gap-2 ${currentLesson.title.includes('Magical Mystery') ? 'text-yellow-400/80 hover:text-yellow-300' : 'text-orange-500 hover:text-orange-600'}`}>
                                            Show Answer
                                        </summary>
                                        <p className={`mt-3 font-bold p-3 rounded-lg border ${currentLesson.title.includes('Magical Mystery') ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            Answer: {q.answer}
                                        </p>
                                    </details>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            ) : (
                <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-10 rounded-3xl border-4 border-white shadow-md text-center">
                    <div className="text-6xl mb-6 animate-pulse">🤖✨</div>
                    <div className="text-xl sm:text-2xl leading-relaxed text-blue-900 font-bold whitespace-pre-wrap">
                      {currentLesson.content}
                    </div>
                </div>
            )}
            
            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => {
                  if (currentLessonKey && !completedLessons.includes(currentLessonKey)) {
                     setCompletedLessons([...completedLessons, currentLessonKey]);
                     setUserEXP(userEXP + 100);
                     setModalData({
                       title: 'Lesson Completed!',
                       message: 'Awesome job! You earned 100 EXP!',
                       icon: '🌟',
                       color: 'green',
                       actionText: 'Continue'
                     });
                     checkBadges('lesson');
                  }
                  setCurrentLesson(null);
                }} 
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:scale-105 transition transform"
              >
                I finished this! 🏆
              </button>
            </div>
          </div>
        ) : activeTab === 'My Learning' ? (
          /* MY LEARNING VIEW */
          <div className="w-full space-y-8 pb-10">
            <button 
              onClick={() => setActiveTab('Home')}
              className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 mb-4 transition-colors"
            >
              &larr; Back to Home
            </button>
            <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="relative z-10 w-full md:w-2/3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-orange-900 mb-4 drop-shadow-sm leading-tight">
                  My Learning Dashboard 📚
                </h2>
                <p className="text-lg sm:text-xl text-orange-800 font-medium">
                  Track your progress, continue where you left off, and discover new adventures!
                </p>
              </div>
            </div>
            
            {/* Progress Overview Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b-2 border-slate-100 pb-8">
              <div 
                onClick={() => setModalData({ 
                  title: 'Learning Streak!', 
                  message: 'You have logged in and learned something new for 3 days in a row! Keep this streak alive to earn a mystery chest this weekend.', 
                  icon: '🔥',
                  type: 'stat',
                  color: 'blue',
                  details: [{label: 'Current Streak', value: '3 Days'}, {label: 'Best Streak', value: '7 Days'}, {label: 'Next Reward In', value: '4 Days'}]
                })}
                className="bg-blue-100 p-6 rounded-3xl shadow-sm border-2 border-blue-200 text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="text-4xl mb-2">🔥</div>
                <h3 className="text-3xl font-black text-blue-900">3 Days</h3>
                <p className="text-blue-700 font-bold uppercase tracking-wider text-sm mt-1">Learning Streak</p>
              </div>
              <div 
                onClick={() => setModalData({ 
                  title: 'Lessons Completed!', 
                  message: 'You are on fire! You have successfully completed 12 lessons so far. You are expanding your brain power amazingly.', 
                  icon: '🎓',
                  type: 'stat',
                  color: 'green',
                  details: [{label: 'Math Lessons', value: '5'}, {label: 'Science Lessons', value: '3'}, {label: 'English Lessons', value: '4'}]
                })}
                className="bg-green-100 p-6 rounded-3xl shadow-sm border-2 border-green-200 text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="text-4xl mb-2">🎓</div>
                <h3 className="text-3xl font-black text-green-900">12</h3>
                <p className="text-green-700 font-bold uppercase tracking-wider text-sm mt-1">Lessons Completed</p>
              </div>
              <div 
                onClick={() => setModalData({ 
                  title: 'Time Spent Learning!', 
                  message: 'You have invested 5.5 hours into growing your brain power! Every minute counts towards your mastery.', 
                  icon: '⏱️',
                  type: 'stat',
                  color: 'purple',
                  details: [{label: 'Total Time', value: '5.5 Hours'}, {label: 'This Week', value: '2.1 Hours'}, {label: 'Daily Average', value: '45 mins'}]
                })}
                className="bg-purple-100 p-6 rounded-3xl shadow-sm border-2 border-purple-200 text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="text-4xl mb-2">⏱️</div>
                <h3 className="text-3xl font-black text-purple-900">5.5 hrs</h3>
                <p className="text-purple-700 font-bold uppercase tracking-wider text-sm mt-1">Time Spent Learning</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">▶️ Continue Learning</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Continue card 1 */}
              <div 
                onClick={() => setModalData({ 
                  title: 'Kontemporaryong Isyu', 
                  message: 'You left off at 60%. Let\'s jump back in and finish learning about the issues facing our world today!', 
                  icon: '🌍',
                  type: 'lesson',
                  color: 'orange',
                  actionText: 'Resume Lesson'
                })}
                className="bg-white p-6 rounded-3xl shadow-sm border-4 border-slate-100 hover:border-orange-300 transition-colors cursor-pointer block relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-5xl">🌍</div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">Grade 10</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">Mga Kontemporaryong Isyu</h3>
                <p className="text-slate-500 font-medium mb-4 text-sm">Araling Panlipunan</p>
                <div className="w-full bg-white rounded-full h-3 mb-2 overflow-hidden border border-slate-200">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-right text-xs text-slate-500 font-bold">60% Complete</p>
              </div>
              {/* Continue card 2 */}
              <div 
                onClick={() => setModalData({ 
                  title: 'Algebra Basics', 
                  message: 'Variables and equations await! You are 25% done with Algebra Basics.', 
                  icon: '🧮',
                  type: 'lesson',
                  color: 'blue',
                  actionText: 'Resume Lesson'
                })}
                className="bg-white p-6 rounded-3xl shadow-sm border-4 border-slate-100 hover:border-blue-300 transition-colors cursor-pointer block relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-5xl">🧮</div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">Grade 7</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">Algebra Basics</h3>
                <p className="text-slate-500 font-medium mb-4 text-sm">Mathematics</p>
                <div className="w-full bg-white rounded-full h-3 mb-2 overflow-hidden border border-slate-200">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-right text-xs text-slate-500 font-bold">25% Complete</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4 border-t-2 border-slate-100 pt-8 flex items-center gap-2">⭐ Completed Lessons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div 
                onClick={() => setModalData({ 
                  title: 'Counting 1 to 10', 
                  message: 'You perfectly completed this Kinder Math lesson on Dec 12. Great foundation!', 
                  icon: '🔢',
                  type: 'lesson',
                  color: 'slate',
                  actionText: 'Review Lesson'
                })}
                className="bg-slate-50 p-6 rounded-3xl border-4 border-slate-100 hover:bg-white transition-colors flex items-center gap-4 cursor-pointer"
              >
                 <div className="text-4xl bg-green-100 p-3 rounded-2xl shadow-sm">✅</div>
                 <div>
                   <h4 className="font-bold text-slate-700 leading-tight">Counting 1 to 10</h4>
                   <p className="text-sm text-slate-500 mt-1">Kinder • Math</p>
                 </div>
              </div>
              <div 
                onClick={() => setModalData({ 
                  title: 'Parts of a Plant', 
                  message: 'You mastered the roots, stems, and leaves! You scored 10/10 on the quiz.', 
                  icon: '🌱',
                  type: 'lesson',
                  color: 'slate',
                  actionText: 'Review Lesson'
                })}
                className="bg-slate-50 p-6 rounded-3xl border-4 border-slate-100 hover:bg-white transition-colors flex items-center gap-4 cursor-pointer"
              >
                 <div className="text-4xl bg-green-100 p-3 rounded-2xl shadow-sm">✅</div>
                 <div>
                   <h4 className="font-bold text-slate-700 leading-tight">Parts of a Plant</h4>
                   <p className="text-sm text-slate-500 mt-1">Grade 1 • Science</p>
                 </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'Quizzes' ? (
          /* QUIZZES VIEW */
          <div className="w-full space-y-8 pb-10">
            {quizStatus === 'setup' && !activeQuizSubject && (
              <>
                <button 
                  onClick={() => setActiveTab('Home')}
                  className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 mb-4 transition-colors"
                >
                  &larr; Back to Home
                </button>
                <div className="bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                  <div className="relative z-10 w-full md:w-2/3">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-900 mb-4 drop-shadow-sm leading-tight flex items-center gap-3">
                      Time to Challenge Yourself! 📝
                    </h2>
                    <p className="text-lg sm:text-xl text-emerald-800 font-medium">
                      Take quizzes to test what you've learned and earn shiny medals! Which subject will you conquer today?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      📅 Daily Challenges
                    </h3>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl border-4 border-yellow-300 shadow-sm relative hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black animate-bounce tracking-widest">HOT 🔥</span>
                        <span className="text-orange-600 font-bold text-sm bg-orange-100 px-3 py-1 rounded-full">Ends in 5h 23m</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-800 mb-2">Math Sprint</h4>
                      <p className="text-slate-600 mb-6 font-medium">Answer as many math questions as you can in 60 seconds to earn double EXPs!</p>
                      <button 
                        onClick={startMathSprint}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-md text-lg"
                      >
                        Start Challenge Now
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      📂 Subject Quizzes
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Mathematics', icon: '🧮', color: 'bg-blue-50 border-blue-200 hover:border-blue-400', theme: 'blue' },
                        { label: 'Science', icon: '🔬', color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400', theme: 'indigo' },
                        { label: 'English', icon: '📚', color: 'bg-pink-50 border-pink-200 hover:border-pink-400', theme: 'pink' },
                        { label: 'Filipino', icon: '🇵🇭', color: 'bg-amber-50 border-amber-200 hover:border-amber-400', theme: 'amber' },
                        { label: 'Araling Panlipunan', icon: '🌍', color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400', theme: 'emerald' },
                        { label: 'Technology', icon: '💻', color: 'bg-purple-50 border-purple-200 hover:border-purple-400', theme: 'purple' }
                      ].map(cat => (
                        <button 
                          key={cat.label} 
                          onClick={() => setActiveQuizSubject(cat.label)}
                          className={`${cat.color} p-4 rounded-3xl shadow-sm border-4 transition-all font-bold text-center text-slate-700 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-md h-32`}
                        >
                          <span className="text-4xl block drop-shadow-sm">{cat.icon}</span>
                          <span className="leading-tight">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {quizStatus === 'setup' && activeQuizSubject && activeQuizSubject !== 'Math Sprint Challenge' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border-4 border-slate-100 max-w-2xl mx-auto text-center mt-10">
                <button 
                  onClick={() => setActiveQuizSubject(null)}
                  className="mb-6 text-slate-500 hover:text-slate-600 font-bold flex items-center gap-2 mx-auto"
                >
                   &larr; Back to Subjects
                </button>
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-2xl xl:text-3xl font-black text-slate-800 mb-2">{activeQuizSubject} Quiz</h2>
                <p className="text-slate-500 mb-8 font-medium">Select your preferred difficulty to begin the challenge.</p>
                
                <div className="space-y-4">
                  <button onClick={() => startSubjectQuiz(activeQuizSubject, 'Easy')} className="w-full bg-green-100 hover:bg-green-200 border-4 border-green-200 text-green-800 font-bold py-4 rounded-2xl text-xl transition-transform hover:scale-[1.02]">
                    🌱 Easy
                  </button>
                  <button onClick={() => startSubjectQuiz(activeQuizSubject, 'Moderate')} className="w-full bg-yellow-100 hover:bg-yellow-200 border-4 border-yellow-200 text-yellow-800 font-bold py-4 rounded-2xl text-xl transition-transform hover:scale-[1.02]">
                    ⭐ Moderate
                  </button>
                  <button onClick={() => startSubjectQuiz(activeQuizSubject, 'Hard')} className="w-full bg-red-100 hover:bg-red-200 border-4 border-red-200 text-red-800 font-bold py-4 rounded-2xl text-xl transition-transform hover:scale-[1.02]">
                    🔥 Hard
                  </button>
                </div>
              </div>
            )}

            {quizStatus === 'playing' && (
              <div className="max-w-3xl mx-auto mt-10 space-y-6">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-6">
                     <button 
                       onClick={() => {
                         setQuizStatus('setup'); 
                         setActiveQuizSubject(null); 
                         setTimeLeft(0);
                       }}
                       className="text-slate-500 hover:text-slate-600 bg-white hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors font-bold text-sm flex items-center gap-2"
                     >
                       ✕ Cancel
                     </button>
                     <h3 className="text-xl font-bold text-slate-500 flex items-center gap-2">
                       <span className="text-2xl">{activeQuizSubject === 'Math Sprint Challenge' ? '⚡' : '📝'}</span> 
                       {activeQuizSubject} {quizDifficulty ? `(${quizDifficulty})` : ''}
                     </h3>
                   </div>
                   {activeQuizSubject === 'Math Sprint Challenge' ? (
                     <div className="bg-red-100 border-2 border-red-200 text-red-700 font-black px-4 py-2 rounded-xl text-xl flex items-center gap-2">
                       ⏳ {timeLeft}s
                     </div>
                   ) : (
                     <div className="bg-white border-2 border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-xl">
                       Question {currentQIndex + 1} / {quizQuestions.length}
                     </div>
                   )}
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-md border-4 border-slate-100">
                  <h2 className="text-2xl xl:text-3xl font-black text-slate-800 mb-8 min-h-[80px] flex items-center">
                    {quizQuestions[currentQIndex]?.question}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quizQuestions[currentQIndex]?.options.map((opt: string, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => handleQuizAnswer(opt)}
                        className="bg-indigo-50 hover:bg-indigo-100 border-4 border-indigo-100 text-indigo-900 font-bold text-xl p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-md"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {quizStatus === 'finished' && (
              <div className="max-w-2xl mx-auto mt-10 text-center bg-white p-10 rounded-3xl shadow-xl border-4 border-indigo-100">
                <div className="text-7xl mb-6">🎉</div>
                <h2 className="text-4xl font-black text-slate-800 mb-2">Quiz Completed!</h2>
                <p className="text-xl text-slate-500 font-medium mb-8">You finished the {activeQuizSubject} challenge.</p>
                
                <div className="bg-indigo-50 rounded-3xl p-8 mb-8 border-2 border-indigo-100 inline-block w-full">
                  <div className="text-5xl font-black text-indigo-600 mb-2">{quizScore}</div>
                  <div className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Total Correct Answers</div>
                </div>

                <button 
                  onClick={() => {
                    setQuizStatus('setup');
                    setActiveQuizSubject(null);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl text-xl w-full transition-transform hover:scale-[1.02] shadow-[0_4px_0_theme(colors.indigo.800)] hover:shadow-none hover:translate-y-1"
                >
                  Back to Quizzes
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'Achievements' ? (
          /* ACHIEVEMENTS VIEW */
          <div className="w-full space-y-8 pb-10">
            <button 
              onClick={() => setActiveTab('Home')}
              className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 mb-4 transition-colors"
            >
              &larr; Back to Home
            </button>
            {/* Header Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-[#eff6ff] rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden text-white border border-slate-100">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left flex-1">
                  <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6 shadow-sm">
                     <span className="text-sm font-bold tracking-widest text-indigo-300 uppercase">Season 1 Rewards</span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl font-black mb-4 drop-shadow-md tracking-tight leading-[1.1]">
                    Your Trophy Room <span className="inline-block hover:animate-spin origin-center cursor-default">🏆</span>
                  </h2>
                  <p className="text-xl text-indigo-200 font-medium max-w-xl mx-auto md:mx-0">
                    Complete lessons, conquer daily challenges, and master quizzes to unlock exclusive badges and boost your EXP.
                  </p>
                </div>
                
                {/* Stats summary block */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 flex flex-col items-center min-w-[200px] shadow-xl">
                  <div className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-1">Total EXP</div>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-sm mb-4">
                     {userEXP.toLocaleString()}
                  </div>
                  <div className="w-full bg-black/30 h-2 rounded-full mb-2 overflow-hidden">
                     <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full" style={{ width: `${expProgress}%` }}></div>
                  </div>
                  <div className="text-xs xl:text-[10px] font-bold text-slate-600 flex justify-between w-full">
                     <span>Lvl {currentLevel}</span>
                     <span>Next Lvl: {nextLevelEXP.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 border-b-2 border-slate-200/60">
               <h3 className="text-2xl font-black text-slate-800">Your Badges </h3>
               <div className="bg-green-100 text-green-700 text-sm font-black px-3 py-1 rounded-full">Explore and Unlock!</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                { id: 'early_explorer', isCustom: true, title: 'Early Explorer', icon: '🌟', desc: 'Unlocked by finishing your first lesson.', rarity: 'Common' },
                { id: 'fairy_tale_hero', isCustom: true, title: 'Fairy Tale Hero', icon: '🏰', desc: 'Unlocked by completing the Fairy Tale quiz.', rarity: 'Rare' },
                { id: 'genius_apprentice', isCustom: true, title: 'Genius Apprentice', icon: '🧠', desc: 'Unlocked by scoring 100% on any quiz.', rarity: 'Epic' },
                { threshold: 100, title: 'First Steps', icon: '🚀', desc: 'Earned by reaching 100 EXP.', rarity: 'Common' },
                { threshold: 500, title: 'Novice Scholar', icon: '🔥', desc: 'Earned by reaching 500 EXP.', rarity: 'Uncommon' },
                { threshold: 1000, title: 'Master Learner', icon: '🧠', desc: 'Earned by reaching 1,000 EXP.', rarity: 'Rare' },
                { threshold: 2000, title: 'Quiz Master', icon: '📝', desc: 'Earned by reaching 2,000 EXP.', rarity: 'Epic' },
                { threshold: 3000, title: 'Book Worm', icon: '📖', desc: 'Earned by reaching 3,000 EXP.', rarity: 'Epic' },
                { threshold: 5000, title: 'World Traveler', icon: '🌎', desc: 'Earned by reaching 5,000 EXP.', rarity: 'Legendary' }
              ].map((badge: any) => {
                const unlocked = badge.isCustom ? unlockedBadges.includes(badge.id) : userEXP >= (badge.threshold || 0);
                const progressPct = badge.isCustom ? (unlocked ? 100 : 0) : Math.min((userEXP / (badge.threshold || 1)) * 100, 100);

                if (unlocked) {
                  return (
                    <div 
                      key={badge.title}
                      onClick={() => setModalData({ 
                        title: badge.title, 
                        message: badge.desc, 
                        icon: badge.icon,
                        type: 'badge',
                        color: 'yellow',
                        details: [{label: 'Rarity', value: badge.rarity}, {label: 'Requirement', value: badge.isCustom ? 'Special Challenge' : `${badge.threshold} EXP`}],
                        actionText: 'Equip Badge'
                      })}
                      className="group bg-white p-6 rounded-3xl shadow-sm border-4 border-slate-100 hover:border-yellow-400 relative overflow-hidden transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(250,204,21,0.25)] cursor-pointer"
                    >
                      <div className="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="text-6xl mb-6 relative z-10 filter drop-shadow-md group-hover:animate-bounce">{badge.icon}</div>
                      <h3 className="font-black text-2xl text-slate-800 mb-2 leading-tight">{badge.title}</h3>
                      <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">{badge.desc}</p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="bg-yellow-100 text-yellow-700 font-black px-3 py-1.5 rounded-xl text-xs uppercase tracking-widest">UNLOCKED</span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div 
                      key={badge.title}
                      onClick={() => setModalData({ 
                        title: badge.title, 
                        message: `${badge.desc} Keep studying to earn this badge!`, 
                        icon: badge.icon,
                        type: 'locked',
                        color: 'slate',
                        details: [{label: 'Progress', value: badge.isCustom ? 'Special Challenge' : `${userEXP}/${badge.threshold} EXP`}, {label: 'Rarity', value: badge.rarity}],
                        actionText: 'Close'
                      })}
                      className="bg-slate-50 p-6 rounded-3xl shadow-sm border-4 border-slate-200 border-dashed relative overflow-hidden hover:bg-white inset-0 hover:shadow-md transition-colors grayscale-[0.8] opacity-80 group cursor-pointer"
                    >
                      <div className="text-6xl mb-6 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110 origin-left">{badge.icon}</div>
                      <h3 className="font-bold text-xl text-slate-800 mb-2 leading-tight">{badge.title}</h3>
                      <p className="text-sm text-slate-500 mb-6 font-medium min-h-[40px]">{badge.desc}</p>
                      <div className="w-full bg-slate-200 rounded-full h-3 mb-3 overflow-hidden border border-slate-300 shadow-inner">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full" style={{ width: `${progressPct}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-widest">
                        <span>In Progress</span>
                        <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded-lg">{Math.round(progressPct)}%</span>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ) : activeTab === 'Peaceful Thoughts' ? (
          /* PEACEFUL THOUGHTS VIEW */
          <div className="flex-1 flex flex-col items-center justify-center bg-[url('/bg.png?v=2')] rounded-3xl min-h-[70vh] sm:min-h-[80vh] overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 bg-blue-900/20 w-full h-full mix-blend-overlay"></div>
            
            {/* Glowing circle */}
            <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-cyan-400/20 blur-xl animate-pulse flex items-center justify-center">
               <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-cyan-300/30 blur-md"></div>
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none p-6 text-center">
               <div className="text-cyan-100/90 text-2xl sm:text-3xl lg:text-4xl font-extralight tracking-widest transition-opacity duration-1000 drop-shadow-sm min-h-[80px]">
                 {currentAffirmation}
               </div>
            </div>
          </div>
        ) : activeTab === 'Learnify by Leddy' ? (
          /* LEARNIFY BY LEDDY VIEW */
          <div className="w-full flex flex-col h-[calc(100dvh-200px)] sm:h-[80vh]">
            <button 
              onClick={() => setActiveTab('Home')}
              className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 mb-4 transition-colors"
            >
              &larr; Back to Home
            </button>
            <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white sm:rounded-t-3xl p-4 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between flex-shrink-0 relative overflow-hidden">
              <div className="relative z-10 w-full md:w-3/4">
                <h2 className="text-2xl sm:text-4xl font-black drop-shadow-md flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 leading-tight">
                  <span className="text-4xl sm:text-5xl animate-bounce filter drop-shadow-lg">🤖</span> <span className="hidden sm:inline">Chat with</span> Learnify by Leddy
                </h2>
                <p className="text-indigo-100 font-medium text-sm sm:text-lg leading-snug">Ask any question you have about your lessons, homework, or random curiosities!</p>
              </div>
              <div className="absolute right-[-20%] md:right-0 top-0 h-full opacity-20 text-9xl hidden sm:flex items-center">
                 🌟
              </div>
            </div>
            
            <div className="flex-grow bg-[#f8fbff] border-x-4 border-indigo-100 p-6 flex flex-col gap-5 overflow-y-auto w-full relative h-0">
              {/* Background watermark */}
              <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] text-[20rem] pointer-events-none">
                🧠
              </div>

              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex z-10 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                  <div className={`max-w-[85%] sm:max-w-[70%] p-5 rounded-3xl shadow-sm relative ${
                    msg.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-sm' 
                    : 'bg-white text-slate-800 rounded-bl-sm border-2 border-slate-100 filter drop-shadow-sm'
                  }`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">👩‍🏫</span>
                        <div className="font-black text-xs text-indigo-500 uppercase tracking-wider">Learnify</div>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere leading-relaxed font-medium text-[15px] sm:text-base overflow-hidden">
                      {msg.text.split(/(!\[.*?\]\(.*?\))/g).map((part, i) => {
                        const match = part.match(/!\[(.*?)\]\((.*?)\)/);
                        if (match) {
                          return (
                            <span key={i} className="block my-4">
                              <img src={match[2]} alt={match[1]} className="rounded-xl shadow-md w-full max-h-[300px] object-cover" />
                              {match[1] && <span className="block text-xs text-center text-slate-500 mt-2">{match[1]}</span>}
                            </span>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="bg-white p-3 sm:p-6 sm:border-x-4 sm:border-b-4 border-indigo-100 rounded-b-xl sm:rounded-b-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] flex-shrink-0 z-10">
              <form className="flex gap-2 sm:gap-3 max-w-4xl mx-auto" onSubmit={handleLearnifySubmit}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isChatLoading}
                  placeholder="E.g., Why is the sky blue?" 
                  className="flex-grow p-3 sm:p-5 text-sm sm:text-lg rounded-xl sm:rounded-2xl border-2 sm:border-4 border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-500 font-medium text-slate-700 disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  onClick={handleLearnifySubmit}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none text-white font-bold px-4 sm:px-8 py-3 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center hover:scale-[1.02] active:scale-95 group"
                >
                  <span className="text-sm sm:text-lg">{isChatLoading ? "..." : "Send"}</span> 
                  {!isChatLoading && <span className="hidden sm:inline ml-2 text-xl sm:text-2xl group-hover:animate-bounce">🚀</span>}
                </button>
              </form>
            </div>
          </div>
        ) : activeTab === 'Stories' ? (
          <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up pb-[100px]">
            {storyState === 'reading' ? (
              <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-yellow-400">
                <div className="p-8 sm:p-12 text-center border-b border-white/20 relative">
                  <div className="absolute inset-0 bg-white opacity-10 mix-blend-overlay"></div>
                  <h2 className="text-3xl sm:text-5xl font-black text-yellow-400 drop-shadow-lg relative z-10">{crossoverStoryData.title}</h2>
                  <p className="text-indigo-200 mt-4 font-bold tracking-widest uppercase text-sm relative z-10">Read the story carefully!</p>
                </div>
                <div className="p-8 sm:p-12 space-y-6 bg-white/5 backdrop-blur-sm">
                  {crossoverStoryData.content.map((paragraph, i) => (
                    <p key={i} className="text-lg sm:text-xl leading-relaxed text-indigo-50 font-medium">{paragraph}</p>
                  ))}
                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={() => setStoryState('quiz')}
                      className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black px-10 py-4 rounded-full text-xl shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all transform hover:scale-105 active:scale-95"
                    >
                      I've Finished Reading! 📚
                    </button>
                  </div>
                </div>
              </div>
            ) : storyState === 'quiz' ? (
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border-4 border-cyan-400 text-center relative overflow-hidden">
                <div className="absolute top-[-20px] left-[-20px] text-8xl opacity-10 select-none">✨</div>
                <h3 className="text-2xl font-black text-cyan-300 mb-2">Pop Quiz!</h3>
                <div className="mb-8 flex gap-2 justify-center">
                  {crossoverStoryData.quiz.map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i === storyQuizIndex ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : i < storyQuizIndex ? 'bg-cyan-700' : 'bg-slate-50'} transition-all`}></div>
                  ))}
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <p className="text-xl sm:text-2xl font-bold text-white mb-8">{crossoverStoryData.quiz[storyQuizIndex].question}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {crossoverStoryData.quiz[storyQuizIndex].options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          const isCorrect = opt === crossoverStoryData.quiz[storyQuizIndex].answer;
                          if (isCorrect) setStoryScore(prev => prev + 1);
                          
                          if (storyQuizIndex < crossoverStoryData.quiz.length - 1) {
                            setStoryQuizIndex(prev => prev + 1);
                          } else {
                            setStoryState('completed');
                            setUserEXP(prev => prev + (storyScore + (isCorrect ? 1 : 0)) * 20);
                            setModalData({
                              title: 'Story Completed!',
                              message: `You scored ${storyScore + (isCorrect ? 1 : 0)} out of ${crossoverStoryData.quiz.length}! You earned EXP!`,
                              icon: '🌟'
                            });
                          }
                        }}
                        className="bg-indigo-800/80 hover:bg-cyan-500 hover:text-indigo-900 text-indigo-100 font-bold p-4 sm:p-6 rounded-2xl border-2 border-indigo-600 hover:border-cyan-400 transition-all text-lg active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-[2.5rem] shadow-2xl p-10 sm:p-16 text-center border-4 border-white text-white">
                <div className="text-8xl mb-6 drop-shadow-lg animate-bounce">🏆</div>
                <h2 className="text-4xl sm:text-5xl font-black mb-4">Awesome Job!</h2>
                <p className="text-xl font-bold text-green-100 mb-8">You finished the magical journey and scored {storyScore} out of {crossoverStoryData.quiz.length}!</p>
                
                <button 
                  onClick={() => {
                    setActiveTab('Home');
                    setStoryState('reading');
                    setStoryQuizIndex(0);
                    setStoryScore(0);
                  }}
                  className="bg-white text-emerald-600 font-black px-8 py-4 rounded-full text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'Progress' ? (
          <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <button 
              onClick={() => setActiveTab('Home')}
              className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 mb-4 transition-colors"
            >
              &larr; Back to Home
            </button>
            <h2 className="text-2xl xl:text-3xl font-black text-slate-800 mb-6 flex items-center gap-3"><span className="text-4xl drop-shadow-sm">📈</span> Your Learning Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center h-64 text-center hover:shadow-md transition-shadow">
                  <div className="text-6xl mb-4 animate-bounce">🏆</div>
                  <div className="text-4xl font-black text-blue-600 mb-1">{userEXP}</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total EXP Earned</div>
               </div>
               <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center h-64 text-center hover:shadow-md transition-shadow">
                  <div className="text-6xl mb-4">⭐</div>
                  <div className="text-4xl font-black text-yellow-500 mb-1">Lv. {currentLevel}</div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Current Rank</div>
               </div>
               <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 col-span-1 md:col-span-2">
                  <h3 className="text-lg font-black text-slate-800 mb-4">Recent Milestones</h3>
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex items-center gap-4 mb-3">
                     <span className="text-3xl">🎉</span>
                     <div>
                        <h4 className="font-extrabold text-sm">Welcome to Leddy Learn!</h4>
                        <p className="text-xs font-medium opacity-80">You've successfully set up your learning account.</p>
                     </div>
                  </div>
                  <div className="text-slate-500 text-center py-6 font-medium text-sm">Keep exploring to see more activity here! You're doing great. 🌟</div>
               </div>
            </div>
          </div>
        ) : activeTab === 'Messages' ? (
          <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in-up">
            <button 
              onClick={() => setActiveTab('Home')}
              className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 mb-4 transition-colors"
            >
              &larr; Back to Home
            </button>
             <h2 className="text-2xl xl:text-3xl font-black text-slate-800 mb-6 flex items-center gap-3"><span className="text-4xl drop-shadow-sm">✉️</span> Messages</h2>
             <div className="space-y-4">
                <div className="bg-white rounded-[20px] p-5 shadow-sm border border-blue-200 flex gap-4 cursor-pointer hover:shadow-md transition-all">
                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0 relative">
                     🤖
                     <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="font-extrabold text-slate-800">Learnify</h4>
                         <span className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded-md">New</span>
                      </div>
                      <p className="text-[13px] font-bold text-slate-600 leading-snug">Welcome to Leddy Learn! I'm here to help you with your studies. Just go to my tab if you want to ask me anything!</p>
                   </div>
                </div>
                <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:shadow-md transition-all opacity-80">
                   <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">🏆</div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="font-extrabold text-slate-800">System Awards</h4>
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">2 days ago</span>
                      </div>
                      <p className="text-[13px] font-bold text-slate-600 leading-snug">Congratulations! You've set up your profile and earned your very first 50 EXP!</p>
                   </div>
                </div>
             </div>
          </div>
        ) : activeTab === 'Settings' ? (
          <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in-up">
            <button 
              onClick={() => setActiveTab('Home')}
              className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2 mb-4 transition-colors"
            >
              &larr; Back to Home
            </button>
             <h2 className="text-2xl xl:text-3xl font-black text-slate-800 mb-6 flex items-center gap-3"><span className="text-4xl drop-shadow-sm">⚙️</span> Settings</h2>
             <div className="bg-[url('/bg1.png')] bg-cover bg-center rounded-[24px] p-6 shadow-sm border border-slate-100 mb-6">
                <h3 className="font-extrabold text-slate-800 mb-4 text-lg">Account & App Data</h3>
                <p className="text-sm text-slate-500 mb-6 font-bold">Manage your profile, sounds, and application data.</p>
                <div className="space-y-4">
                   <div 
                      className="flex justify-between items-center bg-white/50 p-4 rounded-2xl cursor-pointer hover:bg-white/80 transition-colors"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                   >
                      <div>
                         <h4 className="font-bold text-slate-800">Music & Sound Effects</h4>
                         <p className="text-[11px] text-slate-500 font-bold">Toggle sounds during lessons and quizzes.</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${soundEnabled ? 'right-1' : 'left-1'}`}></div>
                      </div>
                   </div>
                   <div className="flex justify-between items-center bg-red-50 p-4 rounded-2xl border border-red-100">
                      <div>
                         <h4 className="font-bold text-red-700">Reset Progress</h4>
                         <p className="text-[11px] text-red-500 font-bold">This will clear your EXP, levels, and unlocked badges.</p>
                      </div>
                      <button 
                        onClick={() => {
                          if(confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
                            localStorage.clear();
                            window.location.reload();
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm active:scale-95"
                      >
                         Reset
                      </button>
                   </div>
                </div>
             </div>
             <button onClick={() => {
                  if (confirm("Are you sure you want to log out?")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }} className="w-full bg-[url('/bg1.png')] bg-cover bg-center py-4 text-slate-600 font-black rounded-[24px] shadow-sm border border-slate-100 transition-colors flex items-center justify-center gap-2 active:scale-95">
                <span className="text-xl">🌑</span> Log out of Leddy Learn
             </button>
          </div>
        ) : activeTab === 'Peaceful Thoughts' ? (
           <div className="h-full w-[90%] mx-auto flex flex-col items-center justify-center p-8 text-center animate-fade-in-up mt-8">
             <div className="text-[6rem] drop-shadow-xl animate-bounce mb-4">🧘</div>
             <h2 className="text-2xl xl:text-3xl font-black text-slate-800 tracking-tight mb-2">Peaceful Thoughts</h2>
             <p className="text-slate-500 font-bold max-w-sm mb-6 text-[15px]">Take a deep breath and clear your mind. This feature is coming soon!</p>
             <button onClick={() => setActiveTab('Home')} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3 rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all">Go Back Home</button>
          </div>
        ) : (
          /* DASHBOARD VIEW (Home) */
          <div className="relative mb-10 xl:mb-1 w-full animate-fade-in-up md:scale-[0.87] lg:scale-[0.82] xl:scale-[0.74] 2xl:scale-[0.85] origin-top">
            {/* HERO SECTION */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-5 xl:gap-1 mb-6 xl:mb-1">
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 relative z-0 min-h-[200px] h-auto lg:h-28 xl:h-28 overflow-hidden flex-1 flex flex-row items-center">
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#f8fafc] to-[#eff6ff] rounded-[24px]"></div>
                <img src="/cindepan.png?v=2" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 z-0 rounded-3xl" />

                {/* Text Content */}
                <div className="relative z-20 w-[60%] sm:w-[55%] md:w-[60%] lg:w-[60%] flex flex-col items-start text-left mt-2 sm:mt-0 py-2">
                   <h2 className="text-[1.2rem] leading-tight sm:text-2xl md:text-3xl font-black tracking-tight text-slate-800 sm:leading-tight mb-2 md:mb-3">
                     Embark on a <span className="text-[#2563eb]">magical journey!</span>
                   </h2>
                   <p className="text-slate-600 font-bold text-[11px] sm:text-sm md:text-[15px] mb-4 sm:mb-5 max-w-xs sm:max-w-sm line-clamp-3 sm:line-clamp-none">Join Cinderella and Peter Pan in new Magical Mysteries and unlock special rewards.</p>
                   <button onClick={() => setActiveTab('Stories')} className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-2 sm:px-6 md:px-8 md:py-3 rounded-full shadow-sm hover:-translate-y-0.5 transition-all text-xs sm:text-sm md:text-base">
                     Start Tale
                   </button>
                </div>
                
                {/* Girl Reading Illustration (Right) */}
                <div className="absolute -right-4 sm:right-0 md:right-8 lg:right-4 bottom-0 h-[85%] sm:h-[100%] md:h-[95%] lg:h-[110%] w-[50%] sm:w-[45%] md:w-[40%] lg:w-auto z-10 flex items-end">
                   <img src="/girl1.png?v=2" alt="Girl Reading" className="h-full w-full object-contain object-right-bottom" />
                </div>
              </div>
              
              <div className="bg-[url('/bg1.png')] bg-cover bg-center rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 md:p-6 lg:p-4 w-full lg:w-72 flex-shrink-0">
                 <img src="/boy1.png?v=2" alt="Learner Avatar" className="w-12 h-12 md:w-16 md:h-16 lg:w-12 lg:h-12 rounded-full mx-auto" />
                 <span className="text-base md:text-lg lg:text-sm font-bold text-slate-800 mt-2 md:mt-3 lg:mt-2 text-center block">Hello, Learner! 👋</span>
                 
                 <div className="w-full mt-3">
                   <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                     <span>Level 5 Explorer</span>
                     <span className="text-blue-500">XP: 345/500</span>
                   </div>
                   <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                     <div className="bg-blue-500 h-full rounded-full" style={{ width: '69%' }}></div>
                   </div>
                 </div>

                 <div className="w-full mt-2 xl:mt-1">
                   <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2 xl:mb-1">My Goals Today:</h4>
                   <ul className="space-y-1 text-xs xl:text-[10px] font-bold text-slate-600">
                     {goals.map(goal => (
                       <li 
                         key={goal.id} 
                         className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                         onClick={() => toggleGoal(goal.id)}
                       >
                         {goal.completed ? (
                           <div className="w-3 h-3 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[7px] flex-shrink-0">✓</div>
                         ) : (
                           <div className="w-3 h-3 rounded-full border border-slate-200 flex-shrink-0"></div>
                         )}
                         <span className={goal.completed ? 'line-through text-slate-500' : ''}>{goal.text}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 xl:gap-1">
              {/* LEFT COLUMN (2/3 width) */}
              <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-4 xl:gap-1">
                
                {/* Grades */}
                <div className="w-full">
                   <div className="flex items-center gap-3 mb-4 xl:mb-1">
                      <span className="text-3xl drop-shadow-sm">🎓</span>
                      <div>
                        <h3 className="text-lg font-black text-slate-800 leading-tight">Choose Your Grade Level</h3>
                        <p className="text-slate-500 text-[11px] font-extrabold tracking-wide uppercase mt-0.5">Start your learning adventure</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                     {[
                        {n: 'Pre-School', c: 'bg-[#ff7675] text-[#d63031] border-[#ff7675] text-red-900', icon: '🍼'},
                        {n: 'Kinder', c: 'bg-[#ffeaa7] text-[#fdcb6e] border-[#ffeaa7] text-amber-900', icon: '⭐'},
                        {n: 'Grade 1', c: 'bg-[#81ecec] text-[#00cec9] border-[#81ecec] text-teal-900', icon: '🎒'},
                        {n: 'Grade 2', c: 'bg-[#55efc4] text-[#00b894] border-[#55efc4] text-green-900', icon: '✏️'},
                        {n: 'Grade 3', c: 'bg-[#fab1a0] text-[#e17055] border-[#fab1a0] text-rose-900', icon: '📕'},
                        {n: 'Grade 4', c: 'bg-[#a29bfe] text-[#6c5ce7] border-[#a29bfe] text-indigo-900', icon: '🔍'},
                        {n: 'Grade 5', c: 'bg-[#fdcb6e] text-[#f39c12] border-[#fdcb6e] text-orange-900', icon: '🏺'},
                        {n: 'Grade 6', c: 'bg-[#74b9ff] text-[#0984e3] border-[#74b9ff] text-blue-900', icon: '🔬'},
                        {n: 'Grade 7', c: 'bg-[#81ecec] text-[#00cec9] border-[#81ecec] text-cyan-900', icon: '💡'},
                        {n: 'Grade 8', c: 'bg-[#55efc4] text-[#00b894] border-[#55efc4] text-emerald-900', icon: '💡'},
                        {n: 'Grade 9', c: 'bg-[#a29bfe] text-[#6c5ce7] border-[#a29bfe] text-purple-900', icon: '💡'},
                        {n: 'Grade 10', c: 'bg-[#fab1a0] text-[#e17055] border-[#fab1a0] text-red-900', icon: '🖼️'}
                     ].map(g => (
                        <button key={g.n} onClick={() => setSelectedGrade(g.n)} className={`p-2 rounded-[12px] font-black text-xs flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 transition-all border-b-[2px] border-b-black/10 ${g.c} ${selectedGrade===g.n ? 'ring-2 ring-offset-2 ring-blue-300 transform scale-105' : 'hover:scale-105'}`}>
                          <span className="text-xl drop-shadow-sm">{g.icon}</span> {g.n}
                        </button>
                     ))}
                   </div>
                </div>

                {/* Subjects */}
                <div className="w-full">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <span className="text-3xl drop-shadow-sm">📚</span>
                        <div>
                          <h3 className="text-lg font-black text-slate-800 leading-tight">Subjects</h3>
                          <p className="text-slate-500 text-[11px] font-extrabold tracking-wide uppercase mt-0.5">Explore different subjects and become a star!</p>
                        </div>
                     </div>
                     <button onClick={() => setShowAllSubjects(!showAllSubjects)} className="text-[#3b82f6] font-bold text-xs bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full hover:bg-slate-50">{showAllSubjects ? 'View Less' : 'View All'}</button>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     {[
                        {n: 'Mathematics', icon: '123', col: 'text-amber-500', bg: 'bg-amber-50'},
                        {n: 'English', icon: 'A', icon2: 'a', col: 'text-emerald-500', bg: 'bg-emerald-50'},
                        {n: 'Science', icon: '🔬', col: 'text-purple-500', bg: 'bg-purple-50'},
                        {n: 'Filipino', icon: '🇵🇭', col: 'text-red-500', bg: 'bg-red-50'},
                        {n: 'AralingPan', icon: '🌍', col: 'text-blue-500', bg: 'bg-blue-50'},
                        {n: 'Arts', icon: '🎨', col: 'text-pink-500', bg: 'bg-pink-50'},
                        {n: 'Technology', icon: '💻', col: 'text-indigo-500', bg: 'bg-indigo-50'},
                        {n: 'Values Ed', icon: '💖', col: 'text-rose-500', bg: 'bg-rose-50'}
                     ].slice(0, showAllSubjects ? undefined : 6).map(s => (
                       <button key={s.n} onClick={() => setSelectedSubject(s.n)} className={`${s.bg} p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 ${selectedSubject===s.n ? 'border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-105' : 'border-slate-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-1 hover:border-slate-200 transition-all'}`}>
                         <div className={`text-3xl font-black tracking-tighter drop-shadow-sm ${s.col || ''} leading-none flex items-baseline`}>
                           {s.n === 'English' ? <><span className="text-3xl text-green-500 leading-none">A</span><span className="text-xl text-blue-500 leading-none">a</span></> : s.icon}
                         </div>
                         <div className="text-[10px] font-extrabold text-slate-800 text-center leading-tight whitespace-nowrap">{s.n}</div>
                       </button>
                     ))}
                   </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="flex justify-center mt-2 mb-4 w-full relative z-10">
                  <button 
                    onClick={handleStartLearning}
                    className="w-full sm:w-auto min-w-[280px] justify-center text-[15px] font-black px-10 py-3.5 bg-blue-600 text-white rounded-full shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(37,99,235,0.4)] transition-all duration-300 ease-out flex items-center gap-2 active:scale-95"
                  >
                    <span className="text-xl">🚀</span> START LEARNING JOURNEY
                  </button>
                </div>

                {/* Continue Learning */}
                <div className="w-full">
                   <div className="flex items-center justify-between mb-4 xl:mb-1">
                     <div className="flex items-center gap-3">
                        <span className="text-2xl drop-shadow-sm">⏱️</span>
                        <h3 className="text-lg font-black text-slate-800 leading-tight">Continue Learning</h3>
                     </div>
                     <button onClick={() => setActiveTab('My Learning')} className="text-[#3b82f6] font-bold text-xs bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full hover:bg-slate-50">View All</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-3 xl:gap-1">
                      {/* Card 1 */}
                      <div className="bg-[url('/bg1.png')] bg-cover bg-center p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-gray-200 transition-colors">
                         <div className="bg-[#bbf7d0] rounded-[16px] flex items-center justify-center w-20 h-20 text-4xl flex-shrink-0 border-b-4 border-[#86efac]">
                           🍏
                         </div>
                         <div className="flex-1">
                           <h4 className="font-extrabold text-slate-800 text-[14px]">Counting Numbers 1-20</h4>
                           <p className="text-slate-500 text-[10px] font-bold mb-3 mt-0.5 tracking-wide">Mathematics • Grade 1</p>
                           <div className="flex items-center justify-between gap-3 mb-2">
                             <div className="flex-1 bg-white h-[6px] rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{width:'60%'}}></div>
                             </div>
                             <span className="text-[10px] font-black text-slate-500">60%</span>
                           </div>
                           <button onClick={handleStartLearning} className="text-blue-500 text-[11px] font-bold border-2 border-blue-100 px-4 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors inline-block active:scale-95">Continue</button>
                         </div>
                      </div>
                      
                      {/* Card 2 */}
                      <div className="bg-[url('/bg1.png')] bg-cover bg-center p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-gray-200 transition-colors">
                         <div className="bg-[#cffafe] rounded-[16px] flex items-center justify-center w-20 h-20 text-4xl flex-shrink-0 border-b-4 border-[#a5f3fc]">
                           🪴
                         </div>
                         <div className="flex-1">
                           <h4 className="font-extrabold text-slate-800 text-[14px]">Parts of a Plant</h4>
                           <p className="text-slate-500 text-[10px] font-bold mb-3 mt-0.5 tracking-wide">Science • Grade 3</p>
                           <div className="flex items-center justify-between gap-3 mb-2">
                             <div className="flex-1 bg-white h-[6px] rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{width:'40%'}}></div>
                             </div>
                             <span className="text-[10px] font-black text-slate-500">40%</span>
                           </div>
                           <button onClick={handleStartLearning} className="text-blue-500 text-[11px] font-bold border-2 border-blue-100 px-4 py-1 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors inline-block active:scale-95">Continue</button>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Bottom Banner */}
                <div className="relative p-6 sm:p-5 flex items-center gap-4 justify-center overflow-hidden text-center mt-2 rounded-2xl shadow-sm bg-gradient-to-r from-blue-900/5 to-indigo-900/10 border border-blue-900/10 xl:hidden">
                   <img src="/cindepan.png?v=2" alt="Background Texture" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />
                   <div className="absolute left-[-10px] opacity-20 text-[6rem] rotate-12 pointer-events-none drop-shadow-sm z-0">🏆</div>
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-5 py-2">
                     <div className="text-[3rem] drop-shadow-md pb-1 animate-pulse">🏆</div>
                     <div className="font-extrabold text-[#1e3a8a] text-[15px] sm:text-[17px] leading-snug">
                        Explore, Learn and Achieve your dreams!<br/>
                        You've got this! ⭐
                     </div>
                   </div>
                   <div className="absolute right-[-10px] bottom-[-20%] text-[7rem] opacity-20 blur-[1px] hidden sm:block pointer-events-none rotate-[-15deg] z-0">🎒</div>
                   <div className="absolute top-[20%] right-[20%] text-[2rem] opacity-20 hidden sm:block pointer-events-none z-0">✨</div>
                </div>

              </div>

              {/* RIGHT COLUMN (1/3 width) */}
              <div className="flex flex-col gap-6 lg:gap-4 xl:gap-1">
                 
                 {/* Ask Teacher AI */}
                 <div className="bg-[url('/bg1.png')] bg-cover bg-center p-6 xl:p-3 rounded-2xl border border-slate-100 relative overflow-hidden flex flex-col items-center text-center shadow-sm">
                    <div className="flex items-center gap-2 mb-2 z-10 self-start ml-2 relative">
                       <span className="text-[#3b82f6] font-bold text-2xl drop-shadow-sm">🤖</span>
                       <h3 className="font-extrabold text-slate-800 text-sm">Learnify by Leddy</h3>
                       <div className="absolute -left-1 -top-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    </div>
                    <div className="absolute top-[5%] right-[5%] w-32 h-32 bg-white rounded-full blur-[20px] opacity-70 pointer-events-none"></div>
                    <p className="text-[13px] font-bold text-slate-700 leading-snug w-[75%] max-w-[200px] text-left ml-2 z-10 mt-3 mb-5 self-start">
                      Hi! I'm your AI teacher.<br/>Ask me anything!
                    </p>
                    <div className="absolute right-[-10px] bottom-[-10px] text-[6.5rem] drop-shadow-xl z-20 pointer-events-none animate-[bounce_4s_infinite]">🤖</div>
                    <button onClick={() => { setActiveTab('Learnify by Leddy'); setCurrentLesson(null); }} className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-extrabold text-[13px] px-6 py-2.5 rounded-full z-10 shadow-[0_4px_15px_rgba(139,92,246,0.3)] transition-transform hover:-translate-y-0.5 active:scale-95 w-[65%] self-start flex items-center justify-center gap-2 ml-2">
                       <span className="text-sm">💬</span> Ask Now
                    </button>
                 </div>

                  {/* Your Progress */}
                 <div className="bg-[url('/bg1.png')] bg-cover bg-center p-6 xl:p-3 rounded-2xl border border-slate-100 shadow-sm relative pt-5 xl:pt-4">
                    <div className="flex items-center justify-between mb-6 xl:mb-1">
                       <h3 className="font-extrabold text-slate-800 text-sm">Your Progress</h3>
                       <button onClick={() => setActiveTab('Progress')} className="text-[#3b82f6] font-bold text-xs bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full hover:bg-slate-50 transition-colors">View All</button>
                    </div>
                    <div className="flex flex-row items-center gap-5 xl:gap-1 justify-between w-full h-[120px] xl:h-[100px]">
                       
                       {/* Circular Progress */}
                       <div className="relative w-28 h-28 xl:w-24 xl:h-24 flex-shrink-0 flex items-center justify-center group cursor-pointer" onClick={() => setActiveTab('Progress')}>
                         <div className="absolute inset-0 rounded-full border-[8px] border-[#f1f5f9] group-hover:scale-105 transition-transform duration-500"></div>
                         <svg viewBox="0 0 36 36" className="w-[110%] h-[110%] transform -rotate-90 absolute">
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeDasharray={`${Math.floor((userEXP % 1000) / 10)}, 100`}
                              className="transition-all duration-1000 ease-out"
                            />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center z-10 z-[5] group-hover:scale-110 transition-transform">
                           <span className="text-2xl font-black text-slate-800 tracking-tighter leading-none mb-0.5">{Math.floor((userEXP % 1000) / 10)}%</span>
                           <span className="text-[6.5px] text-slate-500 font-extrabold tracking-widest uppercase leading-none px-2 text-center">To Next<br/>Level</span>
                         </div>
                       </div>

                       {/* Stats */}
                       <div className="flex-1 flex flex-col gap-4 py-1 self-stretch justify-center pr-2">
                          <div className="flex items-center justify-between group cursor-default">
                             <div className="flex items-center gap-2">
                               <span className="text-sm drop-shadow-sm group-hover:scale-125 transition-transform">⭐</span>
                               <span className="text-[9.5px] font-bold text-slate-500 tracking-wide uppercase whitespace-nowrap">Current Level</span>
                             </div>
                             <span className="text-[13px] font-black text-slate-800">{currentLevel}</span>
                          </div>
                          <div className="flex items-center justify-between group cursor-default">
                             <div className="flex items-center gap-2">
                               <span className="text-sm drop-shadow-sm group-hover:scale-125 transition-transform">🏆</span>
                               <span className="text-[9.5px] font-bold text-slate-500 tracking-wide uppercase whitespace-nowrap">Total EXP</span>
                             </div>
                             <span className="text-[13px] font-black text-slate-800">{userEXP}</span>
                          </div>
                          <div className="flex items-center justify-between group cursor-default">
                             <div className="flex items-center gap-2">
                               <span className="text-sm drop-shadow-sm group-hover:scale-125 transition-transform">🔥</span>
                               <span className="text-[9.5px] font-bold text-slate-500 tracking-wide uppercase whitespace-nowrap">Current Streak</span>
                             </div>
                             <span className="text-[13px] font-black text-slate-800">Active</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Achievements */}
                 <div className="bg-[url('/bg1.png')] bg-cover bg-center p-6 xl:p-3 rounded-2xl border border-slate-100 shadow-sm relative pt-5 xl:pt-4 mt-6 lg:mt-4 xl:mt-3">
                    <div className="flex justify-between items-center mb-6 xl:mb-3">
                       <h3 className="font-extrabold text-slate-800 text-sm">Achievements</h3>
                       <button onClick={() => setActiveTab('Achievements')} className="text-[#3b82f6] font-bold text-xs bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full hover:bg-slate-50 transition-colors">View All</button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 xl:gap-1">
                       <div onClick={() => setModalData({ title: 'Quick Learner', message: 'You completed a lesson very quickly!', icon: '🥇', type: 'badge', color: 'yellow', actionText: 'Awesome!' })} className="flex flex-col items-center gap-1 group cursor-pointer hover:-translate-y-1 transition-transform">
                          <div className="w-[48px] h-[48px] bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-center text-2xl drop-shadow-sm group-hover:border-yellow-200 group-hover:shadow-[0_4px_10px_rgba(250,204,21,0.1)] transition-all">🥇</div>
                          <span className="text-[8px] font-extrabold text-slate-500 text-center uppercase tracking-wide px-1">Quick<br/>Learner</span>
                       </div>
                       <div onClick={() => setModalData({ title: 'Quiz Master', message: 'You got 100% on a quiz!', icon: '🪪', type: 'badge', color: 'purple', actionText: 'Awesome!' })} className="flex flex-col items-center gap-1 group cursor-pointer hover:-translate-y-1 transition-transform">
                          <div className="w-[48px] h-[48px] bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-center text-3xl drop-shadow-sm group-hover:border-purple-200 group-hover:shadow-[0_4px_10px_rgba(168,85,247,0.1)] transition-all pt-1">🪪</div>
                          <span className="text-[8px] font-extrabold text-slate-500 text-center uppercase tracking-wide px-1">Quiz<br/>Master</span>
                       </div>
                       <div onClick={() => setModalData({ title: 'Star Student', message: 'You earned a top star rating!', icon: '⭐', type: 'badge', color: 'yellow', actionText: 'Awesome!' })} className="flex flex-col items-center gap-1 group cursor-pointer hover:-translate-y-1 transition-transform">
                          <div className="w-[48px] h-[48px] bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-center text-3xl drop-shadow-sm group-hover:border-yellow-200 group-hover:shadow-[0_4px_10px_rgba(250,204,21,0.1)] transition-all pt-1">⭐</div>
                          <span className="text-[8px] font-extrabold text-slate-500 text-center uppercase tracking-wide px-1">Star<br/>Student</span>
                       </div>
                       <div onClick={() => setModalData({ title: 'Top Performer', message: 'You are doing great in all subjects!', icon: '💎', type: 'badge', color: 'blue', actionText: 'Awesome!' })} className="flex flex-col items-center gap-1 group cursor-pointer hover:-translate-y-1 transition-transform">
                          <div className="w-[48px] h-[48px] bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-center text-3xl drop-shadow-sm group-hover:border-blue-200 group-hover:shadow-[0_4px_10px_rgba(59,130,246,0.1)] transition-all pt-1">💎</div>
                          <span className="text-[8px] font-extrabold text-slate-500 text-center uppercase tracking-wide px-1">Top<br/>Performer</span>
                       </div>
                    </div>
                 </div>
                 
              </div>
            </div>

          </div>
        )}
        </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] pt-3 pb-6 px-2 sm:px-4 z-50 flex justify-around items-center">
        {[
          { id: 'Home', icon: '🏠', label: 'Home' }, 
          { id: 'My Learning', icon: '📚', label: 'Learn' }, 
          { id: 'Learnify by Leddy', icon: '🤖', label: 'AI' }, 
          { id: 'Achievements', icon: '🏅', label: 'Awards' },
          { id: 'More', icon: '☰', label: 'More' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => { 
              if (tab.id === 'More') {
                setShowMobileMenu(true);
              } else {
                setActiveTab(tab.id); 
                setCurrentLesson(null); 
              }
            }}
            className={`relative flex flex-col items-center justify-center w-[4rem] sm:w-[4.5rem] py-2 rounded-[14px] transition-all duration-300 ease-in-out ${
              (activeTab === tab.id && tab.id !== 'More') || (showMobileMenu && tab.id === 'More')
              ? 'text-blue-600 bg-blue-50' 
              : 'text-slate-500 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className={`text-[1.35rem] sm:text-2xl transition-transform duration-300 ${((activeTab === tab.id && tab.id !== 'More') || (showMobileMenu && tab.id === 'More')) ? '-translate-y-2 scale-110 drop-shadow-sm' : ''}`}>{tab.icon}</span>
            <span className={`text-[10px] font-bold leading-tight w-[110%] text-center absolute bottom-1.5 transition-all duration-300 ${((activeTab === tab.id && tab.id !== 'More') || (showMobileMenu && tab.id === 'More')) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>{tab.label}</span>
          </button>
        ))}
      </div>
      {/* MODAL / TOAST NOTIFICATION */}
      {modalData && (
        <div className="fixed inset-0 bg-[url('/bg.png?v=2')]/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all animate-in fade-in duration-200" onClick={() => setModalData(null)}>
          <div 
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative transition-all transform scale-100 animate-in zoom-in-95 duration-300 overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Color accent header */}
            <div className={`absolute top-0 left-0 w-full h-32 opacity-20 -z-10 ${
              modalData.color === 'blue' ? 'bg-blue-400' :
              modalData.color === 'green' ? 'bg-green-400' :
              modalData.color === 'purple' ? 'bg-purple-400' :
              modalData.color === 'orange' ? 'bg-orange-400' :
              modalData.color === 'yellow' ? 'bg-yellow-400' :
              modalData.color === 'indigo' ? 'bg-indigo-400' :
              modalData.color === 'pink' ? 'bg-pink-400' :
              modalData.color === 'amber' ? 'bg-amber-400' :
              modalData.color === 'emerald' ? 'bg-emerald-400' :
              'bg-slate-300'
            }`}></div>
            <button 
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-600 bg-white/50 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm"
            >
              ✕
            </button>
            <div className="text-7xl mb-4 text-center filter drop-shadow-lg transform hover:scale-110 transition-transform cursor-default">{modalData.icon}</div>
            
            <div className="text-center mb-2 flex flex-col items-center">
              {modalData.type === 'locked' && (
                <span className="bg-slate-200 text-slate-600 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest flex items-center gap-1">
                  🔒 Locked
                </span>
              )}
              {modalData.type === 'badge' && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest flex items-center gap-1 border border-yellow-200">
                  🏆 Badge Earned
                </span>
              )}
              {modalData.type === 'quiz' && (
                <span className="bg-pink-100 text-pink-700 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest flex items-center gap-1 border border-pink-200">
                  📝 Challenge
                </span>
              )}
               {modalData.type === 'lesson' && (
                <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest flex items-center gap-1 border border-blue-200">
                  📚 Local Lesson
                </span>
              )}
              <h3 className="text-2xl font-black text-slate-800">{modalData.title}</h3>
            </div>
            
            <p className="text-slate-600 text-center mb-6 font-medium leading-relaxed">{modalData.message}</p>
            
            {modalData.details && (
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border-2 border-slate-100">
                <ul className="space-y-3">
                  {modalData.details.map((detail, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold text-sm tracking-wide">{detail.label}</span>
                      <span className="text-slate-800 font-black text-sm bg-white px-2 py-1 rounded-md shadow-sm">{detail.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <button 
              onClick={() => setModalData(null)}
              className={`w-full text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_4px_0_rgba(0,0,0,0.15)] hover:shadow-none hover:translate-y-1 ${
                modalData.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 shadow-[0_4px_0_theme(colors.blue.600)]' :
                modalData.color === 'green' ? 'bg-green-500 hover:bg-green-600 shadow-[0_4px_0_theme(colors.green.600)]' :
                modalData.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600 shadow-[0_4px_0_theme(colors.purple.600)]' :
                modalData.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600 shadow-[0_4px_0_theme(colors.orange.600)]' :
                modalData.color === 'yellow' ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-[0_4px_0_theme(colors.yellow.500)]' :
                modalData.color === 'indigo' ? 'bg-indigo-500 hover:bg-indigo-600 shadow-[0_4px_0_theme(colors.indigo.600)]' :
                modalData.color === 'pink' ? 'bg-pink-500 hover:bg-pink-600 shadow-[0_4px_0_theme(colors.pink.600)]' :
                modalData.color === 'amber' ? 'bg-amber-500 hover:bg-amber-600 shadow-[0_4px_0_theme(colors.amber.600)]' :
                modalData.color === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_0_theme(colors.emerald.600)]' :
                'bg-slate-800 hover:bg-slate-900 text-white shadow-[0_4px_0_theme(colors.slate.900)]'
              }`}
            >
              {modalData.actionText || 'Okay, got it!'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

