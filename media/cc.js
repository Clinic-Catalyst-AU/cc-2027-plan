/* Clinic Catalyst 2027 - shared motion. Nothing here moves one element over another. */
(function(){
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

  /* reveal on scroll */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); if(e.target.hasAttribute('data-count')) count(e.target); } });
  }, {threshold:.16, rootMargin:'0px 0px -6% 0px'});
  $('.rv,.rule,[data-count]').forEach(function(el){ io.observe(el); });

  /* count up: data-count="23500" data-pre="$" */
  function count(el){
    var to = +el.getAttribute('data-count'), pre = el.getAttribute('data-pre')||'', suf = el.getAttribute('data-suf')||'';
    var fmt = function(n){ return pre + Math.round(n).toLocaleString('en-AU') + suf; };
    if(calm){ el.textContent = fmt(to); return; }
    var t0 = performance.now(), dur = 1500;
    (function step(t){ var p = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-p,3); el.textContent = fmt(to*e); if(p<1) requestAnimationFrame(step); })(t0);
  }

  /* flick: one option at a time */
  $('.flick').forEach(function(f){
    var track = f.querySelector('.track'), slides = $('.slide', f), n = slides.length, i = 0;
    var cur = f.querySelector('.cur'), prev = f.querySelector('.prev'), next = f.querySelector('.next'), dots = f.querySelector('.dots');
    var tot = f.querySelector('.tot'); if(tot) tot.textContent = ('0'+n).slice(-2);
    if(dots){ for(var k=0;k<n;k++) dots.appendChild(document.createElement('i')); }
    function paint(){
      if(cur) cur.textContent = ('0'+(i+1)).slice(-2);
      if(prev) prev.disabled = i===0; if(next) next.disabled = i===n-1;
      if(dots) $('i',dots).forEach(function(d,k){ d.classList.toggle('on', k===i); });
    }
    function go(k){ i = Math.max(0, Math.min(n-1,k)); track.scrollTo({left: i*track.clientWidth, behavior: calm?'auto':'smooth'}); paint(); }
    if(prev) prev.addEventListener('click', function(){ go(i-1); });
    if(next) next.addEventListener('click', function(){ go(i+1); });
    var tick; track.addEventListener('scroll', function(){ clearTimeout(tick); tick = setTimeout(function(){ i = Math.round(track.scrollLeft/track.clientWidth); paint(); }, 90); }, {passive:true});
    addEventListener('resize', function(){ track.scrollTo({left:i*track.clientWidth}); });
    paint();
  });

  /* the system at work: rows light in order, then loop */
  $('.sys').forEach(function(s){
    var rows = $('li', s), bar = s.querySelector('.meter i'), k = 0;
    function show(){
      rows.forEach(function(r,j){ r.classList.toggle('on', j<=k); });
      if(bar) bar.style.width = ((k+1)/rows.length*100)+'%';
    }
    if(calm){ k = rows.length-1; show(); return; }
    show();
    setInterval(function(){ k = (k+1) % (rows.length+1); if(k===rows.length){ rows.forEach(function(r){ r.classList.remove('on'); }); if(bar) bar.style.width='0'; k=-1; } else show(); }, 2100);
  });

  /* hero field: drifting dot lattice with slow teal threads */
  $('canvas.field').forEach(function(c){
    var x = c.getContext('2d'), w, h, pts = [], dpr = Math.min(2, devicePixelRatio||1), on = true;
    function size(){ w = c.clientWidth; h = c.clientHeight; c.width = w*dpr; c.height = h*dpr; x.setTransform(dpr,0,0,dpr,0,0);
      var n = Math.round(Math.min(70, w*h/16000)); pts = []; for(var i=0;i<n;i++) pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.5+.6}); }
    function draw(){
      x.clearRect(0,0,w,h);
      for(var i=0;i<pts.length;i++){ var p = pts[i]; p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
        x.fillStyle='rgba(0,206,169,.75)'; x.fillRect(p.x-p.r/2,p.y-p.r/2,p.r*1.6,p.r*1.6);
        for(var j=i+1;j<pts.length;j++){ var q = pts[j], dx=p.x-q.x, dy=p.y-q.y, d=dx*dx+dy*dy; if(d<15000){ x.strokeStyle='rgba(0,206,169,'+(.2*(1-d/15000))+')'; x.lineWidth=1; x.beginPath(); x.moveTo(p.x,p.y); x.lineTo(q.x,q.y); x.stroke(); } } }
      if(on && !calm) requestAnimationFrame(draw);
    }
    size(); draw(); addEventListener('resize', size);
    new IntersectionObserver(function(e){ var v = e[0].isIntersecting; if(v && !on){ on = true; draw(); } else on = v; }).observe(c);
  });

  /* ?clean hides the red "to confirm" notes for a clean preview */
  if(/[?&]clean/.test(location.search)) document.body.classList.add('clean');
  $('.yr').forEach(function(e){ e.textContent = new Date().getFullYear(); });
})();
