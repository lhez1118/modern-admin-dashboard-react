const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/bg-slate-800/g, 'bg-white');
content = content.replace(/text-slate-100/g, 'text-slate-800');
content = content.replace(/text-slate-200/g, 'text-slate-700');
content = content.replace(/text-slate-300/g, 'text-slate-600');
content = content.replace(/text-slate-400/g, 'text-slate-500');
content = content.replace(/bg-slate-700/g, 'bg-slate-50');
content = content.replace(/border-slate-700/g, 'border-slate-100');
content = content.replace(/border-slate-600/g, 'border-slate-200');
content = content.replace(/bg-slate-900/g, "bg-[url('/bg.png?v=2')]");
content = content.replace(/from-slate-800/g, 'from-[#f8fafc]');
content = content.replace(/to-slate-900/g, 'to-[#eff6ff]');
content = content.replace(/bg-blue-900\/50/g, 'bg-blue-50');
content = content.replace(/bg-blue-900\/70/g, 'bg-blue-100');
content = content.replace(/border-blue-800/g, 'border-blue-100');
content = content.replace(/border-indigo-800/g, 'border-indigo-100');
content = content.replace(/bg-indigo-900\/50/g, 'bg-indigo-50');
content = content.replace(/bg-purple-900\/50/g, 'bg-purple-50');
content = content.replace(/bg-emerald-900\/50/g, 'bg-emerald-50');
content = content.replace(/bg-amber-900\/50/g, 'bg-amber-50');
content = content.replace(/bg-red-900\/50/g, 'bg-red-50');
content = content.replace(/bg-pink-900\/50/g, 'bg-pink-50');
content = content.replace(/bg-rose-900\/50/g, 'bg-rose-50');
content = content.replace(/text-gray-100/g, 'text-gray-800');
content = content.replace(/text-blue-400/g, 'text-[#3b82f6]');

fs.writeFileSync('src/App.tsx', content);
console.log("Reverted generally successfully!");
