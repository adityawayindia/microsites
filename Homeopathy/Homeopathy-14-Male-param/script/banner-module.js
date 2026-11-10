/* One source of truth for manual activation, image updates and campaign scheduling. */
(function(window,document){
  'use strict';
  let requestVersion=0;
  const banner={
    enabled:true,
    schedule:{enabled:true,startDate:'',endDate:''},
    getElement(){return document.querySelector('#digidrBannerModule, .digidr-banner-module');},
    isWithinSchedule(){
      if(!this.schedule.enabled)return true;
      const now=Date.now(),start=this.schedule.startDate?Date.parse(this.schedule.startDate):null,end=this.schedule.endDate?Date.parse(this.schedule.endDate):null;
      if((start!==null&&!Number.isFinite(start))||(end!==null&&!Number.isFinite(end)))return false;
      if(start!==null&&end!==null&&start>end)return false;
      return (start===null||now>=start)&&(end===null||now<=end);
    },
    safeURL(value){
      if(!value || value==='#')return '';
      try{const u=new URL(value,document.baseURI);return ['https:','http:'].includes(u.protocol)?value:'';}catch(_){return '';}
    },
    setSchedule(config={}){
      const el=this.getElement();
      if('enabled' in config)this.schedule.enabled=config.enabled===true;
      for(const key of ['startDate','endDate'])if(key in config){this.schedule[key]=config[key]||'';el?.setAttribute(key==='startDate'?'data-banner-start':'data-banner-end',this.schedule[key]);}
      this.init();
    },
    setBanner(config={}){
      const el=this.getElement();if(!el)return;
      const attrs={src:'src',srcMobile:'src-mobile',alt:'alt',href:'href'};
      Object.entries(attrs).forEach(([key,attr])=>{if(key in config)el.setAttribute('data-banner-'+attr,String(config[key]??''));});
      if('active' in config)el.dataset.bannerActive=String(config.active===true);
      this.init();
    },
    show(){this.setBanner({active:true});},
    hide(){this.setBanner({active:false});},
    async loadFromEndpoint(endpoint){
      if(!endpoint)return false;const request=++requestVersion;
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),7000);
      try{
        const response=await fetch(endpoint,{signal:controller.signal});if(!response.ok)throw new Error('Banner response failed');
        const data=await response.json();if(request!==requestVersion)return false;
        if('startDate' in data||'start_date' in data||'endDate' in data||'end_date' in data)this.setSchedule({startDate:data.startDate??data.start_date??'',endDate:data.endDate??data.end_date??''});
        this.setBanner({src:data.src??data.banner_image??data.imageUrl??'',srcMobile:data.srcMobile??data.banner_image_mobile??data.imageUrlMobile??data.src_mobile??'',alt:data.alt??data.banner_alt??data.altText??'Clinic banner',href:data.href??data.target_url??data.linkUrl??'',active:'active' in data?data.active===true:data.status==='active'});
        return true;
      }catch(_){if(request===requestVersion)this.hide();return false;}finally{clearTimeout(timeout);}
    },
    init(){
      const el=this.getElement();if(!el)return;
      this.schedule.startDate=el.dataset.bannerStart||'';this.schedule.endDate=el.dataset.bannerEnd||'';
      const img=el.querySelector('.digidr-banner-img'),source=el.querySelector('source'),link=el.querySelector('.digidr-banner-link');
      const src=this.safeURL(el.dataset.bannerSrc||''),mobile=this.safeURL(el.dataset.bannerSrcMobile||'');
      // Relative asset paths remain valid in offline DOM tests as well as at an HTTP origin.
      const local=value=>value&&!/^[a-z][a-z0-9+.-]*:/i.test(value)&&!value.startsWith('//')?value:'';
      const desktop=src||local(el.dataset.bannerSrc),small=mobile||local(el.dataset.bannerSrcMobile);
      if(img&&desktop&&img.getAttribute('src')!==desktop){img.src=desktop;el.dataset.bannerImageFailed='false';}
      if(source)source.srcset=small||desktop||'';
      if(img)img.alt=el.dataset.bannerAlt||'Clinic banner';
      if(link){const href=this.safeURL(el.dataset.bannerHref)||local(el.dataset.bannerHref);
        if(href&&href!=='#'){link.href=href;link.removeAttribute('tabindex');if(/^https?:/i.test(href)){link.target='_blank';link.rel='noopener noreferrer';}else{link.removeAttribute('target');link.removeAttribute('rel');}}
        else{link.removeAttribute('href');link.removeAttribute('target');link.removeAttribute('rel');}
      }
      const visible=this.enabled&&el.dataset.bannerActive==='true'&&this.isWithinSchedule()&&Boolean(desktop)&&el.dataset.bannerImageFailed!=='true';
      el.hidden=!visible;el.style.display=visible?'':'none';
      if(img&&!img.dataset.bannerBound){img.dataset.bannerBound='true';img.addEventListener('error',()=>{el.dataset.bannerImageFailed='true';el.hidden=true;el.style.display='none';});}
    }
  };
  window.DigiDrBanner=banner;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>banner.init());else banner.init();
})(window,document);
