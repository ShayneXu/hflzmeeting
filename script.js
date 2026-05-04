// 简单交互：平滑导航、图片轮播、本地表单提示、双击编辑（仅本地，保存请编辑源码）
document.addEventListener('DOMContentLoaded', function(){
  const storageKey = 'hflzmeeting-delegates';
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');

  // 平滑滚动
  document.querySelectorAll('.top-nav a').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      if(window.matchMedia('(max-width: 820px)').matches){
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    })
  })

  if(navToggle && siteNav){
    navToggle.addEventListener('click', ()=>{
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // 可编辑：双击切换 contenteditable（仅页面临时编辑）
  document.querySelectorAll('.editable').forEach(el=>{
    el.addEventListener('dblclick', ()=>{
      const is = el.getAttribute('contenteditable') === 'true';
      el.setAttribute('contenteditable', !is);
      if(!is) el.focus();
    })
  })

  const delegatesList = document.getElementById('delegates-list');
  const form = document.getElementById('rsvp-form');

  function readEntries(){
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function writeEntries(entries){
    localStorage.setItem(storageKey, JSON.stringify(entries));
  }

  function escapeHtml(value){
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderDelegatesList(){
    if(!delegatesList) return;
    const entries = readEntries();
    if(entries.length === 0){
      delegatesList.innerHTML = '<li class="empty">暂无确认记录，提交后会自动出现在这里。</li>';
      return;
    }
    delegatesList.innerHTML = entries.map(entry => {
      const status = entry.attend === 'yes' ? '会参加' : '无法参加';
      const note = entry.note ? `<span class="meta">备注：${escapeHtml(entry.note)}</span>` : '';
      return `
        <li>
          <strong>${escapeHtml(entry.name)}</strong> · ${escapeHtml(entry.phone)} · ${status}
          <span class="meta">来源：参会确认表单</span>
          ${note}
        </li>
      `;
    }).join('');
  }

  renderDelegatesList();

  // 轮播 - 简单图片列表（用户可在 images/ 替换文件名）
  const imgs = ['images/photo1-placeholder.svg','images/photo2-placeholder.svg','images/photo3-placeholder.svg'];
  let idx=0; const imgEl = document.getElementById('gallery-img');
  function show(i){ imgEl.src = imgs[i]; }
  document.querySelector('.gallery .prev').addEventListener('click', ()=>{ idx = (idx-1+imgs.length)%imgs.length; show(idx); });
  document.querySelector('.gallery .next').addEventListener('click', ()=>{ idx = (idx+1)%imgs.length; show(idx); });
  // 自动轮播
  setInterval(()=>{ idx = (idx+1)%imgs.length; show(idx); }, 5000);

  // 表单提交示例（静态页面，本地提示）
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const entry = {
      name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      attend: String(data.get('attend') || 'yes'),
      note: String(data.get('note') || '').trim(),
      createdAt: new Date().toISOString()
    };

    if(!entry.name || !entry.phone){
      alert('请先填写姓名和联系方式。');
      return;
    }

    const entries = readEntries();
    entries.unshift(entry);
    writeEntries(entries);
    renderDelegatesList();

    alert('已提交并同步到更多代表名单\n姓名：' + entry.name + '\n联系方式：' + entry.phone + '\n状态：' + (entry.attend === 'yes' ? '会参加' : '无法参加'));
    form.reset();
  })
});
