(() => {
  const root = document.documentElement;
  const storageKey = 'pleos-idea-theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const saved = localStorage.getItem(storageKey);
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;

  const bar = document.querySelector('header .bar');
  if (bar) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-toggle';
    const actualTheme = () => root.dataset.theme || (prefersDark.matches ? 'dark' : 'light');
    const label = () => actualTheme() === 'dark' ? '☀ 라이트' : '◐ 다크';
    const render = () => {
      toggle.textContent = label();
      toggle.setAttribute('aria-label', actualTheme() === 'dark' ? '라이트 테마로 변경' : '다크 테마로 변경');
      toggle.title = toggle.getAttribute('aria-label');
    };
    toggle.addEventListener('click', () => {
      root.dataset.theme = actualTheme() === 'dark' ? 'light' : 'dark';
      localStorage.setItem(storageKey, root.dataset.theme);
      render();
    });
    prefersDark.addEventListener?.('change', () => { if (!root.dataset.theme) render(); });
    bar.append(toggle);
    render();
  }

  const button = document.querySelector('.back-to-top');
  if (!button) return;
  let pending = false;
  const update = () => { button.hidden = window.scrollY < 320; pending = false; };
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('pageshow', update);
  button.addEventListener('click', () => {
    const heading = document.querySelector('h1');
    if (heading) { if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  update();
})();
