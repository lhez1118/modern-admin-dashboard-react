export const LESSON_HISTORY: Record<string, string> = {
  // Elementary & Kinder
  'Ako at Aking Pamilya': '<p class="text-slate-300 mb-6 leading-relaxed">The family is the smallest and most important unit of society. We learn our first values of love and respect at home.</p>',
  'Ang Aking Paaralan': '<p class="text-slate-300 mb-6 leading-relaxed">School is our second home. It is where we interact with other children and learn to follow community rules.</p>',
  'Pambansang Sagisag': '<p class="text-slate-300 mb-6 leading-relaxed">Our national symbols help define our identity: The Philippine Eagle, Sampaguita (flower), Narra (tree), and the Philippine Flag.</p>',
  'Mga Katulong sa Pamayanan': '<p class="text-slate-300 mb-6 leading-relaxed">Community helpers make our lives safe and healthy. This includes Doctors, Police Officers, Firefighters, and Teachers.</p>',
  'Kultura at Pagdiriwang': '<p class="text-slate-300 mb-6 leading-relaxed">We celebrate rich traditions like the Ati-Atihan, Sinulog, and the unique Filipino way of celebrating Christmas starting in September.</p>',
  
  'Mga Bayani ng Pilipinas': '<p class="text-slate-300 mb-6 leading-relaxed">Heroes like Dr. Jose Rizal, Andres Bonifacio, and Apolinario Mabini who sacrificed for our freedom.</p>',
  'Heograpiya ng Pilipinas': '<p class="text-slate-300 mb-6 leading-relaxed">We are an archipelago of over 7,600 islands, strictly divided into three major groups: Luzon, Visayas, and Mindanao.</p>',
  'Pamahalaan at Batas': '<p class="text-slate-300 mb-6 leading-relaxed">The government maintains order using the Executive (President), Legislative (Congress), and Judiciary (Supreme Court) branches.</p>',
  'Panahon ng Espanyol': '<p class="text-slate-300 mb-6 leading-relaxed">Ferdinand Magellan arrived in 1521, beginning over 300 years of Spanish colonial rule which introduced Christianity.</p>',
  'Kultura at Tradisyon': '<p class="text-slate-300 mb-6 leading-relaxed">Understanding native concepts like Bayanihan (community spirit) and Utang na Loob.</p>',

  // Junior High
  'Araling Asyano': '<p class="text-slate-300 mb-6 leading-relaxed">Studying the cradles of civilization in Asia, from ancient Mesopotamia to the dynastic periods of China and Japan.</p>',
  'Kasaysayan ng Daigdig': '<p class="text-slate-300 mb-6 leading-relaxed">World history covers human evolution, the Middle Ages, the Renaissance, and the impact of the World Wars.</p>',
  'Ekonomiks': '<p class="text-slate-300 mb-6 leading-relaxed">The study of scarcity. It explains how societies distribute limited resources to satisfy unlimited human needs (Supply and Demand).</p>',
  'The Philippine Revolution': `
    <div class="space-y-8">
      <section>
        <p class="text-slate-200 text-lg leading-relaxed mb-4">
          The <strong>Philippine Revolution (1896–1898)</strong> was one of the most significant and dramatic events in the history of the Philippines. After over three centuries of Spanish colonial rule, characterized by oppressive taxation, forced labor (polo y servicios), and abuse of power by Spanish friars, the Filipino people rose in armed rebellion. The catalyst for this revolution was the founding of the <em>Kataastaasang, Kagalanggalangang Katipunan ng mga Anak ng Bayan</em> (KKK), a secret society established by Andres Bonifacio, Teodoro Plata, and Ladislao Diwa on July 7, 1892. Unlike the reformist La Liga Filipina founded by Dr. Jose Rizal, the Katipunan had a clear, radical goal: total separation and independence from Spain through armed conflict.
        </p>
        <p class="text-slate-200 text-lg leading-relaxed mb-0">
          The breaking point occurred when the Katipunan was prematurely discovered by Spanish authorities on August 19, 1896, leading to massive arrests. In response to the imminent danger, Bonifacio rallied thousands of Katipuneros in Caloocan. During a dramatic event remembered as the <strong>Cry of Pugad Lawin</strong> (August 1896), the revolutionaries tore up their <em>cedulas personales</em> (residence tax certificates), shouting "Mabuhay ang Pilipinas!" (Long live the Philippines!). This deeply symbolic act formally marked the beginning of the Philippine Revolution.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Key Figures of the Revolution</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-[#1c1c21] p-5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors shadow-lg shadow-black/20">
            <h4 class="text-blue-400 font-bold text-lg mb-1">Andres Bonifacio</h4>
            <p class="text-sm text-slate-400 italic mb-3">Supremo of the Katipunan</p>
            <p class="text-slate-300 text-sm leading-relaxed">
              Known as the "Father of the Philippine Revolution," Bonifacio was a brilliant organizer from Tondo, Manila. He authored the Decalogue of the Katipunan. Despite lacking formal military training, he commanded intense loyalty and sparked the nationwide uprising.
            </p>
          </div>
          <div class="bg-[#1c1c21] p-5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors shadow-lg shadow-black/20">
            <h4 class="text-blue-400 font-bold text-lg mb-1">Emilio Aguinaldo</h4>
            <p class="text-sm text-slate-400 italic mb-3">Military Strategist & President</p>
            <p class="text-slate-300 text-sm leading-relaxed">
              A mayor from Kawit, Cavite, who successfully led major military victories against the Spanish forces. He was later elected President of the revolutionary government at the Tejeros Convention, formally declaring independence on June 12, 1898.
            </p>
          </div>
          <div class="bg-[#1c1c21] p-5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors shadow-lg shadow-black/20">
            <h4 class="text-blue-400 font-bold text-lg mb-1">Apolinario Mabini</h4>
            <p class="text-sm text-slate-400 italic mb-3">Brains of the Revolution</p>
            <p class="text-slate-300 text-sm leading-relaxed">
              Despite being paralyzed in both legs due to polio, Mabini served as the first Prime Minister and Chief Adviser to Aguinaldo. He drafted the revolutionary government's decrees and the first constitution in Asia, proving that intellect could guide a nation's destiny.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 class="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Timeline of Key Events</h3>
        <ul class="space-y-4 list-none pl-0">
          <li class="relative pl-6">
            <div class="absolute left-0 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
            <strong class="text-blue-300 font-medium">July 7, 1892 &ndash; Founding of the Katipunan:</strong> 
            <span class="text-slate-300 ml-1">Following the arrest of Jose Rizal, Bonifacio and others secretly formed the KKK in Tondo, Manila to prepare for an armed rebellion.</span>
          </li>
          <li class="relative pl-6">
            <div class="absolute left-0 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
            <strong class="text-blue-300 font-medium">August 23, 1896 &ndash; The Cry of Pugad Lawin:</strong> 
            <span class="text-slate-300 ml-1">Katipunan members tore up their cedulas, publicly declaring their separation from Spain and initiating the national uprising.</span>
          </li>
          <li class="relative pl-6">
            <div class="absolute left-0 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
            <strong class="text-blue-300 font-medium">December 30, 1896 &ndash; Execution of Dr. Jose Rizal:</strong> 
            <span class="text-slate-300 ml-1">Falsely accused of leading the rebellion, Rizal was executed by firing squad in Bagumbayan. His death enraged the populace and fueled the revolution further.</span>
          </li>
          <li class="relative pl-6">
            <div class="absolute left-0 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
            <strong class="text-blue-300 font-medium">March 22, 1897 &ndash; The Tejeros Convention:</strong> 
            <span class="text-slate-300 ml-1">A fateful assembly intended to unite the revolutionary factions (Magdiwang and Magdalo), which resulted in Aguinaldo replacing Bonifacio as the recognized leader.</span>
          </li>
          <li class="relative pl-6">
            <div class="absolute left-0 top-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
            <strong class="text-blue-300 font-medium">June 12, 1898 &ndash; Declaration of Independence:</strong> 
            <span class="text-slate-300 ml-1">Aguinaldo officially declared Philippine independence from Spain in Kawit, Cavite, and unfurled the Philippine national flag for the first time.</span>
          </li>
        </ul>
      </section>

      <section class="bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl">
        <h3 class="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
          Deep Dive Analysis: The Tejeros Convention
        </h3>
        <p class="text-slate-300 leading-relaxed m-0 text-justify">
          While the revolution was initially united against Spain, internal political divisions soon arose in Cavite between two Katipunan councils: the <em>Magdiwang</em> (loyal to Bonifacio) and the <em>Magdalo</em> (loyal to Aguinaldo). The <strong>Tejeros Convention</strong> was called on March 22, 1897, to resolve this friction by establishing a single revolutionary government. During the chaotic elections, Emilio Aguinaldo (who was absent, fighting in the field) was elected President over Bonifacio. When Bonifacio was subsequently elected as Director of the Interior, Daniel Tirona insulted him, arguing the post required a lawyer. Feeling gravely insulted, Bonifacio declared the election null and void. This severe political fracture ultimately led to Bonifacio's tragic trial and execution under Aguinaldo’s newly formed government, highlighting the devastating internal conflicts that plagued the early Philippine struggle for independence.
        </p>
      </section>

      <section class="mt-8 border-t border-white/10 pt-8">
        <h3 class="text-xl font-bold text-white mb-6">Mini-Quiz: Test Your Comprehension</h3>
        
        <div class="space-y-6">
          <div class="bg-[#1c1c21] p-5 rounded-lg border border-white/5">
            <p class="text-white font-medium mb-3">1. Why did the Katipunan tear up their cedulas at the Cry of Pugad Lawin?</p>
            <div class="space-y-2">
              <label class="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-slate-300">
                <input type="radio" name="q1" class="w-4 h-4 text-blue-500 bg-black border-slate-600">
                A) To avoid paying taxes to the Americans
              </label>
              <label class="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-slate-300">
                <input type="radio" name="q1" class="w-4 h-4 text-blue-500 bg-black border-slate-600">
                B) As a symbolic act of separation and rebellion against Spain
              </label>
              <label class="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-slate-300">
                <input type="radio" name="q1" class="w-4 h-4 text-blue-500 bg-black border-slate-600">
                C) Because the cedulas were printed incorrectly
              </label>
            </div>
          </div>

          <div class="bg-[#1c1c21] p-5 rounded-lg border border-white/5">
            <p class="text-white font-medium mb-3">2. Who among the following is known as the "Brains of the Revolution" and served as Chief Adviser to Aguinaldo?</p>
            <div class="space-y-2">
              <label class="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-slate-300">
                <input type="radio" name="q2" class="w-4 h-4 text-blue-500 bg-black border-slate-600">
                A) Jose Rizal
              </label>
              <label class="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-slate-300">
                <input type="radio" name="q2" class="w-4 h-4 text-blue-500 bg-black border-slate-600">
                B) Andres Bonifacio
              </label>
              <label class="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-slate-300">
                <input type="radio" name="q2" class="w-4 h-4 text-blue-500 bg-black border-slate-600">
                C) Apolinario Mabini
              </label>
            </div>
          </div>

          <div class="bg-[#1c1c21] p-5 rounded-lg border border-white/5">
            <p class="text-white font-medium mb-3">3. What was the main cause of the dispute at the Tejeros Convention?</p>
            <div class="space-y-2">
              <label class="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-slate-300">
                <input type="radio" name="q3" class="w-4 h-4 text-blue-500 bg-black border-slate-600">
                A) A disagreement over the design of the Philippine flag
              </label>
              <label class="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-slate-300">
                <input type="radio" name="q3" class="w-4 h-4 text-blue-500 bg-black border-slate-600">
                B) The insult directed at Bonifacio regarding his qualifications for Director of the Interior
              </label>
              <label class="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-slate-300">
                <input type="radio" name="q3" class="w-4 h-4 text-blue-500 bg-black border-slate-600">
                C) The decision on where to execute Dr. Jose Rizal
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  'Martial Law Era': '<p class="text-slate-300 mb-6 leading-relaxed">A dark chapter from 1972-1981 under Pres. Marcos characterized by military control, human rights abuses, and ending with the 1986 EDSA Revolution.</p>',

  // Senior High
  'Philippine Politics': '<p class="text-slate-300 mb-6 leading-relaxed">Analyzes the 1987 Constitution, the exact process of how a bill becomes a law, and electoral reforms.</p>',
  'Culture, Society, & Politics': '<p class="text-slate-300 mb-6 leading-relaxed">A fusion of Anthropology and Sociology to understand how human behavior is shaped by societal norms and political institutions.</p>',
  'World Religions': '<p class="text-slate-300 mb-6 leading-relaxed">Objectively studies the basic tenets of Buddhism, Christianity, Hinduism, Islam, and Judaism to foster global tolerance.</p>',
  'Trends & Critical Thinking': '<p class="text-slate-300 mb-6 leading-relaxed">Trains students to spot global mega-trends (like AI), dissect fake news on social media, and map climate solutions.</p>',
  'Social Sciences': '<p class="text-slate-300 mb-6 leading-relaxed">A psychological and sociological sweep defining how the human brain and large civilizations evolve together.</p>'
};
