(() => {
  const button = document.querySelector('.back-to-top');
  if (!button) return;
  let pending = false;
  const update = () => {
    button.hidden = window.scrollY < 320;
    pending = false;
  };
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('pageshow', update);
  button.addEventListener('click', () => {
    const heading = document.querySelector('h1');
    if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  update();
})();
