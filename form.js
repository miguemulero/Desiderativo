document.addEventListener("DOMContentLoaded",()=>{
  const positivasContainer=document.getElementById("positivas-container");
  const negativasContainer=document.getElementById("negativas-container");
  const statusText=document.getElementById("statusText");
  const spinner=document.getElementById("spinner");
  const analizarBtn=document.getElementById("analizar");

  // Protocolo ACR precargado
  document.getElementById("nombre").value="protocolo ACR";
  document.getElementById("edad").value="11";
  document.getElementById("genero").value="masculino";
  document.getElementById("nivel_educativo").value="primario";
  document.getElementById("fecha").value="2026-01-20";
  document.getElementById("modalidad").value="estandar";
  document.getElementById("informacion").value="padres separados con custodia compartida y alto nivel de conflicto.  Tiene dos hermanos mayores que él y otro mellizo. ";
  document.getElementById("recuerdo").value="navidades abriendo regalos con la familia";

  function createCatexiaFija(num,simbolo="",tr=0,justificacion="",observaciones=""){
    const div=document.createElement("div");
    div.className="catexia-item";
    div.innerHTML=`
      <div class="catexia-header">Catexia ${num}</div>
      <div class="catexia-main">
        <input class="simbolo" type="text" placeholder="Símbolo" value="${simbolo}"/>
        <input class="tr" type="number" placeholder="TR (seg)" value="${tr}" min="0" step="0.01"/>
      </div>
      <div class="catexia-texts">
        <div class="field">
          <label>Justificación</label>
          <textarea class="justificacion" placeholder="Razón del símbolo...">${justificacion}</textarea>
        </div>
        <div class="field">
          <label>Observaciones</label>
          <textarea class="observaciones" placeholder="Notas adicionales...">${observaciones}</textarea>
        </div>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" class="cambio-check" id="cambio-${num}">
        <label for="cambio-${num}">Cambio</label>
      </div>
      <button type="button" class="add-btn" style="display:none;">+ Añadir respuesta</button>
      <div class="extras-container"></div>
    `;

    const checkbox=div.querySelector(".cambio-check");
    const addBtn=div.querySelector(".add-btn");
    const extrasContainer=div.querySelector(".extras-container");

    checkbox.addEventListener("change",()=>{
      if(checkbox.checked){
        addBtn.style.display="block";
      }else{
        addBtn.style.display="none";
        extrasContainer.innerHTML="";
      }
    });

    addBtn.addEventListener("click",()=>{
      const extra=document.createElement("div");
      extra.className="extra-response";
      extra.innerHTML=`
        <input type="text" placeholder="Símbolo" class="extra-simbolo"/>
        <input type="number" placeholder="TR (seg)" class="extra-tr" min="0" step="0.01"/>
        <button type="button" class="remove-btn">×</button>
      `;
      extra.querySelector(".remove-btn").addEventListener("click",()=>extra.remove());
      extrasContainer.appendChild(extra);
    });

    return div;
  }

  // Cargar catexias positivas ACR
  positivasContainer.appendChild(createCatexiaFija(1,"AGAPORNI",3,"porque puede volar, estar en el suelo, ir donde quiera...  lo puede adoptar una familia",""));
  positivasContainer.appendChild(createCatexiaFija(2,"GIRASOL",6,"porque le doy pipas a la gente, a veces gratis, a veces no",""));
  positivasContainer.appendChild(createCatexiaFija(3,"CARNE",10,"porque estaría buena y disfrutarían comiendo",""));

  // Cargar catexias negativas ACR
  negativasContainer.appendChild(createCatexiaFija(1,"MAPACHE",1,"porque huelen mal, me pueden tirar a la basura y matar",""));
  negativasContainer.appendChild(createCatexiaFija(2,"UN ORDENADOR",4,"porque me usarían y cuando se acabe la batería no podría respirar",""));
  negativasContainer.appendChild(createCatexiaFija(3,"UNA ROSA",10,"porque me arrancarían, me quitarían las espinas y tendría mucho dolor",""));

  function readCatexias(container){
    const items=Array.from(container.querySelectorAll(".catexia-item"));
    return items.map(item=>{
      const simbolo=item.querySelector(".simbolo")?.value?.trim()||"";
      const tr=Number(item.querySelector(".tr")?.value||0);
      const justificacion=item.querySelector(".justificacion")?.value?.trim()||"";
      const observaciones=item.querySelector(".observaciones")?.value?.trim()||"";
      
      const extras=Array.from(item.querySelectorAll(".extra-response")).map(ex=>({
        simbolo:ex.querySelector(".extra-simbolo")?.value?.trim()||"",
        tr:Number(ex.querySelector(".extra-tr")?.value||0)
      }));

      return{simbolo,tr,justificacion,observaciones,extras};
    });
  }

  function buildPrompt(p){
    const formatCatexia=(cat,idx)=>{
      let text=`${idx+1}. Símbolo: ${cat.simbolo} | TR(s): ${cat.tr}\n   Justificación: ${cat.justificacion}\n   Observaciones: ${cat.observaciones}`;
      if(cat.extras&&cat.extras.length>0){
        text+="\n   Cambios: ";
        cat.extras.forEach((ex,i)=>{
          text+=`\n      ${i+1}. ${ex.simbolo} | TR(s): ${ex.tr}`;
        });
      }
      return text;
    };

    const listPos=p.positivas.map((c,i)=>formatCatexia(c,i)).join("\n\n");
    const listNeg=p.negativas.map((c,i)=>formatCatexia(c,i)).join("\n\n");

    const protocolo=[
      "Edad: "+p.edad,
      "Sexo: "+p.genero,
      "Nivel educativo: "+p.nivel_educativo,
      "Fecha: "+p.fecha,
      "Modalidad: "+p.modalidad,
      "",
      "CATEXIAS POSITIVAS:",
      listPos,
      "",
      "CATEXIAS NEGATIVAS:",
      listNeg,
      "",
      "Asociaciones:",
      p.asociaciones||"-",
      "",
      "Recuerdo positivo:",
      p.recuerdo||"-",
      "",
      "Información relevante:",
      p.informacion||"-"
    ].join("\n");

    return `Analiza integralmente este protocolo sin modificar ni alterar los títulos de los epígrafes bajo ningún concepto mediante el esquema de la fuente "Análisis integral". Al finalizar el apartado VII, escribe en una línea aparte: FIN DEL INFORME. 

PROTOCOLO A ANALIZAR: 
Nombre/ID: ${p.nombre}

${protocolo}`;
  }

  function validateForm(protocolo){
    if(!protocolo.nombre){
      return "Completa el campo Nombre/ID.";
    }
    if(!protocolo.edad||protocolo.edad<4||protocolo.edad>100){
      return "La edad debe estar entre 4 y 100 años.";
    }
    if(!protocolo.fecha){
      return "Selecciona una fecha.";
    }
    return null;
  }

  function setBusy(isBusy){
    spinner.hidden=!isBusy;
    statusText.textContent=isBusy?"Analizando...":"";
    analizarBtn.disabled=isBusy;
  }

  async function startAnalysis(protocoloText){
    return new Promise((resolve)=>{
      chrome.runtime.sendMessage({type:"analizar-protocolo",protocoloText},(resp)=>{
        if(chrome.runtime.lastError){
          resolve({ok:false,error:chrome.runtime.lastError.message});
        }else{
          resolve(resp||{ok:false,error:"Error desconocido"});
        }
      });
    });
  }

  chrome.runtime.onMessage.addListener((msg)=>{
    if(msg?.type==="REPORT_READY"){
      setBusy(false);
    }
  });

  document.getElementById("analizar").addEventListener("click",async()=>{
    const protocolo={
      nombre:document.getElementById("nombre").value.trim(),
      edad:Number(document.getElementById("edad").value),
      genero:document.getElementById("genero").value,
      nivel_educativo:document.getElementById("nivel_educativo").value,
      fecha:document.getElementById("fecha").value,
      modalidad:document.getElementById("modalidad").value,
      informacion:document.getElementById("informacion").value.trim(),
      positivas:readCatexias(positivasContainer),
      negativas:readCatexias(negativasContainer),
      asociaciones:document.getElementById("asociaciones").value.trim(),
      recuerdo:document.getElementById("recuerdo").value.trim()
    };

    const validationError=validateForm(protocolo);
    if(validationError){
      alert(validationError);
      return;
    }

    const protocoloText=buildPrompt(protocolo);

    setBusy(true);
    const resp=await startAnalysis(protocoloText);

    if(!resp?.ok){
      setBusy(false);
      alert(resp?.error||"Error al procesar");
      return;
    }
  });

  document.getElementById("limpiar").addEventListener("click",()=>{
    positivasContainer.innerHTML="";
    negativasContainer.innerHTML="";
    positivasContainer.appendChild(createCatexiaFija(1));
    positivasContainer.appendChild(createCatexiaFija(2));
    positivasContainer.appendChild(createCatexiaFija(3));
    negativasContainer.appendChild(createCatexiaFija(1));
    negativasContainer.appendChild(createCatexiaFija(2));
    negativasContainer.appendChild(createCatexiaFija(3));
    document.getElementById("asociaciones").value="";
    document.getElementById("recuerdo").value="";
  });
});