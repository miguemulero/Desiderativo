# Desiderativo - Asistente NotebookLM

Extensión de Chrome para asistir en la interpretación del Cuestionario Desiderativo, trabajando en conjunto con NotebookLM de Google.

## 🎯 ¿Qué es el Cuestionario Desiderativo?

El Cuestionario Desiderativo es una técnica proyectiva utilizada en psicología que permite explorar:
- Mecanismos de defensa del individuo
- Estructura de la personalidad
- Aspectos de la identidad
- Fortalezas y vulnerabilidades del yo

## 🚀 Características

- **Plantillas predefinidas**: Acceso rápido a plantillas para administración e interpretación
- **Integración con NotebookLM**: Trabaja directamente con la herramienta de Google para organizar y analizar respuestas
- **Guías de interpretación**: Criterios detallados para el análisis de respuestas
- **Interfaz intuitiva**: Diseño moderno y fácil de usar

## 📦 Instalación

### Método 1: Instalación desde el código fuente

1. Clona este repositorio o descarga el código
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el "Modo de desarrollador" en la esquina superior derecha
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta del proyecto

### Método 2: Desde Chrome Web Store (Próximamente)

La extensión estará disponible en Chrome Web Store próximamente.

## 💡 Cómo usar

1. **Instala la extensión** siguiendo los pasos anteriores
2. **Haz clic en el icono** de la extensión en la barra de herramientas de Chrome
3. **Selecciona una plantilla**:
   - 📝 Plantilla Básica: Para registro rápido de respuestas
   - 📊 Análisis Detallado: Para evaluación completa con análisis por respuesta
   - 🔍 Guía de Interpretación: Marco teórico y criterios de análisis
4. **La plantilla se copiará** automáticamente al portapapeles
5. **Abre NotebookLM** usando el botón "Enviar a NotebookLM" o manualmente
6. **Pega el contenido** en NotebookLM (Ctrl+V / Cmd+V)
7. **Completa la evaluación** usando NotebookLM para organizar y analizar

## 🔧 Funcionalidades

### Plantillas disponibles

#### 1. Plantilla Básica
Incluye:
- Datos del evaluado
- Las 6 consignas estándar (3 positivas, 3 negativas)
- Espacio para respuestas y justificaciones
- Sección de observaciones

#### 2. Análisis Detallado
Incluye:
- Datos generales completos
- Análisis individual por respuesta
- Identificación de mecanismos de defensa
- Síntesis interpretativa
- Conclusiones y recomendaciones

#### 3. Guía de Interpretación
Incluye:
- Marco teórico
- Criterios de análisis formal
- Análisis de contenido
- Mecanismos de defensa
- Indicadores de fortaleza yoica
- Referencias para integración diagnóstica

### Integración con NotebookLM

La extensión está diseñada para trabajar específicamente con NotebookLM:
- Detecta automáticamente cuando NotebookLM está abierto
- Permite copiar plantillas con un clic
- Facilita la organización de información
- Ayuda en la generación de análisis y síntesis

## 📁 Estructura del proyecto

```
Desiderativo/
├── manifest.json          # Configuración de la extensión
├── popup.html            # Interfaz de usuario del popup
├── popup.css             # Estilos del popup
├── popup.js              # Lógica del popup
├── content.js            # Script de contenido para NotebookLM
├── content.css           # Estilos para NotebookLM
├── background.js         # Service worker de fondo
├── icons/                # Iconos de la extensión
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # Este archivo
```

## 🛠️ Tecnologías utilizadas

- **Manifest V3**: Última versión del sistema de extensiones de Chrome
- **HTML5/CSS3**: Interfaz de usuario moderna
- **JavaScript**: Lógica de la extensión
- **Chrome Extension APIs**: Integración con el navegador

## 🔒 Permisos

La extensión requiere los siguientes permisos:
- `activeTab`: Para interactuar con la pestaña activa
- `storage`: Para guardar preferencias localmente
- `host_permissions` para `notebooklm.google.com`: Para integración con NotebookLM

## 📝 Uso profesional

Esta herramienta está diseñada para profesionales de la salud mental:
- Psicólogos clínicos
- Psiquiatras
- Psicoanalistas
- Estudiantes de psicología

**Importante**: El Cuestionario Desiderativo debe ser administrado e interpretado por profesionales capacitados en técnicas proyectivas.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo una licencia que permite su uso con fines educativos y profesionales.

## 📧 Contacto

Para preguntas, sugerencias o reportar problemas, por favor abre un issue en el repositorio.

## 🙏 Agradecimientos

- A la comunidad de profesionales de la salud mental
- A los desarrolladores de NotebookLM por crear una herramienta tan útil
- A todos los que contribuyen al desarrollo de técnicas proyectivas

---

**Nota**: Esta extensión es una herramienta de apoyo. La interpretación del Cuestionario Desiderativo requiere formación profesional específica en técnicas proyectivas y debe realizarse en el contexto de una evaluación psicológica completa.
