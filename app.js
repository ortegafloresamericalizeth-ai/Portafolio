const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY="portafolio-v1";
let S={cv:{},proj:[],ev:{}},edit=-1;
try{const r=localStorage.getItem(KEY);if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const esc=t=>String(t||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const lines=t=>String(t||"").split(/\n/).map(x=>x.trim()).filter(Boolean);
const list=t=>String(t||"").split(/[,\n]/).map(x=>x.trim()).filter(Boolean);
const ph=t=>`<span class="ph">${t}</span>`;

function tabs(){$$("nav button").forEach(b=>b.onclick=()=>{$$("nav button").forEach(x=>x.setAttribute("aria-selected",x===b));$$("main>section").forEach(s=>s.classList.toggle("on",s.id==="s-"+b.dataset.t))})}

function renderCV(){
  const c=S.cv,ul=a=>a.length?`<ul>${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";
  const links=[c.correo,c.github,c.linkedin,c.ciudad].filter(Boolean).map(esc).join(" | ");
  const pr=S.proj.slice(0,3).map(p=>`<p><strong>${esc(p.nombre)}</strong> (${esc(p.estado)}${p.fecha?", "+esc(p.fecha):""})${p.rol?" — "+esc(p.rol):""}${p.tecnologias?`<br><em>${esc(p.tecnologias)}</em>`:""}</p>`).join("");
  const sk=[["Técnicas",c.tecnicas],["Blandas",c.blandas],["Herramientas",c.herramientas]].filter(x=>x[1]).map(x=>`<li><strong>${x[0]}:</strong> ${esc(list(x[1]).join(", "))}</li>`).join("");
  $("#paper").innerHTML=`<h3>${c.nombre?esc(c.nombre):ph("Tu nombre")}</h3>
  <div class="role">${c.titulo?esc(c.titulo):ph("Tu perfil profesional")}</div>
  <div class="links">${links||ph("Correo | GitHub | LinkedIn")}</div>
  <h4>Perfil</h4><p>${c.resumen?esc(c.resumen):ph("Escribe 3 a 5 líneas sobre tus intereses y perfil.")}</p>
  <h4>Formación</h4>${lines(c.formacion).length?ul(lines(c.formacion)):ph("Tu escuela, carrera y semestre.")}
  <h4>Habilidades</h4>${sk?`<ul>${sk}</ul>`:ph("Técnicas, blandas y herramientas.")}
  <h4>Proyectos académicos</h4>${pr||ph("Agrega proyectos en la sección Mis proyectos.")}
  ${lines(c.cursos).length?`<h4>Idiomas y cursos</h4>${ul(lines(c.cursos))}`:""}`;
  progress();
}
function progress(){
  const c=S.cv,ok=c.nombre&&c.resumen&&c.formacion&&c.tecnicas;
  const a=$("#p1"),b=$("#p2");
  a.className=ok?"ok":"";a.textContent=(ok?"✓ ":"○ ")+"CV completo";
  const n=S.proj.length;b.className=n>=3?"ok":"";b.textContent=(n>=3?"✓ ":"○ ")+`Proyectos (${n} de 3)`;
}
function bindCV(){$$("[data-k]").forEach(i=>{i.value=S.cv[i.dataset.k]||"";i.oninput=()=>{S.cv[i.dataset.k]=i.value;save();renderCV()}})}
$("#print").onclick=()=>window.print();
$("#copy").onclick=async e=>{const t=$("#paper").innerText;try{await navigator.clipboard.writeText(t);e.target.textContent="Copiado"}catch(x){e.target.textContent="No se pudo copiar"}setTimeout(()=>e.target.textContent="Copiar como texto",1800)};

function renderProj(){
  const L=$("#plist");
  if(!S.proj.length){L.innerHTML='<div class="empty" style="grid-column:1/-1">Aún no hay proyectos. Llena el formulario y agrega el primero.</div>';progress();return}
  L.innerHTML=S.proj.map((p,i)=>`<article class="card"><h3>${esc(p.nombre)}</h3>
  <div><span class="chip">${esc(p.tipo)}</span><span class="chip st">${esc(p.estado)}</span></div>
  <div class="meta">${[p.contexto,p.fecha].filter(Boolean).map(esc).join(" | ")}</div>
  ${p.problema?`<p><strong>Problema:</strong> ${esc(p.problema)}</p>`:""}
  ${p.tecnologias?`<p><strong>Tecnologías:</strong> ${esc(p.tecnologias)}</p>`:""}
  ${p.rol?`<p><strong>Mi aportación:</strong> ${esc(p.rol)}</p>`:""}
  ${p.resultado?`<p><strong>Resultados:</strong> ${esc(p.resultado)}</p>`:""}
  ${/^https?:\/\//.test(p.enlace||"")?`<a href="${esc(p.enlace)}" target="_blank" rel="noopener">Ver evidencia</a>`:""}
  <div class="acts"><button data-e="${i}">Editar</button><button data-d="${i}">Eliminar</button></div></article>`).join("");
  $$("[data-e]").forEach(b=>b.onclick=()=>{edit=+b.dataset.e;$$("[data-p]").forEach(f=>f.value=S.proj[edit][f.dataset.p]||f.value);$("#padd").textContent="Guardar cambios";$("#pcancel").hidden=false;$("#pform").scrollIntoView({behavior:"smooth"})});
  $$("[data-d]").forEach(b=>b.onclick=()=>{if(confirm("¿Eliminar este proyecto?")){S.proj.splice(+b.dataset.d,1);save();renderProj();renderCV()}});
  progress();
}
function resetP(){edit=-1;$$("[data-p]").forEach(f=>f.tagName==="SELECT"?f.selectedIndex=0:f.value="");$("#padd").textContent="Agregar proyecto";$("#pcancel").hidden=true}
$("#padd").onclick=()=>{const p={};$$("[data-p]").forEach(f=>p[f.dataset.p]=f.value.trim());
  if(!p.nombre){$("[data-p=nombre]").focus();return}
  edit>=0?S.proj[edit]=p:S.proj.push(p);save();resetP();renderProj();renderCV()};
$("#pcancel").onclick=resetP;

const EV=[["Desarrollo personal","Manejo emocional"],["Desarrollo personal","Manejo del conflicto"],["Desarrollo personal","Toma de decisiones"],["Desarrollo personal","Liderazgo y trabajo en equipo"],["Desarrollo personal","Creatividad"],["Desarrollo personal","Salud y felicidad"],["Desarrollo personal","Proyecto de vida"],["Aprendizaje","Aprendizaje autorregulado"],["Aprendizaje","Aprendizaje basado en proyectos"],["Aprendizaje","Aprendizaje basado en problemas y TIC"],["Aprendizaje","Administración por proyectos"],["Aprendizaje","Emprendimiento social y económico"],["Aprendizaje","Vocación científica"],["Identidad profesional","Plan de carrera"],["Identidad profesional","Identidad profesional, protocolo y etiqueta"],["Identidad profesional","Relaciones industriales"],["Identidad profesional","Ética profesional"]];
function renderEv(){
  const g=["Desarrollo personal","Aprendizaje","Identidad profesional"];
  $("#evlist").innerHTML=g.map(n=>{const items=EV.filter(e=>e[0]===n);const done=items.filter(e=>S.ev[e[1]]).length;
  return `<div class="card"><h3>${n}</h3><div class="meta">${done} de 2 mínimas${done>=2?" ✓":""}</div>${items.map(e=>`<label style="display:flex;gap:8px;font-weight:400;margin:4px 0"><input type="checkbox" style="width:auto" data-v="${esc(e[1])}" ${S.ev[e[1]]?"checked":""}>${esc(e[1])}</label>`).join("")}</div>`}).join("");
  $$("[data-v]").forEach(c=>c.onchange=()=>{S.ev[c.dataset.v]=c.checked;save();renderEv()});
}
tabs();bindCV();renderCV();renderProj();renderEv();
