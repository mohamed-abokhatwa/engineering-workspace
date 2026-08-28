
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>8),{passive:true});
const mb=document.getElementById('menubtn');
if(mb){const close=()=>{nav.classList.remove('open');mb.setAttribute('aria-expanded','false');document.body.style.overflow=''};
mb.addEventListener('click',()=>{const o=nav.classList.toggle('open');
mb.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
document.querySelectorAll('.mmenu a').forEach(a=>a.addEventListener('click',close));
/* the ways out a reader expects: Escape, and the empty space around the list */
addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))close()});
const mm=document.getElementById('mmenu');
if(mm)mm.addEventListener('click',e=>{if(e.target===mm)close()});
addEventListener('resize',()=>{if(innerWidth>820)close()});}
const yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);
const el=e.target,end=parseInt(el.dataset.count,10),t0=performance.now(),dur=1300;
const fmt=n=>n.toLocaleString('en-US');
const tick=t=>{const p=Math.min(1,(t-t0)/dur),ease=1-Math.pow(1-p,3);
el.textContent=fmt(Math.round(end*ease));if(p<1)requestAnimationFrame(tick)};
requestAnimationFrame(tick)}),{threshold:.4});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));
document.querySelectorAll('.yt[data-yt]').forEach(box=>{
  const id=box.dataset.yt;
  const q=box.classList.contains('wide')?'maxresdefault':'hqdefault';
  box.style.backgroundImage=`url('https://i.ytimg.com/vi/${id}/${q}.jpg')`;
  box.addEventListener('click',()=>{
    if(box.querySelector('iframe'))return;
    const f=document.createElement('iframe');
    f.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen=true;
    box.textContent='';box.appendChild(f);
  },{once:false});
});
document.querySelectorAll('.tabbtn').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabbtn').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.tabpanel').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  document.getElementById('tp-'+b.dataset.t).classList.add('on');
}));
const tf=document.getElementById('trialForm');
if(tf){const API='https://app.engspace.app/api/public/trial-request';
const post=b=>fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
tf.addEventListener('submit',async ev=>{ev.preventDefault();
const $=id=>document.getElementById(id);const err=$('f-err'),ok=$('f-ok'),btn=$('f-btn');
err.style.display='none';err.textContent='';
const name=$('f-name').value.trim(),email=$('f-email').value.trim();
if(name.length<2){err.textContent='Please give your name.';err.style.display='block';return}
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){err.textContent='That email address does not look right.';err.style.display='block';return}
const planEl=$('f-plan');const plan=planEl?planEl.value:'trial';
const body={name,email,company:$('f-company').value.trim(),role_title:$('f-role').value.trim(),
message:$('f-msg').value.trim(),plan:plan,website:$('f-web').value};
btn.disabled=true;btn.textContent='Sending…';
try{let r;
try{r=await post(body)}
catch(_e){await new Promise(res=>setTimeout(res,1600));r=await post(body)}
if(!r.ok)throw new Error((await r.json().catch(()=>({}))).detail||'The request could not be sent.');
tf.querySelectorAll('input,textarea,select,button').forEach(x=>x.disabled=true);
ok.style.display='block';btn.textContent='Requested ✓';
}catch(e){
const mail='mailto:support@engspace.app?subject='+encodeURIComponent('Trial request — '+name)
+'&body='+encodeURIComponent('Name: '+name+'\nEmail: '+email+'\nCompany: '+body.company
+'\nRole: '+body.role_title+'\n\n'+body.message);
err.innerHTML=(e.message||'Could not reach the server right now.')
+' Nothing typed was lost — <a href="'+mail+'" style="color:inherit;text-decoration:underline;font-weight:600">send the same request by e-mail</a> and it reaches us at support@engspace.app.';
err.style.display='block';btn.disabled=false;btn.textContent=labelFor(plan)}});
const labelFor=v=>v==='personal'?'Ask for the personal plan':v==='company'?'Ask about a company licence':'Request my free 15-day trial';
const syncBtn=()=>{const pe=document.getElementById('f-plan'),b=document.getElementById('f-btn');
if(pe&&b&&b.textContent.indexOf('✓')<0&&!b.disabled)b.textContent=labelFor(pe.value)};
const pe0=document.getElementById('f-plan');
if(pe0){pe0.addEventListener('change',syncBtn);
/* A pricing button links here already knowing which plan the reader wants.
   The plan travels in the query string, so the #request fragment still lands
   on the form on its own if this script never runs. The older
   "#try?plan=x" links stay understood — they are out in the world. */
const readPlan=()=>{
  const q=new URLSearchParams(location.search).get('plan')
    ||(location.hash.split('plan=')[1]||'');
  const v=q.replace(/[^a-z]/g,'');
  return (v==='personal'||v==='company')?v:''};
const named={personal:'the personal plan',company:'a company licence'};
const applyPlan=(want,scroll)=>{
  if(!want)return;
  pe0.value=want;syncBtn();
  const c=document.getElementById('f-chosen');
  if(c){c.innerHTML='You chose <b>'+named[want]+'</b>. Your details are all that is missing.';
        c.hidden=false;}
  if(scroll){const f=document.getElementById('request');
    if(f)f.scrollIntoView({behavior:'smooth',block:'start'});}};
/* A new link carries #request and the browser scrolls there by itself. An
   older #try?plan=x link matches no element, so this has to do the scrolling
   — and the url is tidied to the current form on the way past. */
const p0=readPlan();
if(p0){const legacy=location.hash.indexOf('request')<0;
  if(legacy)history.replaceState(null,'','?plan='+p0+'#request');
  applyPlan(p0,legacy);}
/* Clicking the same button while already on this page changes the url without
   reloading, so the choice has to be picked up here too — otherwise the form
   still said "free 15-day trial" after the reader asked for the paid plan. */
document.querySelectorAll('a[data-plan]').forEach(a=>a.addEventListener('click',ev=>{
  const want=a.dataset.plan;
  if(!document.getElementById('request'))return;      /* another page · let it navigate */
  ev.preventDefault();
  history.replaceState(null,'','?plan='+want+'#request');
  applyPlan(want,true);}));
syncBtn();}}
