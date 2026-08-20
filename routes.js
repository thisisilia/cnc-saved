const http=require('http'),{spawn}=require('child_process'),fs=require('fs');
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',PORT=9296,URL='http://localhost:8081';
const chrome=spawn(CHROME,[`--remote-debugging-port=${PORT}`,'--headless=new','--disable-gpu','--no-first-run','--user-data-dir=/tmp/chrome-routes-profile','--hide-scrollbars',URL]);
const get=p=>new Promise((res,rej)=>{http.get({host:'127.0.0.1',port:PORT,path:p},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)))}).on('error',rej)});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  let t;for(let i=0;i<40;i++){try{t=(await get('/json/list')).find(x=>x.type==='page'&&x.webSocketDebuggerUrl);if(t)break}catch{}await sleep(500)}
  const WebSocket=require('ws');const ws=new WebSocket(t.webSocketDebuggerUrl,{perMessageDeflate:false});
  let id=0;const pend=new Map();const send=(m,p={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:p}))});
  ws.on('message',raw=>{const m=JSON.parse(raw);if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result);pend.delete(m.id)}});
  await new Promise(r=>ws.on('open',r));
  await send('Page.enable');await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:393,height:852,deviceScaleFactor:2,mobile:true});
  await send('Page.navigate',{url:URL});
  for(let i=0;i<60;i++){await sleep(900);const r=await send('Runtime.evaluate',{expression:`document.body.innerText.includes('Saved')`,returnByValue:true});if(r.result.value)break}
  await sleep(2500);
  const vis=`(els)=>els.filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0}).pop()`;
  const tap=async(js)=>{const r=await send('Runtime.evaluate',{expression:`(()=>{const el=${js};if(!el)return null;const b=el.getBoundingClientRect();return JSON.stringify({x:b.x+b.width/2,y:b.y+b.height/2})})()`,returnByValue:true});if(!r.result.value)return false;const{x,y}=JSON.parse(r.result.value);await send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1});await sleep(700);return true;};
  const byText=x=>`(${vis})([...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim()===${JSON.stringify(x)}))`;
  const info=async()=>(await send('Runtime.evaluate',{expression:`JSON.stringify({path:location.pathname, title:document.title})`,returnByValue:true})).result.value;
  console.log('start          ', await info());
  await tap(byText('My garage')); console.log('after My garage ', await info());
  await tap(byText('2000 Rover Mini Cooper')); console.log('after vehicle  ', await info());
  await tap(byText('Overall performance')); console.log('after perf     ', await info());
  // direct load a deep URL to confirm it resolves
  await send('Page.navigate',{url:URL+'/valuations'}); await sleep(2500);
  console.log('direct /valuations ', await info());
  chrome.kill();process.exit(0);
})();
