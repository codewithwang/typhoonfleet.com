/* The NIST CSF 2.0 map. One component for the whole site: a light fleet wheel, then a dark harbour chart, sharing one selection.
   Skills, ranks, agents and categories come from skills.js at runtime (window.TF_SKILLS), so the map cannot drift from it.
   Framework wording comes from fleet/csf-meta.js (window.TF_CSFMETA, built by _gen/build-csf-meta.py).

   <div data-csfmap data-hash="1" data-base="../"></div>             whole fleet, with the agent pick
   <div data-csfmap data-agent="squall" data-base="../"></div>       one agent: compact, its share on the wheel, its berths first
   data-hash="1" keeps the state in the URL (#full, #report, #ID.RA, #ship=squall). Agent pages leave it off: their tree owns the hash. */
(function(){
var S=window.TF_SKILLS,M=window.TF_CSFMETA,NS='http://www.w3.org/2000/svg';
if(!S||!M)return;
var MAT=['Not built','Built','Running','Live','World class'],MAXR=4,GOLD='#F2C46B',GREY='#D3D9E3',SLIP='#12315A';
var A=S.agents,order=S.order,uid=0;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var wide=window.matchMedia('(min-width:760px)');

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function plural(n,w){return n+' '+w+(n===1?'':'s');}
function h(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function el(n,a,p,t){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(t!=null)e.textContent=t;if(p)p.appendChild(e);return e;}
function list(a){a=a.slice();return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}

/* Lamp colours: each agent's own colour, lifted until it holds at least 6.5 to 1 against the dark berth.
   Manifest's brown and the deeper ambers need it; the light colours pass unchanged. */
function rgb(hex){var n=parseInt(hex.slice(1),16);return [n>>16&255,n>>8&255,n&255];}
function lum(c){var v=c.map(function(x){x/=255;return x<=.03928?x/12.92:Math.pow((x+.055)/1.055,2.4);});return .2126*v[0]+.7152*v[1]+.0722*v[2];}
var SLIPL=lum(rgb(SLIP)),LAMP={};
function lampCol(a){
 if(LAMP[a])return LAMP[a];
 var c=rgb(A[a].spot),t=0,o=c;
 while(t<1&&(lum(o)+.05)/(SLIPL+.05)<6.5){t+=.04;o=c.map(function(x){return Math.round(x+(255-x)*t);});}
 return LAMP[a]='#'+o.map(function(x){return ('0'+x.toString(16)).slice(-2);}).join('');}

function mount(root){
var aid=root.getAttribute('data-agent')||null,base=root.getAttribute('data-base')||'',useHash=root.getAttribute('data-hash')==='1';
if(aid&&!A[aid])aid=null;
var id0='cm'+(++uid),crew=base+'fleet/crew/';

root.innerHTML='<div class="cmx'+(aid?' compact':'')+'">'+
 '<div class="cm-hero">'+
  '<div class="cm-hh"><p class="cm-lede"></p></div>'+
  '<div class="cm-hl">'+
   '<div class="cm-view cm-seg" role="group" aria-label="View"><button type="button" data-full="0" aria-pressed="true">Today</button><button type="button" data-full="1" aria-pressed="false">Full fleet</button></div>'+
   '<div class="cm-wheelbox"><svg class="cm-wheel" viewBox="0 0 700 700" role="group" aria-label="NIST CSF 2.0 wheel"></svg></div>'+
   '<div class="cm-key"></div>'+
  '</div>'+
  '<div class="cm-hr">'+(aid?'':'<div class="cm-pick" role="group" aria-label="Agents"></div><div class="cm-acard" hidden></div>')+'<div class="cm-unl"></div></div>'+
 '</div>'+
 '<div class="cm-harb">'+
  '<div class="cm-harbhead"><button type="button" class="cm-fpill" hidden></button>'+
   '<div class="cm-hctl"><div class="cm-seg cm-rview" role="group" aria-label="Chart or report"><button type="button" data-rep="0" aria-pressed="true">Chart</button><button type="button" data-rep="1" aria-pressed="false">Report</button></div></div></div>'+
  '<div class="cm"><div class="cm-chartview"><div class="cm-panel"></div></div><div class="cm-rpt"></div>'+
   '<p class="cm-src">Categories and wording from <a href="'+M.source+'">NIST CSWP 29</a>.</p></div>'+
 '</div></div>';
var X=root.querySelector('.cmx'),$=function(s){return root.querySelector(s);};

function avatarImg(k,cls){return '<img'+(cls?' class="'+cls+'"':'')+' src="'+crew+k+'.png" alt="" style="--c:'+A[k].spot+'">';}
function avatar(id){return '<span class="cm-av" style="--c:'+A[id].spot+'"><img src="'+crew+id+'.png" alt=""></span>';}

/* ---------- model: every skill once, with its real rank (r0) and the Full fleet rank ---------- */
var ALL={};
order.forEach(function(a){A[a].skills.forEach(function(s){
 ALL[a+':'+s.id]={key:a+':'+s.id,agent:a,id:s.id,name:s.n,r0:s.r,r:s.r,csf:s.csf,t:s.t,
  req:(s.req||[]).map(function(q){return q.indexOf(':')>0?q:a+':'+q;})};});});
var cats={},FN=[],fnById={};
M.functions.forEach(function(f){
 var o={id:f.id,name:f.name,description:f.description,cats:f.categories,e0:{},pos:{},cap:0};FN.push(o);fnById[f.id]=o;
 f.categories.forEach(function(id){var m=M.categories[id];
  cats[id]={id:id,fn:f.id,short:m.short,description:m.description,outOfScope:m.outOfScope,note:m.note,skills:[],e0:{},pos:{},cap:0};});});
var TOT={e0:{},pos:{},cap:0};
Object.keys(ALL).forEach(function(k){var x=ALL[k],c=cats[x.csf];if(!c){if(window.console)console.warn('csf-map: unknown category',x.csf,k);return;}
 c.skills.push(x);var f=fnById[c.fn];
 [c,f,TOT].forEach(function(g){g.e0[x.agent]=(g.e0[x.agent]||0)+x.r0;g.pos[x.agent]=(g.pos[x.agent]||0)+MAXR;g.cap+=MAXR;});});
var NSK=Object.keys(ALL).length,E0=0;Object.keys(TOT.e0).forEach(function(k){E0+=TOT.e0[k];});
function tally(l){var w=0,p=0,t=0;l.forEach(function(k){if(k.r>0)w++;p+=k.r;if(k.r>t)t=k.r;});return {n:l.length,working:w,points:p,max:MAXR*l.length,top:t};}
function agTally(a){return tally(Object.keys(ALL).map(function(k){return ALL[k];}).filter(function(x){return x.agent===a;}));}

/* ---------- state ---------- */
var st={agent:aid,seg:null,full:false,rep:false};
var mix=0,anim=0,open={};
function applyView(){Object.keys(ALL).forEach(function(k){var x=ALL[k];x.r=st.full?MAXR:x.r0;});}
function fa(){return st.agent;}
function mineOf(c){var f=fa();return f?c.skills.filter(function(k){return k.agent===f;}):c.skills;}

/* ---------- the wheel ---------- */
var CX=350,CY=350;
function rad(d){return d*Math.PI/180;}
function pt(r,a){return [CX+r*Math.cos(a),CY+r*Math.sin(a)];}
function sector(r1,r2,a1,a2){var p1=pt(r2,a1),p2=pt(r2,a2),p3=pt(r1,a2),p4=pt(r1,a1),big=(a2-a1)>Math.PI?1:0;
 return 'M'+p1+'A'+r2+' '+r2+' 0 '+big+' 1 '+p2+'L'+p3+'A'+r1+' '+r1+' 0 '+big+' 0 '+p4+'Z';}
var svg=$('.cm-wheel');
var defs=el('defs',{},svg);
var HATCH=id0+'-hatch';
var pat=el('pattern',{id:HATCH,width:6,height:6,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},defs);
el('rect',{width:6,height:6,fill:'#fff'},pat);el('line',{x1:0,y1:0,x2:0,y2:6,stroke:'rgba(10,35,66,.28)','stroke-width':2},pat);
var style=document.createElement('style');style.textContent='#'+id0+' .cm-seg-g.oos .trk{fill:url(#'+HATCH+')}';X.parentNode.insertBefore(style,X);X.id=id0;
var segG={},stackG={},bandG={},fnT={};
var GOV={r1:78,r2:128,lab:113,band:[131,137],dot:90};
var OUT={r1:164,r2:256,lab:236,band:[290,297],dot:273};
function segment(c,a1,a2,Rr){
 var g=el('g',{class:'cm-seg-g',tabindex:0,role:'button','data-id':c.id},svg);
 el('path',{class:'trk',d:sector(Rr.r1,Rr.r2,a1,a2)},g);
 stackG[c.id]=el('g',{class:'stk'},g);
 var mid=(a1+a2)/2,lp=pt(Rr.lab,mid);
 el('text',{x:lp[0],y:lp[1]},g,c.id.split('.')[1]);
 c.a1=a1;c.a2=a2;c.R=Rr;c.mid=mid;c.dots=el('g',{},g);
 g.addEventListener('click',function(){pickSeg(c.id);});
 g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pickSeg(c.id);}});
 segG[c.id]=g;}
var gv=FN[0],gn=gv.cats.length,ggap=1.6,gsa=(360-gn*ggap)/gn;
gv.cats.forEach(function(id,i){var a1=rad(-90+ggap/2+i*(gsa+ggap));segment(cats[id],a1,a1+rad(gsa),GOV);});
gv.a1=rad(-90);gv.a2=rad(269.6);gv.R=GOV;
var fgap=6,igap=1.4,nOut=0;FN.slice(1).forEach(function(f){nOut+=f.cats.length;});
var osa=(360-5*fgap-(nOut-5)*igap)/nOut,ang=-90+fgap/2;
FN.slice(1).forEach(function(f){var start=ang;
 f.cats.forEach(function(id,i){segment(cats[id],rad(ang),rad(ang+osa),OUT);ang+=osa+(i<f.cats.length-1?igap:0);});
 f.a1=rad(start);f.a2=rad(ang);f.R=OUT;ang+=fgap;});
FN.forEach(function(f,i){
 var b=bandG[f.id]=el('g',{class:'cm-band'},svg);var Rr=f.R;
 el('path',{class:'t',d:sector(Rr.band[0],Rr.band[1],f.a1,f.a2)},b);
 b.stk=el('g',{},b);
 var la1=f.a1,la2=f.a2;if(i===0){la1=rad(-90-35);la2=rad(-90+35);}
 var mid=(la1+la2)/2,low=Math.sin(mid)>0,rr=i===0?142:(low?334:316);
 var p0=pt(rr,la1),p1=pt(rr,la2),pid=id0+'-fa-'+f.id;
 el('path',{id:pid,d:low?'M'+p1+'A'+rr+' '+rr+' 0 0 0 '+p0:'M'+p0+'A'+rr+' '+rr+' 0 0 1 '+p1,fill:'none',stroke:'none'},defs);
 var t=el('text',{class:'cm-fnname','data-fn':f.id},svg);
 el('textPath',{href:'#'+pid,startOffset:'50%'},t,f.name);
 t.addEventListener('click',function(){openQuay(f.id);});fnT[f.id]=t;});
var hub=el('g',{class:'cm-hub'},svg);
el('circle',{class:'cm-hubdisc',cx:CX,cy:CY,r:58},hub);
el('path',{d:sector(62,70,rad(-90),rad(269.6)),fill:'#ECE8E0'},hub);
var hubStk=el('g',{},hub);
var hubN=el('text',{class:'n',x:CX,y:CY-20},hub,'');
var hubOf=el('text',{class:'s',x:CX,y:CY+13},hub,'');
el('text',{class:'s',x:CX,y:CY+36},hub,'points');

function at(e0,pos,m){var o={};for(var k in pos)o[k]=(e0[k]||0)+(pos[k]-(e0[k]||0))*m;return o;}
function fillOf(k,focus){var on=!focus||focus===k;return on?[A[k].spot,A[k].spot,.26]:[GREY,'#EEF1F5',1];}
function stackedAng(g,per,pos,r1,r2,a1,a2,total,focus){
 g.innerHTML='';var cum=0,span=a2-a1;
 order.forEach(function(k){var cap=pos[k]||0;if(!cap)return;var v=per[k]||0,f=fillOf(k,focus);
  var s0=a1+span*cum/total,s1=a1+span*(cum+v)/total,s2=a1+span*(cum+cap)/total;cum+=cap;
  if(cap-v>.01)el('path',{d:sector(r1,r2,s1,s2),fill:f[1],'fill-opacity':f[2]},g);
  if(v>.01)el('path',{class:'f',d:sector(r1,r2,s0,s1),fill:f[0]},g);});}
function stackedRad(g,per,pos,Rr,a1,a2,total,focus){
 g.innerHTML='';var cum=0,th=Rr.r2-Rr.r1;
 order.forEach(function(k){var cap=pos[k]||0;if(!cap)return;var v=per[k]||0,f=fillOf(k,focus);
  var b0=Rr.r1+th*cum/total,b1=Rr.r1+th*(cum+v)/total,b2=Rr.r1+th*(cum+cap)/total;cum+=cap;
  if(cap-v>.01)el('path',{d:sector(b1,b2,a1,a2),fill:f[1],'fill-opacity':f[2]},g);
  if(v>.01)el('path',{d:sector(b0,b1,a1,a2),fill:f[0]},g);});}
function agTotals(a){var e0=0,mx=0;Object.keys(ALL).forEach(function(k){var x=ALL[k];if(x.agent===a){e0+=x.r0;mx+=MAXR;}});return {e0:e0,max:mx};}
/* the fills follow `mix`, so switching animates the whole wheel */
function drawFills(){
 var A0=st.agent,m=mix;
 Object.keys(cats).forEach(function(id){var c=cats[id];
  if(c.skills.length)stackedRad(stackG[id],at(c.e0,c.pos,m),c.pos,c.R,c.a1,c.a2,c.cap,A0);});
 FN.forEach(function(f){stackedAng(bandG[f.id].stk,at(f.e0,f.pos,m),f.pos,f.R.band[0],f.R.band[1],f.a1,f.a2,f.cap,A0);});
 stackedAng(hubStk,at(TOT.e0,TOT.pos,m),TOT.pos,62,70,rad(-90),rad(269.6),TOT.cap,A0);
 var nm,mx,col='';
 if(A0){var T=agTotals(A0);nm=Math.round(T.e0+(T.max-T.e0)*m);mx=T.max;col=A[A0].spot;}
 else{nm=Math.round(E0+(TOT.cap-E0)*m);mx=TOT.cap;}
 hubN.textContent=nm;hubN.style.fill=col;hubOf.textContent='of '+mx;}
function drawState(){
 var A0=st.agent;
 Object.keys(cats).forEach(function(id){var c=cats[id],g=segG[id],cl='cm-seg-g';
  var touched=c.skills.some(function(s){return s.agent===A0;});
  if(c.outOfScope)cl+=' oos';else if(!c.skills.length)cl+=' empty';
  if(A0&&!touched)cl+=' dim';
  if(st.seg===id)cl+=' sel';else if(A0&&touched)cl+=' mine';
  g.setAttribute('class',cl);
  if(A0)g.style.setProperty('--mc',A[A0].spot);
  g.setAttribute('aria-pressed',st.seg===id?'true':'false');
  var T=tally(c.skills);
  g.setAttribute('aria-label',c.short+', '+(c.outOfScope?'out of scope':!c.skills.length?'no skill yet':T.points+' of '+T.max+' points'));
  c.dots.innerHTML='';
  if(mix<.001&&!st.full){
   var wait=order.filter(function(k){return c.skills.some(function(s){return s.agent===k;})&&!c.skills.some(function(s){return s.agent===k&&s.r>0;});});
   var step=22/c.R.dot,n=wait.length;
   wait.forEach(function(k,i){var p=pt(c.R.dot,c.mid+(i-(n-1)/2)*step);
    el('circle',{class:'cm-hollow',cx:p[0],cy:p[1],r:8,stroke:(A0&&A0!==k)?GREY:A[k].spot},c.dots);});}});
 drawFills();}

/* ---------- agent pick ---------- */
var pickEl=$('.cm-pick'),acard=$('.cm-acard'),fpill=$('.cm-fpill');
function renderPick(){
 if(!pickEl)return;
 pickEl.innerHTML='';
 var b=h('button','cm-chip all'+(st.agent?'':' on'),'<span class="cm-cn"><span>Whole fleet</span></span>');b.type='button';b.setAttribute('aria-pressed',st.agent?'false':'true');
 b.onclick=function(){pickAgent(null);};pickEl.appendChild(b);
 order.forEach(function(k){var T=agTally(k);
  var c=h('button','cm-chip'+(st.agent===k?' on':''),avatarImg(k)+'<span class="cm-cn"><span>'+esc(A[k].name)+'</span><small>'+(T.points?T.points+' of '+T.max:'Joining')+'</small></span>');
  c.type='button';c.setAttribute('aria-pressed',st.agent===k?'true':'false');c.dataset.agent=k;
  c.onclick=function(){pickAgent(st.agent===k?null:k);};pickEl.appendChild(c);});}
function renderCard(){
 if(aid)return;
 var a=st.agent;
 if(!a){acard.hidden=true;fpill.hidden=true;return;}
 var n=0,w=0,pts=0,fleet=0;
 Object.keys(ALL).forEach(function(k){fleet+=ALL[k].r;});
 Object.keys(cats).forEach(function(id){var l=cats[id].skills.filter(function(k){return k.agent===a;});if(!l.length)return;n++;if(l.some(function(k){return k.r>0;}))w++;l.forEach(function(k){pts+=k.r;});});
 var line=w?'Working in '+w+' of '+plural(n,'berth')+'. Brings '+pts+' of the fleet\'s '+fleet+' points.':'Joining soon with skills in '+plural(n,'berth')+'.';
 acard.style.setProperty('--c',A[a].spot);acard.hidden=false;
 acard.innerHTML=avatarImg(a)+'<div><b>'+esc(A[a].name)+'</b><p>'+esc(A[a].job)+'</p><p>'+line+'</p></div><button type="button" class="x" aria-label="Show the whole fleet">&times;</button>';
 acard.querySelector('.x').onclick=function(){pickAgent(null);};
 fpill.hidden=false;fpill.style.setProperty('--c',A[a].spot);fpill.innerHTML=avatarImg(a)+esc(A[a].name)+'<span aria-hidden="true">&times;</span>';
 fpill.setAttribute('aria-label','Show the whole fleet');fpill.onclick=function(){pickAgent(null);};}

/* ---------- next unlocks, from the real req graph ---------- */
var unlEl=$('.cm-unl');
function catWorking(c){return c.skills.filter(function(s){return s.r>0;}).length;}
function agWorking(a){return Object.keys(ALL).some(function(k){return ALL[k].agent===a&&ALL[k].r>0;});}
function unlocks(agent){
 var ready=Object.keys(ALL).map(function(k){return ALL[k];}).filter(function(x){return x.r===0&&x.req.every(function(q){return ALL[q]&&ALL[q].r>0;});});
 ready.forEach(function(x){
  x.opens=catWorking(cats[x.csf])===0;x.brings=!agWorking(x.agent);
  x.frees=Object.keys(ALL).map(function(k){return ALL[k];}).filter(function(y){return y.r===0&&y.key!==x.key&&y.req.indexOf(x.key)>=0&&y.req.every(function(q){return q===x.key||ALL[q].r>0;});});
  x.score=(x.opens?5:0)+(x.brings?2:0)+x.frees.length*2-x.t*.5;});
 var L=ready.filter(function(x){return !agent||x.agent===agent||x.frees.some(function(y){return y.agent===agent;});});
 L.sort(function(a,b){var sa=a.score+(agent&&a.agent===agent?3:0),sb=b.score+(agent&&b.agent===agent?3:0);
  return sb-sa||a.t-b.t||order.indexOf(a.agent)-order.indexOf(b.agent);});
 return L.slice(0,4);}
function renderUnl(){
 var a=st.agent;unlEl.innerHTML='<h3>Next unlocks</h3>';
 if(st.full){
  unlEl.innerHTML='<h3>Working together</h3>';
  var pr={};Object.keys(ALL).forEach(function(k){var x=ALL[k];x.req.forEach(function(q){var o=ALL[q];if(!o||o.agent===x.agent)return;var key=x.agent+'>'+o.agent;pr[key]=(pr[key]||0)+1;});});
  var rows=Object.keys(pr).map(function(k){var p=k.split('>');return {a:p[0],b:p[1],n:pr[k]};}).filter(function(r){return !a||r.a===a||r.b===a;});
  rows.sort(function(x,y){return y.n-x.n||order.indexOf(x.a)-order.indexOf(y.a);});
  if(!rows.length){unlEl.appendChild(h('p','none',esc(a?A[a].name:'Every agent')+' works on its own.'));return;}
  var ul2=h('div','cm-ulist dep');
  rows.slice(0,aid?3:5).forEach(function(r){
   ul2.appendChild(h('div','cm-urow dep','<span class="pair">'+avatarImg(r.a)+avatarImg(r.b)+'</span><b>'+esc(A[r.a].name)+' relies on '+esc(A[r.b].name)+'</b><span class="a">'+plural(r.n,'skill')+' build on '+esc(A[r.b].name)+'\'s work</span>'));});
  unlEl.appendChild(ul2);return;}
 var L=unlocks(a);
 if(!L.length){unlEl.appendChild(h('p','none','Nothing new is ready for '+esc(a?A[a].name:'the fleet')+' yet.'));return;}
 var ul=h('div','cm-ulist');
 L.forEach(function(x){var c=cats[x.csf],ph=[];
  if(x.opens)ph.push('Opens '+esc(c.short));
  if(x.brings)ph.push('Brings '+esc(A[x.agent].name)+' in');
  var fr=x.frees;
  if(fr.length){
   if(a&&x.agent!==a){var mine=fr.filter(function(y){return y.agent===a;}).map(function(y){return esc(y.name);});ph.push('Frees '+(mine.length<3?list(mine):mine.length+' skills')+' for '+esc(A[a].name));}
   else ph.push('Frees '+fr.length+(fr.length===1?' more skill':' more skills'));}
  var b=h('button','cm-urow'+(st.seg===x.csf?' on':''),avatarImg(x.agent)+'<b>'+esc(x.name)+'</b><span class="p">+1 point</span><span class="a">'+esc(A[x.agent].name)+' &middot; '+esc(c.short)+'</span>'+(ph.length?'<span class="g">'+ph.join(' &middot; ')+'</span>':''));
  b.type='button';b.dataset.seg=x.csf;
  b.onclick=function(){select(x.csf,true);};
  ul.appendChild(b);});
 unlEl.appendChild(ul);}

/* ---------- headline, view switch, legend ---------- */
var ledeEl=$('.cm-lede'),hero=$('.cm-hero'),cm=$('.cm');
function renderLede(){
 var pts=0,cap=TOT.cap,n=NSK,who='by '+order.length+' agents across '+NSK+' skills';
 if(st.agent){var T=agTotals(st.agent);cap=T.max;n=cap/MAXR;who='across '+n+' '+A[st.agent].name+' skills';
  Object.keys(ALL).forEach(function(k){if(ALL[k].agent===st.agent)pts+=ALL[k].r;});}
 else Object.keys(ALL).forEach(function(k){pts+=ALL[k].r;});
 ledeEl.innerHTML=st.full?'<b>'+pts+' of '+cap+' points</b> if every skill reaches World class.':'<b>'+pts+' of '+cap+' points</b> earned '+who+'.';
 hero.classList.toggle('full',st.full);cm.classList.toggle('full',st.full);
 [].forEach.call(root.querySelectorAll('.cm-view button'),function(b){b.setAttribute('aria-pressed',String((b.dataset.full==='1')===st.full));});}
(function(){
 var L=$('.cm-key');
 function sw(inner){return '<svg width="26" height="18" viewBox="0 0 26 18" aria-hidden="true">'+inner+'</svg>';}
 var s0=sw('<rect x="1.5" y="3" width="11" height="12" fill="#E0892B"/><rect x="12.5" y="3" width="12" height="12" fill="#E0892B" fill-opacity=".26"/>');
 var s1=sw('<circle cx="13" cy="9" r="6" fill="#fff" stroke="#E0892B" stroke-width="3"/>');
 var s2=sw('<rect x="1.5" y="1.5" width="23" height="15" rx="3" fill="#fff" stroke="rgba(10,35,66,.5)" stroke-width="1.5" stroke-dasharray="4 3"/>');
 var s3=sw('<defs><pattern id="'+id0+'-hp" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#fff"/><line x1="0" y1="0" x2="0" y2="6" stroke="rgba(10,35,66,.35)" stroke-width="2"/></pattern></defs><rect x="1.5" y="1.5" width="23" height="15" rx="3" fill="url(#'+id0+'-hp)" stroke="rgba(10,35,66,.4)" stroke-width="1.5"/>');
 L.innerHTML='<span class="k">'+s0+'Earned and still to earn</span><span class="k lg-soon">'+s1+'Skills coming soon</span><span class="k">'+s2+'No skill yet</span><span class="k">'+s3+'Out of scope</span>';})();

/* ---------- the harbour ---------- */
var panel=$('.cm-panel'),rpt=$('.cm-rpt');
var sheet=document.createElement('aside');sheet.className='cm-sheet';sheet.hidden=true;sheet.setAttribute('role','dialog');sheet.setAttribute('aria-live','polite');document.body.appendChild(sheet);
function lamp(r,col,size){
 size=size||20;
 var c=10,R=7.5,s='<svg class="lamp" width="'+size+'" height="'+size+'" viewBox="0 0 20 20" aria-hidden="true">';
 if(r<1)return s+'<circle cx="10" cy="10" r="'+R+'" fill="rgba(10,29,56,.6)" stroke="#8FA6C6" stroke-opacity=".8" stroke-width="1.3" stroke-dasharray="2.2 2.2"/></svg>';
 if(r>=3)s+='<circle cx="10" cy="10" r="'+(r>=4?11:10)+'" fill="'+col+'" fill-opacity="'+(r>=4?.34:.24)+'"/>';
 if(r>=4){for(var k=0;k<4;k++){var a=k*Math.PI/2+Math.PI/4;s+='<line x1="'+(c+Math.cos(a)*8.5).toFixed(1)+'" y1="'+(c+Math.sin(a)*8.5).toFixed(1)+'" x2="'+(c+Math.cos(a)*12)+'" y2="'+(c+Math.sin(a)*12)+'" stroke="'+col+'" stroke-width="1.3"/>';}}
 s+='<circle cx="10" cy="10" r="'+R+'" fill="#0A1D38" stroke="'+col+'" stroke-width="1.6"/>';
 if(r>=4)s+='<circle cx="10" cy="10" r="'+R+'" fill="'+col+'"/><circle cx="10" cy="10" r="2.4" fill="#0A1D38" fill-opacity=".85"/>';
 else{var ex=[c+R,c,c-R][r-1],ey=[c,c+R,c][r-1],large=r===3?1:0;
  s+='<path d="M10 10 L10 '+(c-R)+' A'+R+' '+R+' 0 '+large+' 1 '+ex+' '+ey+' Z" fill="'+col+'"/>';}
 return s+'</svg>';}
function blockers(s){return s.req.filter(function(q){return ALL[q]&&ALL[q].r<1;});}
function weight(n){return 1+.5*Math.min(1,n/20);}
var ROWS=(function(){var rows=[],cur=null;
 FN.forEach(function(f){var n=f.cats.length;
  if(n>=6){cur=null;rows.push([f]);return;}
  if(cur&&cur.used+n<=8){cur.list.push(f);cur.used+=n;}else{cur={list:[f],used:n};rows.push(cur.list);}});
 return rows;})();

function berthHtml(c){
 var id=c.id,l=mineOf(c),own=l.length>0,f=fa(),T=tally(l),col=f?lampCol(f):GOLD;
 var nobody=!c.skills.length;
 var cls='cm-b'+(c.outOfScope?' oos':(nobody?' none':(T.working?' on':' off')))+((f&&!own)?' dim':'')+(st.seg===id?' sel':'')+(c.skills.length>9?' wide':'');
 var count;
 if(c.outOfScope)count='';
 else if(nobody)count=esc(c.note||'No skill covers this yet.');
 else if(f&&!own)count='';
 else count=T.working?T.working+' of '+T.n+' working':plural(T.n,'skill');
 var aria=c.short+' '+id+(c.outOfScope?', out of scope':(nobody?', no skill yet':', '+T.working+' of '+T.n+' skills working'));
 var p=T.max?T.points/T.max:0;
 var hh='<button type="button" class="'+cls+'" data-id="'+id+'" aria-label="'+esc(aria)+'" style="--p:'+p.toFixed(3)+';--g:'+col+'">';
 hh+='<span class="cm-bt"><span class="cm-bn">'+esc(c.short)+'</span> <span class="cm-bc">'+id+'</span></span>';
 if(c.outOfScope)hh+='<span class="cm-fogtxt">Out of scope</span>';
 else{
  var lamps='';
  if(own)l.slice().sort(function(a,b){return b.r-a.r||order.indexOf(a.agent)-order.indexOf(b.agent);}).forEach(function(k){lamps+=lamp(k.r,lampCol(k.agent));});
  if(f)c.skills.filter(function(k){return k.agent!==f;}).forEach(function(k){lamps+='<span class="cm-fade">'+lamp(k.r,lampCol(k.agent))+'</span>';});
  hh+='<span class="cm-bl">'+lamps+'</span><span class="cm-bs">'+count+'</span>';
  if(T.n&&own)hh+='<span class="cm-bar"><i style="width:'+(p*100).toFixed(1)+'%"></i></span>';}
 return hh+'</button>';}
function quayHtml(f){
 var fcats=f.cats.map(function(id){return cats[id];});
 var all=[];fcats.forEach(function(c){all=all.concat(mineOf(c));});
 var T=tally(all),fo=fa();
 var hasMine=all.length>0,isOpen=open[f.id];
 if(isOpen===undefined)isOpen=wide.matches?(fo?hasMine:true):false;
 var ord=fcats.slice();
 if(fo)ord.sort(function(a,b){return (mineOf(b).length>0)-(mineOf(a).length>0);});
 var wsum=0,cols=ord.map(function(c){var w=weight(c.skills.length);wsum+=w;return w.toFixed(2)+'fr';}).join(' ');
 var pips='';ord.forEach(function(c){if(c.outOfScope||!c.skills.length)return;pips+='<i class="'+(mineOf(c).some(function(k){return k.r>0;})?'on':'')+'"></i>';});
 var sub=!hasMine?(fo?'':'Coming soon'):(T.working?T.working+' of '+T.n+' working':'Coming soon');
 return '<div class="cm-q'+(isOpen?' open':'')+((fo&&!hasMine)?' idle':'')+'" data-fn="'+f.id+'" style="--w:'+wsum.toFixed(2)+'">'+
  '<button type="button" class="cm-qh" aria-expanded="'+isOpen+'"><span class="cm-qn">'+esc(f.name)+'</span><span class="cm-pips" aria-hidden="true">'+pips+'</span><span class="cm-qs">'+sub+'</span><span class="cm-chev" aria-hidden="true"></span>'+
  '<span class="cm-qbar"><i style="width:'+(T.max?(T.points/T.max*100).toFixed(1):0)+'%;background:'+(fo?lampCol(fo):GOLD)+'"></i></span></button>'+
  '<div class="cm-qb"><div class="cm-wall"></div><div class="cm-grid" style="--cols:'+cols+'">'+ord.map(berthHtml).join('')+'</div></div></div>';}
function drawHarbour(){
 var hh='<div class="cm-quays">';
 ROWS.forEach(function(r){hh+='<div class="cm-row">'+r.map(quayHtml).join('')+'</div>';});
 hh+='</div><div class="cm-legend">'+MAT.map(function(m,i){return '<span class="cm-k">'+lamp(i,fa()?lampCol(fa()):GOLD,22)+'<span>'+m+(i?' <small>'+plural(i,'point')+'</small>':'')+'</span></span>';}).join('')+'</div>';
 panel.innerHTML=hh;}

/* the berth sheet: the same one from the wheel, the berths and the unlocks */
function drawSheet(){
 var id=st.seg;if(!id){sheet.hidden=true;return;}
 var c=cats[id];
 var hh='<button type="button" class="cm-x" aria-label="Close">&times;</button><h2>'+esc(c.short)+' <span>'+id+'</span></h2><p class="cm-desc">'+esc(c.description)+'.</p>';
 if(c.outOfScope||!c.skills.length)hh+='<p class="cm-none">'+esc(c.note)+'</p>';
 else{
  var ord=order.slice();if(fa())ord.sort(function(x,y){return (y===fa())-(x===fa());});
  ord.forEach(function(a){
   var ks=c.skills.filter(function(k){return k.agent===a;});if(!ks.length)return;
   ks=ks.slice().sort(function(x,y){return y.r-x.r;});
   hh+='<div class="cm-ag"><h3>'+avatar(a)+esc(A[a].name)+'</h3><ul class="cm-sk">';
   ks.forEach(function(k){var note='';
    if(k.r<1){var b=blockers(k);note=b.length===0?'Next in line':(b.length===1?'After '+ALL[b[0]].name:'After '+b.length+' skills');}
    hh+='<li><span class="lw">'+lamp(k.r,lampCol(a),24)+'</span><span class="n"><a href="'+base+a+'/skills.html#'+k.id+'">'+esc(k.name)+'</a>'+(note?'<small>'+esc(note)+'</small>':'')+'</span><span class="m">'+MAT[k.r]+'</span></li>';});
   hh+='</ul></div>';});}
 var keep=sheet.hidden;
 sheet.innerHTML=hh;sheet.hidden=false;if(keep||sheet.dataset.id!==id)sheet.scrollTop=0;sheet.dataset.id=id;}

/* ---------- report ---------- */
function agentsOf(c){return order.filter(function(a){return c.skills.some(function(k){return k.agent===a;});});}
function dots(c){return agentsOf(c).map(function(a){return '<span class="cm-dot" style="--c:'+A[a].spot+'" title="'+esc(A[a].name)+'"><img src="'+crew+a+'.png" alt=""></span>';}).join('');}
function buildReport(){
 var all=Object.keys(ALL).map(function(k){return ALL[k];}).filter(function(x){return !aid||x.agent===aid;}),TT=tally(all);
 var hh='<table class="cm-t"><thead><tr><th>Category</th><th>Skills</th><th>Working</th><th>Furthest along</th><th>Agents</th></tr></thead>';
 FN.forEach(function(f){
  var T=tally(f.cats.reduce(function(a,id){return a.concat(mineOf(cats[id]));},[]));
  hh+='<tbody><tr class="cm-fnrow"><td colspan="5"><b>'+esc(f.name)+'</b>'+(T.n?'<em>'+T.working+' of '+T.n+' working</em>':'')+'<small>'+esc(f.description)+'</small></td></tr>';
  f.cats.forEach(function(id){
   var c=cats[id],mine=mineOf(c),t=tally(mine),none=!mine.length,dead=!c.skills.length;
   hh+='<tr class="cm-crow'+(dead?' none':'')+'" data-id="'+id+'"'+(dead?'':' tabindex="0" role="button"')+'><td class="nm"><span class="n">'+esc(c.short)+'</span> <span class="code">'+id+'</span></td>';
   if(!none)hh+='<td class="num c-sk">'+t.n+'</td><td class="num wk">'+t.working+' of '+t.n+'</td><td class="fw">'+MAT[t.top]+'</td><td class="ag">'+dots({skills:mine})+'<span class="names">'+esc(agentsOf({skills:mine}).map(function(a){return A[a].name;}).join(' '))+'</span></td>';
   else hh+='<td class="num c-sk">0</td><td class="num wk">0</td><td class="fw">'+(c.outOfScope?'Out of scope':(dead||!aid?'No skill yet':''))+'</td><td class="ag"></td>';
   hh+='</tr>';});
  hh+='</tbody>';});
 hh+='<tfoot><tr><td class="nm">All '+Object.keys(cats).length+' categories</td><td class="num c-sk">'+TT.n+'</td><td class="num wk">'+TT.working+' of '+TT.n+'</td><td class="fw">'+MAT[TT.top]+'</td><td class="ag"></td></tr></tfoot></table>';
 rpt.innerHTML=hh;}
rpt.addEventListener('click',function(e){var r=e.target.closest('.cm-crow');if(r&&!r.classList.contains('none'))select(r.dataset.id,false);});
rpt.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var r=e.target.closest('.cm-crow');if(r&&!r.classList.contains('none')){e.preventDefault();select(r.dataset.id,false);}});

/* ---------- one shared selection ---------- */
function syncHash(){
 if(!useHash)return;
 var t=[];if(st.full)t.push('full');if(st.rep)t.push('report');if(st.seg)t.push(st.seg);if(st.agent)t.push('ship='+st.agent);
 var nh=t.length?'#'+t.join('&'):'';
 if(location.hash!==nh)history.replaceState(null,'',location.pathname+location.search+nh);}
function render(){
 applyView();buildReport();
 drawState();renderLede();renderPick();renderCard();renderUnl();drawHarbour();drawSheet();
 cm.classList.toggle('rep',st.rep);
 [].forEach.call(root.querySelectorAll('.cm-rview button'),function(b){b.setAttribute('aria-pressed',String((b.dataset.rep==='1')===st.rep));});
 syncHash();}
function scrollTo(node,how){if(!node)return;node.scrollIntoView({block:how||'start',behavior:reduce?'auto':'smooth'});}
function pickAgent(k){if(aid)return;st.agent=k;st.seg=null;open={};render();}
function select(id,scroll){
 st.seg=id;open[cats[id].fn]=true;
 if(st.rep){st.rep=false;}
 render();
 if(scroll||!wide.matches){var b=panel.querySelector('.cm-b[data-id="'+id+'"]');scrollTo(b,'start');}}
function toggle(id,scroll){if(st.seg===id){closeSheet();return;}select(id,scroll);}
function pickSeg(id){toggle(id,true);}
function openQuay(fid){
 open[fid]=true;st.rep=false;render();scrollTo(panel.querySelector('.cm-q[data-fn="'+fid+'"]'),'start');}
function closeSheet(){st.seg=null;render();}
function setFull(v,instant){
 if(v===st.full)return;
 st.full=v;
 var target=v?1:0;
 cancelAnimationFrame(anim);
 render();
 if(reduce||instant){mix=target;drawFills();drawState();return;}
 var from=mix,t0=null,dur=900;
 function step(ts){if(t0===null)t0=ts;var p=Math.min(1,(ts-t0)/dur),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
  mix=from+(target-from)*e;drawFills();
  if(p<1)anim=requestAnimationFrame(step);else{mix=target;drawState();}}
 anim=requestAnimationFrame(step);}

/* ---------- events ---------- */
panel.addEventListener('click',function(e){
 var q=e.target.closest('.cm-qh');
 if(q){var sec=q.closest('.cm-q'),id=sec.dataset.fn,now=!sec.classList.contains('open');open[id]=now;sec.classList.toggle('open',now);q.setAttribute('aria-expanded',now);return;}
 var b=e.target.closest('.cm-b');
 if(b)toggle(b.dataset.id,false);});
sheet.addEventListener('click',function(e){if(e.target.closest('.cm-x'))closeSheet();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sheet.hidden)closeSheet();});
$('.cm-view').addEventListener('click',function(e){var b=e.target.closest('button');if(b)setFull(b.dataset.full==='1');});
$('.cm-rview').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.rep=b.dataset.rep==='1';if(st.rep)st.seg=null;render();});
if(wide.addEventListener)wide.addEventListener('change',function(){drawHarbour();});

/* ---------- start ---------- */
(function(){
 var hash=useHash?decodeURIComponent(location.hash.slice(1)):'';
 hash.split('&').forEach(function(t){var m;
  if(t==='full'){st.full=true;mix=1;}
  else if(t==='report')st.rep=true;
  else if(!aid&&(m=/^ship=(\w+)/.exec(t))&&A[m[1]])st.agent=m[1];
  else if(cats[t]){st.seg=t;open[cats[t].fn]=true;}});
 render();})();
root.__csf={st:st,cats:cats,setFull:setFull,pickAgent:pickAgent,select:select,mixv:function(){return mix;}};
window.__csf=root.__csf;
}

function run(){document.querySelectorAll('[data-csfmap]').forEach(mount);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
