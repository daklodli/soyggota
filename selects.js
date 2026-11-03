/* Accessible custom menus backed by native selects for form data and fallback. */
(function(root) {
  const instances=new Set();
  function enhance(select,{kind='route',label=()=>'',details=()=>''}={}) {
    const wrapper=document.createElement('div');
    wrapper.className=`picker picker-${kind}`;
    select.before(wrapper); wrapper.append(select);
    const fieldLabel=select.labels?.[0];
    select.hidden=true; select.tabIndex=-1; select.setAttribute('aria-hidden','true');
    const trigger=document.createElement('button');
    trigger.type='button'; trigger.className='picker-trigger'; trigger.id=`${select.id}-trigger`;
    trigger.setAttribute('aria-haspopup','listbox'); trigger.setAttribute('aria-expanded','false');
    trigger.setAttribute('aria-controls',`${select.id}-menu`);
    const menu=document.createElement('div');
    menu.className='picker-menu'; menu.id=`${select.id}-menu`; menu.role='listbox'; menu.hidden=true;
    wrapper.append(trigger,menu);
    if(fieldLabel) fieldLabel.htmlFor=trigger.id;
    let opened=false,typed='',typedAt=0;
    const buttons=()=>[...menu.querySelectorAll('[role=option]')];
    const globe='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z" stroke="currentColor" stroke-width="1.5"/></svg>';
    function close(focus=false) {
      opened=false; menu.hidden=true; wrapper.classList.remove('is-open','opens-up');
      trigger.setAttribute('aria-expanded','false');
      if(focus)trigger.focus({preventScroll:true});
    }
    function render() {
      const selected=select.selectedOptions[0];
      const display=kind==='language'?({en:'EN',hy:'ՀԱՅ',ru:'РУС'}[select.value]):selected?.textContent||'';
      trigger.replaceChildren();
      if(kind==='language') {const icon=document.createElement('span');icon.className='picker-globe';icon.innerHTML=globe;trigger.append(icon);}
      const value=document.createElement('span'); value.className='picker-value'; value.textContent=display;
      const arrow=document.createElement('span');arrow.className='picker-chevron';arrow.setAttribute('aria-hidden','true');
      trigger.append(value,arrow);
      trigger.classList.toggle('is-placeholder',!select.value);
      trigger.setAttribute('aria-label',`${label()}: ${selected?.textContent||''}`);
      trigger.setAttribute('aria-required',String(select.required));
      menu.setAttribute('aria-label',label());
      menu.replaceChildren();
      for(const option of select.options) {
        if(option.disabled || !option.value)continue;
        const item=document.createElement('button');item.type='button';item.role='option';item.tabIndex=-1;
        item.className='picker-option';item.dataset.value=option.value;item.setAttribute('aria-selected',String(option.selected));
        const copy=document.createElement('span');copy.className='picker-option-copy';
        const title=document.createElement('span');title.className='picker-option-title';
        title.textContent=kind==='language'?({en:'English',hy:'Հայերեն',ru:'Русский'}[option.value]):option.textContent;
        copy.append(title);
        const sub=details(option.value);
        if(sub){const note=document.createElement('small');note.textContent=sub;copy.append(note);}
        item.append(copy);
        const check=document.createElement('span');check.className='picker-check';check.textContent='✓';check.setAttribute('aria-hidden','true');item.append(check);
        item.addEventListener('click',()=>{select.value=option.value;close(true);render();select.dispatchEvent(new Event('change',{bubbles:true}));});
        menu.append(item);
      }
    }
    function open(position='selected') {
      for(const instance of instances)if(instance!==api)instance.close();
      opened=true;menu.hidden=false;wrapper.classList.add('is-open');trigger.setAttribute('aria-expanded','true');
      const box=trigger.getBoundingClientRect(),height=menu.getBoundingClientRect().height;
      wrapper.classList.toggle('opens-up',box.bottom+height+12>innerHeight&&box.top>height+12);
      const options=buttons();
      const chosen=position==='first'?options[0]:position==='last'?options.at(-1):options.find(x=>x.dataset.value===select.value)||options[0];
      chosen?.focus({preventScroll:true});
    }
    trigger.addEventListener('click',()=>opened?close():open());
    trigger.addEventListener('keydown',e=>{
      if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();open(e.key==='End'?'last':e.key==='Home'?'first':'selected');}
      if(e.key==='Escape'){e.preventDefault();close(true);}
    });
    menu.addEventListener('keydown',e=>{
      const options=buttons(),current=options.indexOf(document.activeElement);
      if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
        e.preventDefault();
        const next=e.key==='Home'?0:e.key==='End'?options.length-1:(current+(e.key==='ArrowDown'?1:-1)+options.length)%options.length;
        options[next]?.focus();
      }else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close(true);}
      else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&e.key!==' '){
        if(Date.now()-typedAt>700)typed='';typed+=e.key.toLocaleLowerCase();typedAt=Date.now();
        options.find(x=>x.textContent.trim().toLocaleLowerCase().startsWith(typed))?.focus();
      }
    });
    wrapper.addEventListener('focusout',e=>{if(!wrapper.contains(e.relatedTarget))close();});
    document.addEventListener('pointerdown',e=>{if(!wrapper.contains(e.target))close();});
    window.addEventListener('resize',()=>close());
    select.addEventListener('change',render);
    const api={render,close,trigger};instances.add(api);render();return api;
  }
  root.SoyggotaSelect={enhance};
})(window);
