const KEY = "kriggor-route-v1";
const initial = {clients:[],routes:[],visits:[],trips:[]};
let data = loadData();
let modalMode = null;

function loadData(){try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {...initial}}}
function saveData(){localStorage.setItem(KEY,JSON.stringify(data));renderAll()}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function dateNow(){return new Date().toLocaleDateString("pt-BR")}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function go(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));const names={dashboard:"Início",clients:"Clientes",routes:"Rotas",history:"Histórico de visitas",reports:"Relatórios",trips:"Minhas viagens",planning:"Planejamento diário",destinations:"Destinos",settings:"Configurações"};document.getElementById("crumb").textContent=names[page]||"Início";document.getElementById("sidebar").classList.remove("open");renderAll()}
function openModal(title,eyebrow,fields,mode){modalMode=mode;document.getElementById("modalTitle").textContent=title;document.getElementById("modalEyebrow").textContent=eyebrow;document.getElementById("modalFields").innerHTML=fields;document.getElementById("modal").showModal()}
function input(name,label,placeholder="",type="text",full=false){return `<div class="field ${full?"full":""}"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" placeholder="${placeholder}" /></div>`}
function area(name,label,placeholder=""){return `<div class="field full"><label for="${name}">${label}</label><textarea id="${name}" name="${name}" placeholder="${placeholder}"></textarea></div>`}
function selectField(name,label,options){return `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}">${options.map(o=>`<option>${o}</option>`).join("")}</select></div>`}
function addClient(){openModal("Novo cliente","CADASTRO DE CLIENTE",input("company","Empresa / cliente","Nome da empresa", "text",true)+input("contact","Pessoa de contato","Nome do contato")+input("phone","Telefone","(00) 00000-0000","tel")+input("city","Cidade","Cidade / UF")+input("address","Endereço","Rua, número, bairro","text",true)+selectField("category","Categoria",["Ativo","Potencial","Inativo"])+area("notes","Observações","Informações importantes sobre o cliente..."),"client")}
function addRoute(){openModal("Planejar nova rota","PLANEJAMENTO DE ROTA",input("routeName","Nome da rota","Ex.: Visitas região norte","text",true)+input("origin","Ponto de partida","Endereço de origem")+input("routeDate","Data","", "date")+area("stops","Destinos","Digite um destino por linha...")+selectField("returnToOrigin","Retorno",["Retornar à origem","Terminar no último destino"]),"route")}
function editRoute(id){
 const r=data.routes.find(x=>x.id===id); if(!r)return;
 const fields=`<div class="field full"><label for="routeName">Nome da rota</label><input id="routeName" name="routeName" value="${esc(r.routeName||"")}" required /></div>
 <div class="field"><label for="origin">Ponto de partida</label><input id="origin" name="origin" value="${esc(r.origin||"")}" /></div>
 <div class="field"><label for="routeDate">Data</label><input id="routeDate" name="routeDate" type="date" value="${esc(r.routeDate||"")}" /></div>
 <div class="field full"><label for="stops">Destinos (um por linha)</label><textarea id="stops" name="stops">${esc((r.stops||[]).map(s=>typeof s==="string"?s:s.label||"").join("\\n"))}</textarea></div>
 <div class="field"><label for="returnToOrigin">Retorno</label><select id="returnToOrigin" name="returnToOrigin"><option ${r.returnToOrigin==="Retornar à origem"?"selected":""}>Retornar à origem</option><option ${r.returnToOrigin==="Terminar no último destino"?"selected":""}>Terminar no último destino</option></select></div>`;
 openModal("Editar rota","ALTERAR PLANEJAMENTO",fields,"edit-route:"+id);
}
function addTrip(){openModal("Nova viagem","PLANEJAMENTO DE VIAGEM",input("tripName","Nome da viagem","Ex.: Viagem a Curitiba","text",true)+input("tripStart","Data de início","","date")+input("tripEnd","Data de término","","date")+area("tripPlaces","Destinos","Digite um destino por linha..."),"trip")}
document.addEventListener("click",e=>{
 const page=e.target.closest("[data-page]");if(page){e.preventDefault();go(page.dataset.page);return}
 const action=e.target.closest("[data-action]")?.dataset.action;
 if(action==="add-client")addClient();if(action==="new-route")addRoute();if(action==="add-trip")addTrip();
 if(e.target.closest("[data-edit-route]"))editRoute(e.target.closest("[data-edit-route]").dataset.editRoute);
 if(e.target.closest("[data-visit]")){const id=e.target.closest("[data-visit]").dataset.visit;const c=data.clients.find(x=>x.id===id);if(c){data.visits.unshift({id:crypto.randomUUID(),client:c.company,date:dateNow(),notes:"Visita marcada como concluída."});saveData();toast("Visita registrada com sucesso.")}}
 if(e.target.closest("[data-delete-client]")){const id=e.target.closest("[data-delete-client]").dataset.deleteClient;if(confirm("Excluir este cliente?")){data.clients=data.clients.filter(x=>x.id!==id);saveData();toast("Cliente excluído.")}}
 if(e.target.closest("[data-delete-route]")){const id=e.target.closest("[data-delete-route]").dataset.deleteRoute;if(confirm("Excluir esta rota?")){data.routes=data.routes.filter(x=>x.id!==id);saveData();toast("Rota excluída.")}}
 if(e.target.closest("[data-delete-trip]")){const id=e.target.closest("[data-delete-trip]").dataset.deleteTrip;if(confirm("Excluir esta viagem?")){data.trips=data.trips.filter(x=>x.id!==id);saveData();toast("Viagem excluída.")}}
});
document.getElementById("modalForm").addEventListener("submit",e=>{if(e.submitter?.value==="cancel")return;e.preventDefault();const f=new FormData(e.currentTarget),v=Object.fromEntries(f.entries());if(modalMode==="client"){if(!v.company?.trim()){toast("Informe o nome da empresa.");return}data.clients.unshift({id:crypto.randomUUID(),...v});toast("Cliente cadastrado.")}if(modalMode==="route"){if(!v.routeName?.trim()){toast("Informe um nome para a rota.");return}data.routes.unshift({id:crypto.randomUUID(),...v,stops:(v.stops||"").split("\n").map(x=>x.trim()).filter(Boolean)});toast("Rota criada.")}if(modalMode?.startsWith("edit-route:")){const id=modalMode.split(":")[1],r=data.routes.find(x=>x.id===id);if(!r)return;if(!v.routeName?.trim()){toast("Informe um nome para a rota.");return}Object.assign(r,v,{stops:(v.stops||"").split("\n").map(x=>x.trim()).filter(Boolean)});toast("Rota atualizada.")}if(modalMode==="trip"){if(!v.tripName?.trim()){toast("Informe um nome para a viagem.");return}data.trips.unshift({id:crypto.randomUUID(),...v,places:(v.tripPlaces||"").split("\n").map(x=>x.trim()).filter(Boolean)});toast("Viagem criada.")}document.getElementById("modal").close();saveData()});
document.getElementById("clientSearch").addEventListener("input",renderClients);document.getElementById("clientFilter").addEventListener("change",renderClients);
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("exportData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="kriggor-route-dados.json";a.click();URL.revokeObjectURL(a.href);toast("Arquivo de dados exportado.")});
function renderClients(){const q=(document.getElementById("clientSearch")?.value||"").toLowerCase(),filter=document.getElementById("clientFilter")?.value||"all";const rows=data.clients.filter(c=>(filter==="all"||c.category===filter)&&[c.company,c.contact,c.city].join(" ").toLowerCase().includes(q));document.getElementById("clientsTable").innerHTML=rows.map(c=>`<tr><td><strong>${esc(c.company)}</strong><br><small>${esc(c.address||"")}</small></td><td>${esc(c.contact||"—")}<br><small>${esc(c.phone||"")}</small></td><td>${esc(c.city||"—")}</td><td><span class="category ${c.category.toLowerCase()}">${esc(c.category)}</span></td><td><button class="row-actions" data-visit="${c.id}">Registrar visita</button> <button class="row-actions" data-delete-client="${c.id}">Excluir</button></td></tr>`).join("");document.getElementById("clientsEmpty").style.display=rows.length?"none":"block"}
function renderRoutes(){const el=document.getElementById("routesList");el.innerHTML=data.routes.map(r=>`<article class="data-card"><h3>${esc(r.routeName)}</h3><p>Partida: ${esc(r.origin||"Não informada")}</p><div class="meta"><span>▦ ${esc(r.routeDate||"Sem data")}</span><span>◎ ${(r.stops||[]).length} destino(s)</span><span>${esc(r.returnToOrigin||"")}</span></div>${r.stops?.length?`<p style="margin-top:13px"> ${r.stops.map((s,i)=>`${i+1}. ${esc(typeof s==="string"?s:s.label||"Local marcado no mapa")}`).join("<br>")}</p>`:""}<div class="card-actions"><button data-edit-route="${r.id}">✎ Editar rota</button><button data-delete-route="${r.id}">Excluir rota</button></div></article>`).join("")||emptyCard("⌁","Nenhuma rota criada","Crie uma rota para reunir os endereços das suas visitas.","add-route");refreshMapRouteOptions();setTimeout(initRouteMap,80)}
function renderTrips(){document.getElementById("tripsList").innerHTML=data.trips.map(t=>`<article class="data-card"><h3>${esc(t.tripName)}</h3><p>${esc(t.tripStart||"Data não definida")} ${t.tripEnd?"— "+esc(t.tripEnd):""}</p><div class="meta"><span>✈ ${(t.places||[]).length} destino(s)</span></div>${t.places?.length?`<p style="margin-top:13px">${t.places.map((s,i)=>`${i+1}. ${esc(s)}`).join("<br>")}</p>`:""}<div class="card-actions"><button data-delete-trip="${t.id}">Excluir viagem</button></div></article>`).join("")||emptyCard("✈","Nenhuma viagem planejada","Crie sua primeira viagem e adicione os destinos desejados.","add-trip")}
function emptyCard(icon,title,desc,action){return `<div class="panel empty-state" style="grid-column:1/-1"><span>${icon}</span><strong>${title}</strong><p>${desc}</p><button class="primary-btn small" data-action="${action}">＋ Criar agora</button></div>`}
function renderHistory(){document.getElementById("historyTable").innerHTML=data.visits.map(v=>`<tr><td><strong>${esc(v.client)}</strong></td><td>${esc(v.date)}</td><td>${esc(v.notes)}</td><td><span class="category">Concluída</span></td></tr>`).join("");document.getElementById("historyEmpty").style.display=data.visits.length?"none":"block"}
function renderDestinations(){const all=data.trips.flatMap(t=>(t.places||[]).map(p=>({trip:t.tripName,place:p})));document.getElementById("destinationsList").innerHTML=all.map(x=>`<article class="data-card"><h3>${esc(x.place)}</h3><p>Viagem: ${esc(x.trip)}</p></article>`).join("")||emptyCard("◎","Nenhum destino cadastrado","Adicione destinos ao criar uma viagem.","add-trip")}

let routeMap=null, mapMarkerLayer=null, selectedMapPoint=null, mapClickMarker=null;
function initRouteMap(){
 const node=document.getElementById("routeMap"); if(!node || typeof L==="undefined")return;
 if(!routeMap){
  routeMap=L.map("routeMap").setView([-30.0346,-51.2177],5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(routeMap);
  mapMarkerLayer=L.layerGroup().addTo(routeMap);
  routeMap.on("click",e=>{selectedMapPoint={lat:e.latlng.lat,lon:e.latlng.lng,label:`Ponto no mapa (${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)})`};if(mapClickMarker)mapMarkerLayer.removeLayer(mapClickMarker);mapClickMarker=L.marker(e.latlng).addTo(mapMarkerLayer).bindPopup("Novo ponto selecionado").openPopup();document.getElementById("addMapPointBtn").disabled=false;document.getElementById("mapHelp").textContent="Ponto selecionado. Escolha uma rota e clique em Adicionar à rota.";});
  document.getElementById("mapSearchBtn").addEventListener("click",searchMapAddress);
  document.getElementById("mapSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();searchMapAddress()}});
  document.getElementById("addMapPointBtn").addEventListener("click",addSelectedMapPoint);
  document.getElementById("mapRouteSelect").addEventListener("change",showRouteOnMap);
 } else {setTimeout(()=>routeMap.invalidateSize(),100)}
 refreshMapRouteOptions();showRouteOnMap();
}
function refreshMapRouteOptions(){
 const select=document.getElementById("mapRouteSelect");if(!select)return;const old=select.value;
 select.innerHTML='<option value="">Selecione uma rota</option>'+data.routes.map(r=>`<option value="${r.id}">${esc(r.routeName)}</option>`).join("");
 if(data.routes.some(r=>r.id===old))select.value=old;
}
async function searchMapAddress(){
 const q=document.getElementById("mapSearch").value.trim();if(!q){toast("Digite um endereço ou cidade.");return}
 const btn=document.getElementById("mapSearchBtn");btn.disabled=true;btn.textContent="Buscando...";
 try{
  const url="https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(q);
  const res=await fetch(url,{headers:{"Accept-Language":"pt-BR"}});if(!res.ok)throw new Error("Busca indisponível");
  const results=await res.json();if(!results.length){toast("Endereço não encontrado.");return}
  const p=results[0],lat=Number(p.lat),lon=Number(p.lon);selectedMapPoint={lat,lon,label:p.display_name};
  if(mapClickMarker)mapMarkerLayer.removeLayer(mapClickMarker);
  mapClickMarker=L.marker([lat,lon]).addTo(mapMarkerLayer).bindPopup(esc(p.display_name)).openPopup();
  routeMap.setView([lat,lon],15);document.getElementById("addMapPointBtn").disabled=false;
  document.getElementById("mapHelp").textContent="Local encontrado. Escolha uma rota e clique em Adicionar à rota.";
 }catch(err){toast("Não foi possível pesquisar agora. Tente novamente.")}finally{btn.disabled=false;btn.textContent="Buscar"}
}
function addSelectedMapPoint(){
 const routeId=document.getElementById("mapRouteSelect").value;if(!routeId){toast("Selecione uma rota primeiro.");return}
 if(!selectedMapPoint){toast("Pesquise ou selecione um ponto no mapa.");return}
 const route=data.routes.find(r=>r.id===routeId);if(!route)return;
 route.stops=route.stops||[];route.stops.push({label:selectedMapPoint.label,lat:selectedMapPoint.lat,lon:selectedMapPoint.lon});
 saveData();document.getElementById("addMapPointBtn").disabled=true;document.getElementById("mapHelp").textContent="Destino adicionado à rota.";selectedMapPoint=null;mapClickMarker=null;showRouteOnMap();toast("Destino adicionado à rota.")
}
function showRouteOnMap(){
 if(!routeMap||!mapMarkerLayer)return;mapMarkerLayer.clearLayers();mapClickMarker=null;selectedMapPoint=null;document.getElementById("addMapPointBtn").disabled=true;
 const id=document.getElementById("mapRouteSelect")?.value;const route=data.routes.find(r=>r.id===id);if(!route)return;
 const pts=[];(route.stops||[]).forEach((s,i)=>{if(typeof s==="object"&&Number.isFinite(s.lat)&&Number.isFinite(s.lon)){const ll=[s.lat,s.lon];pts.push(ll);L.marker(ll).addTo(mapMarkerLayer).bindPopup(`${i+1}. ${esc(s.label||"Destino")}`)}});
 if(pts.length){routeMap.fitBounds(pts,{padding:[25,25],maxZoom:14})}
}

function renderAll(){document.getElementById("statClients").textContent=data.clients.length;document.getElementById("statRoutes").textContent=data.routes.length;document.getElementById("statVisits").textContent=data.visits.length;document.getElementById("statTrips").textContent=data.trips.length;document.getElementById("reportClients").textContent=data.clients.length;document.getElementById("reportRoutes").textContent=data.routes.length;document.getElementById("reportVisits").textContent=data.visits.length;document.getElementById("reportSummary").textContent=`Você possui ${data.clients.length} cliente(s), ${data.routes.length} rota(s), ${data.visits.length} visita(s) concluída(s) e ${data.trips.length} viagem(ns) cadastrada(s).`;renderClients();renderRoutes();renderTrips();renderHistory();renderDestinations();document.getElementById("recentActivity").innerHTML=data.visits.slice(0,4).map(v=>`<div class="activity-item"><span class="activity-dot"></span><div><strong>Visita concluída — ${esc(v.client)}</strong><small>${esc(v.date)}</small></div></div>`).join("")||`<div class="empty-state compact"><span>◷</span><p>Nenhuma atividade por enquanto.</p><small>Quando você registrar visitas, elas aparecerão aqui.</small></div>`}
renderAll();
