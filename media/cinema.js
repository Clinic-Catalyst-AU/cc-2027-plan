/* Clinic Catalyst cinema system: reveals, count-up, one-at-a-time viewer, enquiry loop, turning seal, drawn timeline. */
(function(){
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (/[?&]clean\b/.test(location.search)) document.body.classList.add('clean');
  document.querySelectorAll('.yr').forEach(function(e){ e.textContent = new Date().getFullYear(); });

  // reveals
  var rv = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || still) rv.forEach(function(e){ e.classList.add('on'); });
  else {
    var io = new IntersectionObserver(function(es){ es.forEach(function(x){ if (x.isIntersecting){ x.target.classList.add('on'); io.unobserve(x.target); } }); }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(e){ io.observe(e); });
  }

  // count-up
  function fmt(n, d){ return n.toLocaleString('en-AU', {minimumFractionDigits:d, maximumFractionDigits:d}); }
  var cs = document.querySelectorAll('[data-count]');
  function run(el){
    var to = parseFloat(el.dataset.count), d = +(el.dataset.dec||0), pre = el.dataset.pre||'', suf = el.dataset.suf||'';
    if (still){ el.textContent = pre + fmt(to,d) + suf; return; }
    var t0 = null;
    function f(t){ if(!t0) t0 = t; var p = Math.min(1,(t-t0)/1700), e = 1-Math.pow(1-p,3); el.textContent = pre + fmt(to*e,d) + suf; if(p<1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  if ('IntersectionObserver' in window){
    var co = new IntersectionObserver(function(es){ es.forEach(function(x){ if(x.isIntersecting){ run(x.target); co.unobserve(x.target); } }); }, {threshold:.5});
    cs.forEach(function(e){ co.observe(e); });
  } else cs.forEach(run);

  // one-at-a-time viewer
  document.querySelectorAll('.flick').forEach(function(f){
    var tr = f.querySelector('.track'), sl = f.querySelectorAll('.slide'), cur = f.querySelector('.cur'), tot = f.querySelector('.tot'),
        pv = f.querySelector('.prev'), nx = f.querySelector('.next'), i = 0;
    if (tot) tot.textContent = ('0'+sl.length).slice(-2);
    function set(n){ i = Math.max(0, Math.min(sl.length-1, n)); if(cur) cur.textContent = ('0'+(i+1)).slice(-2); if(pv) pv.disabled = i===0; if(nx) nx.disabled = i===sl.length-1; }
    function go(n){ set(n); tr.scrollTo({left: sl[i].offsetLeft - tr.offsetLeft, behavior: still?'auto':'smooth'}); }
    if (pv) pv.addEventListener('click', function(){ go(i-1); });
    if (nx) nx.addEventListener('click', function(){ go(i+1); });
    var tm; tr.addEventListener('scroll', function(){ clearTimeout(tm); tm = setTimeout(function(){ var b = 0, bd = 1e9; sl.forEach(function(s,k){ var d = Math.abs((s.offsetLeft - tr.offsetLeft) - tr.scrollLeft); if(d<bd){bd=d;b=k;} }); set(b); }, 90); });
    set(0);
  });

  // enquiry panel
  document.querySelectorAll('.sys').forEach(function(s){
    var li = s.querySelectorAll('li'), k = 0;
    if (still){ li.forEach(function(l){ l.classList.add('on'); }); return; }
    function step(){ li.forEach(function(l,n){ l.classList.toggle('on', n<=k); }); k = (k+1) % (li.length+2); if(k>li.length-1 && k!==0){ } }
    step(); setInterval(function(){ if(k>=li.length){ k = 0; li.forEach(function(l){ l.classList.remove('on'); }); return; } step(); }, 2000);
  });

  // seal turns with the scroll; timeline draws with the scroll
  var seals = document.querySelectorAll('.seal svg'), days = document.querySelectorAll('.days');
  function onScroll(){
    var y = window.scrollY;
    if (!still) seals.forEach(function(s){ s.style.transform = 'rotate(' + (y*0.06) + 'deg)'; });
    days.forEach(function(d){
      var r = d.getBoundingClientRect(), dr = d.querySelector('.draw'); if(!dr) return;
      var p = Math.max(0, Math.min(1, (window.innerHeight*0.62 - r.top) / (r.height-16)));
      dr.style.height = (still ? 1 : p) * (r.height-16) + 'px';
    });
  }
  var tick = false;
  window.addEventListener('scroll', function(){ if(!tick){ tick = true; requestAnimationFrame(function(){ onScroll(); tick = false; }); } }, {passive:true});
  window.addEventListener('resize', onScroll); onScroll();
})();
