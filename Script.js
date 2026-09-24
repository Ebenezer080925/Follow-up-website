// Replace this with your exact n8n webhook URL. 
// Note: Use /webhook-test/... for testing and /webhook/... for live production.
const WEBHOOK_URL = "https://ebenstones.app.n8n.cloud/webhook/31cfd964-3c92-4b8a-92e1-47fa5afa2fd2";

const landing = document.getElementById('landing');
const formScreen = document.getElementById('formScreen');
const successScreen = document.getElementById('successScreen');

function showScreen(el){
  [landing, formScreen, successScreen].forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  window.scrollTo(0,0);
}

document.getElementById('goToForm').addEventListener('click', () => showScreen(formScreen));
document.getElementById('backToLanding').addEventListener('click', () => showScreen(landing));
document.getElementById('registerAnother').addEventListener('click', () => {
  document.getElementById('regForm').reset();
  document.getElementById('avatarPreview').innerHTML = '＋';
  document.getElementById('fileName').textContent = 'No file chosen';
  showScreen(formScreen);
});

// Profile picture preview handling
const fileInput = document.getElementById('profilePicture');
const fileTrigger = document.getElementById('fileTrigger');
const avatarPreview = document.getElementById('avatarPreview');
const fileNameEl = document.getElementById('fileName');

fileTrigger.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if(!file) return;
  fileNameEl.textContent = file.name;
  const reader = new FileReader();
  reader.onload = e => {
    avatarPreview.innerHTML = `<img src="${e.target.result}" alt="Profile preview">`;
  };
  reader.readAsDataURL(file);
});

// Form submission handler
const form = document.getElementById('regForm');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('statusMsg');

function setStatus(kind, text){
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg show ' + kind;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusMsg.className = 'status-msg';

  if(!fileInput.files[0]){
    setStatus('err', 'Please choose a profile picture.');
    return;
  }

  // Automatically packages all named HTML inputs (text + files)
  const formData = new FormData(form);

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  try{
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData // The browser automatically handles the multipart/form-data boundary
    });

    if(!res.ok) throw new Error('Server responded with ' + res.status);

    showScreen(successScreen);
  }catch(err){
    setStatus('err', "Couldn't submit right now. Check your connection and try again.");
    console.error(err);
  }finally{
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit registration';
  }
});