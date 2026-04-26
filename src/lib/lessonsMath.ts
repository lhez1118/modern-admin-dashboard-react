export const LESSON_MATH: Record<string, string> = {
  'Counting 1 to 100': `
    <p class="text-slate-300 mb-6 leading-relaxed">Counting from 1 to 100 is the first step in learning numbers. Every time you reach a number ending in 9 (like 19, 29), the next number starts a new 'tens' place (20, 30).</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Let's practice counting by 10s:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> 10, 20, 30, 40, 50, 60, 70, 80, 90, 100!</li>
      </ul>
    </div>
  `,
  'Basic Addition': `
    <p class="text-slate-300 mb-6 leading-relaxed">Addition is finding the total. When you add two numbers together, you are combining them. The symbol for addition is <strong class="text-blue-400">+</strong>.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Examples:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> 1 apple + 1 apple = 2 apples</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> 2 dogs + 3 cats = 5 animals in total</li>
      </ul>
    </div>
  `,
  'Basic Subtraction': `
    <p class="text-slate-300 mb-6 leading-relaxed">Subtraction means taking something away. The symbol is <strong class="text-blue-400">-</strong>. If you start with 5 books and give 2 away, you subtract 2 from 5 to get 3.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Examples:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> 5 cookies - 2 eaten cookies = 3 cookies left</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> 10 blocks - 5 blocks = 5 blocks</li>
      </ul>
    </div>
  `,
  'Shapes and Patterns': `
    <p class="text-slate-300 mb-6 leading-relaxed">There are many basic shapes like circles, squares, triangles, and rectangles. A pattern is when these shapes or colors repeat in a predictable way.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Common Shapes:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Circle:</strong> Round and has no corners.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Square:</strong> Has 4 equal sides and 4 corners.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Triangle:</strong> Has 3 sides and 3 corners.</li>
      </ul>
    </div>
  `,
  'Telling Time': `
    <p class="text-slate-300 mb-6 leading-relaxed">A clock helps us measure time. An analog clock has two main hands: the short hour hand and the long minute hand.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">How it works:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> When the long hand points to 12, it is "o'clock". If the short hand points to 3, it is 3:00.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> There are 60 minutes in an hour, and 24 hours in a day.</li>
      </ul>
    </div>
  `,
  'Addition & Subtraction (Advanced)': `
    <p class="text-slate-300 mb-6 leading-relaxed">Advanced addition involves carrying over to the next place value (tens, hundreds). Advanced subtraction involves borrowing from the next place value.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Step-by-step Addition (25 + 18):</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> 1. Add the ones: 5 + 8 = 13. Write down 3, carry over 1.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> 2. Add the tens: 2 + 1 + (the 1 carried over) = 4.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Final answer: 43.</li>
      </ul>
    </div>
  `,
  'Multiplication Basics': `
    <p class="text-slate-300 mb-6 leading-relaxed">Multiplication is repeated addition. Instead of adding a number many times, we multiply it. The symbol is <strong class="text-blue-400">x</strong> or <strong class="text-blue-400">*</strong>.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Example: 4 x 3</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> This means 4 groups of 3, or 4 + 4 + 4.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> The answer is 12! Memorizing times tables speeds this up.</li>
      </ul>
    </div>
  `,
  'Division Basics': `
    <p class="text-slate-300 mb-6 leading-relaxed">Division is splitting a large group into smaller, equal parts. It is the exact opposite of multiplication. The symbol is <strong class="text-blue-400">÷</strong>.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Example: 12 ÷ 3</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> If you have 12 slices of pizza and share them evenly among 3 friends, how many slices does each person get?</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> The answer is 4. (Because 4 x 3 = 12).</li>
      </ul>
    </div>
  `,
  'Fractions & Decimals': `
    <p class="text-slate-300 mb-6 leading-relaxed">A fraction represents a part of a whole (like 1/2). A decimal represents fractions using a base-10 standard (like 0.5).</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Key Parts:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Numerator:</strong> The top number of a fraction (how many parts we have).</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Denominator:</strong> The bottom number (how many total parts make a whole).</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Conversion:</strong> 1/4 is the same as dividing 1 by 4, giving the decimal 0.25.</li>
      </ul>
    </div>
  `,
  'Basic Geometry': `
    <p class="text-slate-300 mb-6 leading-relaxed">Geometry is the branch of math that deals with shapes, sizes, relative positions of figures, and the properties of space.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Important Concepts:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Perimeter:</strong> The continuous line forming the boundary of a closed geometric figure (distance around).</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Area:</strong> The extent or measurement of a surface (space inside).</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Line vs Ray:</strong> A line goes on forever in both directions, a ray starts at a point and goes outward forever.</li>
      </ul>
    </div>
  `,
  'Pre-Algebra & Algebra 1': `
    <p class="text-slate-300 mb-6 leading-relaxed">Algebra introduces variables: letters like <strong class="text-blue-400">x</strong> or <strong class="text-blue-400">y</strong> that stand in for unknown numbers. Our goal is to "solve for x".</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Golden Rules of Equations:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Whatever operation you do to one side of the equals sign (=), you must do to the other side to keep it balanced.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Example: If x + 5 = 12, subtract 5 from both sides to find that x = 7.</li>
      </ul>
    </div>
  `,
  'Geometry & Theorems': `
    <p class="text-slate-300 mb-6 leading-relaxed">Theorems are mathematical statements that have been proven on the basis of previously established statements, like other theorems, and generally accepted statements, like axioms.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">The Pythagorean Theorem:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Only applies to right-angled triangles.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Formula: <strong class="text-blue-400">a² + b² = c²</strong> (where c is the hypotenuse, the longest side).</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Sum of internal angles in ANY triangle will always equal exactly 180 degrees.</li>
      </ul>
    </div>
  `,
  'Statistics & Probability': `
    <p class="text-slate-300 mb-6 leading-relaxed">Statistics deals with collecting, analyzing, and interpreting data. Probability calculates the mathematical likelihood that a specific event will occur.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Core Statistical Measures:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Mean:</strong> The average of all numbers.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Median:</strong> The exact middle number when data is sorted in order.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Mode:</strong> The number that appears most frequently in a dataset.</li>
      </ul>
    </div>
  `,
  'Linear Equations': `
    <p class="text-slate-300 mb-6 leading-relaxed">A linear equation forms a perfectly straight line when mapped on a Cartesian graph. The fundamental formula is the slope-intercept form.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Equation: y = mx + b</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong class="text-blue-400">y</strong> and <strong class="text-blue-400">x</strong> are coordinates on the graph.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong class="text-blue-400">m</strong> refers to the slope (rise over run) - how steep the line is.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong class="text-blue-400">b</strong> is the y-intercept (where the line crosses the y-axis).</li>
      </ul>
    </div>
  `,
  'Trigonometry Basics': `
    <p class="text-slate-300 mb-6 leading-relaxed">Trigonometry is a branch of mathematics that studies relationships between side lengths and angles of triangles. SOH CAH TOA is the most famous mnemonic to remember ratios.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">SOH CAH TOA Breakdown:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Sine (SOH):</strong> Opposite / Hypotenuse</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Cosine (CAH):</strong> Adjacent / Hypotenuse</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Tangent (TOA):</strong> Opposite / Adjacent</li>
      </ul>
    </div>
  `,
  'Advanced Algebra': `
    <p class="text-slate-300 mb-6 leading-relaxed">Advanced Algebra moves beyond simple linear equations and dives into polynomials, quadratic equations, imaginary numbers, logarithms, and exponential functions.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">The Quadratic Formula:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Used to find the roots (x-intercepts) of a parabola where ax² + bx + c = 0.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> Formula: x = [ -b ± √(b² - 4ac) ] / 2a</li>
      </ul>
    </div>
  `,
  'Pre-Calculus': `
    <p class="text-slate-300 mb-6 leading-relaxed">Pre-Calculus acts as a bridge between high school algebra and university-level calculus. It relies heavily on limits, sequences, series, and advanced graphing of complex functions.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Key Areas of Study:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Limits:</strong> Trying to figure out what y-value a function is approaching as x gets closer to a specific number.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Vectors and Matrices:</strong> Storing and manipulating multi-dimensional data models.</li>
      </ul>
    </div>
  `,
  'Basic Calculus': `
    <p class="text-slate-300 mb-6 leading-relaxed">Calculus is the mathematics of change. While algebra gives us formulas for lines, calculus gives us formulas for curves that are constantly curving.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">The Two Branches:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Differential Calculus:</strong> Focuses on the "Derivative" — finding the exact rate of change or the slope of a curve at a single, infinitely small point.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Integral Calculus:</strong> Focuses on the "Integral" — accumulating quantities, often used to figure out the exact area underneath a curved, bumpy line.</li>
      </ul>
    </div>
  `,
  'Business Mathematics': `
    <p class="text-slate-300 mb-6 leading-relaxed">Business math applies algebraic and statistical concepts directly to commerce. It involves calculating cash flows, determining profit margins, and balancing accounting spreadsheets.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Core Financial Calculations:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Simple Interest:</strong> I = PRT (Interest = Principal x Rate x Time). Used for basic loans.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Compound Interest:</strong> Interest calculated on the initial principal AND the accumulated interest of previous periods. ("Interest on interest").</li>
      </ul>
    </div>
  `,
  'General Mathematics': `
    <p class="text-slate-300 mb-6 leading-relaxed">General Mathematics bridges practical, everyday problem solving with theoretical functions. It encompasses a wide net of logic, rational functions, standard logic propositions, and basic personal finance.</p>
    <div class="bg-[#1c1c21] p-6 rounded-xl border border-white/5 mb-6 text-slate-300">
      <strong class="text-blue-400 block mb-2">Focus Areas:</strong>
      <ul class="space-y-3 mb-0 list-none pl-0">
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Functions:</strong> Understanding how input values map to specific output values, ensuring every input has exactly one output.</li>
        <li class="flex items-start gap-3"><span class="text-blue-500">✓</span> <strong>Logic & Propositions:</strong> Determining truth values of connected statements using AND/OR rules and truth tables.</li>
      </ul>
    </div>
  `
};
