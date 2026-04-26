const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Reduce vertical padding/margins and gaps for large screens
content = content.replace(/xl:py-4/g, 'xl:py-2');
content = content.replace(/xl:mb-4/g, 'xl:mb-2');
content = content.replace(/xl:mb-2/g, 'xl:mb-1');
content = content.replace(/xl:gap-4/g, 'xl:gap-2');
content = content.replace(/xl:gap-3/g, 'xl:gap-2');
content = content.replace(/xl:gap-2/g, 'xl:gap-1');

// Make dashboard view scaled on desktop to ensure it perfectly fits
content = content.replace('/* DASHBOARD VIEW (Home) */', '/* DASHBOARD VIEW (Home) */\n          <div className="hidden xl:block absolute inset-0 z-[-1] pointer-events-none scale-[0.95] origin-top"></div>');
content = content.replace('className="relative mb-10 xl:mb-2 w-full animate-fade-in-up', 'className="relative mb-10 xl:mb-0 w-full animate-fade-in-up xl:scale-[0.85] 2xl:scale-100 origin-top xl:-mt-2'); 

// Decrease font size slightly on desktop if needed
content = content.replace(/text-lg lg:text-base/g, 'text-lg lg:text-sm');
content = content.replace(/text-3xl font-black text-slate-100/g, 'text-2xl xl:text-3xl font-black text-slate-100');

// Reduce card paddings for xl
content = content.replace(/p-6 xl:p-4/g, 'p-6 xl:p-3');

// Adjust hero section height
content = content.replace(/xl:h-32/g, 'xl:h-28');
content = content.replace(/lg:h-36/g, 'lg:h-28');
// Goals list text sizing
content = content.replace(/text-xs font-bold text-slate-300/g, 'text-xs xl:text-[10px] font-bold text-slate-300');

fs.writeFileSync('src/App.tsx', content);
console.log("Compacted successfully for screenshot!");
