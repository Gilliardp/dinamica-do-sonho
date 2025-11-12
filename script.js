
document.getElementById('year').textContent = new Date().getFullYear();
const openChatBtn = document.getElementById('open-chat');
const chatWidget = document.getElementById('chat-widget');
const closeChat = document.getElementById('close-chat');
const chatBody = document.getElementById('chat-body');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
openChatBtn.addEventListener('click', () => chatWidget.classList.remove('chat-closed'));
closeChat.addEventListener('click', () => chatWidget.classList.add('chat-closed'));

function addMessage(text, who='bot'){const wrapper=document.createElement('div');wrapper.className='message '+(who==='user'?'user':'bot');wrapper.innerHTML=`<div class="bubble">${text}</div>`;chatBody.appendChild(wrapper);chatBody.scrollTop=chatBody.scrollHeight;}

let session = {slots:{}, step:0, lang:'pt'};
function mockAIReply(input){
  const s = session;
  if(s.step===0){ s.step=1; return t('ai_ask_environment'); }
  if(s.step===1){ s.slots.environment = input; s.step=2; return t('ai_ask_size'); }
  if(s.step===2){ s.slots.size = input; s.step=3; return t('ai_ask_type'); }
  if(s.step===3){ s.slots.type = input; s.step=4; return t('ai_ask_budget'); }
  if(s.step===4){ s.slots.budget = input; s.step=5; return t('ai_confirm'); }
  if(s.step===5){
    const summary = `ENV: ${s.slots.environment} | SIZE: ${s.slots.size} | TYPE: ${s.slots.type} | BUDGET: ${s.slots.budget}`;
    const whatsapp = encodeURIComponent(`Olá Alfredo, transferi um cliente com os detalhes: ${summary}`);
    const link = `https://wa.me/351918393290?text=${whatsapp}`;
    s.step=0; s.slots={};
    return `${t('ai_handoff') } <a href="${link}" target="_blank">${t('ai_handoff_click')}</a>`;
  }
  return t('not_understood');
}

chatForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const text = chatInput.value.trim();
  if(!text) return;
  addMessage(escapeHtml(text),'user');
  chatInput.value='';
  addMessage(t('thinking'),'bot');
  setTimeout(()=>{
    chatBody.removeChild(chatBody.lastChild);
    const reply = mockAIReply(text);
    addMessage(reply,'bot');
  },800);
});

function escapeHtml(s){return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}

const langSelector = document.getElementById('lang-selector');
let currentLang = 'pt';
const translations = {
  pt: { menu_about:"Sobre", menu_types:"Tipos", menu_gallery:"Galeria", menu_visualizer:"Visualizador", menu_contact:"Contato", chat_button:"Fale com a IA", hero_title:"Mais de 15 anos de tradição em tapetes", hero_sub:"Estoque completo: tapetes industriais, persas e orientais feitos à mão.", hero_cta:"Agende uma visita", about_title:"Sobre nós", about_text:"Há mais de 15 anos, a Dinâmica do Sonho combina tradição e conhecimento...", types_title:"Tipos de tapetes", type_industrial_title:"Industriais", type_industrial_text:"Resistentes e fáceis de limpar — ideais para áreas de circulação.", type_handmade_title:"Feitos à mão (Persas/Orientais)", type_handmade_text:"Peças artísticas e duradouras, perfeitas para salas.", type_outdoor_title:"Para áreas externas", type_outdoor_text:"Materiais tratados para varandas e áreas cobertas.", gallery_title:"Galeria — tapetes em stock", visualizer_title:"Visualizador - aplique um tapete numa foto de ambiente", contact_title:"Contato", contact_phone_label:"Telefone:", contact_address_label:"Endereço:", contact_hours_label:"Horário:", contact_whatsapp:"Abrir WhatsApp", chat_header:"Atendimento IA — Dinâmica do Sonho", chat_placeholder:"Escreva sua pergunta...", chat_send:"Enviar", thinking:"A nossa IA está a pensar...", not_understood:"Desculpe, não percebi. Pode reformular?", error:"Erro de conexão. Tente via WhatsApp: +351 918393290", ai_ask_environment:"Ótimo — em que ambiente pretende o tapete? (ex: sala, quarto, escritório)", ai_ask_size:"Qual o tamanho aproximado (ex: 2x3m)?", ai_ask_type:"Prefere industrial, persa/oriental ou não tem preferência?", ai_ask_budget:"Qual o seu orçamento aproximado?", ai_confirm:"Perfeito — vou transferir os detalhes para o nosso vendedor Alfredo.", ai_handoff:"Pronto — estou a transferir para Alfredo.", ai_handoff_click:"Abrir conversa com Alfredo" },
  en: { menu_about:"About", menu_types:"Types", menu_gallery:"Gallery", menu_visualizer:"Visualizer", menu_contact:"Contact", chat_button:"Talk to AI", hero_title:"Over 15 years of tradition in rugs", hero_sub:"Full stock: industrial, Persian and handmade oriental rugs.", hero_cta:"Book a visit", about_title:"About us", about_text:"For over 15 years, Dinâmica do Sonho has combined tradition and expertise...", types_title:"Rug types", type_industrial_title:"Industrial", type_industrial_text:"Durable and easy to clean — ideal for high-traffic areas.", type_handmade_title:"Handmade (Persian/Oriental)", type_handmade_text:"Artistic, durable pieces — perfect for living rooms.", type_outdoor_title:"Outdoor", type_outdoor_text:"Weather-treated materials for covered terraces.", gallery_title:"Gallery — stock rugs", visualizer_title:"Visualizer - apply a rug on a room photo", contact_title:"Contact", contact_phone_label:"Phone:", contact_address_label:"Address:", contact_hours_label:"Hours:", contact_whatsapp:"Open WhatsApp", chat_header:"AI Support — Dinâmica do Sonho", chat_placeholder:"Write your question...", chat_send:"Send", thinking:"Our AI is thinking...", not_understood:"Sorry, I didn’t understand. Could you rephrase?", error:"Connection error. Try WhatsApp: +351 918393290", ai_ask_environment:"Great — which room is the rug for? (eg: living room, bedroom, office)", ai_ask_size:"What's the approximate size (eg: 2x3m)?", ai_ask_type:"Prefer industrial, Persian/Oriental or no preference?", ai_ask_budget:"What's your approximate budget?", ai_confirm:"Perfect — I'll forward the details to our salesperson Alfredo.", ai_handoff:"Done — transferring to Alfredo.", ai_handoff_click:"Open chat with Alfredo" },
  fr: { menu_about:"À propos", menu_types:"Types", menu_gallery:"Galerie", menu_visualizer:"Visualiseur", menu_contact:"Contact", chat_button:"Parler à l’IA", hero_title:"Plus de 15 ans de tradition en tapis", hero_sub:"Stock complet : tapis industriels, persans et orientaux faits à la main.", hero_cta:"Prendre rendez-vous", about_title:"À propos de nous", about_text:"Depuis plus de 15 ans, Dinâmica do Sonho allie tradition et savoir-faire...", types_title:"Types de tapis", type_industrial_title:"Industriels", type_industrial_text:"Résistants et faciles à nettoyer — parfaits pour les zones à fort passage.", type_handmade_title:"Faits main (Persans/Orientaux)", type_handmade_text:"Pièces artistiques et durables — idéales pour les salons.", type_outdoor_title:"Extérieurs", type_outdoor_text:"Matériaux traités pour les terrasses couvertes.", gallery_title:"Galerie — tapis em stock", visualizer_title:"Visualiseur - appliquez un tapis sur une photo", contact_title:"Contact", contact_phone_label:"Téléphone:", contact_address_label:"Adresse:", contact_hours_label:"Horaires:", contact_whatsapp:"Ouvrir WhatsApp", chat_header:"Assistance IA — Dinâmica do Sonho", chat_placeholder:"Écrivez votre question...", chat_send:"Envoyer", thinking:"Notre IA réfléchit...", not_understood:"Désolé, je n’ai pas compris. Pouvez-vous reformuler ?", error:"Erreur de connexion. Essayez WhatsApp : +351 918393290", ai_ask_environment:"Super — pour quelle pièce est le tapis ? (ex: salon, chambre, bureau)", ai_ask_size:"Quelle est la taille approximative (ex: 2x3m)?", ai_ask_type:"Préférez industriel, persan/oriental ou pas de préférence?", ai_ask_budget:"Quel est votre budget approximatif?", ai_confirm:"Parfait — je transmets les détails à notre vendeur Alfredo.", ai_handoff:"Fait — transfert à Alfredo.", ai_handoff_click:"Ouvrir conversation avec Alfredo" },
  es: { menu_about:"Sobre", menu_types:"Tipos", menu_gallery:"Galería", menu_visualizer:"Visualizador", menu_contact:"Contacto", chat_button:"Habla con la IA", hero_title:"Más de 15 años de tradición en alfombras", hero_sub:"Stock completo: industriales, persas y orientales hechos a mano.", hero_cta:"Agendar visita", about_title:"Sobre nosotros", about_text:"Durante más de 15 años, Dinâmica do Sonho ha combinado tradición y experiencia...", types_title:"Tipos de alfombras", type_industrial_title:"Industriales", type_industrial_text:"Resistentes y fáciles de limpiar — ideales para zonas de paso.", type_handmade_title:"Hechas a mano (Persas/Orientales)", type_handmade_text:"Piezas artísticas y duraderas — perfectas para salas.", type_outdoor_title:"Exteriores", type_outdoor_text:"Materiales tratados para terrazas cubiertas.", gallery_title:"Galería — alfombras en stock", visualizer_title:"Visualizador - aplica una alfombra sobre una foto", contact_title:"Contacto", contact_phone_label:"Teléfono:", contact_address_label:"Dirección:", contact_hours_label:"Horario:", contact_whatsapp:"Abrir WhatsApp", chat_header:"Atención IA — Dinâmica do Sonho", chat_placeholder:"Escribe tu pregunta...", chat_send:"Enviar", thinking:"Nuestra IA está pensando...", not_understood:"Lo siento, no entendí. ¿Podrías reformular?", error:"Error de conexión. Prueba por WhatsApp: +351 918393290", ai_ask_environment:"Perfecto — ¿en qué ambiente necesita la alfombra? (ej: sala, dormitorio, oficina)", ai_ask_size:"¿Cuál es el tamaño aproximado (ej: 2x3m)?", ai_ask_type:"¿Prefiere industrial, persa/oriental o sin preferencia?", ai_ask_budget:"¿Cuál es su presupuesto aproximado?", ai_confirm:"Perfecto — voy a pasar los detalles al vendedor Alfredo.", ai_handoff:"Listo — transfiriendo a Alfredo.", ai_handoff_click:"Abrir chat con Alfredo" }
};

function t(key){ return translations[currentLang][key] || key; }
function updateTexts(){ document.querySelectorAll('[data-i18n]').forEach(el=>el.innerText=t(el.getAttribute('data-i18n'))); document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.getAttribute('data-i18n-placeholder'))); }
langSelector.addEventListener('change', (e)=>{ currentLang = e.target.value; session.lang = currentLang; updateTexts(); });
updateTexts();

// Gallery functions (fetch from server)
async function loadStock(){ try{ const res = await fetch('/api/stock'); const data = await res.json(); renderStock(data); populateVisualizerSelect(data);}catch(e){console.error(e);} }
function renderStock(items){ const list = document.getElementById('stock-list'); list.innerHTML=''; items.forEach(it=>{ const div=document.createElement('div'); div.className='stock-item'; div.innerHTML = `<img src="${it.image}" alt="${it.title}" style="width:100%;height:160px;object-fit:cover;border-radius:6px"><h4>${it.title}</h4><p>${it.desc}</p><p><strong>${it.price}</strong></p>`; list.appendChild(div); }); }

document.getElementById('add-stock-form').addEventListener('submit', async (e)=>{ e.preventDefault(); const form = e.target; const data = { title: form.title.value, price: form.price.value, image: form.imageUrl.value || 'images/stock-1.jpg', desc: form.desc.value }; try{ const res = await fetch('/api/stock', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); const saved = await res.json(); form.reset(); loadStock(); }catch(err){ console.error(err); } });

// visualizer implementation
let roomImg = new Image(); let rugImg = new Image();
let rugState = {x:250,y:350,scale:1,rotate:0,opacity:1};
const canvas = document.getElementById('visualizer-canvas');
const ctx = canvas.getContext('2d');
document.getElementById('room-file').addEventListener('change', (e)=>{ const f = e.target.files[0]; if(!f) return; const url = URL.createObjectURL(f); roomImg = new Image(); roomImg.onload = drawCanvas; roomImg.src = url; });
function populateVisualizerSelect(items){ const sel = document.getElementById('visualizer-rugs'); sel.innerHTML=''; items.forEach(it=>{ const opt=document.createElement('option'); opt.value = it.image; opt.innerText = it.title; sel.appendChild(opt); }); }
document.getElementById('visualizer-rugs').addEventListener('change', (e)=>{ rugImg = new Image(); rugImg.onload = ()=>{ drawCanvas(); }; rugImg.src = e.target.value; });
document.getElementById('r-scale').addEventListener('input', (e)=>{ rugState.scale = parseFloat(e.target.value); drawCanvas(); });
document.getElementById('r-rotate').addEventListener('input', (e)=>{ rugState.rotate = parseFloat(e.target.value); drawCanvas(); });
document.getElementById('r-opacity').addEventListener('input', (e)=>{ rugState.opacity = parseFloat(e.target.value); drawCanvas(); });
document.getElementById('download-visual').addEventListener('click', ()=>{ const url = canvas.toDataURL('image/jpeg',0.9); const a = document.createElement('a'); a.href = url; a.download = 'visualizacao.jpg'; a.click(); });
function useInVisualizer(img){ document.getElementById('visualizer-rugs').value = img; rugImg = new Image(); rugImg.onload = drawCanvas; rugImg.src = img; }
let dragging=false, dragOffset={x:0,y:0};
canvas.addEventListener('mousedown', (e)=>{ const rect=canvas.getBoundingClientRect(); const mx=e.clientX-rect.left, my=e.clientY-rect.top; const rw = (rugImg.width||200)*rugState.scale, rh=(rugImg.height||100)*rugState.scale; if(mx>rugState.x && mx<rugState.x+rw && my>rugState.y && my<rugState.y+rh){ dragging=true; dragOffset.x=mx-rugState.x; dragOffset.y=my-rugState.y; } });
canvas.addEventListener('mousemove', (e)=>{ if(!dragging) return; const rect=canvas.getBoundingClientRect(); rugState.x = e.clientX-rect.left - dragOffset.x; rugState.y = e.clientY-rect.top - dragOffset.y; drawCanvas(); });
canvas.addEventListener('mouseup', ()=>dragging=false);
canvas.addEventListener('mouseleave', ()=>dragging=false);
function drawCanvas(){ ctx.clearRect(0,0,canvas.width,canvas.height); if(roomImg && roomImg.src){ const iw=roomImg.width, ih=roomImg.height; const scale = Math.min(canvas.width/iw, canvas.height/ih); const nw = iw*scale, nh = ih*scale; const ox = (canvas.width-nw)/2, oy = (canvas.height-nh)/2; ctx.drawImage(roomImg, ox, oy, nw, nh); }else{ ctx.fillStyle='#ddd'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#666'; ctx.fillText('Carregue uma foto do ambiente',20,30); } if(rugImg && rugImg.src){ ctx.save(); const cx = rugState.x + (rugImg.width*rugState.scale)/2; const cy = rugState.y + (rugImg.height*rugState.scale)/2; ctx.translate(cx, cy); ctx.rotate(rugState.rotate * Math.PI/180); ctx.globalAlpha = rugState.opacity; ctx.drawImage(rugImg, - (rugImg.width*rugState.scale)/2, - (rugImg.height*rugState.scale)/2, rugImg.width*rugState.scale, rugImg.height*rugState.scale); ctx.globalAlpha = 1; ctx.restore(); } }
const mapsLink = document.getElementById('maps-link');
mapsLink.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Rua Paulo VI 89B, 2410-169 Leiria Portugal');
document.getElementById('facebook-link').href = '#';
document.getElementById('instagram-link').href = '#';
loadStock();
