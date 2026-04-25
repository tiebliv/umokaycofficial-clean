/* ==========================================================================
   #UMOKAY2 — Tips & Tricks Funnel
   Lightweight vanilla JS: form handling, success state, reveal-on-scroll
   ========================================================================== */
(function () {
  'use strict';

  // --------- Config ---------
  // Replace ENDPOINT with your real form handler (Mailchimp, ConvertKit,
  // ActiveCampaign, Beehiiv, Resend webhook, n8n, etc.). If left empty,
  // we'll just simulate a successful submit and store the email locally.
  var ENDPOINT = ''; // e.g. 'https://hooks.umokayofficial.com/optin'

  // --------- Helpers ---------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || '').trim());
  }

  // --------- Form ---------
  var form = $('#optinForm');
  var emailInput = $('#email');
  var errorEl = $('#formError');
  var success = $('#success');

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg || 'Drop a real email so I can send the guide.';
    errorEl.hidden = false;
  }
  function hideError() {
    if (!errorEl) return;
    errorEl.hidden = true;
  }

  function showSuccess() {
    // Redirect to the VIP Upgrade page immediately after successful submission
    window.location.href = 'upgrade.html';
  }

  function submitOptin(email) {
    if (!ENDPOINT) {
      // Dev / staging fallback — store locally and resolve.
      try { localStorage.setItem('umokay2_optin', email); } catch (e) {}
      return new Promise(function (resolve) { setTimeout(resolve, 600); });
    }
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: 'umokay2-tips-tricks-funnel' })
    }).then(function (r) {
      if (!r.ok) throw new Error('Bad response');
      return r.json().catch(function () { return {}; });
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideError();
      var email = (emailInput.value || '').trim();

      if (!isValidEmail(email)) {
        showError('Drop a real email so I can send the guide.');
        emailInput.focus();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var prevText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending…</span>';
      }

      submitOptin(email)
        .then(function () {
          showSuccess();
          // Optional: fire analytics events here.
          // window.dataLayer && window.dataLayer.push({ event: 'optin_success', source: 'umokay2_tips_tricks' });
        })
        .catch(function () {
          showError('Something glitched. Try again in a sec.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = prevText;
          }
        });
    });
  }

  // --------- Reveal on scroll ---------
  document.documentElement.classList.add('is-loaded');
  var revealEls = document.querySelectorAll('.section, .hero__copy, .hero__visual, .lesson, .preview__card, .proof__tile');
  revealEls.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  // --------- Video teaser (click-to-play, 90s clip) ---------
  var vplayer = document.getElementById('vplayer');
  var vplayBtn = document.getElementById('vplay');
  function loadVideo(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!vplayer || vplayer.classList.contains('is-playing')) return;
    var id    = vplayer.getAttribute('data-video');
    var start = parseInt(vplayer.getAttribute('data-start') || '0', 10);
    var end   = parseInt(vplayer.getAttribute('data-end')   || '90', 10);
    var src = 'https://www.youtube-nocookie.com/embed/' + id +
              '?autoplay=1&rel=0&modestbranding=1&playsinline=1' +
              '&start=' + start + '&end=' + end;
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', src);
    iframe.setAttribute('title', 'UMOKAY2 masterclass preview');
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    vplayer.appendChild(iframe);
    vplayer.classList.add('is-playing');

    // Auto-stop when scrolled away
    if ('IntersectionObserver' in window) {
      var vo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting && vplayer.classList.contains('is-playing')) {
            var f = vplayer.querySelector('iframe');
            if (f) f.remove();
            vplayer.classList.remove('is-playing');
          }
        });
      }, { threshold: 0 });
      vo.observe(vplayer);
    }
  }
  if (vplayBtn) {
    vplayBtn.addEventListener('click', loadVideo);
    vplayBtn.addEventListener('touchend', loadVideo, { passive: false });
  }

  // --------- Smooth anchor for older browsers ---------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

})();
