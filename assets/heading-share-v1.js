(() => {
  const headings = [...document.querySelectorAll('main h1, main h2')];
  if (!headings.length) return;
  const svg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 13 4-4M8 16l-1 1a4.24 4.24 0 0 1-6-6l4-4a4.24 4.24 0 0 1 6 0" transform="translate(3 0)"/><path d="m13 7 1-1a4.24 4.24 0 0 1 6 6l-4 4a4.24 4.24 0 0 1-6 0"/></svg>';
  const status = document.createElement('div');
  status.className = 'heading-share-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.append(status);
  let statusTimer;
  const announce = message => {
    clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.add('is-visible');
    statusTimer = setTimeout(() => status.classList.remove('is-visible'), 2800);
  };
  const manualCopy = (markdown, returnFocus) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'heading-share-dialog';
    const label = document.createElement('label');
    label.textContent = '마크다운 링크';
    label.htmlFor = 'heading-share-copy-text';
    const help = document.createElement('p');
    help.textContent = '자동 복사가 제한되었습니다. 아래 내용을 선택해 복사해 주세요.';
    const field = document.createElement('textarea');
    field.id = label.htmlFor;
    field.readOnly = true;
    field.rows = 4;
    field.value = markdown;
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '닫기';
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { dialog.remove(); returnFocus.focus(); });
    dialog.append(label, help, field, close);
    document.body.append(dialog);
    dialog.showModal();
    field.focus();
    field.select();
    field.setSelectionRange(0, markdown.length);
  };
  headings.forEach((heading, index) => {
    if (heading.querySelector('a, button')) return;
    const title = heading.innerText.replace(/\s+/g, ' ').trim();
    if (!title) return;
    const section = heading.closest('section[id]');
    if (!heading.id && !section) {
      let id = heading.tagName === 'H1' ? 'page-title' : `section-title-${index + 1}`;
      while (document.getElementById(id)) id += '-link';
      heading.id = id;
    }
    const id = heading.id || section.id;
    const anchor = document.createElement('a');
    anchor.className = 'heading-permalink';
    anchor.href = '#' + id;
    while (heading.firstChild) anchor.append(heading.firstChild);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'heading-share-button';
    button.setAttribute('aria-label', `${title} — 마크다운 링크 복사`);
    button.title = '마크다운 링크 복사';
    button.innerHTML = svg;
    button.addEventListener('click', async () => {
      const url = new URL(window.location.href);
      url.search = '';
      url.hash = id;
      const escapedTitle = title.replace(/[\\[\]]/g, '\\$&');
      const markdown = `[${escapedTitle}](${url.href})`;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(markdown);
        announce('마크다운 링크를 복사했습니다. 붙여넣어 공유하세요.');
      } catch {
        manualCopy(markdown, button);
      }
    });
    heading.classList.add('shareable-heading');
    heading.append(anchor, document.createTextNode(' '), button);
  });
})();
