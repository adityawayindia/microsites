/* Informational practice assistant. Local scripted answers; no AI or patient-message service is connected. */
(function(){
  const icon='assets/chatbot-icon.svg',doctor=document.querySelector('.brand-name')?.textContent.trim()||'the doctor';
  const wrap=document.createElement('div');wrap.className='chatbot-fab-wrap';wrap.id='chatbotFabWrap';
  wrap.innerHTML=`<div class="chatbot-backdrop" id="chatbotBackdrop"></div>
<div class="chatbot-window" id="chatbotWindow" role="dialog" aria-modal="true" aria-label="Practice information assistant" hidden data-clarity-mask="true">
<div class="chatbot-header"><div class="chatbot-header-avatar"><img src="${icon}" width="44" height="44" alt=""/></div><div class="chatbot-header-info"><p class="chatbot-header-name">Practice Assistant</p></div><button type="button" class="chatbot-header-close" id="chatbotCloseBtn" aria-label="Close chat"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>
<div class="chatbot-suggestions-wrap" id="chatbotSuggestionsWrap"><div class="chatbot-suggestions" id="chatbotSuggestions" aria-label="Suggested questions"><button type="button" class="chatbot-suggestion-chip">Book a visit</button><button type="button" class="chatbot-suggestion-chip">What to bring</button><button type="button" class="chatbot-suggestion-chip">Clinic details</button><button type="button" class="chatbot-suggestion-chip">Online visits</button></div></div>
<div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite" aria-label="Chat messages"></div>
<div class="chatbot-input-area"><div class="chatbot-input-wrap"><textarea class="chatbot-input" id="chatbotInput" placeholder="Ask about the practice…" rows="1" maxlength="2000" aria-label="Type your message"></textarea></div><button type="button" class="chatbot-send-btn" id="chatbotSendBtn" aria-label="Send message" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
<div class="chatbot-footer">Informational only, not medical advice.<br>Consult your doctor.</div></div>
<button type="button" class="chatbot-fab" id="chatbotFab" aria-label="Open practice assistant" aria-expanded="false" aria-controls="chatbotWindow"><img src="${icon}" width="32" height="32" alt=""/><span class="chatbot-fab-text">Ask Doctor</span></button>`;
  document.body.append(wrap);
  const $=id=>document.getElementById(id),panel=$('chatbotWindow'),fab=$('chatbotFab'),input=$('chatbotInput'),messages=$('chatbotMessages'),send=$('chatbotSendBtn');
  let opened=false;
  function add(text,who){
    const row=document.createElement('div');row.className='chatbot-msg '+who;
    const body=document.createElement('div');body.className='chatbot-msg-bubble';body.textContent=text;row.append(body);messages.append(row);
    requestAnimationFrame(()=>messages.scrollTop=messages.scrollHeight);
  }
  function close(){panel.hidden=true;wrap.classList.remove('is-open','is-kb-open');fab.setAttribute('aria-expanded','false');window.DigiDrDialogs?.activate(null);fab.focus({preventScroll:true});}
  function open(){
    panel.hidden=false;wrap.classList.add('is-open');fab.setAttribute('aria-expanded','true');
    if(!opened){opened=true;add(`Hello. I share general practice information for ${doctor}. Choose a question below or type a message. This is not a live chat with the doctor.`,'bot');}
    window.DigiDrDialogs?.activate(wrap,$('chatbotCloseBtn'));window.trackEvent?.('chatbot_open_click');syncViewport();
  }
  function reply(text){
    const t=text.toLowerCase();
    if(/book|appointment/.test(t))return 'Use the Book Appointment button on this page to request a clinic or online visit. Availability comes from the clinic. If booking is unavailable, please contact the clinic directly.';
    if(/bring|prepare|report/.test(t))return 'Bring your recent reports, prescriptions and a list of current medicines. For a child, a parent or lawful guardian should attend. The doctor will explain what else is needed.';
    if(/clinic|address|contact/.test(t))return document.querySelector('#contact-us .contact-item p')?.textContent.replace(/\s+/g,' ').trim()||'Please see the Contact section for clinic details.';
    if(/online|video/.test(t))return 'Select Online Consultation in the appointment form to check availability. Online visits are not for emergencies. The doctor may recommend a clinic visit when an examination is needed.';
    return 'I can help with practice information and appointment preparation, but cannot assess symptoms, recommend remedies or make treatment decisions. Please book a consultation or consult your doctor.';
  }
  function submit(text){text=text.trim().slice(0,2000);if(!text)return;add(text,'user');input.value='';input.style.height='';send.disabled=true;add(reply(text),'bot');window.trackEvent?.('chatbot_send_click');}
  fab.addEventListener('click',()=>panel.hidden?open():close());$('chatbotCloseBtn').addEventListener('click',close);$('chatbotBackdrop').addEventListener('click',close);
  send.addEventListener('click',()=>submit(input.value));
  input.addEventListener('input',()=>{send.disabled=!input.value.trim();input.style.height='auto';input.style.height=Math.min(input.scrollHeight,100)+'px';});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();submit(input.value);}});
  $('chatbotSuggestions').addEventListener('click',e=>{const chip=e.target.closest('button');if(chip)submit(chip.textContent);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();close();}});
  function syncViewport(){
    if(panel.hidden)return;const vv=window.visualViewport;if(!vv)return;
    const offset=Math.max(0,window.innerHeight-vv.height-vv.offsetTop),keyboard=offset>100&&window.innerWidth<=768;
    wrap.classList.toggle('is-kb-open',keyboard);wrap.style.setProperty('--chatbot-vvh',vv.height+'px');wrap.style.setProperty('--chatbot-kb-offset',offset+'px');
  }
  window.visualViewport?.addEventListener('resize',syncViewport);window.visualViewport?.addEventListener('scroll',syncViewport);
  window.addEventListener('resize',syncViewport);
})();
