// 简单交互：平滑导航、图片轮播、本地表单提示、双击编辑（仅本地，保存请编辑源码）
document.addEventListener('DOMContentLoaded', function(){
  // 平滑滚动
  document.querySelectorAll('.top-nav a').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    })
  })

  // 可编辑：双击切换 contenteditable（仅页面临时编辑）
  document.querySelectorAll('.editable').forEach(el=>{
    el.addEventListener('dblclick', ()=>{
      const is = el.getAttribute('contenteditable') === 'true';
      el.setAttribute('contenteditable', !is);
      if(!is) el.focus();
    })
  })

  // 轮播 - 简单图片列表（用户可在 images/ 替换文件名）
  const imgs = ['images/photo1-placeholder.svg','images/photo2-placeholder.svg','images/photo3-placeholder.svg'];
  let idx=0; const imgEl = document.getElementById('gallery-img');
  function show(i){ imgEl.src = imgs[i]; }
  document.querySelector('.gallery .prev').addEventListener('click', ()=>{ idx = (idx-1+imgs.length)%imgs.length; show(idx); });
  document.querySelector('.gallery .next').addEventListener('click', ()=>{ idx = (idx+1)%imgs.length; show(idx); });
  // 自动轮播
  setInterval(()=>{ idx = (idx+1)%imgs.length; show(idx); }, 5000);

  // 表单提交示例（静态页面，本地提示）
  const form = document.getElementById('rsvp-form');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')||'';
    const phone = data.get('phone')||'';
    alert('已提交（示例）\n姓名：'+name+'\n联系方式：'+phone+'\n注：要真正收集请替换为后端或第三方表单。');
    form.reset();
  })
});
