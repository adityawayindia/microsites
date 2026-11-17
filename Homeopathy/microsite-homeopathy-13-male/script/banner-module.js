/* DigiDr banner API: all entry points apply active state, schedule and safe URLs. */
(function (window, document) {
  'use strict';
  const safeURL = (value, asset=false) => {
    if (!value || value === '#') return '';
    try {
      const u=new URL(value,document.baseURI);
      if(!['https:','http:'].includes(u.protocol))return '';
      if(location.protocol==='https:'&&u.protocol!=='https:')return '';
      if(asset&&value.startsWith('data:'))return '';
      return value;
    } catch{return '';}
  };
  let pending=0;
  const api = {
    enabled:true,
    schedule:{enabled:true,startDate:'',endDate:''},
    getElement(){return document.querySelector('#digidrBannerModule, .digidr-banner-module');},
    isWithinSchedule(){
      if(!this.schedule.enabled)return true;
      const start=this.schedule.startDate?Date.parse(this.schedule.startDate):-Infinity;
      const end=this.schedule.endDate?Date.parse(this.schedule.endDate):Infinity;
      if(Number.isNaN(start)||Number.isNaN(end)||start>end)return false;
      return Date.now()>=start&&Date.now()<=end;
    },
    setSchedule(config={}){
      const el=this.getElement();
      if('enabled'in config)this.schedule.enabled=!!config.enabled;
      for(const [key,attribute]of [['startDate','data-banner-start'],['endDate','data-banner-end']]){
        if(key in config){this.schedule[key]=config[key]?String(config[key]):'';el?.setAttribute(attribute,this.schedule[key]);}
      }
      this.init();
    },
    setBanner(config={}){
      const el=this.getElement();if(!el)return;
      for(const [key,attribute]of [['src','data-banner-src'],['srcMobile','data-banner-src-mobile'],['alt','data-banner-alt'],['href','data-banner-href']]){
        if(key in config)el.setAttribute(attribute,String(config[key]??''));
      }
      if('active'in config)el.dataset.bannerActive=String(config.active===true);
      this.init();
    },
    show(){this.setBanner({active:true});},
    hide(){this.setBanner({active:false});},
    async loadFromEndpoint(url){
      const sequence=++pending;if(!safeURL(url))return false;
      const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),7000);
      try{
        const response=await fetch(url,{credentials:'omit',signal:abort.signal});
        if(!response.ok)throw new Error('Banner unavailable');
        const data=await response.json();if(sequence!==pending||!data||typeof data!=='object')return false;
        const dates={};if('startDate'in data||'start_date'in data)dates.startDate=data.startDate??data.start_date;
        if('endDate'in data||'end_date'in data)dates.endDate=data.endDate??data.end_date;
        this.setSchedule(dates);
        this.setBanner({src:data.src??data.banner_image??data.imageUrl??'',srcMobile:data.srcMobile??data.banner_image_mobile??data.imageUrlMobile??data.src_mobile??data.imageUrl_mobile??'',alt:data.alt??data.banner_alt??data.altText??'',href:data.href??data.target_url??data.linkUrl??'',active:typeof data.active==='boolean'?data.active:data.status==='active'});
        return true;
      }catch{if(sequence===pending)this.hide();return false;}finally{clearTimeout(timer);}
    },
    init(){
      const el=this.getElement();if(!el)return;
      if(el.hasAttribute('data-banner-start'))this.schedule.startDate=el.dataset.bannerStart;
      if(el.hasAttribute('data-banner-end'))this.schedule.endDate=el.dataset.bannerEnd;
      const desktop=safeURL(el.dataset.bannerSrc,true),mobile=safeURL(el.dataset.bannerSrcMobile,true);
      const visible=this.enabled&&el.dataset.bannerActive==='true'&&this.isWithinSchedule()&&!!desktop&&!!mobile;
      el.hidden=!visible;el.style.display=visible?'':'none';
      const image=el.querySelector('.digidr-banner-img'),source=el.querySelector('source'),link=el.querySelector('.digidr-banner-link');
      if(image&&desktop){if(image.getAttribute('src')!==desktop)image.src=desktop;image.alt=el.dataset.bannerAlt||'Clinic announcement';
        image.onerror=()=>{el.hidden=true;el.style.display='none';};}
      if(source&&mobile)source.srcset=mobile;
      if(link){const href=safeURL(el.dataset.bannerHref);if(href){link.href=href;
        const external=new URL(href,document.baseURI).origin!==new URL(document.baseURI).origin;
        if(external){link.target='_blank';link.rel='noopener noreferrer';}else{link.removeAttribute('target');link.removeAttribute('rel');}
      }else{link.removeAttribute('href');link.removeAttribute('target');link.removeAttribute('rel');}}
    }
  };
  window.DigiDrBanner=api;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>api.init());else api.init();
})(window,document);
