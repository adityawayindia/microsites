// One guarded GA4 + Clarity dispatch per user action. Never send form or chat contents.
(function(){
  window.trackEvent=function(eventName,params={}){
    const safe={page_path:location.pathname};
    for(const key of ['label','checked','method','scrolled_to_bottom','appointment_type'])if(params[key]!==undefined)safe[key]=params[key];
    if(typeof window.gtag==='function')window.gtag('event',eventName,safe);
    if(typeof window.clarity==='function')window.clarity('event',eventName);
  };
  document.addEventListener('click',event=>{
    const el=event.target instanceof Element?event.target.closest('[data-ga-event]'):null;
    if(!el||el.disabled||el.closest('[aria-disabled="true"]'))return;
    window.trackEvent(el.dataset.gaEvent,{label:el.dataset.gaLabel||el.getAttribute('aria-label')||el.textContent.trim().slice(0,60)});
  });
})();
