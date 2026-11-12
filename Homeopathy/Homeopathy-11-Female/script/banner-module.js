/* DigiDr banner API: explicit on/off state, per-site schedule and responsive picture sources. */
(function(window,document){
  'use strict';
  const own=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
  const api={
    enabled:true,
    schedule:{enabled:true,startDate:'',endDate:''},
    getElement(){return document.querySelector('#digidrBannerModule,.digidr-banner-module');},
    isWithinSchedule(){
      if(!this.schedule.enabled)return true;
      const {startDate,endDate}=this.schedule,now=Date.now(),start=startDate?Date.parse(startDate):-Infinity,end=endDate?Date.parse(endDate):Infinity;
      return !Number.isNaN(start)&&!Number.isNaN(end)&&start<=end&&now>=start&&now<=end;
    },
    setSchedule(config){
      if(!config)return;const el=this.getElement();
      ['enabled','startDate','endDate'].forEach(key=>{if(own(config,key))this.schedule[key]=config[key];});
      if(el){if(own(config,'startDate'))el.dataset.bannerStart=config.startDate||'';if(own(config,'endDate'))el.dataset.bannerEnd=config.endDate||'';}
      this.init();
    },
    setBanner(config){
      const el=this.getElement();if(!el||!config)return;
      for(const [key,attr] of Object.entries({src:'bannerSrc',srcMobile:'bannerSrcMobile',alt:'bannerAlt',href:'bannerHref'})){
        if(own(config,key))el.dataset[attr]=config[key]||'';
      }
      if(own(config,'active'))el.dataset.bannerActive=config.active===true?'true':'false';
      this.init();
    },
    show(){this.setBanner({active:true});},
    hide(){this.setBanner({active:false});},
    async loadFromEndpoint(url){
      if(!url)return;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
      try{
        const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw new Error('banner-unavailable');
        const data=await response.json();if(!data||typeof data!=='object')throw new Error('banner-invalid');
        if(own(data,'startDate')||own(data,'start_date')||own(data,'endDate')||own(data,'end_date'))this.setSchedule({startDate:data.startDate??data.start_date??'',endDate:data.endDate??data.end_date??''});
        this.setBanner({src:data.src??data.banner_image??data.imageUrl??'',srcMobile:data.srcMobile??data.banner_image_mobile??data.imageUrlMobile??data.src_mobile??data.imageUrl_mobile??'',
          alt:data.alt??data.banner_alt??data.altText??'',href:data.href??data.target_url??data.linkUrl??'',active:own(data,'active')?data.active===true:data.status==='active'});
      }catch{this.hide();}finally{clearTimeout(timer);}
    },
    init(){
      const el=this.getElement();if(!el)return;
      this.schedule.startDate=el.dataset.bannerStart||'';this.schedule.endDate=el.dataset.bannerEnd||'';
      const src=el.dataset.bannerSrc||'',mobile=el.dataset.bannerSrcMobile||src,img=el.querySelector('#digidrBannerImg,.digidr-banner-img'),source=el.querySelector('source'),link=el.querySelector('#digidrBannerLink,.digidr-banner-link');
      const safeImage=value=>{try{const url=new URL(value,document.baseURI);return value&&['http:','https:'].includes(url.protocol);}catch{return false;}};
      const visible=this.enabled&&el.dataset.bannerActive==='true'&&this.isWithinSchedule()&&safeImage(src)&&safeImage(mobile);
      el.hidden=!visible;el.classList.toggle('is-banner-hidden',!visible);
      if(img){if(src&&img.getAttribute('src')!==src)img.src=src;img.alt=el.dataset.bannerAlt||'Clinic banner';img.onerror=()=>{el.hidden=true;el.classList.add('is-banner-hidden');};}
      if(source&&mobile)source.srcset=mobile;
      if(link){
        const href=el.dataset.bannerHref||'';let safe=false;try{safe=href&&href!=='#'&&['http:','https:'].includes(new URL(href,document.baseURI).protocol);}catch{}
        if(safe){link.setAttribute('href',href);link.tabIndex=0;if(!href.startsWith('#')&&new URL(href,document.baseURI).origin!==location.origin){link.target='_blank';link.rel='noopener noreferrer';}else{link.removeAttribute('target');link.removeAttribute('rel');}}
        else{link.removeAttribute('href');link.tabIndex=-1;link.removeAttribute('target');link.removeAttribute('rel');}
      }
    }
  };
  window.DigiDrBanner=api;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>api.init());else api.init();
})(window,document);
