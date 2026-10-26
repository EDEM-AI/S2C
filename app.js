'use strict';
const $ = (s) => document.querySelector(s);
let demos = [], selectedGroup = 'ood';
const notes = {
  ood: 'Changed tablecloths, strong illumination and colored-light perturbations.',
  id: 'Ordinary black-cloth setup, including insertion and additional removal demonstrations.',
  all: 'All 18 full recordings, grouped by visual setting. Select a task to narrow the view.'
};
const dialog = $('#video-dialog');
let lastTrigger;
function openVideo(d, trigger) {
  lastTrigger = trigger;
  $('#overview').pause();
  $('#dialog-title').textContent = d.title;
  $('#dialog-condition').textContent = `${d.group.toUpperCase()} / ${d.condition}`;
  const video = $('#dialog-video');
  video.src = `assets/videos/${d.id}.mp4`;
  video.poster = `assets/posters/${d.id}.webp`;
  $('#download-video').href = video.src;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  video.play().catch(() => {});
}
function renderDemos() {
  const task = $('#task-filter').value;
  const filtered = demos.filter(d => (selectedGroup === 'all' || d.group === selectedGroup) && (task === 'all' || d.task === task));
  const grid = $('#demo-grid');
  grid.replaceChildren();
  for (const d of filtered) {
    const article = document.createElement('article'); article.className = 'demo-card';
    const button = document.createElement('button'); button.type = 'button'; button.className = `demo-trigger${d.portrait ? ' portrait' : ''}`;
    button.setAttribute('aria-label', `Play ${d.title}: ${d.condition}`);
    const img = document.createElement('img'); img.src = `assets/posters/${d.id}.webp`; img.alt = d.title; img.loading = 'lazy'; img.width = 480; img.height = d.portrait ? 848 : 270;
    const play = document.createElement('span'); play.className = 'play-icon'; play.textContent = '▶'; play.setAttribute('aria-hidden', 'true');
    const duration = document.createElement('span'); duration.className = 'video-duration'; duration.textContent = `${Math.floor(d.duration / 60)}:${String(d.duration % 60).padStart(2,'0')}`;
    const tag = document.createElement('span'); tag.className = 'video-index'; tag.textContent = d.group.toUpperCase();
    button.append(img, play, duration, tag); button.addEventListener('click', () => openVideo(d, button));
    const title = document.createElement('h3'); title.textContent = d.title;
    const caption = document.createElement('p'); caption.textContent = d.condition;
    article.append(button,title,caption); grid.append(article);
  }
  $('#empty-state').hidden = filtered.length > 0;
  $('#distribution-note').textContent = `${notes[selectedGroup]} ${filtered.length} recording${filtered.length === 1 ? '' : 's'} shown.`;
  document.querySelectorAll('[data-group]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.group === selectedGroup)));
}
document.querySelectorAll('[data-group]').forEach(button => button.addEventListener('click', () => { selectedGroup = button.dataset.group; renderDemos(); }));
$('#task-filter').addEventListener('change',renderDemos);
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { const v = $('#dialog-video'); v.pause(); v.removeAttribute('src'); v.load(); document.body.style.overflow = ''; lastTrigger?.focus(); });
$('#show-removal').addEventListener('click', () => { selectedGroup = 'id'; $('#task-filter').value = 'all'; renderDemos(); });
// Exact per-task successful-trial counts from the supplied manuscript.
const results = {
 training: {'ACT':[0,1,0,2,0,0],'SERL':[0,0,0,0,0,0],'Octo-small':[0,2,0,5,0,0],'HIL-SERL':[19,20,18,20,16,16],'HIL-ConRFT':[18,20,19,20,16,17],'S2C':[20,20,20,20,17,16]},
 pattern: {'HIL-SERL':[0,0,0,0,0,0],'HIL-ConRFT':[0,0,0,0,0,0],'S2C':[18,15,11,13,14,12]},
 sun: {'HIL-SERL':[0,0,0,0,0,0],'HIL-ConRFT':[0,0,0,0,0,0],'S2C':[20,17,15,20,16,13]},
 color: {'HIL-SERL':[0,0,0,0,0,0],'HIL-ConRFT':[0,0,0,0,0,0],'S2C':[18,18,19,16,12,12]},
 red: {'HIL-SERL':[0,0,0,6,2,3],'HIL-ConRFT':[0,0,0,8,4,4],'S2C':[18,19,17,17,15,13]}
};
function renderResults() {
 const bars = $('#result-bars'), body = $('#result-table tbody'); bars.replaceChildren(); body.replaceChildren();
 for(const [name, counts] of Object.entries(results[$('#condition').value])) {
   const average = counts.reduce((a,b) => a+b,0) / 120 * 100;
   const row = document.createElement('div'); row.className = 'bar-row';
   const label = document.createElement('span'); label.textContent = name;
   const track = document.createElement('div'); track.className = 'bar-track'; track.setAttribute('aria-hidden','true');
   const fill = document.createElement('div'); fill.className = 'bar-fill'; fill.style.width = `${average}%`; track.append(fill);
   const value = document.createElement('span'); value.className = 'bar-value'; value.textContent = `${average.toFixed(2)}%`; row.append(label,track,value); bars.append(row);
   const tr = document.createElement('tr'); const th = document.createElement('th'); th.scope = 'row'; th.textContent = name; tr.append(th);
   [...counts.map(n => `${n}/20`),`${average.toFixed(2)}%`].forEach(text => { const td = document.createElement('td'); td.textContent = text; tr.append(td); }); body.append(tr);
 }
}
$('#condition').addEventListener('change',renderResults); renderResults();
$('#copy-citation').addEventListener('click', async () => {
 try { await navigator.clipboard.writeText($('#bibtex').textContent); $('#copy-status').textContent = 'BibTeX copied.'; }
 catch { const range = document.createRange(); range.selectNodeContents($('#bibtex')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); $('#copy-status').textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.'; }
});
fetch('assets/demos.json').then(r => { if(!r.ok) throw new Error('Unable to load recordings'); return r.json(); }).then(data => { demos = data; renderDemos(); }).catch(() => { $('#distribution-note').textContent = 'The video gallery could not load. Please refresh, or watch the overview film above.'; });
