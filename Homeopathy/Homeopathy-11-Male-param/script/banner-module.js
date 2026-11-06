/* DigiDr banner: inactive by default, bounded schedules, no unsafe destinations. */
(function(window,document){
 'use strict';
 function safeURL(value,image=false){
   if(!value || value==='#')return '';
   if(image && /^data:image\/(png|jpeg|webp|svg\+xml);base64,/i.test(value))return value;
   try{const u=new URL(value,location.protocol==='about:'?'https://digidr.app/':location.href);return /^https?:$/.test(u.protocol)?value:'';}catch{return '';}
 }
 const banner={
   enabled:true,
   schedule:{enabled:true,startDate:'',endDate:''},
   getElement(){return document.querySelector('#digidrBannerModule,.digidr-banner-module');},
   isWithinSchedule(){
     if(!this.schedule.enabled)return true;
     const now=Date.now(),start=this.schedule.startDate,end=this.schedule.endDate;
     const a=start?Date.parse(start):null,b=end?Date.parse(end):null;
     if((start&&!Number.isFinite(a))||(end&&!Number.isFinite(b))||(a!==null&&b!==null&&a>b))return false;
     return (a===null||now>=a)&&(b===null||now<=b);
   },
   setSchedule(config){
     if(!config)return;const el=this.getElement();
     if('enabled'in config)this.schedule.enabled=!!config.enabled;
     for(const[key,attr]of [['startDate','data-banner-start'],['endDate','data-banner-end']]){
       if(key in config){this.schedule[key]=config[key] instanceof Date?config[key].toISOString():String(config[key]||'');el?.setAttribute(attr,this.schedule[key]);}
     }
     this.init();
   },
   setBanner(config){
     const el=this.getElement();if(!el||!config)return;
     for(const[key,attr]of [['src','data-banner-src'],['srcMobile','data-banner-src-mobile'],['alt','data-banner-alt'],['href','data-banner-href']])if(key in config)el.setAttribute(attr,String(config[key]||''));
     if('active'in config)el.dataset.bannerActive=config.active?'true':'false';
     this.init();
   },
   show(){this.setBanner({active:true});},hide(){this.setBanner({active:false});},
   async loadFromEndpoint(endpoint){
     if(!safeURL(endpoint))return false;
     const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),7000);
     try{
       const response=await fetch(endpoint,{signal:controller.signal});if(!response.ok)throw new Error('banner-response');const d=await response.json();
       this.setSchedule({startDate:d.startDate||d.start_date||'',endDate:d.endDate||d.end_date||''});
       this.setBanner({src:d.src||d.banner_image||d.imageUrl||'',srcMobile:d.srcMobile||d.banner_image_mobile||d.imageUrlMobile||d.src_mobile||d.imageUrl_mobile||'',alt:d.alt||d.banner_alt||d.altText||'',href:d.href||d.target_url||d.linkUrl||'',active:typeof d.active==='boolean'?d.active:d.status==='active'});
       return true;
     }catch{this.hide();return false;}finally{clearTimeout(timer);}
   },
   init(){
     const el=this.getElement();if(!el)return;
     this.schedule.startDate=el.dataset.bannerStart||'';this.schedule.endDate=el.dataset.bannerEnd||'';
     const img=el.querySelector('.digidr-banner-img'),source=el.querySelector('source'),link=el.querySelector('.digidr-banner-link');
     const src=safeURL(el.dataset.bannerSrc,true),mobile=safeURL(el.dataset.bannerSrcMobile,true),href=safeURL(el.dataset.bannerHref);
     el.hidden=!(this.enabled&&el.dataset.bannerActive==='true'&&this.isWithinSchedule()&&src&&mobile);
     if(img){if(src&&img.getAttribute('src')!==src)img.src=src;img.alt=el.dataset.bannerAlt||'Clinic banner';img.onerror=()=>{el.hidden=true;};}
     if(source&&mobile&&source.getAttribute('srcset')!==mobile)source.srcset=mobile;
     if(link){if(href){link.href=href;link.removeAttribute('tabindex');if(/^https?:\/\//i.test(href)){link.target='_blank';link.rel='noopener noreferrer';}else{link.removeAttribute('target');link.removeAttribute('rel');}}else{link.removeAttribute('href');link.setAttribute('tabindex','-1');}}
   }
 };
 window.DigiDrBanner=banner;
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>banner.init());else banner.init();
})(window,document);
