/* HIDRA Mobile — atualização aditiva: relógio, clima real e atalho para relatório do Desktop */
(()=>{'use strict';
 const top=document.querySelector('.top'),hero=document.querySelector('.hero');
 if(!top||!hero)return;
 const style=document.createElement('style');style.textContent=`
 .hidra-daybar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:9px 11px;background:#092638d9;border:1px solid #286b83;border-radius:10px;color:#bceefd;font:12px Segoe UI,Arial,sans-serif;letter-spacing:.25px}
 .hidra-daybar button{color:#aaf0ff;border:1px solid #3085a1;background:#103a4e;border-radius:7px;padding:7px 9px;font:inherit}
 .hidra-daybar .hidra-weather{white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
 .hidra-day-shortcuts{display:flex;gap:8px;margin:0 0 7px}
 .hidra-day-shortcuts button{flex:1;background:#103447;border:1px solid #35768c;border-radius:9px;padding:10px 7px;color:#c6f3ff;font:12px Segoe UI,Arial,sans-serif}
 `;document.head.append(style);
 const bar=document.createElement('div');bar.className='hidra-daybar';bar.setAttribute('aria-label','Horário e condições do tempo');
 const clock=document.createElement('span');clock.setAttribute('aria-label','Data e horário');
 const weather=document.createElement('button');weather.type='button';weather.className='hidra-weather';weather.title='Escolher cidade para consultar o clima';
 bar.append(clock,weather);top.insertAdjacentElement('afterend',bar);
 const shortcuts=document.createElement('div');shortcuts.className='hidra-day-shortcuts';
 const report=document.createElement('button');report.type='button';report.textContent='◷ Resumo do dia';report.title='Pedir novo relatório ao Desktop';
 const notes=document.createElement('button');notes.type='button';notes.textContent='▤ Lembretes';notes.title='Consultar lembretes no Desktop';
 shortcuts.append(report,notes);hero.insertAdjacentElement('afterend',shortcuts);
 function sendToDesktop(message){const input=document.getElementById('message'),form=document.getElementById('sendform');if(!input||!form)return;input.value=message;if(form.requestSubmit)form.requestSubmit();else form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));}
 report.addEventListener('click',()=>sendToDesktop('HIDRA, me passa o resumo do dia'));
 notes.addEventListener('click',()=>sendToDesktop('HIDRA, abra meus lembretes'));
 const cityKey='hidra.mobile.weather.city.v1';let city='';try{city=localStorage.getItem(cityKey)||'';}catch(e){}
 let inFlight=false,cache=null;
 function renderClock(){const d=new Date(),g=d.getHours()<5?'Boa noite':d.getHours()<12?'Bom dia':d.getHours()<18?'Boa tarde':'Boa noite';clock.textContent=g+' · '+d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});clock.title=d.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}
 function weatherKind(c){if(c===0)return['☀️','céu limpo'];if(c<=3)return['⛅','parcialmente nublado'];if(c===45||c===48)return['🌫️','neblina'];if(c>=51&&c<=67)return['🌧️','chuva'];if(c>=71&&c<=77)return['❄️','neve'];if(c>=80&&c<=82)return['🌦️','pancadas de chuva'];if(c>=95)return['⛈️','trovoadas'];return['☁️','nublado'];}
 function showWeather(){weather.textContent=cache?cache.icon+' '+Math.round(cache.temp)+'°C · '+cache.city:city?'☁ Clima indisponível · toque para tentar':'☁ Configurar clima';}
 async function refresh(){if(!city||inFlight)return;inFlight=true;weather.textContent='☁ Consultando clima…';const activeCity=city;
 try{const geocode=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(activeCity)+'&count=1&language=pt&format=json');if(!geocode.ok)throw Error('Geocodificação indisponível');const places=await geocode.json();if(!places.results?.length)throw Error('Cidade não encontrada');const loc=places.results[0];const url='https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(loc.latitude)+'&longitude='+encodeURIComponent(loc.longitude)+'&current=temperature_2m,weather_code&timezone=auto';const response=await fetch(url);if(!response.ok)throw Error('Clima indisponível');const data=await response.json();if(!Number.isFinite(Number(data.current?.temperature_2m)))throw Error('Temperatura inválida');if(city!==activeCity)return;const kind=weatherKind(Number(data.current.weather_code));cache={city:loc.name,temp:Number(data.current.temperature_2m),icon:kind[0],description:kind[1],updated:Date.now()};
 }catch(e){if(city===activeCity)cache=null;console.warn('[HIDRA Mobile] Clima:',e.message);}finally{inFlight=false;showWeather();}}
 weather.addEventListener('click',()=>{const updated=prompt('Qual cidade devo usar para o clima? Ex.: São Paulo, SP',city);if(updated===null)return;city=updated.trim().slice(0,100);try{localStorage.setItem(cityKey,city);}catch(e){}cache=null;showWeather();if(city)refresh();});
 renderClock();showWeather();setInterval(renderClock,1000);setInterval(()=>{if(city)refresh();},15*60*1000);if(city)refresh();
 // A memória da saudação pertence ao Desktop: os comandos de voz/texto continuam sendo enviados à API existente.
})();
