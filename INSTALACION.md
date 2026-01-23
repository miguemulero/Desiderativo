# Guía de Instalación - Extensión Desiderativo

## 📋 Requisitos Previos

- Google Chrome (versión 88 o superior)
- Acceso a NotebookLM de Google

## 🔧 Instalación Paso a Paso

### 1. Descargar el código

Tienes dos opciones:

**Opción A: Clonar el repositorio**
```bash
git clone https://github.com/miguemulero/Desiderativo.git
cd Desiderativo
```

**Opción B: Descargar ZIP**
1. Ve a https://github.com/miguemulero/Desiderativo
2. Haz clic en el botón verde "Code"
3. Selecciona "Download ZIP"
4. Descomprime el archivo en tu computadora

### 2. Cargar la extensión en Chrome

1. Abre Google Chrome
2. Escribe en la barra de direcciones: `chrome://extensions/`
3. Presiona Enter
4. En la esquina superior derecha, activa el **"Modo de desarrollador"**
   
   ![Activar modo desarrollador](https://user-images.githubusercontent.com/example/toggle.png)

5. Haz clic en el botón **"Cargar extensión sin empaquetar"**
   
   ![Cargar extensión](https://user-images.githubusercontent.com/example/load.png)

6. Navega hasta la carpeta donde descargaste/clonaste el proyecto
7. Selecciona la carpeta principal `Desiderativo`
8. Haz clic en "Seleccionar"

### 3. Verificar la instalación

La extensión debería aparecer en la lista con:
- ✅ Nombre: "Desiderativo - Asistente NotebookLM"
- ✅ Versión: 1.0.0
- ✅ Estado: Habilitada

### 4. Anclar la extensión (Recomendado)

Para acceso rápido:
1. Haz clic en el icono de puzzle (🧩) en la barra de herramientas de Chrome
2. Encuentra "Desiderativo - Asistente NotebookLM"
3. Haz clic en el icono de pin (📌) junto al nombre
4. La extensión aparecerá en tu barra de herramientas

## 🎯 Primer Uso

1. **Haz clic en el icono** de la extensión en tu barra de herramientas
2. Verás el popup con las opciones disponibles
3. **Prueba una plantilla**: Haz clic en "📝 Plantilla Básica"
4. La plantilla se copiará automáticamente al portapapeles
5. **Abre NotebookLM**: Haz clic en "📤 Enviar a NotebookLM"
6. **Pega el contenido**: Presiona Ctrl+V (Windows/Linux) o Cmd+V (Mac)

## ✅ Verificación de Funcionamiento

### Test 1: Popup
- [ ] El popup se abre al hacer clic en el icono
- [ ] Los botones responden al hacer clic
- [ ] Las plantillas se copian correctamente

### Test 2: NotebookLM
- [ ] El botón "Enviar a NotebookLM" abre una nueva pestaña
- [ ] Aparece el indicador de extensión activa en NotebookLM
- [ ] El contenido se puede pegar correctamente

## ❓ Solución de Problemas

### La extensión no aparece después de cargarla

**Solución:**
1. Asegúrate de que el modo desarrollador está activado
2. Verifica que seleccionaste la carpeta correcta (debe contener `manifest.json`)
3. Refresca la página de extensiones (F5)

### El popup no se abre

**Solución:**
1. Ve a `chrome://extensions/`
2. Busca mensajes de error en la extensión
3. Haz clic en "Recargar" en la tarjeta de la extensión
4. Intenta hacer clic en el icono nuevamente

### Los botones no funcionan

**Solución:**
1. Abre las herramientas de desarrollo del popup:
   - Clic derecho en el popup
   - Selecciona "Inspeccionar"
2. Revisa la consola en busca de errores
3. Recarga la extensión

### No se copia al portapapeles

**Solución:**
1. Asegúrate de que Chrome tiene permisos para acceder al portapapeles
2. Intenta en una pestaña diferente
3. Copia manualmente usando Ctrl+C/Cmd+C después de seleccionar el texto

### No funciona en NotebookLM

**Solución:**
1. Verifica que la URL sea exactamente `https://notebooklm.google.com/*`
2. Recarga la página de NotebookLM después de instalar la extensión
3. Verifica los permisos de la extensión en `chrome://extensions/`

## 🔄 Actualización

Para actualizar la extensión:

1. Descarga la nueva versión del código
2. Ve a `chrome://extensions/`
3. Haz clic en el botón "Recargar" (🔄) en la tarjeta de la extensión
4. Verifica que la versión se haya actualizado

## 🗑️ Desinstalación

Para desinstalar:

1. Ve a `chrome://extensions/`
2. Busca "Desiderativo - Asistente NotebookLM"
3. Haz clic en "Quitar"
4. Confirma la acción

## 📞 Soporte

Si encuentras problemas:
1. Revisa esta guía de solución de problemas
2. Consulta el README.md para más información
3. Abre un issue en GitHub con detalles del problema

## 🎓 Recursos Adicionales

- [Documentación de Chrome Extensions](https://developer.chrome.com/docs/extensions/)
- [NotebookLM](https://notebooklm.google.com)
- [Repositorio del Proyecto](https://github.com/miguemulero/Desiderativo)

---

¡Gracias por usar la Extensión Desiderativo! 🎯
