/* Shared site chrome for typhoonfleet.com. One place for the header, the crew menu, the per-agent
   sub-bar and the footer, so no page is a dead end. A page opts in with:
     <body data-page="home|map|skills|skills-all|overview|product|attack|technical|method" data-hero="squall|glass|...">
     <script src="{root}site.js"></script>   (first thing inside body)
   Agent names, roles and status come from skills.js, which must load before this file.
   side: 'crew' checks something of yours; 'service' works behind the wall for the crew. */
(function(){
  var me=document.currentScript, ROOT=me.src.replace(/site\.js(\?.*)?$/,'');
  var B=document.body, HERO=B.getAttribute('data-hero')||'', PAGE=B.getAttribute('data-page')||'';
  var START='https://start.typhoonfleet.com/', LOGIN='https://squall.typhoonfleet.com/squall/login';
  function u(p){return ROOT+p;}
  /* pages in the older style do not load the site fonts; the chrome needs them */
  if(!document.querySelector('link[href*="Big+Shoulders"]')){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap';document.head.appendChild(l);}

  /* the crew list comes from skills.js, which every page loads first */
  var T=window.TF_SKILLS, CREW=T.order.map(function(k){var a=T.agents[k];return {id:k,side:a.side,name:a.name,role:a.role,st:(a.st==='live'||a.st==='built')?a.st:'dim',label:a.label,href:a.href};});
  /* tabs under an agent: pages for Squall, sections for the single-page agents, the tree for all */
  function one(id){var b=u(id+'/index.html');return [['overview','Overview',b],['kit','What it carries',b+'#kit'],['how','How it works',b+'#how'],['limits','Limits',b+'#limits'],['skills','Skill tree',u(id+'/skills.html')]];}
  function none(id){return [['skills','Skill tree',u(id+'/skills.html')]];}
  var TABS={
    squall:[['overview','Overview',u('squall/index.html')],['skills','Skill tree',u('squall/skills.html')],['product','What it checks',u('squall/product.html')],['attack','Attack path',u('squall/attack-path.html')],['technical','Technical',u('squall/technical.html')],['method','Method',u('method/appsec-review.html')]],
    glass:one('glass'), bridge:one('bridge'), haze:one('haze'),
    anchor:none('anchor'), fathom:none('fathom'), lookout:none('lookout'), harbour:none('harbour')
  };
  var SPY={glass:1,bridge:1,haze:1};

  var WAVE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M12 3v8M8 11h8"/></svg>';
  var CARET='<svg class="tf-caret" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg>';
  var BARS='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12"/></svg>';
  var BACK='<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 2.5L4 6l3.5 3.5"/></svg>';

  function on(c){return c?' class="on" aria-current="page"':'';}
  function row(c){
    return '<a href="'+u(c.href)+'" class="'+(c.st==='dim'?'dim':'')+(c.id===HERO?' on':'')+'"><img src="'+u('fleet/art/'+c.id+'-tile.jpg')+'" alt="" loading="lazy" width="36" height="36">'+
      '<div><b>'+c.name+'</b><span>'+c.role+' · <i class="'+(c.st==='live'?'live':'')+'">'+c.label+'</i></span></div></a>';
  }
  function side(s){return CREW.filter(function(c){return c.side===s;});}

  var header='<header class="tf-top"><div class="tf-wrap">'+
    '<a class="tf-brand" href="'+u('index.html')+'" aria-label="Typhoon Fleet home">'+WAVE+'Typhoon Fleet</a>'+
    '<div class="tf-nav" role="navigation" aria-label="Site">'+
      '<button type="button" data-tf-toggle aria-expanded="false" aria-controls="tf-panel"'+(HERO?' class="on"':'')+'>Crew '+CARET+'</button>'+
      '<a href="'+u('fleet/skills.html')+'"'+on(PAGE==='skills-all')+'>Skill trees</a>'+
      '<a href="'+u('index.html#fleet')+'">Fleet</a>'+
      '<a href="'+u('index.html#how')+'">How it works</a>'+
    '</div>'+
    '<div class="tf-right"><a class="tf-login" href="'+LOGIN+'">Log in</a><a class="tf-start" href="'+START+'">Start</a>'+
      '<button type="button" class="tf-menu" data-tf-toggle aria-expanded="false" aria-controls="tf-panel">'+BARS+'Menu</button></div>'+
    '</div>'+
    '<div class="tf-panel" id="tf-panel"><div class="tf-wrap">'+
      '<div class="tf-ph">The crew. Each one checks something of yours.</div>'+
      '<div class="tf-crew">'+side('crew').map(row).join('')+'</div>'+
      '<div class="tf-ph tf-ph2">Fleet services. They work behind the wall, for the crew.</div>'+
      '<div class="tf-crew">'+side('service').map(row).join('')+'</div>'+
      '<div class="tf-more"><a href="'+u('index.html')+'">Home</a><a href="'+u('fleet/skills.html')+'">Skill trees</a><a href="'+u('index.html#fleet')+'">The rest of the fleet</a><a href="'+u('index.html#how')+'">How it works</a><a href="'+LOGIN+'">Log in</a></div>'+
    '</div></div></header>';

  var sub='';
  var hero=CREW.filter(function(c){return c.id===HERO;})[0];
  if(hero){
    var tabs=(TABS[HERO]||[]).map(function(t){return '<a href="'+t[2]+'" data-tab="'+t[0]+'"'+on(t[0]===PAGE)+'>'+t[1]+'</a>';}).join('');
    sub='<div class="tf-sub"><div class="tf-wrap">'+
      '<a class="tf-back" href="'+u('index.html#crew')+'">'+BACK+'Crew</a><span class="tf-sep">/</span>'+
      '<a class="tf-here" href="'+u(hero.href)+'">'+hero.name+'</a>'+
      (tabs?'<div class="tf-tabs" role="navigation" aria-label="'+hero.name+' pages">'+tabs+'</div>':'')+
    '</div></div>';
  }
  B.insertAdjacentHTML('afterbegin',header+sub);

  function fl(c){return '<a href="'+u(c.href)+'">'+c.name+'<small>'+c.label+'</small></a>';}
  var footer='<footer class="tf-foot"><div class="tf-wrap"><div class="tf-fcols">'+
    '<div><h4>The crew</h4><div class="tf-fl">'+side('crew').map(fl).join('')+'</div><h4 style="margin-top:14px">Fleet services</h4><div class="tf-fl">'+side('service').map(fl).join('')+'</div></div>'+
    '<div><h4>The site</h4><div class="tf-fl"><a href="'+u('index.html')+'">Home</a><a href="'+u('fleet/skills.html')+'">Skill trees</a><a href="'+u('index.html#fleet')+'">The fleet</a><a href="'+u('index.html#how')+'">How it works</a></div></div>'+
    '<div><h4>Your account</h4><div class="tf-fl"><a href="'+START+'">Start with your domain</a><a href="'+LOGIN+'">Log in</a><a href="mailto:squall@typhoonfleet.com">squall@typhoonfleet.com</a></div></div>'+
    '</div><div class="tf-legal">Typhoon Fleet, Hong Kong. Original artwork, not affiliated with any game.'+
    (HERO==='squall'?' MITRE ATT&amp;CK is a registered trademark of The MITRE Corporation.':'')+'</div></div></footer>';
  function foot(){B.insertAdjacentHTML('beforeend',footer);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',foot);else foot();

  /* crew menu open and close */
  var panel=document.getElementById('tf-panel'), toggles=document.querySelectorAll('[data-tf-toggle]');
  function set(open){panel.classList.toggle('open',open);toggles.forEach(function(t){t.setAttribute('aria-expanded',open?'true':'false');});}
  toggles.forEach(function(t){t.addEventListener('click',function(e){e.stopPropagation();set(!panel.classList.contains('open'));});});
  document.addEventListener('click',function(e){if(panel.classList.contains('open')&&!panel.contains(e.target))set(false);});
  panel.addEventListener('click',function(e){if(e.target.closest('a'))set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});

  /* keep the current tab in view on a narrow sub-bar */
  var cur=document.querySelector('.tf-tabs a.on'); if(cur){var w=document.querySelector('.tf-sub .tf-wrap');w.scrollLeft=Math.max(0,cur.offsetLeft-90);}

  /* single-page agents: light the tab for the section in view */
  if(hero&&SPY[HERO]&&PAGE==='overview'&&'IntersectionObserver' in window){
    document.addEventListener('DOMContentLoaded',function(){
      var links={};document.querySelectorAll('.tf-tabs a').forEach(function(a){links[a.getAttribute('data-tab')]=a;});
      var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){
        ['overview','kit','how','limits'].forEach(function(k){links[k].classList.remove('on');});
        var id=en.target.id==='top'?'overview':en.target.id; if(links[id])links[id].classList.add('on');}});},{rootMargin:'-120px 0px -60% 0px'});
      ['top','kit','how','limits'].forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el);});
    });
  }
})();
