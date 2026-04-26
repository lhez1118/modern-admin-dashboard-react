const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
`/* DASHBOARD VIEW (Home) */
          <div className="hidden xl:block absolute inset-0 z-[-1] pointer-events-none scale-[0.95] origin-top"></div>
          <div className="relative mb-10 xl:mb-0 w-full animate-fade-in-up xl:scale-[0.85] 2xl:scale-100 origin-top xl:-mt-2">`,
`/* DASHBOARD VIEW (Home) */
          <div className="relative mb-10 xl:mb-0 w-full animate-fade-in-up xl:scale-[0.85] 2xl:scale-[0.9] overflow-y-visible origin-top">`
);
fs.writeFileSync('src/App.tsx', content);
