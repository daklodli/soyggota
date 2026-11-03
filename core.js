(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SoyggotaCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  function localDate(now = new Date()) {
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  }
  function normalize(values) {
    return Object.fromEntries(['name','date','guests','tour','wishes'].map(key => [key,String(values[key] ?? '').trim()]));
  }
  function validate(values, now = new Date()) {
    const data = normalize(values), errors = {};
    if (!data.name || data.name.length > 100) errors.name = 'name';
    if (!/^[1-9]\d*$/.test(data.guests) || Number(data.guests)>30) errors.guests = 'guests';
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.date);
    if (!parts) errors.date = 'date';
    else {
      const [year,month,day] = parts.slice(1).map(Number);
      const parsed = new Date(Date.UTC(year,month-1,day));
      if (parsed.getUTCFullYear()!==year || parsed.getUTCMonth()!==month-1 || parsed.getUTCDate()!==day || data.date<localDate(now)) errors.date='date';
    }
    if (data.wishes.length>2000) errors.wishes='wishes';
    return {data,errors,valid:Object.keys(errors).length===0};
  }
  function message(values, labels, tourName) {
    const data=normalize(values);
    return `${labels.request}\n\n${labels.nameKey}: ${data.name}\n${labels.dateKey}: ${data.date}\n${labels.guestsKey}: ${data.guests}\n${labels.routeKey}: ${tourName}\n${labels.wishKey}: ${data.wishes}`;
  }
  return {localDate,normalize,validate,message};
});
