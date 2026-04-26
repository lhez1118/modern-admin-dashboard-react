export const QUIZ_DATABASE: Record<string, Record<string, {q: string, options: string[], a: string}[]>> = {
  'Fairy Tale': {
    'Easy': [
      { q: "How many glass slippers did Cinderella lose?", options: ["One", "Two", "Three"], a: "One" },
      { q: "Where does Peter Pan live?", options: ["Wonderland", "Neverland", "Narnia"], a: "Neverland" },
      { q: "What color is Cinderella's ball gown?", options: ["Blue", "Red", "Black"], a: "Blue" },
      { q: "What magical creature is Peter Pan's best friend?", options: ["Dragon", "Unicorn", "Fairy"], a: "Fairy" },
      { q: "What did Cinderella's fairy godmother turn into a carriage?", options: ["Watermelon", "Apple", "Pumpkin"], a: "Pumpkin" }
    ],
    'Moderate': [],
    'Hard': []
  },
  'Mathematics': {
    'Easy': [
      { q: "What is 15 + 8?", options: ["21", "23", "25"], a: "23" },
      { q: "What is 10 x 4?", options: ["14", "40", "44"], a: "40" },
      { q: "Subtract 12 from 30.", options: ["18", "16", "20"], a: "18" },
      { q: "What is half of 50?", options: ["20", "25", "30"], a: "25" },
      { q: "5 + 5 x 2 =", options: ["20", "15", "10"], a: "15" },
    ],
    'Moderate': [
      { q: "Solve: 3x = 12. What is x?", options: ["3", "4", "6"], a: "4" },
      { q: "What is 15% of 100?", options: ["10", "15", "20"], a: "15" },
      { q: "Compute: 7^2 (7 squared)", options: ["14", "49", "47"], a: "49" },
      { q: "What is the square root of 81?", options: ["8", "9", "11"], a: "9" },
      { q: "Solve: 20 - (4 x 3) =", options: ["48", "8", "12"], a: "8" },
    ],
    'Hard': [
      { q: "Solve: 2x + 5 = 17. What is x?", options: ["6", "5", "7"], a: "6" },
      { q: "What is the formula for the area of a circle?", options: ["πr²", "2πr", "πd"], a: "πr²" },
      { q: "If y = x² + 2x, what is y when x = 3?", options: ["12", "15", "18"], a: "15" },
      { q: "What is the sine of 90 degrees?", options: ["0", "1", "undefined"], a: "1" },
      { q: "A right triangle has sides 3 and 4. What is the hypotenuse?", options: ["5", "6", "7"], a: "5" },
    ]
  },
  'Science': {
    'Easy': [
      { q: "What is the center of our solar system?", options: ["Earth", "Mars", "Sun"], a: "Sun" },
      { q: "Which part of a plant conducts photosynthesis?", options: ["Roots", "Stem", "Leaf"], a: "Leaf" },
      { q: "What gas do humans breathe out?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide"], a: "Carbon Dioxide" },
      { q: "How many legs does a spider have?", options: ["6", "8", "10"], a: "8" },
      { q: "What do bees collect to make honey?", options: ["Nectar", "Leaves", "Water"], a: "Nectar" }
    ],
    'Moderate': [
      { q: "What part of the cell contains the genetic material (DNA)?", options: ["Ribosome", "Nucleus", "Mitochondria"], a: "Nucleus" },
      { q: "At what temperature (Celsius) does water boil?", options: ["50", "90", "100"], a: "100" },
      { q: "What is the chemical symbol for Gold?", options: ["Go", "Au", "Ag"], a: "Au" },
      { q: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars"], a: "Mars" },
      { q: "What force keeps us on the ground?", options: ["Magnetism", "Gravity", "Friction"], a: "Gravity" }
    ],
    'Hard': [
      { q: "What is the most abundant gas in the Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen"], a: "Nitrogen" },
      { q: "What process do plants use to create food from sunlight?", options: ["Respiration", "Photosynthesis", "Transpiration"], a: "Photosynthesis" },
      { q: "An atom with an electrical charge is called an...", options: ["Ion", "Electron", "Isotope"], a: "Ion" },
      { q: "What blood type is the universal donor?", options: ["A+", "AB+", "O-"], a: "O-" },
      { q: "What part of the brain controls balance and coordination?", options: ["Cerebrum", "Cerebellum", "Brainstem"], a: "Cerebellum" }
    ]
  },
  'English': {
    'Easy': [
      { q: "What is a 'noun'?", options: ["An action word", "A person, place, or thing", "A describing word"], a: "A person, place, or thing" },
      { q: "Choose the correct spelling:", options: ["Definately", "Definitly", "Definitely"], a: "Definitely" },
      { q: "Which is a vowel?", options: ["B", "E", "Z"], a: "E" },
      { q: "What tense is 'I walked'?", options: ["Present", "Past", "Future"], a: "Past" },
      { q: "What punctuation ends a question?", options: ["Period", "Exclamation", "Question Mark"], a: "Question Mark" }
    ],
    'Moderate': [
      { q: "Identify the adjective: 'The quick brown fox.'", options: ["The", "quick", "fox"], a: "quick" },
      { q: "What is a synonym for 'Happy'?", options: ["Sad", "Joyful", "Angry"], a: "Joyful" },
      { q: "Which sentence is grammatically correct?", options: ["She dont know.", "She don't knows.", "She doesn't know."], a: "She doesn't know." },
      { q: "What is an antonym for 'Expand'?", options: ["Grow", "Shrink", "Inflate"], a: "Shrink" },
      { q: "What is the plural of 'Child'?", options: ["Childs", "Childrens", "Children"], a: "Children" }
    ],
    'Hard': [
      { q: "What is a 'hyperbole'?", options: ["A hidden meaning", "An extreme exaggeration", "A comparison using like or as"], a: "An extreme exaggeration" },
      { q: "Which word is an adverb in: 'He ran very fast'?", options: ["He", "ran", "very"], a: "very" },
      { q: "What is the past participle of 'write'?", options: ["Written", "Wrote", "Writing"], a: "Written" },
      { q: "What figurative language is 'Cruel kindness'?", options: ["Metaphor", "Oxymoron", "Simile"], a: "Oxymoron" },
      { q: "Identify the pronoun: 'They went to the store.'", options: ["They", "went", "store"], a: "They" }
    ]
  },
  'Technology': {
    'Easy': [
      { q: "What device do you use to click things on a computer screen?", options: ["Mouse", "Keyboard", "Printer"], a: "Mouse" },
      { q: "What does PC stand for?", options: ["Personal Computer", "Private Computer", "Public Computer"], a: "Personal Computer" },
      { q: "Which of these is a search engine?", options: ["Google", "Microsoft Word", "Paint"], a: "Google" },
      { q: "What part of the computer shows you the pictures and words?", options: ["Monitor", "Mouse", "CPU"], a: "Monitor" },
      { q: "Which tool helps you type letters and numbers?", options: ["Keyboard", "Speaker", "Mouse"], a: "Keyboard" }
    ],
    'Moderate': [
      { q: "What does Wi-Fi stand for?", options: ["Wireless Fidelity", "Wired Fiber", "Wireless Fire"], a: "Wireless Fidelity" },
      { q: "What is the brain of the computer?", options: ["CPU", "RAM", "Hard Drive"], a: "CPU" },
      { q: "Which of these is an Operating System?", options: ["Windows", "Microsoft Excel", "Google Chrome"], a: "Windows" },
      { q: "What do you call the physical parts of a computer?", options: ["Hardware", "Software", "Malware"], a: "Hardware" },
      { q: "Which shortcut copies text?", options: ["Ctrl + C", "Ctrl + V", "Ctrl + Z"], a: "Ctrl + C" }
    ],
    'Hard': [
      { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Machine Language", "Home Tool Markup Language"], a: "Hyper Text Markup Language" },
      { q: "What is full form of RAM?", options: ["Random Access Memory", "Read Access Memory", "Run All Memory"], a: "Random Access Memory" },
      { q: "What does a firewall do?", options: ["Protects a network", "Cools down the PC", "Makes internet faster"], a: "Protects a network" },
      { q: "What was the first computer virus created in the 1970s?", options: ["Creeper", "ILOVEYOU", "Melissa"], a: "Creeper" },
      { q: "What represents the smallest unit of data in a computer?", options: ["Bit", "Byte", "Pixel"], a: "Bit" }
    ]
  },
  'Filipino': {
    'Easy': [
      { q: "Ano ang pambansang ibon ng Pilipinas?", options: ["Maya", "Agila", "Kalapati"], a: "Agila" },
      { q: "Sino ang tinaguriang Pambansang Bayani ng Pilipinas?", options: ["Andres Bonifacio", "Apolinario Mabini", "Jose Rizal"], a: "Jose Rizal" },
      { q: "Ilang titik mayroon ang makabagong alpabetong Filipino?", options: ["26", "28", "20"], a: "28" },
      { q: "Ano sa Tagalog ang 'Good Morning'?", options: ["Magandang Gabi", "Magandang Tanghali", "Magandang Umaga"], a: "Magandang Umaga" },
      { q: "Kailan ginagawa ang Simbang Gabi?", options: ["Pasko", "Araw ng Patay", "Mahal na Araw"], a: "Pasko" }
    ],
    'Moderate': [
      { q: "Ano ang kahulugan ng idyomang 'Butas ang bulsa'?", options: ["Mayaman", "Punit ang damit", "Walang pera"], a: "Walang pera" },
      { q: "Kanino inialay ni Jose Rizal ang nobelang El Filibusterismo?", options: ["Maria Clara", "Sa Inang Bayan", "GOMBURZA"], a: "GOMBURZA" },
      { q: "Sino ang tinaguriang 'Ama ng Katipunan'?", options: ["Emilio Aguinaldo", "Andres Bonifacio", "Apolinario Mabini"], a: "Andres Bonifacio" },
      { q: "Ano ang tawag sa bahagi ng panalita na naglalarawan sa pangngalan?", options: ["Pang-uri", "Pandiwa", "Pang-abay"], a: "Pang-uri" },
      { q: "Sino ang sumulat ng Florante at Laura?", options: ["Francisco Balagtas", "Jose Rizal", "Graciano Lopez Jaena"], a: "Francisco Balagtas" }
    ],
    'Hard': [
      { q: "Alin sa mga sumusunod ang halimbawa ng 'Pang-atnig' (Conjunction)?", options: ["Mabilis", "Ngunit", "Takbo"], a: "Ngunit" },
      { q: "Ano ang sagisag panulat ni Marcelo H. del Pilar?", options: ["Plaridel", "Dimasalang", "Tick-Tack"], a: "Plaridel" },
      { q: "Sino si 'Matanglawin' sa El Filibusterismo?", options: ["Basilio", "Kabesang Tales", "Simoun"], a: "Kabesang Tales" },
      { q: "Ano ang kasingkahulugan ng salitang 'Marikit'?", options: ["Pangit", "Maganda", "Madilim"], a: "Maganda" },
      { q: "Sino ang unang Pangulo ng Republika ng Pilipinas?", options: ["Manuel Quezon", "Jose P. Laurel", "Emilio Aguinaldo"], a: "Emilio Aguinaldo" }
    ]
  },
  'Araling Panlipunan': {
    'Easy': [
      { q: "Ilang isla mayroon ang Pilipinas (approx)?", options: ["7,641", "1,000", "5,200"], a: "7,641" },
      { q: "Ano ang kabisera o capital ng Pilipinas?", options: ["Quezon City", "Manila", "Cebu"], a: "Manila" },
      { q: "Sino ang pinuno na nagdeklara ng Martial Law sa Pilipinas?", options: ["Ferdinand Marcos", "Corazon Aquino", "Rodrigo Duterte"], a: "Ferdinand Marcos" },
      { q: "Anong rehiyon matatagpuan ang Baguio City?", options: ["Region I", "CAR (Cordillera)", "NCR"], a: "CAR (Cordillera)" },
      { q: "Sino ang nagtuklas ng bansang Pilipinas ayon sa mga Kastila noong 1521?", options: ["Miguel Lopez de Legazpi", "Christopher Columbus", "Ferdinand Magellan"], a: "Ferdinand Magellan" }
    ],
    'Moderate': [
      { q: "Sino ang tinaguriang 'Utak ng Katipunan'?", options: ["Emilio Jacinto", "Apolinario Mabini", "Andres Bonifacio"], a: "Emilio Jacinto" },
      { q: "Kailan idineklara ang Kalayaan ng Pilipinas?", options: ["June 12, 1898", "July 4, 1946", "August 21, 1983"], a: "June 12, 1898" },
      { q: "Ano ang naging pinaka-unang kabisera ng Pilipinas sa panahon ng mga Kastila?", options: ["Cebu", "Manila", "Iloilo"], a: "Cebu" },
      { q: "Sino ang asawa ni Diego Silang na nagpatuloy ng himagsikan?", options: ["Melchora Aquino", "Gabriela Silang", "Gregoria de Jesus"], a: "Gabriela Silang" },
      { q: "Ano ang tawag sa sistema ng kalakalan (trade) sa pagitan ng Pilipinas at Mexico noong panahon ng Kastila?", options: ["Barter System", "Kalakalang Galyon", "Encomienda System"], a: "Kalakalang Galyon" }
    ],
    'Hard': [
      { q: "Anong batas ang nagtatadhana sa malayang kalakalan sa pagitan ng US at Pilipinas (Payne-Aldrich)?", options: ["Wood-Forbes", "Payne-Aldrich Act", "Tydings-McDuffie Act"], a: "Payne-Aldrich Act" },
      { q: "Sino ang Pangulo na naglagda ng 'Agricultural Land Reform Code'?", options: ["Ramon Magsaysay", "Ferdinand Marcos", "Diosdado Macapagal"], a: "Diosdado Macapagal" },
      { q: "Aling bansa sa Asya pinadala ang mga Pilipinong sundalo noong PEFTOK?", options: ["Vietnam", "Korea", "Japan"], a: "Korea" },
      { q: "Ano ang tawag sa aklat na isinulat ni Antonio de Morga tungkol sa kasaysayan ng bansa?", options: ["Noli Me Tangere", "Sucesos de las Islas Filipinas", "La Solidaridad"], a: "Sucesos de las Islas Filipinas" },
      { q: "Ano ang pangalan ng barko ni Magellan na nakakumpleto ng pag-ikot sa mundo?", options: ["Trinidad", "Concepcion", "Victoria"], a: "Victoria" }
    ]
  }
};
