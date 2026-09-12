import { Controller, Get, Header } from '@nestjs/common';

/** Minimal browser voice interface. Browser STT/TTS are replaceable UI adapters; M.A.D.I. core remains unchanged. */
@Controller('madi')
export class MadiVoiceUiController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  render(): string {
    return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>M.A.D.I. — Interfaz de Voz</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#05070b;color:#dce8ff;font:16px system-ui,Segoe UI,sans-serif;display:grid;place-items:center}.app{width:min(900px,94vw);text-align:center}.orb{width:300px;height:300px;margin:20px auto;border-radius:50%;border:1px solid #4a79b8;box-shadow:0 0 35px #1e4d86,0 0 100px #102c50 inset;position:relative;display:grid;place-items:center;transition:.25s}.orb:before,.orb:after{content:"";position:absolute;border-radius:50%;border:1px solid #719fe0}.orb:before{width:78%;height:78%}.orb:after{width:58%;height:58%}.orb.speaking{animation:pulse .8s infinite alternate;box-shadow:0 0 55px #55a5ff,0 0 110px #102c50 inset}.face{width:130px;height:90px;position:relative;z-index:2}.eye{position:absolute;top:28px;width:25px;height:12px;border-top:3px solid #bfe1ff;border-radius:50%}.eye.l{left:15px}.eye.r{right:15px}.mouth{position:absolute;left:45px;top:55px;width:40px;height:12px;border-bottom:3px solid #bfe1ff;border-radius:50%}.status{opacity:.75;margin:8px}.reply{min-height:50px;margin:20px auto;max-width:700px}.controls{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}button,input{font:inherit;border-radius:12px;border:1px solid #385b86;background:#0d1522;color:#e7f1ff;padding:12px 16px}button{cursor:pointer}button.primary{background:#17365d}.text{width:min(620px,80vw)}.hint{opacity:.5;font-size:13px}@keyframes pulse{to{transform:scale(1.035)}}
</style></head><body><main class="app"><h1>M.A.D.I.</h1><div id="orb" class="orb"><div class="face"><i class="eye l"></i><i class="eye r"></i><i class="mouth"></i></div></div><div id="status" class="status">Lista para escucharte</div><div id="reply" class="reply">Pulsa el micrófono y háblame.</div><div class="controls"><input id="text" class="text" placeholder="Escribe también aquí…"><button id="send">Enviar</button><button id="mic" class="primary">🎙 Hablar</button></div><p class="hint">La voz usa las capacidades disponibles de tu navegador. La conversación pasa por la misma API de interacción de M.A.D.I.</p></main>
<script>
const orb=document.querySelector('#orb'),status=document.querySelector('#status'),reply=document.querySelector('#reply'),text=document.querySelector('#text');
const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition; let recognition=null;
function state(s){status.textContent=s;orb.classList.toggle('speaking',s==='Hablando…')}
function speak(t){if(!('speechSynthesis' in window)||!t)return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t);u.lang='es-AR';u.onstart=()=>state('Hablando…');u.onend=()=>state('Lista para escucharte');speechSynthesis.speak(u)}
function extract(r){for(const k of ['conclusions','recommendations','proposedActions','data']){const v=r[k];if(Array.isArray(v)&&v.length){const x=v[0];if(typeof x==='string')return x;if(x&&typeof x==='object'&&typeof x.text==='string')return x.text}}if(r.error?.message)return r.error.message;if(r.authorization?.reason)return r.authorization.reason;return r.status?`Estado: ${r.status}`:'Sin respuesta.'}
async function send(content){if(!content.trim())return;state('Pensando…');reply.textContent='';try{const r=await fetch('/interactions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:crypto.randomUUID(),timestamp:new Date().toISOString(),source:{applicationId:'madi-voice-ui',interface:'web'},input:{type:'text',content}})});if(!r.ok)throw new Error('HTTP '+r.status);const data=await r.json();const out=extract(data);reply.textContent=out;speak(out);if(!speechSynthesis.speaking)state('Lista para escucharte')}catch(e){reply.textContent='No pude completar la interacción: '+e.message;state('Error')}}
document.querySelector('#send').onclick=()=>send(text.value);text.addEventListener('keydown',e=>{if(e.key==='Enter')send(text.value)});
if(Recognition){recognition=new Recognition();recognition.lang='es-AR';recognition.interimResults=false;recognition.continuous=false;recognition.onstart=()=>state('Escuchando…');recognition.onerror=e=>{state('Error');reply.textContent='Micrófono: '+e.error};recognition.onend=()=>{if(status.textContent==='Escuchando…')state('Lista para escucharte')};recognition.onresult=e=>{const t=e.results[0][0].transcript;text.value=t;send(t)}}else document.querySelector('#mic').disabled=true;
document.querySelector('#mic').onclick=()=>{if(!recognition)return;try{recognition.start()}catch{recognition.stop()}};
</script></body></html>`;
  }
}
