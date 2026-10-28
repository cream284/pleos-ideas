(() => {
  const table = document.querySelector('#role-review-table');
  const controls = document.querySelector('.review-controls');
  if (!table || !controls) return;
  const rows = [...table.querySelectorAll('tbody tr')];
  const body = table.tBodies[0];
  const search = document.querySelector('#review-search');
  const filter = document.querySelector('#review-filter');
  const sort = document.querySelector('#review-sort');
  const count = document.querySelector('#review-count');
  const empty = document.querySelector('#review-empty');
  const update = () => {
    const query = search.value.trim().toLocaleLowerCase('ko');
    let visible = 0;
    const ordered = [...rows].sort((a,b) => sort.value === 'rank'
      ? Number(a.dataset.rank)-Number(b.dataset.rank)
      : Number(b.dataset[sort.value])-Number(a.dataset[sort.value]) || Number(a.dataset.rank)-Number(b.dataset.rank));
    for (const row of ordered) {
      row.hidden = (filter.value !== 'all' && row.dataset.decision !== filter.value) || !row.textContent.toLocaleLowerCase('ko').includes(query);
      if (!row.hidden) visible++;
      body.append(row);
    }
    table.dataset.sort = sort.value;
    count.textContent = `${visible} / ${rows.length}개 표시`;
    empty.hidden = visible !== 0;
  };
  search.addEventListener('input', update);
  filter.addEventListener('change', update);
  sort.addEventListener('change', update);
  controls.hidden = false;
  update();
})();
