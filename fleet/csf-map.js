/* The NIST CSF 2.0 harbour chart. One component for the whole site.
   Skills, ranks, agents and categories come from skills.js at runtime (window.TF_SKILLS), so the map cannot drift from it.
   Framework wording comes from fleet/csf-meta.js (window.TF_CSFMETA, built by _gen/build-csf-meta.py).

   <div data-csfmap data-base="../"></div>                          whole fleet
   <div data-csfmap data-agent="squall" data-base="../"></div>      one agent's skills
   data-hash="1" lets the map keep its state in the URL (#report, #ID.RA). Agent pages leave it off: their tree owns the hash. */
(function(){
var S=window.TF_SKILLS,M=window.TF_CSFMETA;
if(!S||!M)return;
var MAT=['Not built','Built','Running','Live','World class'];

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* model: every category with the skills that sit in it, for the whole fleet or one agent */
function model(aid){
  var ids=aid?[aid]:S.order,cats={},tot=0,work=0,top=0;
  M.functions.forEach(function(f){f.categories.forEach(function(id){
    var m=M.categories[id];
    cats[id]={id:id,fn:f.id,short:m.short,description:m.description,outOfScope:m.outOfScope,note:m.note,skills:[],count:0,working:0,max:null};
  });});
  ids.forEach(function(k){S.agents[k].skills.forEach(function(s){
    var c=cats[s.csf]; if(!c){if(window.console)console.warn('csf-map: unknown category',s.csf,k,s.id);return;}
    c.skills.push({agent:k,id:s.id,name:s.n,r:s.r});
    c.count++; if(s.r>0){c.working++;work++;} c.max=c.max==null?s.r:Math.max(c.max,s.r);
    tot++; top=Math.max(top,s.r);
  });});
  var fns=M.functions.map(function(f){
    var n=0,w=0;f.categories.forEach(function(id){n+=cats[id].count;w+=cats[id].working;});
    return {id:f.id,name:f.name,description:f.description,categories:f.categories,count:n,working:w};
  });
  return {cats:cats,fns:fns,total:tot,working:work,top:top,agent:aid||null};
}

/* a moored light: brightness is maturity */
var HALO=[0,7.5,10,13,17],HOP=[0,.16,.26,.36,.45],BODY=[3.9,3.5,4.4,5.2,5.9],BOP=[0,.62,.82,1,1];
function light(cx,cy,r,col){
  if(r<1)return '<circle cx="'+cx+'" cy="'+cy+'" r="3.8" fill="none" stroke="#7C93B3" stroke-opacity=".75" stroke-width="1.2"/>';
  var s='<circle cx="'+cx+'" cy="'+cy+'" r="'+HALO[r]+'" fill="'+col+'" fill-opacity="'+HOP[r]+'"/>';
  if(r>=4){for(var k=0;k<4;k++){var a=k*Math.PI/2+Math.PI/4;s+='<line x1="'+(cx+Math.cos(a)*7)+'" y1="'+(cy+Math.sin(a)*7)+'" x2="'+(cx+Math.cos(a)*14)+'" y2="'+(cy+Math.sin(a)*14)+'" stroke="'+col+'" stroke-width="1.4"/>';}}
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+BODY[r]+'" fill="'+col+'" fill-opacity="'+BOP[r]+'"/>';
  if(r>=3)s+='<circle cx="'+cx+'" cy="'+cy+'" r="1.7" fill="#fff" fill-opacity=".9"/>';
  return s;
}
function lightSvg(r,col,size){var h=size/2;return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" aria-hidden="true">'+light(h,h,r,col)+'</svg>';}

/* greedy word wrap on character count; the code rides on the last line when it fits */
function wrapLabel(name,code,max){
  var w=name.split(' '),lines=[''];
  w.forEach(function(x){var l=lines[lines.length-1];if(l&&(l+' '+x).length>max)lines.push(x);else lines[lines.length-1]=l?l+' '+x:x;});
  var last=lines[lines.length-1];
  if((last+' '+code).length<=max)return {lines:lines,codeOn:lines.length-1};
  lines.push('');return {lines:lines,codeOn:lines.length-1};
}

function mount(root){
  var aid=root.getAttribute('data-agent')||null,base=root.getAttribute('data-base')||'',useHash=root.getAttribute('data-hash')==='1';
  var D=model(aid),A=S.agents,agentName=aid?A[aid].name:'';
  var sel=null,hi=null,lastW=0;

  root.innerHTML='<div class="cm">'+
    '<p class="cm-lede"></p>'+
    '<div class="cm-bar"><span class="cm-hint">Tap a berth for its skills.</span>'+
      '<div class="cm-seg" role="tablist" aria-label="View"><button type="button" role="tab" class="t-chart" aria-selected="true">Chart</button><button type="button" role="tab" class="t-rep" aria-selected="false">Report</button></div></div>'+
    '<div class="cm-chartview"><div class="cm-panel"><svg class="cm-chart" role="group" aria-label="Harbour chart of '+(aid?esc(agentName)+"'s skills":'the fleet')+' against NIST CSF 2.0"></svg><div class="cm-legend"></div></div></div>'+
    '<div class="cm-rpt"></div>'+
    '<p class="cm-src">Categories and wording from <a href="'+M.source+'">NIST CSWP 29</a>.</p>'+
  '</div>';
  var sheet=document.createElement('aside');sheet.className='cm-sheet';sheet.hidden=true;sheet.setAttribute('role','dialog');sheet.setAttribute('aria-live','polite');
  document.body.appendChild(sheet);
  var cm=root.querySelector('.cm'),svg=cm.querySelector('.cm-chart'),host=cm.querySelector('.cm-panel');

  /* lede, all derived */
  (function(){
    var t;
    if(!aid){
      var best=null;D.fns.forEach(function(f){if(!best||f.working>best.working)best=f;});
      t=D.working+' of '+D.total+' skills work today.'+(D.working&&best.working/D.working>.5?' Most are in '+best.name+'.':'');
    }else if(!D.working){t='None of the '+D.total+' '+agentName+' skills work yet. They are being built.';}
    else t=D.working+' of '+D.total+' '+agentName+' skills work today.';
    cm.querySelector('.cm-lede').textContent=t;
  })();

  /* legend */
  (function(){
    var gold='#F2C46B',h='<div class="cm-row">';
    MAT.forEach(function(m,i){h+='<span class="cm-k">'+lightSvg(i,aid?A[aid].spot:gold,26)+m+'</span>';});
    h+='</div>';
    if(!aid){h+='<div class="cm-row">';S.order.forEach(function(id){h+='<button type="button" data-ag="'+id+'" aria-pressed="false"><i style="background:'+A[id].spot+'"></i>'+esc(A[id].name)+'</button>';});h+='</div>';}
    var L=cm.querySelector('.cm-legend');L.innerHTML=h;
    L.addEventListener('click',function(e){var b=e.target.closest('button[data-ag]');if(!b)return;
      hi=(hi===b.dataset.ag)?null:b.dataset.ag;
      L.querySelectorAll('button[data-ag]').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.ag===hi);});
      draw(true);});
  })();

  function owns(c){return !aid||c.count>0;}  /* in agent view a berth with none of the agent's skills is background */
  function countText(c){return c.outOfScope?'':(c.count?c.working+' of '+c.count+' working':(aid?'':'No skill yet'));}

  function draw(force){
    var W=Math.floor(host.getBoundingClientRect().width);
    if(W<200)return;
    if(!force&&W===lastW)return;lastW=W;
    var phone=W<600,pad=phone?16:28,Wi=W-2*pad,g=10,gg=28,top=phone?30:42,pitch=14;
    var cols=W>=1000?8:Math.max(2,Math.floor((Wi+g)/(124+g)));
    /* pack functions into rows */
    var rows=[],cur=null;
    D.fns.forEach(function(f){
      var n=f.categories.length;
      if(n>=cols){cur=null;rows.push({groups:[{f:f,n:n,k:cols}],used:cols});return;}
      if(cur&&cur.used+n<=cols){cur.groups.push({f:f,n:n,k:n});cur.used+=n;}
      else{cur={groups:[{f:f,n:n,k:n}],used:n};rows.push(cur);}
    });
    var defs='<defs><linearGradient id="cm-gl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F2B25B" stop-opacity="1"/><stop offset="1" stop-color="#F2B25B" stop-opacity="0"/></linearGradient>'+
      '<filter id="cm-fog" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter></defs>';
    var body='',y=top;
    rows.forEach(function(r){
      /* every row spans the full width, so its berth width is its own */
      var slots=0,gaps=(r.groups.length-1)*gg;
      r.groups.forEach(function(G){slots+=G.k;gaps+=(G.k-1)*g;});
      var bw=Math.floor(Math.min(220,(Wi-gaps)/slots));
      var nameMax=Math.max(8,Math.floor((bw-20)/6.7)),lc=Math.max(3,Math.floor((bw-14)/pitch));
      /* each berth is as tall as its content; berths on the same pier line match */
      var subs=0;r.groups.forEach(function(G){subs=Math.max(subs,Math.ceil(G.n/G.k));});
      var info={},bhs=[];
      for(var sr=0;sr<subs;sr++){
        var need=0;
        r.groups.forEach(function(G){G.f.categories.forEach(function(id,i){
          if(Math.floor(i/G.k)!==sr)return;
          var c=D.cats[id],lab=wrapLabel(c.short,id,nameMax),ct=countText(c);
          var lr=c.outOfScope?2:(owns(c)&&c.count?Math.ceil(c.count/lc):0);
          info[id]={lab:lab,ct:ct,lr:lr};
          need=Math.max(need,12+lab.lines.length*15+(ct?17:0)+(lr?lr*pitch+4:0)+(lr||ct?8:4));
        });});
        bhs.push(Math.max(need,56));
      }
      var x=pad,rowH=0;
      r.groups.forEach(function(G){
        var f=G.f,gw=G.k*bw+(G.k-1)*g,nrows=Math.ceil(G.n/G.k);
        var wy=y+30;
        var sumH=0;for(var q0=0;q0<nrows;q0++)sumH+=bhs[q0];
        var gh=9+sumH+(nrows-1)*g+6;
        body+='<text class="cm-fn" x="'+x+'" y="'+(y+20)+'">'+esc(f.name)+'</text>';
        if(f.count)body+='<text class="cm-fs" x="'+(x+gw)+'" y="'+(y+20)+'" text-anchor="end">'+f.working+' of '+f.count+' working</text>';
        /* piers between berths */
        var byA=wy+9;
        for(var s2=0;s2<nrows;s2++){
          var cnt=Math.min(G.k,G.n-s2*G.k);
          for(var p=0;p<=cnt;p++){
            var px=x+p*(bw+g)-g/2-2;
            body+='<rect x="'+px+'" y="'+(byA-(s2?g:0))+'" width="4" height="'+(bhs[s2]+(s2?g:0)+4)+'" rx="2" fill="#EDE3CF" fill-opacity=".9"/>';
          }
          byA+=bhs[s2]+g;
        }
        /* quay wall */
        body+='<rect x="'+(x-g/2-2)+'" y="'+wy+'" width="'+(gw+g+4)+'" height="9" rx="3" fill="#EDE3CF"/>';
        for(var q=0;q<G.k;q++)body+='<circle cx="'+(x+q*(bw+g)+bw/2)+'" cy="'+(wy+4.5)+'" r="2.2" fill="#0A1D38"/>';
        /* berths */
        f.categories.forEach(function(id,i){
          var c=D.cats[id],col=i%G.k,rw=Math.floor(i/G.k),bh=bhs[rw],bx=x+col*(bw+g),by=wy+9,I=info[id];
          for(var z=0;z<rw;z++)by+=bhs[z]+g;
          var own=owns(c);
          var cls='cm-berth'+(c.outOfScope?' oos':c.count?'':' empty')+(own?'':' bg')+(sel===id?' sel':'');
          var aria=c.short+' '+id+(c.outOfScope?', out of scope':c.count?', '+c.working+' of '+c.count+' skills working':', no skill yet');
          body+='<g class="'+cls+'" data-id="'+id+'"'+(own?' tabindex="0" role="button" aria-label="'+esc(aria)+'"':' aria-hidden="true"')+'>';
          body+='<rect class="slip" x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="5"/>';
          if(c.max!=null&&c.max>0)body+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="5" fill="url(#cm-gl)" fill-opacity="'+(.1+c.max/4*.6).toFixed(2)+'" pointer-events="none"/>';
          if(c.outOfScope){
            var cid='cm-cp-'+id.replace('.','');
            body+='<clipPath id="'+cid+'"><rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="5"/></clipPath>'+
              '<g clip-path="url(#'+cid+')" pointer-events="none"><g filter="url(#cm-fog)" fill="#C3CFDF"><ellipse cx="'+(bx+bw*.3)+'" cy="'+(by+bh*.38)+'" rx="'+(bw*.42)+'" ry="'+(bh*.3)+'" fill-opacity=".5"/><ellipse cx="'+(bx+bw*.72)+'" cy="'+(by+bh*.66)+'" rx="'+(bw*.45)+'" ry="'+(bh*.3)+'" fill-opacity=".45"/><ellipse cx="'+(bx+bw*.5)+'" cy="'+(by+bh*.9)+'" rx="'+(bw*.55)+'" ry="'+(bh*.2)+'" fill-opacity=".4"/></g></g>';
          }
          I.lab.lines.forEach(function(L,li){
            body+='<text class="cm-name" x="'+(bx+10)+'" y="'+(by+20+li*15)+'">'+esc(L)+(li===I.lab.codeOn?' <tspan class="cm-code">'+id+'</tspan>':'')+'</text>';
          });
          var ty=by+12+I.lab.lines.length*15;
          if(I.ct){body+='<text class="cm-count" x="'+(bx+10)+'" y="'+(ty+10)+'">'+I.ct+'</text>';ty+=17;}
          if(c.outOfScope){
            body+='<text class="cm-fog" x="'+(bx+bw/2)+'" y="'+(ty+I.lr*pitch/2+4)+'" pointer-events="none">Out of scope</text>';
          }else if(own&&c.count){
            var sk=c.skills.slice().sort(function(a,b){return b.r-a.r||S.order.indexOf(a.agent)-S.order.indexOf(b.agent);});
            var dimAll=hi&&!sk.some(function(k){return k.agent===hi;});
            body+='<g class="cm-lights" pointer-events="none"'+(dimAll?' opacity=".18"':'')+'>';
            sk.forEach(function(k,j){
              var cx=bx+10+(j%lc)*pitch+6,cy=ty+4+Math.floor(j/lc)*pitch+6,dim=hi&&k.agent!==hi;
              body+='<g'+(dim?' opacity=".16"':'')+'>'+light(cx,cy,k.r,A[k.agent].spot)+'</g>';
            });
            body+='</g>';
          }
          body+='<rect class="hit" x="'+(bx-4)+'" y="'+by+'" width="'+(bw+8)+'" height="'+bh+'"/></g>';
        });
        rowH=Math.max(rowH,30+gh);
        x+=gw+gg;
      });
      y+=rowH+(phone?22:30);
    });
    var H=Math.ceil(y-(phone?10:14)+pad/2);
    /* water contours, then the hull-plate frame */
    var water='';
    for(var k=1;k<7;k++){var by0=H*k/7,d='M0 '+by0;for(var xx=0;xx<=W;xx+=20)d+=' L'+xx+' '+(by0+Math.sin(xx/70+k*1.7)*9);water+='<path d="'+d+'" fill="none" stroke="#9DB9DB" stroke-opacity=".09"/>';}
    var frame='<rect x="4" y="4" width="'+(W-8)+'" height="'+(H-8)+'" fill="none" stroke="#EDE3CF" stroke-opacity=".4"/><rect x="10" y="10" width="'+(W-20)+'" height="'+(H-20)+'" fill="none" stroke="#EDE3CF" stroke-opacity=".25"/>';
    for(var t=4;t<W-4;t+=24){var tw=Math.min(12,W-4-t);frame+='<rect x="'+t+'" y="4" width="'+tw+'" height="6" fill="#EDE3CF" fill-opacity=".35"/><rect x="'+t+'" y="'+(H-10)+'" width="'+tw+'" height="6" fill="#EDE3CF" fill-opacity=".35"/>';}
    for(var u=4;u<H-4;u+=24){var uh=Math.min(12,H-4-u);frame+='<rect x="4" y="'+u+'" width="6" height="'+uh+'" fill="#EDE3CF" fill-opacity=".35"/><rect x="'+(W-10)+'" y="'+u+'" width="6" height="'+uh+'" fill="#EDE3CF" fill-opacity=".35"/>';}
    svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('width',W);svg.setAttribute('height',H);
    svg.innerHTML=defs+water+frame+body;
  }

  /* sheet */
  function avatar(id){return '<span class="cm-av" style="--c:'+A[id].spot+'"><img src="'+base+'fleet/crew/'+id+'.png" alt=""></span>';}
  function openSheet(id){
    var c=D.cats[id];if(!c)return;sel=id;
    var h='<button type="button" class="cm-x" aria-label="Close">&times;</button><h2>'+esc(c.short)+' <span>'+id+'</span></h2><p class="cm-desc">'+esc(c.description)+'.</p>';
    if(c.outOfScope||!c.count){h+='<p class="cm-none">'+esc(c.note)+'</p>';}
    else{
      S.order.forEach(function(a){
        var ks=c.skills.filter(function(k){return k.agent===a;});if(!ks.length)return;
        ks.sort(function(x,y){return y.r-x.r;});
        h+='<div class="cm-ag">'+(aid?'':'<h3>'+avatar(a)+esc(A[a].name)+'</h3>')+'<ul class="cm-sk'+(aid?' solo':'')+'">';
        ks.forEach(function(k){h+='<li>'+lightSvg(k.r,A[a].spot,24)+'<a class="n" data-sk="'+k.id+'" href="'+(aid?'#'+k.id:base+a+'/skills.html#'+k.id)+'">'+esc(k.name)+'</a><span class="m">'+MAT[k.r]+'</span></li>';});
        h+='</ul></div>';
      });
    }
    sheet.innerHTML=h;sheet.hidden=false;sheet.scrollTop=0;
    cm.querySelectorAll('.cm-berth').forEach(function(b){b.classList.toggle('sel',b.dataset.id===id);});
    if(useHash&&location.hash!=='#'+id)history.replaceState(null,'','#'+id);
  }
  function closeSheet(){
    sel=null;sheet.hidden=true;
    cm.querySelectorAll('.cm-berth.sel').forEach(function(b){b.classList.remove('sel');});
    if(useHash)history.replaceState(null,'',location.pathname+location.search);
  }
  sheet.addEventListener('click',function(e){
    if(e.target.closest('.cm-x')){closeSheet();return;}
    var a=e.target.closest('a[data-sk]');
    if(a&&aid){ /* on an agent page the skill is on the tree above: jump to it */
      var n=document.querySelector('.sk-node[data-id="'+a.getAttribute('data-sk')+'"]');
      if(n){e.preventDefault();closeSheet();n.scrollIntoView({block:'center',behavior:'smooth'});n.click();}
    }
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sheet.hidden)closeSheet();});
  svg.addEventListener('click',function(e){
    var b=e.target.closest('.cm-berth');
    if(!b||b.getAttribute('aria-hidden')==='true'){if(!sheet.hidden)closeSheet();return;}
    if(sel===b.dataset.id&&!sheet.hidden)closeSheet();else openSheet(b.dataset.id);
  });
  svg.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var b=e.target.closest('.cm-berth');if(b&&b.getAttribute('role')==='button'){e.preventDefault();openSheet(b.dataset.id);}});

  /* report */
  function agentsOf(c){return S.order.filter(function(a){return c.skills.some(function(k){return k.agent===a;});});}
  function dots(c){
    return agentsOf(c).map(function(a){return '<span class="cm-dot" style="--c:'+A[a].spot+'" title="'+esc(A[a].name)+'"><img src="'+base+'fleet/crew/'+a+'.png" alt=""></span>';}).join('');
  }
  function buildReport(){
    var h='<table class="cm-t"><thead><tr><th>Category</th><th>Skills</th><th>Working</th><th>Furthest along</th><th>Agents</th></tr></thead>';
    D.fns.forEach(function(f){
      h+='<tbody><tr class="cm-fnrow"><td colspan="5"><b>'+esc(f.name)+'</b>'+(f.count?'<em>'+f.working+' of '+f.count+' working</em>':'')+'<small>'+esc(f.description)+'</small></td></tr>';
      f.categories.forEach(function(id){
        var c=D.cats[id],none=!c.count;
        h+='<tr class="cm-crow'+(none?' none':'')+'" data-id="'+id+'"'+((aid&&none)?'':' tabindex="0" role="button"')+'>'+
          '<td class="nm"><span class="n">'+esc(c.short)+'</span> <span class="code">'+id+'</span></td>';
        if(c.count){
          h+='<td class="num sk">'+c.count+'</td><td class="num wk">'+c.working+' of '+c.count+'</td><td class="fw">'+MAT[c.max]+'</td><td class="ag">'+dots(c)+'<span class="names">'+esc(agentsOf(c).map(function(a){return A[a].name;}).join(' '))+'</span></td>';
        }else{
          h+='<td class="num sk">0</td><td class="num wk">0</td><td class="fw">'+(c.outOfScope?'Out of scope':(aid?'':'No skill yet'))+'</td><td class="ag"></td>';
        }
        h+='</tr>';
      });
      h+='</tbody>';
    });
    h+='<tfoot><tr><td class="nm">All '+Object.keys(D.cats).length+' categories</td><td class="num sk">'+D.total+'</td><td class="num wk">'+D.working+' of '+D.total+'</td><td class="fw">'+(D.total?MAT[D.top]:'')+'</td><td class="ag"></td></tr></tfoot></table>';
    cm.querySelector('.cm-rpt').innerHTML=h;
  }
  cm.querySelector('.cm-rpt').addEventListener('click',function(e){var r=e.target.closest('.cm-crow');if(r&&r.getAttribute('role')==='button')openSheet(r.dataset.id);});
  cm.querySelector('.cm-rpt').addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var r=e.target.closest('.cm-crow');if(r&&r.getAttribute('role')==='button'){e.preventDefault();openSheet(r.dataset.id);}});

  /* chart or report */
  var tc=cm.querySelector('.t-chart'),tr=cm.querySelector('.t-rep');
  function view(rep,fromHash){
    cm.classList.toggle('rep',rep);
    tc.setAttribute('aria-selected',!rep);tr.setAttribute('aria-selected',rep);
    if(!sheet.hidden&&!fromHash)closeSheet();
    if(useHash){if(rep)history.replaceState(null,'','#report');else if(location.hash==='#report')history.replaceState(null,'',location.pathname+location.search);}
    if(!rep){lastW=0;draw(true);}
  }
  tc.onclick=function(){view(false);};tr.onclick=function(){view(true);};
  buildReport();

  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(!cm.classList.contains('rep'))draw(false);},60);});
  var hash=useHash?decodeURIComponent(location.hash.slice(1)):'';
  if(hash==='report')view(true,true);
  else{draw(true);if(D.cats[hash])openSheet(hash);}
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(!cm.classList.contains('rep'))draw(true);});
}

function run(){document.querySelectorAll('[data-csfmap]').forEach(mount);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
