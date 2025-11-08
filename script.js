
// Elements
const scorecardsSection = document.getElementById('scorecards');
const sections = Array.from(document.querySelectorAll('.section-content'));
const scorecards = Array.from(document.querySelectorAll('.scorecard'));
const backButtons = Array.from(document.querySelectorAll('[data-action="back"]'));

// Helper: hide all sections
function hideAllSections(){
  sections.forEach(sec => {
    sec.classList.add('d-none');
    sec.setAttribute('hidden','');
  });
}

// Show scorecards / hide content
function showScorecards(){
  hideAllSections();
  scorecardsSection.classList.remove('d-none');
  scorecardsSection.removeAttribute('hidden');
  history.replaceState(null, '', '#'); // clear hash
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Show a single section (no scrolling to scorecards)
function showSection(id, viaHash=false){
  const target = document.getElementById(id);
  if(!target) return;

  // Hide the scorecards and other sections
  scorecardsSection.classList.add('d-none');
  scorecardsSection.setAttribute('hidden','');
  hideAllSections();

  // Reveal the chosen section
  target.classList.remove('d-none');
  target.removeAttribute('hidden');

  // Update URL hash for shareability
  if (!viaHash && location.hash !== `#${id}`) {
    history.replaceState(null, '', `#${id}`);
  }

  // Do not auto-scroll; keep natural position
}

// Scorecard clicks
scorecards.forEach(btn => {
  btn.addEventListener('click', () => {
    showSection(btn.dataset.target);
  });
});

// Back buttons
backButtons.forEach(btn => {
  btn.addEventListener('click', showScorecards);
});

// Deep-link support (#message, etc.)
function initFromHash(){
  const hash = location.hash.replace('#','');
  if(hash){
    showSection(hash, true);
  }else{
    showScorecards();
  }
}
initFromHash();

// Handle hash change via back/forward
window.addEventListener('hashchange', initFromHash);

// Polaroid -> Modal enlarge
const photoModal = document.getElementById('photoModal');
if (photoModal) {
  photoModal.addEventListener('show.bs.modal', event => {
    const trigger = event.relatedTarget;
    const src = trigger?.getAttribute('data-photo-src');
    const note = trigger?.getAttribute('data-photo-note') || '';
    document.getElementById('modalPhoto').setAttribute('src', src);
    document.getElementById('modalNote').textContent = note;
  });
}

// Checklist persistence (localStorage)
const STORAGE_KEY = 'monthsary-checklist-v1';
const list = document.getElementById('todoList');
const saveBtn = document.getElementById('saveChecks');
const clearBtn = document.getElementById('clearChecks');

function loadChecks(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    list?.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
      const id = cb.getAttribute('data-id');
      cb.checked = Boolean(saved[id]);
    });
  }catch(e){ /* ignore */ }
}
function saveChecks(){
  const data = {};
  list?.querySelectorAll('input[type="checkbox"]').forEach(cb=>{
    const id = cb.getAttribute('data-id');
    data[id] = cb.checked ? 1 : 0;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function clearChecks(){
  list?.querySelectorAll('input[type="checkbox"]').forEach(cb=> cb.checked = false);
  saveChecks();
}
if(list){
  loadChecks();
  saveBtn?.addEventListener('click', saveChecks);
  clearBtn?.addEventListener('click', clearChecks);
}
