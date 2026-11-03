const tours = [
  {id:'garni',cat:'day',days:1,img:'assets/garni.jpg',
    title:['Garni & Geghard','Գառնի և Գեղարդ','Гарни и Гегард'],
    alt:['Garni temple','Գառնիի տաճարը','Храм Гарни'],
    stops:[['Garni','Geghard','Symphony of Stones'],['Գառնի','Գեղարդ','Քարերի սիմֆոնիա'],['Гарни','Гегард','Симфония камней']],
    note:['A temple above the gorge, a monastery in the rock and a walk among the basalt columns. A good place to start if you have a day outside Yerevan.','Տաճար՝ կիրճի վերևում, ժայռափոր վանք և զբոսանք բազալտե սյուների մոտ։ Հարմար տարբերակ է, եթե Երևանից դուրս մեկ օր ունեք։','Храм над ущельем, скальный монастырь и прогулка среди базальтовых колонн. Вариант для одного дня за пределами Еревана.']},
  {id:'wine',cat:'wine',days:1,img:'assets/noravank.jpg',
    title:['Khor Virap, Areni & Noravank','Խոր Վիրապ, Արենի և Նորավանք','Хор Вирап, Арени и Нораванк'],
    alt:['Noravank monastery in the red cliffs','Նորավանքը՝ կարմիր ժայռերի մեջ','Нораванк среди красных скал'],
    stops:[['Khor Virap','Areni','Noravank'],['Խոր Վիրապ','Արենի','Նորավանք'],['Хор Вирап','Арени','Нораванк']],
    note:['From the Ararat valley to the red cliffs of Noravank. If you’d like to stop for a wine tasting in Areni, we’ll include it in your plan and quote.','Արարատյան դաշտից մինչև Նորավանքի կարմիր ժայռերը։ Եթե ուզում եք Արենիում գինի համտեսել, կանգառն ու արժեքը կներառենք առաջարկում։','От Араратской долины до красных скал Нораванка. Если хотите дегустацию в Арени, включим её в программу и расчёт.']},
  {id:'south',cat:'multi',days:3,img:'assets/tatev.jpg',
    title:['A few days in Syunik','Մի քանի օր Սյունիքում','Несколько дней в Сюнике'],
    alt:['Tatev monastery and the Vorotan canyon','Տաթևի վանքն ու Որոտանի կիրճը','Татевский монастырь и Воротанское ущелье'],
    stops:[['Vardenyats Pass','Shaki Waterfall','Tatev','Khndzoresk'],['Վարդենյաց լեռնանցք','Շաքիի ջրվեժ','Տաթև','Խնձորեսկ'],['Варденяцский перевал','Шакинский водопад','Татев','Хндзореск']],
    note:['A longer trip through southern Armenia. We’ll agree on the order of stops, overnight stays and driving time for each day.','Ավելի երկար ճամփորդություն Հայաստանի հարավում։ Կհամաձայնեցնենք կանգառների հերթականությունը, գիշերակացն ու յուրաքանչյուր օրվա ճանապարհի տևողությունը։','Поездка по югу Армении. Порядок остановок, ночёвки и время в дороге на каждый день согласуем заранее.']},
  {id:'georgia',cat:'georgia',days:3,img:'assets/tbilisi.jpg',
    title:['Yerevan to Tbilisi','Երևանից՝ Թբիլիսի','Из Еревана в Тбилиси'],
    alt:['The balconies and rooftops of old Tbilisi','Հին Թբիլիսիի պատշգամբներն ու տանիքները','Балконы и крыши старого Тбилиси'],
    stops:[['Yerevan','Dashbashi Canyon','Tbilisi'],['Երևան','Դաշբաշի կիրճ','Թբիլիսի'],['Ереван','Каньон Дашбаши','Тбилиси']],
    note:['Continue into Georgia with a route planned around your available days. Border requirements and stops are discussed before booking.','Շարունակեք ճանապարհը դեպի Վրաստան՝ ձեր օրերին հարմար ծրագրով։ Սահմանային պահանջներն ու կանգառները կքննարկենք նախքան ամրագրելը։','Продолжите путешествие в Грузию. Маршрут подстроим под ваши дни; остановки и требования для въезда обсудим до бронирования.']}
];
const core=SoyggotaCore;
const languages=['en','hy','ru'];
let lang='en';
try { const saved=localStorage.getItem('soyggota-lang'); if(languages.includes(saved))lang=saved; } catch {}
let filter='all';
let languagePicker,tourPicker;
const touchedFields=new Set();
let submitted=false;
const $=s=>document.querySelector(s);
const index=()=>languages.indexOf(lang);
const text=()=>content[lang];
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const duration=tour=>`${tour.days} ${text()[tour.days===1?'dayUnit':'days']}`;
const closeLabel=()=>({en:'Close',hy:'Փակել',ru:'Закрыть'}[lang]);
const privateLabel=()=>({en:'Private tour',hy:'Անհատական տուր',ru:'Индивидуальный тур'}[lang]);

function renderRoutes() {
  const list=tours.filter(tour=>filter==='all'||tour.cat===filter);
  const cards=$('#cards');
  cards.dataset.filter=filter;
  cards.innerHTML=list.map(tour=>{
    const compact=filter==='all'&&tours.indexOf(tour)>1;
    return `<article class="route-card${compact?' compact':''}">
      <img class="route-photo" src="${tour.img}" alt="${tour.alt[index()]}" loading="lazy" width="1600" height="1000">
      <div class="route-copy"><p class="route-meta"><span>${duration(tour)}</span><span>${text()[tour.cat]}</span></p>
      <h3><button type="button" data-tour="${tour.id}">${tour.title[index()]}</button></h3>
      <p class="route-stops">${tour.stops[index()].join(' · ')}</p>
      <p class="route-note">${tour.note[index()]}</p>
      <div class="route-bottom"><span>${text().quote}</span><button class="detail-link" type="button" data-tour="${tour.id}" aria-label="${text().details}: ${tour.title[index()]}">${text().details}</button></div></div>
    </article>`;
  }).join('');
  $('#filters').innerHTML=['all','day','wine','multi','georgia'].map(key=>`<button type="button" data-filter="${key}" class="${filter===key?'active':''}" aria-pressed="${filter===key}">${text()[key]}</button>`).join('');
}

function formValues() { return Object.fromEntries(new FormData($('#inquiry'))); }
function invalidatePrepared() {
  $('#prepared').hidden=true;
  $('#copy-status').textContent='';
}
function prepareMessage() {
  const values=formValues();
  const tour=tours.find(t=>t.id===values.tour);
  $('#message').value=core.message(values,text(),tour?tour.title[index()]:text().customOption);
}
function moveTo(element) {
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'});
}

function renderLanguage() {
  document.documentElement.lang=lang;
  document.title='Soyggota | '+({en:'Private tours in Armenia',hy:'Անհատական տուրեր Հայաստանում',ru:'Индивидуальные туры по Армении'}[lang]);
  document.querySelectorAll('[data-i]').forEach(el=>el.innerHTML=text()[el.dataset.i]||'');
  $('#language').value=lang;
  $('#tour-dialog .close').setAttribute('aria-label',closeLabel());
  const selection=$('#tour-select').value;
  $('#tour-select').innerHTML=`<option value="" disabled>${text().chooseRoute}</option><option value="custom">${text().customOption}</option>`+tours.map(t=>`<option value="${t.id}">${t.title[index()]}</option>`).join('');
  $('#tour-select').value=selection;
  if(!$('#prepared').hidden)prepareMessage();
  $('#copy-status').textContent='';
  $('header nav').setAttribute('aria-label',text().navLabel);
  $('#filters').setAttribute('aria-label',text().filterLabel);
  $('#language').setAttribute('aria-label',text().languageLabel);
  $('.hero-photo img').alt=text().heroAlt;
  $('.story figure img').alt=text().storyAlt;
  document.querySelector('meta[name=description]').content=text().description;
  renderRoutes();
  languagePicker?.render();tourPicker?.render();
  renderFieldErrors();
}

$('#language').addEventListener('change',e=>{
  lang=e.target.value;
  try{localStorage.setItem('soyggota-lang',lang)}catch{}
  renderLanguage();
});
$('#filters').addEventListener('click',e=>{
  const button=e.target.closest('[data-filter]');
  if(!button || !['all','day','wine','multi','georgia'].includes(button.dataset.filter))return;
  filter=button.dataset.filter;
  renderRoutes();
  $('#filters').querySelector(`[data-filter="${filter}"]`).focus({preventScroll:true});
});
const dialog=$('#tour-dialog');
$('#cards').addEventListener('click',e=>{
  const button=e.target.closest('[data-tour]');
  if(!button)return;
  const tour=tours.find(t=>t.id===button.dataset.tour);
  if(!tour)return;
  $('#tour-detail').innerHTML=`<div class="route-cover"><img src="${tour.img}" alt="${tour.alt[index()]}"><span>${text()[tour.cat]} · ${duration(tour)}</span></div><p class="eyebrow">${privateLabel()} · ${duration(tour)}</p>
    <h2 id="detail-title">${tour.title[index()]}</h2><p>${tour.note[index()]}</p>
    <ol class="itinerary route-timeline">${tour.stops[index()].map(stop=>`<li>${escapeHTML(stop)}</li>`).join('')}</ol>
    <h3>${text().included}</h3><p>${text().includedText}</p>
    <h3>${text().conditions}</h3><p>${text().conditionsText}</p>
    <button class="button" id="choose-tour">${text().choose}</button>`;
  $('#choose-tour').onclick=()=>{
    $('#tour-select').value=tour.id;
    $('#tour-select').dispatchEvent(new Event('change',{bubbles:true}));
    invalidatePrepared();
    dialog.close();
    (tourPicker?.trigger||$('#tour-select')).focus({preventScroll:true});
    moveTo($('#plan'));
  };
  dialog.showModal();
  document.body.classList.add('dialog-open');
});
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{
  if(e.target!==dialog)return;
  const bounds=dialog.getBoundingClientRect();
  if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom)dialog.close();
});
const fieldNames=['name','date','guests','tour','wishes'];
function renderFieldErrors() {
  const result=core.validate(formValues());
  for(const name of fieldNames){
    const field=$(`[name=${name}]`), group=$(`[data-field=${name}]`), error=$(`#${name}-error`);
    const invalid=Boolean(result.errors[name]&&touchedFields.has(name));
    const errorText=!result.data[name]?text()[`required_${name}`]||text()[`invalid_${name}`]:text()[`invalid_${name}`];
    group.classList.toggle('field-invalid',invalid);
    field.setAttribute('aria-invalid',String(invalid));
    error.textContent=invalid?errorText:'';error.hidden=!invalid;
    if(name==='tour'&&tourPicker){tourPicker.trigger.setAttribute('aria-invalid',String(invalid));tourPicker.trigger.setAttribute('aria-describedby','tour-error');}
  }
  const summary=$('#inquiry-error-summary');
  summary.hidden=!(submitted&&!result.valid);summary.textContent=summary.hidden?'':text().errorSummary;
  return result;
}
function updateDateLimit() { $('[name=date]').min=core.localDate(); }
updateDateLimit();
$('#inquiry').noValidate=true;
$('#inquiry').addEventListener('focusin',updateDateLimit);
$('#inquiry').addEventListener('focusout',e=>{
  if(fieldNames.includes(e.target.name)){touchedFields.add(e.target.name);renderFieldErrors();}
});
for(const event of ['input','change']) $('#inquiry').addEventListener(event,e=>{
  if(!fieldNames.includes(e.target.name))return;
  if(e.type==='change')touchedFields.add(e.target.name);
  invalidatePrepared();renderFieldErrors();
});
$('#inquiry').addEventListener('submit',e=>{
  e.preventDefault();updateDateLimit();submitted=true;
  fieldNames.forEach(name=>touchedFields.add(name));
  const result=renderFieldErrors();
  if(!result.valid){
    invalidatePrepared();
    const first=fieldNames.find(name=>result.errors[name]);
    const target=first==='tour'&&tourPicker?tourPicker.trigger:$(`[name=${first}]`);
    target.focus({preventScroll:true});moveTo(target);return;
  }
  prepareMessage();$('#prepared').hidden=false;$('#copy-status').textContent='';
  $('#message').focus({preventScroll:true});moveTo($('#prepared'));
});
async function copyPreparedMessage() {
  const value=$('#message').value;
  try {
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);return true;
  } catch {
    $('#message').focus({preventScroll:true});$('#message').select();
    try{return document.execCommand('copy');}catch{return false;}
  }
}
$('#copy').addEventListener('click',async()=>{
  const copied=await copyPreparedMessage();
  if(!$('#prepared').hidden)$('#copy-status').textContent=copied?text().copied:text().copyFail;
});
$('#instagram-send').addEventListener('click',async()=>{
  // The native link opens the chat. Start clipboard writing during the click,
  // before the browser transfers focus to the new tab.
  const copied=await copyPreparedMessage();
  $('#copy-status').textContent=copied?text().instagramCopied:text().copyFail;
});
languagePicker=SoyggotaSelect.enhance($('#language'),{kind:'language',label:()=>text().languageLabel});
tourPicker=SoyggotaSelect.enhance($('#tour-select'),{kind:'route',label:()=>text().tourLabel,details:value=>{
  const tour=tours.find(t=>t.id===value);
  return tour?`${duration(tour)} · ${text()[tour.cat]}`:text().customHint;
}});
renderLanguage();
