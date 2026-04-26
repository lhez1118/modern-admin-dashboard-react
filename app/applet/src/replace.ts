import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/bg-white/g, 'bg-slate-800');
content = content.replace(/text-slate-800/g, 'text-slate-100');
content = content.replace(/text-slate-700/g, 'text-slate-200');
content = content.replace(/text-slate-600/g, 'text-slate-300');
content = content.replace(/text-slate-500/g, 'text-slate-400');
content = content.replace(/bg-slate-50/g, 'bg-slate-700');
content = content.replace(/bg-slate-100/g, 'bg-slate-800');
content = content.replace(/border-slate-100/g, 'border-slate-700');
content = content.replace(/border-slate-200/g, 'border-slate-600');
content = content.replace(/border-gray-100/g, 'border-slate-700');
content = content.replace(/bg-\[url\('\/bg.png\?v=2'\)\]/g, 'bg-slate-900');
content = content.replace(/bg-\[url\('\/bg1.png'\)\]/g, 'bg-slate-800');
content = content.replace(/from-\[#f8fafc\]/g, 'from-slate-800');
content = content.replace(/to-\[#eff6ff\]/g, 'to-slate-900');
content = content.replace(/bg-blue-50/g, 'bg-blue-900\/50');
content = content.replace(/bg-blue-100/g, 'bg-blue-900\/70');
content = content.replace(/border-blue-100/g, 'border-blue-800');
content = content.replace(/border-indigo-100/g, 'border-indigo-800');
content = content.replace(/bg-indigo-50/g, 'bg-indigo-900\/50');
content = content.replace(/bg-purple-50/g, 'bg-purple-900\/50');
content = content.replace(/bg-emerald-50/g, 'bg-emerald-900\/50');
content = content.replace(/bg-amber-50/g, 'bg-amber-900\/50');
content = content.replace(/bg-red-50/g, 'bg-red-900\/50');
content = content.replace(/bg-pink-50/g, 'bg-pink-900\/50');
content = content.replace(/bg-rose-50/g, 'bg-rose-900\/50');
content = content.replace(/text-gray-800/g, 'text-gray-100');
content = content.replace(/bg-\[#f8fafc\]/g, 'bg-slate-800');
content = content.replace(/bg-\[#eff6ff\]/g, 'bg-slate-900');
content = content.replace(/text-black/g, 'text-white');
content = content.replace(/text-slate-900/g, 'text-slate-100');

fs.writeFileSync('src/App.tsx', content);
