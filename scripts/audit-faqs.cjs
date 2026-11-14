// Requires Poppler's pdftotext on PATH. Run with --write to align unassigned drafts.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const pdf = 'DigiDr_FAQ_6_Sets_22_Specialities.pdf';
const extracted = cp.execFileSync('pdftotext', ['-layout', path.join(root, pdf), '-'], {encoding:'utf8', maxBuffer:8e6});
const bank = {};
let specialty, set, item, column;
for (let line of extracted.split(/\r?\n/)) {
  line = line.replace(/\f/g, '');
  const heading = line.match(/^\d+\. (.+)$/);
  if (heading) { specialty = heading[1]; bank[specialty] = {}; item = null; continue; }
  const numberedSet = line.match(/^Set ([1-6])$/);
  if (numberedSet) { set = +numberedSet[1]; bank[specialty][set] = []; item = null; continue; }
  if (/No\. +Question +Answer/.test(line)) { column = line.indexOf('Answer'); continue; }
  if (!line.trim() || line.trim() === 'DigiDr' || !specialty) continue;
  const numberedItem = line.match(/^ {0,3}([1-6]) +/);
  if (numberedItem) {
    item = {question:'', answer:''};
    assert.equal(+numberedItem[1], bank[specialty][set].length + 1);
    bank[specialty][set].push(item);
  }
  if (item) {
    const q = line.slice(0,column).replace(/^ {0,3}[1-6] +/, '').trim();
    const a = line.slice(column).trim();
    item.question += (item.question && q ? ' ' : '') + q;
    item.answer += (item.answer && a ? ' ' : '') + a;
  }
}
assert.equal(Object.keys(bank).length,22);
for (const sets of Object.values(bank)) {
  assert.equal(Object.keys(sets).length,6);
  for (const entries of Object.values(sets)) {
    assert.equal(entries.length,6);
    for (const entry of entries) {
      assert.ok(entry.question.endsWith('?'), entry.question);
      assert.ok(entry.answer.length > 30, entry.answer);
    }
  }
}
const mapping = {'General Medicine':'General Medicine / Family Physician','General Physician':'General Medicine / Family Physician',Cardiology:'Cardiology',Orthopedics:'Orthopaedics',Pediatrician:'Paediatrics',ENT:'ENT',Neurology:'Neurology',Gastroenterology:'Gastroenterology',Urologist:'Urology',Oncology:'Oncology',Dentist:'Dentistry',Intensivist:'Critical Care','Plastic Surgery':'Plastic and Cosmetic Surgery'};
const decode = s => s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#(?:39|x27);/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const escape = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const questions = /(<button\b[^>]*class="[^"]*\bfaq-question\b[^"]*"[^>]*>[\s\S]*?<span\b[^>]*>)([\s\S]*?)(<\/span>)/g;
const answers = /(<div\b[^>]*class="faq-answer-inner"[^>]*>\s*<p\b[^>]*>)([\s\S]*?)(<\/p>)/g;
const sectionPattern = /<section\b[^>]*\bid="faq"[^>]*>[\s\S]*?<\/section>/;
const write = process.argv.includes('--write');
const rows = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === 'index.html') audit(file);
  }
}
function audit(file) {
  const relative = path.relative(root,file).replace(/\\/g,'/');
  const category = relative.split('/')[0];
  const matchedSpecialty = mapping[category];
  const html = fs.readFileSync(file,'utf8');
  const section = html.match(sectionPattern)?.[0];
  const row = {file:relative, specialty:matchedSpecialty || category};
  rows.push(row);
  if (!matchedSpecialty) { row.status = ['Ayurvedic','Homeopathy','Radiology','microsite-ayurvedic-new-male-param'].includes(category) ? 'specialty-absent-from-pdf' : 'outside-specialty-drafts'; return; }
  if (!section) {row.status='missing-faq-section';return;}
  const q = [...section.matchAll(questions)].map(m=>decode(m[2]));
  const a = [...section.matchAll(answers)].map(m=>decode(m[2]));
  const sets = bank[matchedSpecialty];
  const exact = Object.entries(sets).find(([,entries])=> entries.length===q.length && entries.every((e,i)=>e.question===q[i] && e.answer===a[i]));
  row.faqCount = q.length;
  row.commentedOut = !html.replace(/<!--[\s\S]*?-->/g,'').match(sectionPattern);
  if (exact) {row.set=+exact[0];row.status='matches-pdf';return;}
  const allEntries = Object.values(sets).flat();
  const existingEntries = q.map(question=>allEntries.find(e=>e.question===question));
  if (q.length===6 && existingEntries.every((e,i)=>e && e.answer===a[i])) {
    row.set='mixed (permitted by PDF)';row.status='matches-pdf';return;
  }
  if (/assigned|work pending|^live microsites\//i.test(relative)) {row.status='excluded-assigned-or-unfinished';return;}
  const setNumber = +(relative.match(/-(\d+)(?:-(?:male|female))?(?:-param)?\/index.html$/)?.[1] || 1);
  if (setNumber>6) {row.status='needs-set-assignment';return;}
  // Prefer an existing question-matched set to preserve deliberate assignments.
  const sameQuestions = Object.entries(sets).find(([,entries])=> entries.length===q.length && entries.every((e,i)=>e.question===q[i]));
  row.set = sameQuestions ? +sameQuestions[0] : setNumber;
  const preserveQuestions = q.length===6 && existingEntries.every(Boolean);
  if (preserveQuestions && !sameQuestions) row.set='mixed (permitted by PDF)';
  row.status='needs-update';
  if (!write) return;
  const entries = preserveQuestions ? existingEntries : sets[row.set];
  assert.equal(q.length,6,relative + ': expected six existing FAQ items');
  assert.equal(a.length,6,relative + ': expected six existing answers');
  let qi=0,ai=0;
  const replacement = section.replace(questions,(_,before,text,after)=>before+escape(entries[qi++].question)+after)
    .replace(answers,(_,before,text,after)=>before+escape(entries[ai++].answer)+after);
  fs.writeFileSync(file,html.replace(section,replacement));
  row.status='updated';
}
walk(root);
const report = {source:pdf, extractedSpecialties:22, extractedSets:132, extractedFaqs:792, policy:'Preserve matching sets; otherwise use draft number 1–6. Do not change assigned/live/unfinished sites or specialties absent from the PDF.', rows};
fs.writeFileSync(path.join(root,'faq-audit.json'), JSON.stringify(report,null,2)+'\n');
const counts = {};
for (const row of rows) counts[row.status] = (counts[row.status]||0)+1;
console.log(JSON.stringify(counts,null,2));
for (const row of rows.filter(r=>['needs-update','missing-faq-section'].includes(r.status))) console.log(JSON.stringify(row));
