(function(){
  /* ---- Render Proyek dari js/projects-data.js — dijalankan paling
     awal (sebelum lightbox, reveal-on-scroll, dst dipasang), biar
     kartu yang baru dibikin di sini ikut kebaca sama semua fitur
     lain. Edit isinya lewat js/projects-data.js, bukan di sini. ---- */
  (function renderProjects(){
    var mount = document.getElementById('projectsMount');
    if(!mount || typeof PROJECTS === 'undefined') return;

    function escAttr(s){
      return String(s || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function mediaSlotHtml(m, title){
      if(m.type === 'youtube'){
        var src = 'https://www.youtube.com/embed/' + m.id + (m.start ? ('?start=' + m.start) : '');
        return '<div class="media-slot"><iframe src="' + src + '" title="' + escAttr(title) + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
      }
      if(m.type === 'image'){
        return '<div class="media-slot"><img src="' + escAttr(m.src) + '" alt="' + escAttr(m.alt) + '"></div>';
      }
      if(m.type === 'embed'){
        return '<div class="media-slot"><iframe src="' + escAttr(m.src) + '" title="' + escAttr(title) + '" loading="lazy" allowfullscreen></iframe></div>';
      }
      return '<div class="media-slot"><span class="media-slot-label">' + (m.label || '\ud83d\udcf7') + '</span></div>';
    }

    function cardHtml(p){
      var cls = 'proj-card proj-compact doc-card' + (p.isTemplate ? ' is-template' : '');
      var mediaHtml = (p.media || []).map(function(m){ return mediaSlotHtml(m, p.title); }).join('');
      return (
        '<div class="' + cls + '" data-group="proyek"' +
        ' data-eyebrow="' + escAttr(p.tag) + '"' +
        ' data-title="' + escAttr(p.title) + '"' +
        ' data-meta="' + escAttr(p.meta) + '"' +
        ' data-desc="' + escAttr(p.desc) + '"' +
        ' data-link="' + escAttr(p.link) + '">' +
          '<div class="media-wrap"><div class="media-gallery">' + mediaHtml + '</div></div>' +
          '<div class="proj-compact-body">' +
            '<span class="proj-tag">' + escAttr(p.tag) + '</span>' +
            '<h3 class="proj-title">' + escAttr(p.title) + '</h3>' +
          '</div>' +
        '</div>'
      );
    }

    var categories = [];
    var seen = {};
    PROJECTS.forEach(function(p){
      if(!seen[p.category]){
        seen[p.category] = { title: p.category, note: p.categoryNote || '', cards: [] };
        categories.push(seen[p.category]);
      }
      seen[p.category].cards.push(p);
    });

    mount.innerHTML = categories.map(function(cat){
      return (
        '<div class="proj-category">' +
          '<div class="proj-cat-head"><h3 class="proj-cat-title">' + escAttr(cat.title) +
            '<span class="proj-cat-note">' + escAttr(cat.note) + '</span></h3></div>' +
          '<div class="proj-grid">' + cat.cards.map(cardHtml).join('') + '</div>' +
        '</div>'
      );
    }).join('');
  })();

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Dark / Light mode toggle ----
     Tema awal udah di-set inline script di <head> (sebelum paint,
     ngikutin prefers-color-scheme sistem). Di sini tinggal sinkronin
     tombolnya + kasih interaksi klik buat override manual selama
     sesi berjalan (nggak disimpan permanen, reset ke preferensi
     sistem tiap buka ulang halaman). */
  var themeToggle = document.getElementById('themeToggle');
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }
  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  themeToggle.addEventListener('click', function(){
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ links.classList.remove('is-open'); });
  });

  /* ---- Detail toggle (minimize/maximize dokumentasi per entri) ---- */
  function expandBody(body, btn){
    if(!body.classList.contains('is-collapsed')) return;
    body.style.maxHeight = body.scrollHeight + 'px';
    body.classList.remove('is-collapsed');
    if(btn){ btn.classList.remove('is-collapsed'); btn.setAttribute('aria-expanded', 'true'); }
    body.addEventListener('transitionend', function te(ev){
      if(ev.propertyName === 'max-height' && !body.classList.contains('is-collapsed')){
        body.style.maxHeight = 'none';
      }
      body.removeEventListener('transitionend', te);
    });
  }
  function collapseBody(body, btn){
    if(body.classList.contains('is-collapsed')) return;
    body.style.maxHeight = body.scrollHeight + 'px';
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        body.style.maxHeight = '0px';
        body.classList.add('is-collapsed');
      });
    });
    if(btn){ btn.classList.add('is-collapsed'); btn.setAttribute('aria-expanded', 'false'); }
  }

  document.querySelectorAll('.exp-head-row[data-toggle]').forEach(function(row){
    var btn = row.querySelector('.collapse-toggle');
    var body = document.getElementById(btn.getAttribute('aria-controls'));
    if(!body) return;
    row.addEventListener('click', function(e){
      e.stopPropagation(); /* jangan sampai kebuka lightbox-nya juga */
      if(body.classList.contains('is-collapsed')) expandBody(body, btn);
      else collapseBody(body, btn);
    });
  });

  /* ---- Scrollspy + progress bar ---- */
  var sections = Array.from(document.querySelectorAll('main section'));
  var navAs = Array.from(document.querySelectorAll('.nav-links a'));
  var progress = document.getElementById('progressBar');

  function updateNav(){
    var scrollPos = window.scrollY + window.innerHeight * 0.3;
    var current = sections[0];
    sections.forEach(function(sec){ if(sec.offsetTop <= scrollPos) current = sec; });
    navAs.forEach(function(a){ a.classList.toggle('is-active', a.getAttribute('href') === '#' + current.id); });
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = pct + '%';
    var hudSectionEl = document.getElementById('hudSection');
    if(hudSectionEl) hudSectionEl.textContent = current.id;
  }
  window.addEventListener('scroll', updateNav, {passive:true});
  window.addEventListener('resize', updateNav);
  updateNav();
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- Reveal-on-scroll: kartu & blok muncul dengan fade+slide
     halus pas kena scroll, biar tampilan lebih hidup/dinamis.
     Dilewati total kalau user set prefers-reduced-motion. ---- */
  if(!prefersReducedMotion && 'IntersectionObserver' in window){
    var revealTargets = document.querySelectorAll(
      '.achieve-card, .proj-card, .exp-item, .contact-card, .board, .edu-block, .skill-cols > div, .hero-cta, .hero-desc, .thesis-showcase'
    );
    revealTargets.forEach(function(el, i){
      el.classList.add('reveal');
      el.style.transitionDelay = (0.04 * (i % 5)) + 's';
    });
    var revealIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, {threshold:0.1, rootMargin:'0px 0px -60px 0px'});
    revealTargets.forEach(function(el){ revealIO.observe(el); });
  }

  /* ---- Intro cinematic: overlay ilang otomatis lewat CSS
     animation (lihat .intro-overlay). Ini cuma nambahin: jalanin
     timecode palsu ala kamera, dan skip-on-click/keypress. ---- */
  var introOverlay = document.getElementById('introOverlay');
  if(introOverlay){
    if(prefersReducedMotion){
      introOverlay.remove();
    } else {
      var introTc = document.getElementById('introTimecode');
      var introStart = null;
      var introRaf;
      function tickIntro(ts){
        if(!introStart) introStart = ts;
        var totalFrames = Math.floor(((ts - introStart) / 1000) * 24);
        var f = totalFrames % 24;
        var s = Math.floor(totalFrames / 24) % 60;
        if(introTc){
          introTc.textContent = '00:00:' + String(s).padStart(2, '0') + ':' + String(f).padStart(2, '0');
        }
        introRaf = requestAnimationFrame(tickIntro);
      }
      introRaf = requestAnimationFrame(tickIntro);
      function skipIntro(){
        introOverlay.classList.add('is-skipped');
        cancelAnimationFrame(introRaf);
      }
      introOverlay.addEventListener('click', skipIntro);
      document.addEventListener('keydown', function introKeyHandler(e){
        skipIntro();
        document.removeEventListener('keydown', introKeyHandler);
      }, {once:true});
      setTimeout(function(){ cancelAnimationFrame(introRaf); }, 2200);
    }
  }

  /* ---- Custom cursor: reticle ala viewfinder, cuma nyala di
     desktop dengan mouse presisi. Kalau nggak cocok kriterianya,
     nggak disentuh sama sekali (cursor bawaan tetap normal). ---- */
  if(!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    var cursorEl = document.getElementById('customCursor');
    if(cursorEl){
      var ccRing = cursorEl.querySelector('.cc-ring');
      var ccDot = cursorEl.querySelector('.cc-dot');
      var cx = 0, cy = 0, ringX = 0, ringY = 0, cursorStarted = false;
      document.addEventListener('mousemove', function(e){
        cx = e.clientX; cy = e.clientY;
        if(ccDot) ccDot.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
        if(!cursorStarted){
          cursorStarted = true;
          ringX = cx; ringY = cy;
          cursorEl.classList.add('is-active');
          document.body.classList.add('cc-active');
          requestAnimationFrame(animateRing);
        }
      }, {once:false});
      function animateRing(){
        ringX += (cx - ringX) * 0.2;
        ringY += (cy - ringY) * 0.2;
        if(ccRing) ccRing.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px)';
        requestAnimationFrame(animateRing);
      }
      document.querySelectorAll('a, button, .doc-card, .chip').forEach(function(el){
        el.addEventListener('mouseenter', function(){ cursorEl.classList.add('is-hovering'); });
        el.addEventListener('mouseleave', function(){ cursorEl.classList.remove('is-hovering'); });
      });
    }

    /* ---- Hover tip: label "Klik untuk detail" ikut kursor pas
       nge-hover kartu dokumentasi, gantiin instruksi statis yang
       keulang-ulang di teks section. ---- */
    var hoverTip = document.getElementById('hoverTip');
    if(hoverTip){
      document.querySelectorAll('.doc-card').forEach(function(card){
        card.addEventListener('mouseenter', function(){
          hoverTip.classList.add('is-shown');
        });
        card.addEventListener('mousemove', function(e){
          hoverTip.style.left = e.clientX + 'px';
          hoverTip.style.top = e.clientY + 'px';
        });
        card.addEventListener('mouseleave', function(){
          hoverTip.classList.remove('is-shown');
        });
      });
      /* Sembunyiin tip pas nge-hover elemen interaktif di dalam
         kartu (tombol panah galeri, tautan) biar nggak numpuk. */
      document.querySelectorAll('.org-gallery-nav, .lightbox-link, a[href^="http"], a[href^="mailto"], a[href^="tel"]').forEach(function(el){
        el.addEventListener('mouseenter', function(){ hoverTip.classList.remove('is-shown'); });
      });
    }
  }

  /* ---- Tilt 3D: kartu miring halus ngikutin posisi kursor.
     Sama kayak custom cursor, cuma nyala buat mouse presisi. ---- */
  if(!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    document.querySelectorAll('.achieve-card, .proj-card, .contact-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var px = e.clientX - rect.left;
        var py = e.clientY - rect.top;
        var rotY = ((px - rect.width / 2) / (rect.width / 2)) * 5;
        var rotX = ((py - rect.height / 2) / (rect.height / 2)) * -5;
        card.style.transform = 'perspective(700px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  /* ---- Toast kecil buat feedback tombol kamera ---- */
  var camToast = document.getElementById('camToast');
  var camToastTimer = null;
  function showCamToast(text){
    if(!camToast) return;
    camToast.textContent = text;
    camToast.classList.add('is-shown');
    clearTimeout(camToastTimer);
    camToastTimer = setTimeout(function(){ camToast.classList.remove('is-shown'); }, 1800);
  }

  /* ---- Suara shutter kamera, disintesis langsung (nggak butuh
     file audio eksternal). Gagal diam-diam kalau browser nolak. ---- */
  function playShutterSound(){
    try{
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if(!Ctx) return;
      var ctx = new Ctx();
      var now = ctx.currentTime;
      var osc1 = ctx.createOscillator();
      var gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(1500, now);
      gain1.gain.setValueAtTime(0.16, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc1.connect(gain1).connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);
      var osc2 = ctx.createOscillator();
      var gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(380, now + 0.07);
      gain2.gain.setValueAtTime(0.13, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.15);
      setTimeout(function(){ ctx.close && ctx.close(); }, 400);
    } catch(err){ /* audio nggak tersedia, lewati aja */ }
  }

  /* ---- Tombol shutter: flash + suara + jepretan ---- */
  var shutterBtn = document.getElementById('shutterBtn');
  var flashOverlay = document.getElementById('flashOverlay');
  var shutterMessages = [
    '📸 Halaman ini telah diabadikan.',
    '📸 Jepretan berhasil disimpan.',
    '📸 Momen berhasil diambil.',
    '📸 Satu bingkai lagi untuk koleksi.'
  ];

  /* ---- Hint bubble: nongol sekali buat ngajak coba tombol kamera ---- */
  var camHint = document.getElementById('camHint');
  var camHintTimer = null;
  if(camHint){
    camHintTimer = setTimeout(function(){
      camHint.classList.add('is-shown');
      setTimeout(function(){ camHint.classList.remove('is-shown'); }, 5000);
    }, 2400);
  }
  function dismissCamHint(){
    if(!camHint) return;
    clearTimeout(camHintTimer);
    camHint.classList.remove('is-shown');
  }

  if(shutterBtn){
    shutterBtn.addEventListener('click', function(){
      dismissCamHint();
      if(flashOverlay && !prefersReducedMotion){
        flashOverlay.classList.remove('is-flashing');
        void flashOverlay.offsetWidth;
        flashOverlay.classList.add('is-flashing');
      }
      playShutterSound();
      showCamToast(shutterMessages[Math.floor(Math.random() * shutterMessages.length)]);
    });
  }

  /* ---- Tombol REC: toggle viewfinder HUD + timecode berjalan ---- */
  var recToggleBtn = document.getElementById('recToggleBtn');
  var viewfinderHud = document.getElementById('viewfinderHud');
  var hudTimecode = document.getElementById('hudTimecode');
  var hudRaf = null;
  var hudStart = null;
  var recOnMessages = [
    'Mode REC aktif.',
    'Mulai merekam perjalanan ini.',
    'Kamera menyala — mari mulai.'
  ];
  var recOffMessages = [
    'Rekaman telah disimpan.',
    'Mode REC dihentikan.',
    'Mode viewfinder dinonaktifkan.'
  ];
  function tickHud(ts){
    if(!hudStart) hudStart = ts;
    var totalFrames = Math.floor(((ts - hudStart) / 1000) * 24);
    var f = totalFrames % 24;
    var s = Math.floor(totalFrames / 24) % 60;
    var m = Math.floor(totalFrames / 24 / 60) % 60;
    if(hudTimecode){
      hudTimecode.textContent = '00:' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ':' + String(f).padStart(2, '0');
    }
    hudRaf = requestAnimationFrame(tickHud);
  }
  if(recToggleBtn && viewfinderHud){
    recToggleBtn.addEventListener('click', function(){
      dismissCamHint();
      var isActive = viewfinderHud.classList.toggle('is-active');
      recToggleBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if(isActive){
        hudStart = null;
        if(!prefersReducedMotion){
          hudRaf = requestAnimationFrame(tickHud);
        } else if(hudTimecode){
          hudTimecode.textContent = '00:00:00:00';
        }
        showCamToast(recOnMessages[Math.floor(Math.random() * recOnMessages.length)]);
      } else {
        if(hudRaf) cancelAnimationFrame(hudRaf);
        showCamToast(recOffMessages[Math.floor(Math.random() * recOffMessages.length)]);
      }
    });
  }

  /* ---- Galeri organisasi: bisa digulir 3 cara — tombol panah,
     drag pakai mouse (klik-tahan-geser), atau swipe/trackpad
     bawaan browser. Kalau abis drag, klik ikutannya nggak
     nge-trigger lightbox biar nggak kebuka nggak sengaja. ---- */
  document.querySelectorAll('.org-gallery').forEach(function(gallery){
    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    var dragged = false;

    gallery.addEventListener('mousedown', function(e){
      isDown = true;
      dragged = false;
      gallery.classList.add('is-dragging');
      startX = e.pageX;
      startScroll = gallery.scrollLeft;
    });
    window.addEventListener('mouseup', function(){
      isDown = false;
      gallery.classList.remove('is-dragging');
    });
    gallery.addEventListener('mouseleave', function(){
      isDown = false;
      gallery.classList.remove('is-dragging');
    });
    gallery.addEventListener('mousemove', function(e){
      if(!isDown) return;
      e.preventDefault();
      var delta = e.pageX - startX;
      if(Math.abs(delta) > 4) dragged = true;
      gallery.scrollLeft = startScroll - delta;
    });
    gallery.addEventListener('click', function(e){
      if(dragged){
        e.stopPropagation();
        e.preventDefault();
        dragged = false;
      }
    }, true);

    var wrap = gallery.closest('.org-gallery-wrap');
    if(wrap){
      var prevNav = wrap.querySelector('.org-gallery-nav.prev');
      var nextNav = wrap.querySelector('.org-gallery-nav.next');
      var step = 190;
      if(prevNav){
        prevNav.addEventListener('click', function(e){
          e.stopPropagation();
          gallery.scrollBy({left: -step, behavior: prefersReducedMotion ? 'auto' : 'smooth'});
        });
      }
      if(nextNav){
        nextNav.addEventListener('click', function(e){
          e.stopPropagation();
          gallery.scrollBy({left: step, behavior: prefersReducedMotion ? 'auto' : 'smooth'});
        });
      }
    }
  });

  /* ---- Lightbox (maximize/minimize dokumentasi) ---- */
  var lightbox = document.getElementById('lightbox');
  var mediaEl = document.getElementById('lightboxMedia');
  var dotsEl = document.getElementById('lightboxDots');
  var titleEl = document.getElementById('lightboxTitle');
  var metaEl = document.getElementById('lightboxMeta');
  var descEl = document.getElementById('lightboxDesc');
  var linkEl = document.getElementById('lightboxLink');
  var eyebrowEl = document.getElementById('lightboxEyebrow');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var currentGroup = [];
  var currentIndex = 0;
  var currentGallery = [];
  var currentGalleryIndex = 0;

  function renderGalleryImage(){
    var slot = currentGallery[currentGalleryIndex];
    mediaEl.innerHTML = slot ? slot.innerHTML : '';
  }

  function renderDots(){
    dotsEl.innerHTML = '';
    if(currentGallery.length <= 1) return;
    currentGallery.forEach(function(_, i){
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'lb-dot' + (i === currentGalleryIndex ? ' is-current' : '');
      dot.setAttribute('aria-label', 'Gambar ' + (i + 1) + ' dari ' + currentGallery.length);
      dot.addEventListener('click', function(e){
        e.stopPropagation();
        currentGalleryIndex = i;
        renderGalleryImage();
        renderDots();
      });
      dotsEl.appendChild(dot);
    });
  }

  function render(){
    var card = currentGroup[currentIndex];
    var gallery = card.querySelector('.media-gallery');
    currentGallery = gallery
      ? Array.from(gallery.querySelectorAll('.media-slot'))
      : (card.querySelector('.media-slot') ? [card.querySelector('.media-slot')] : []);
    currentGalleryIndex = 0;
    renderGalleryImage();
    renderDots();
    titleEl.textContent = card.dataset.title || '';
    metaEl.textContent = card.dataset.meta || '';
    descEl.textContent = card.dataset.desc || '';
    eyebrowEl.textContent = card.dataset.eyebrow || '';
    var link = card.dataset.link || '';
    if(link){
      linkEl.href = link;
      linkEl.classList.add('is-shown');
    } else {
      linkEl.removeAttribute('href');
      linkEl.classList.remove('is-shown');
    }
    var multi = currentGroup.length > 1;
    prevBtn.style.display = multi ? 'flex' : 'none';
    nextBtn.style.display = multi ? 'flex' : 'none';
  }

  function openFromCard(card){
    var group = card.dataset.group || 'default';
    currentGroup = Array.from(document.querySelectorAll('.doc-card[data-group="' + group + '"]'));
    currentIndex = currentGroup.indexOf(card);
    render();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.doc-card').forEach(function(card){
    card.addEventListener('click', function(){ openFromCard(card); });
    var btn = card.querySelector('.maximize-btn');
    if(btn){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        openFromCard(card);
      });
    }
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) closeLightbox(); });
  prevBtn.addEventListener('click', function(){ currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length; render(); });
  nextBtn.addEventListener('click', function(){ currentIndex = (currentIndex + 1) % currentGroup.length; render(); });
  document.addEventListener('keydown', function(e){
    if(!lightbox.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') prevBtn.click();
    if(e.key === 'ArrowRight') nextBtn.click();
  });
})();
