
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>8),{passive:true});
const mb=document.getElementById('menubtn');
if(mb){const close=()=>{nav.classList.remove('open');mb.setAttribute('aria-expanded','false');document.body.style.overflow=''};
mb.addEventListener('click',()=>{const o=nav.classList.toggle('open');
mb.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
document.querySelectorAll('.mmenu a').forEach(a=>a.addEventListener('click',close));
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
document.querySelectorAll('.tabbtn').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabbtn').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.tabpanel').forEach(x=>x.classList.remove('on'));
  b.classList.add('on');
  document.getElementById('tp-'+b.dataset.t).classList.add('on');
}));
const tf=document.getElementById('trialForm');
if(tf){const API='https://cockpit.abokhatwa.com/api/public/trial-request';
tf.addEventListener('submit',async ev=>{ev.preventDefault();
const $=id=>document.getElementById(id);const err=$('f-err'),ok=$('f-ok'),btn=$('f-btn');
err.style.display='none';
const name=$('f-name').value.trim(),email=$('f-email').value.trim();
if(name.length<2){err.textContent='Please give your name.';err.style.display='block';return}
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){err.textContent='That email address does not look right.';err.style.display='block';return}
btn.disabled=true;btn.textContent='Sending…';
try{const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json'},
body:JSON.stringify({name,email,company:$('f-company').value.trim(),role_title:$('f-role').value.trim(),
message:$('f-msg').value.trim(),website:$('f-web').value})});
if(!r.ok)throw new Error((await r.json().catch(()=>({}))).detail||'The request could not be sent.');
tf.querySelectorAll('input,textarea,button').forEach(x=>x.disabled=true);
ok.style.display='block';btn.textContent='Requested ✓';
}catch(e){err.textContent=(e.message||'Could not reach the server')+' — you can also email mohamed@abokhatwa.com directly.';
err.style.display='block';btn.disabled=false;btn.textContent='Request my free 15-day trial'}});}
