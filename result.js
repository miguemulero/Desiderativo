const qs=(s)=>document.querySelector(s);

function getDraftId(){
  const params=new URLSearchParams(location.search);
  return params.get("draftId");
}

function escapeHtml(str){
  return(str||"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function renderToHtml(text){
  return escapeHtml(text).replaceAll("\n","<br/>");
}

async function load(){
  const draftId=getDraftId();
  if(!draftId){
    qs("#report").value="No se encontró el borrador del informe.";
    return;
  }

  const key="draft:"+draftId;
  const data=await chrome.storage.local.get(key);
  const item=data[key];

  if(!item){
    qs("#report").value="No se pudo cargar el informe.";
    return;
  }

  const report=qs("#report");
  report.value=(item?.reportText||"").trim();
  qs("#rendered").innerHTML=renderToHtml(report.value);
}

function syncRendered(){
  qs("#rendered").innerHTML=renderToHtml(qs("#report").value||"");
}

window.addEventListener("DOMContentLoaded",async()=>{
  await load();

  qs("#report").addEventListener("input",syncRendered);
  
  qs("#printPdf").addEventListener("click",()=>{
    syncRendered();
    window.print();
  });
});