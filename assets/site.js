
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
const el=e.target,end=parseInt(el.dataset.count,10),t0=performance.now(),dur=650;
const fmt=n=>n.toLocaleString('en-US');
const tick=t=>{const p=Math.min(1,(t-t0)/dur),ease=1-Math.pow(1-p,3);
el.textContent=fmt(Math.round(end*ease));if(p<1)requestAnimationFrame(tick)};
requestAnimationFrame(tick)}),{threshold:.4});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));
document.querySelectorAll('.yt[data-yt]').forEach(box=>{
  const id=box.dataset.yt;
  box.addEventListener('click',()=>{
    if(box.querySelector('iframe'))return;
    const f=document.createElement('iframe');
    f.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen=true;
    box.textContent='';box.appendChild(f);
  },{once:false});
  box.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();box.click()}});
});
document.querySelectorAll('.tabbtn').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabbtn').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.tabpanel').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  document.getElementById('tp-'+b.dataset.t).classList.add('on');
}));
const tf=document.getElementById('trialForm');if(tf){
/* r215 · a form like any other. The request goes straight to us — kept on
   the licence service, mailed to the support inbox — and the page says so in
   place. The visitor's own mail app is only the fallback for when our
   service cannot be reached, so nothing typed here is ever lost. */
const T0=Date.now();
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
tf.addEventListener('submit',async ev=>{ev.preventDefault();
const $=id=>document.getElementById(id);
const err=$('f-err'),ok=$('f-ok'),btn=$('f-btn');
if(btn.disabled)return;
err.style.display='none';err.textContent='';ok.style.display='none';
const name=$('f-name').value.trim(),email=$('f-email').value.trim();
if(name.length<2){err.textContent='Please give your name.';err.style.display='block';return}
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){err.textContent='That email address does not look right.';err.style.display='block';return}
const planEl=$('f-plan');const plan=planEl?planEl.value:'personal';
const company=$('f-company').value.trim(),role=$('f-role').value.trim(),msg=$('f-msg').value.trim();
const subj=plan==='company'?'Company licence':plan==='question'?'A question':'Personal plan';
const mail='mailto:support@engspace.app?subject='+encodeURIComponent(subj+' — '+name)+'&body='+encodeURIComponent('Name: '+name+'\nEmail: '+email+'\nCompany: '+company+'\nRole: '+role+'\nPlan: '+plan+'\n\n'+msg);
const label=btn.textContent;
btn.disabled=true;btn.textContent='Sending…';
try{
  const r=await fetch('https://lic.engspace.app/request',{method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({plan:plan,name:name,email:email,company:company,role:role,message:msg,
      page:location.pathname,web:$('f-web').value,t:Date.now()-T0})});
  const j=await r.json().catch(()=>({}));
  if(r.ok&&j.ok){
    ok.innerHTML='<b>Sent &#8212; thank you, '+esc(name.split(' ')[0])+'.</b> Your request has reached us. A person reads every one and answers you at <b>'+esc(email)+'</b>, usually within a day.';
    ok.style.display='block';btn.textContent='Sent ✓';
    tf.querySelectorAll('input,select,textarea').forEach(x=>{x.disabled=true});
    return;}
  if(r.status===400||r.status===429){
    err.textContent=j.say||'Please check the form and send it again.';err.style.display='block';
    btn.disabled=false;btn.textContent=label;return;}
  throw new Error('service '+r.status);
}catch(e){
  ok.innerHTML='Our form could not reach us just now, so nothing was sent yet. <a href="'+mail+'" style="color:inherit;text-decoration:underline;font-weight:600">Send it from your mail app instead</a> &#8212; the request is already written out &#8212; or write to support@engspace.app.';
  ok.style.display='block';btn.disabled=false;btn.textContent=label;}
});
const labelFor=v=>v==='company'?'Ask about a company licence':v==='question'?'Send my question':'Ask for the personal plan';
const syncBtn=()=>{const pe=document.getElementById('f-plan'),b=document.getElementById('f-btn');
if(pe&&b&&b.textContent.indexOf('✓')<0&&!b.disabled)b.textContent=labelFor(pe.value)};
const pe0=document.getElementById('f-plan');
if(pe0){pe0.addEventListener('change',syncBtn);
/* A pricing button links here already knowing which plan the reader wants.
   The plan travels in the query string, so the #request fragment still lands
   on the form on its own if this script never runs. The older
   "#try?plan=x" links stay understood — they are out in the world. The
   trial is not one of the choices: it is the app itself, for 14 days, and
   an old ?plan=trial link simply lands on the personal plan. */
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
   still said "the personal plan" after the reader asked about a company. */
document.querySelectorAll('a[data-plan]').forEach(a=>a.addEventListener('click',ev=>{
  const want=a.dataset.plan;
  if(!document.getElementById('request'))return;      /* another page · let it navigate */
  ev.preventDefault();
  history.replaceState(null,'','?plan='+want+'#request');
  applyPlan(want,true);}));
syncBtn();}}

/* r215 · WhatsApp. A plain link to a chat with the founder: no widget, no
   third-party script. The first line is written for the visitor and names the
   page they were reading. The number is put together here, so it is not in
   the HTML for address harvesters. The button arrives after a moment and
   steps aside while the licence request form is on screen, so the two never
   compete. */
(()=>{const n=['966','54','170','6700'].join('');
const pg=location.pathname.split('/').pop().replace(/\.html$/,'');
const at='engspace.app'+(pg&&pg!=='index'?'/'+pg:'');
const url='https://wa.me/'+n+'?text='+encodeURIComponent('Hello, I have a question about Engineering Workspace ('+at+').');
const count=()=>{try{if(window.gtag)gtag('event','whatsapp_click',{page_path:location.pathname})}catch(e){}};
document.querySelectorAll('[data-wa]').forEach(a=>{a.href=url;a.target='_blank';a.rel='noopener';a.hidden=false;a.addEventListener('click',count)});
const fab=document.createElement('a');
fab.className='wa-fab';fab.href=url;fab.target='_blank';fab.rel='noopener';
fab.setAttribute('aria-label','Chat with the founder on WhatsApp');
fab.innerHTML='<span class="wa-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0A100E" d="M12 3.4c-4.97 0-9 3.4-9 7.6 0 2.25 1.16 4.28 3 5.67l-.72 3.63 3.98-2.08c.87.2 1.8.3 2.74.3 4.97 0 9-3.4 9-7.52S16.97 3.4 12 3.4z"/><circle cx="8.3" cy="11" r="1.2" fill="#D2C79E"/><circle cx="12" cy="11" r="1.2" fill="#D2C79E"/><circle cx="15.7" cy="11" r="1.2" fill="#D2C79E"/></svg></span>'
 +'<span class="wa-t"><b><span class="wa-long">Chat on </span>WhatsApp</b><small class="wa-sub">The founder &#183; KSA working hours</small></span>';
fab.addEventListener('click',count);
document.body.appendChild(fab);
let away=false,ready=false;
const show=()=>fab.classList.toggle('on',ready&&!away);
setTimeout(()=>{ready=true;show()},900);
const rq=document.getElementById('request');
if(rq&&'IntersectionObserver' in window)
  new IntersectionObserver(es=>{away=es[0].isIntersecting;show()},{threshold:.12}).observe(rq);
})();
