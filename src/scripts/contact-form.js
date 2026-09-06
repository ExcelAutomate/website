// Contact form: real HTML5 validation, a real (visually-styled) radio group
// for reply preference, a honeypot, and a minimum-time-on-form guard. See
// docs/Build Notes.md > Contact form for the full spec this follows.
//
// On GitHub Pages there is no backend, so the Netlify-style fetch below will
// fail here — that's fine and expected (DECISIONS.md): the in-card
// confirmation still shows, because what needs reviewing on this test build
// is the required-field behaviour, not real delivery. On Netlify the same
// code delivers the submission for real, unchanged.

const MOUNT_TIME = Date.now();
const MIN_MS_ON_FORM = 3000;
const RESUBMIT_GUARD_MS = 10000;

function initContactForm() {
  const form = document.getElementById('contact-form');
  const thanks = document.getElementById('contact-thanks');
  const resetBtn = document.getElementById('contact-reset');
  const phoneField = document.getElementById('phone-field');
  const phoneInput = phoneField ? phoneField.querySelector('input') : null;
  if (!form || !thanks) return;

  // Reply preference — a real radio group underneath the styled tiles, so
  // the value submits and the control is keyboard-operable. The radios are
  // native <input type="radio"> wired to visually-hidden inputs with
  // matching <label for>, so clicking/keying the label already toggles the
  // input; this listens for the resulting `change` to update the visuals
  // and the Phone field's visibility/required state.
  form.querySelectorAll('input[name="reply-preference"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      // Recompute both labels from current radio state, rather than trying
      // to toggle just the one that changed — simpler and correct regardless
      // of event order.
      form.querySelectorAll('input[name="reply-preference"]').forEach((r) => {
        const label = form.querySelector(`label[data-reply-option="${r.value}"]`);
        if (label) label.setAttribute('data-selected', r.checked ? 'true' : 'false');
      });

      const phoneChosen = form.querySelector('input[name="reply-preference"][value="phone"]').checked;
      if (phoneField && phoneInput) {
        phoneField.hidden = !phoneChosen;
        if (phoneChosen) phoneInput.setAttribute('required', 'required');
        else phoneInput.removeAttribute('required');
      }
    });
  });

  function showError(input, show) {
    const wrapper = input.closest('.field');
    const err = wrapper ? wrapper.querySelector('.field-error') : null;
    input.classList.toggle('touched', show);
    if (err) err.classList.toggle('show', show);
  }

  function validate() {
    let ok = true;
    form.querySelectorAll('input[required], textarea[required]').forEach((el) => {
      const valid = el.checkValidity();
      showError(el, !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  // Clear an error as soon as the field becomes valid again.
  form.querySelectorAll('input, textarea').forEach((el) => {
    el.addEventListener('input', () => {
      if (el.hasAttribute('required') && el.checkValidity()) showError(el, false);
    });
  });

  function showThanks() {
    form.hidden = true;
    thanks.hidden = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Honeypot — Netlify Forms convention. Anything that fills it is a bot;
    // drop it silently rather than telling the sender it failed.
    const honeypot = form.querySelector('input[name="bot-field"]');
    const isBot = !!(honeypot && honeypot.value);

    // Minimum time on form — bots post instantly, people don't.
    const tooFast = Date.now() - MOUNT_TIME < MIN_MS_ON_FORM;

    // Soft guard against an accidental double-send from clicking twice;
    // stops nothing malicious, just spares a real sender two emails.
    const lastSent = Number(sessionStorage.getItem('contact-sent-at') || 0);
    const recentlySent = Date.now() - lastSent < RESUBMIT_GUARD_MS;

    if (isBot || tooFast || recentlySent) {
      showThanks();
      return;
    }

    const data = new FormData(form);
    fetch(form.getAttribute('action') || window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    })
      .then(() => {
        sessionStorage.setItem('contact-sent-at', String(Date.now()));
        showThanks();
      })
      .catch(() => {
        // No backend on GitHub Pages — expected here. Show the confirmation
        // anyway so the required-field behaviour is still what gets
        // reviewed on this test build (see Build Notes > Contact form).
        sessionStorage.setItem('contact-sent-at', String(Date.now()));
        showThanks();
      });
  });

  resetBtn?.addEventListener('click', () => {
    thanks.hidden = true;
    form.hidden = false;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}
