-- ============================================================
-- V7: Translate visible seed data to Spanish
-- ============================================================
-- Keep enum values such as student, instructor, active, completed,
-- beginner and published unchanged because the application expects them.

UPDATE users SET first_name = 'Administrador', last_name = 'Sistema'
WHERE email = 'admin@aprende.ues' AND first_name = 'Admin' AND last_name = 'System';

UPDATE users SET first_name = 'Sofía', last_name = 'Ramírez'
WHERE email = 'sofia.ramirez@aprende.ues';

UPDATE users SET last_name = 'Martínez'
WHERE email = 'diego.martinez@aprende.ues';

UPDATE users SET last_name = 'Gutiérrez'
WHERE email = 'ana.gutierrez@aprende.ues';

UPDATE users SET last_name = 'López'
WHERE email = 'carlos.lopez@aprende.ues';

UPDATE users SET last_name = 'Hernández'
WHERE email = 'miguel.hernandez@aprende.ues';

UPDATE users SET last_name = 'Sánchez'
WHERE email = 'laura.sanchez@aprende.ues';

UPDATE categories
SET name = CASE slug
    WHEN 'programming' THEN 'Programación'
    WHEN 'design' THEN 'Diseño'
    WHEN 'data-science' THEN 'Ciencia de Datos'
    WHEN 'frontend' THEN 'Desarrollo Frontend'
    WHEN 'backend' THEN 'Desarrollo Backend'
    WHEN 'ux-ui' THEN 'Diseño UX / UI'
    WHEN 'machine-learning' THEN 'Aprendizaje Automático'
    ELSE name
  END,
  description = CASE slug
    WHEN 'programming' THEN 'Cursos de desarrollo de software y programación'
    WHEN 'design' THEN 'Cursos de diseño visual, experiencia de usuario y creatividad'
    WHEN 'data-science' THEN 'Análisis de datos, aprendizaje automático y estadística'
    WHEN 'frontend' THEN 'HTML, CSS, JavaScript y frameworks modernos'
    WHEN 'backend' THEN 'Servidores, APIs REST, bases de datos y DevOps'
    WHEN 'ux-ui' THEN 'Investigación de experiencia de usuario, wireframes y prototipos'
    WHEN 'machine-learning' THEN 'Algoritmos de aprendizaje automático, aprendizaje profundo y aplicaciones de IA'
    ELSE description
  END,
  slug = CASE slug
    WHEN 'programming' THEN 'programacion'
    WHEN 'design' THEN 'diseno'
    WHEN 'data-science' THEN 'ciencia-datos'
    WHEN 'machine-learning' THEN 'aprendizaje-automatico'
    ELSE slug
  END
WHERE slug IN ('programming', 'design', 'data-science', 'frontend', 'backend', 'ux-ui', 'machine-learning');

UPDATE courses
SET title = CASE title
    WHEN 'HTML & CSS Fundamentals' THEN 'Fundamentos de HTML y CSS'
    WHEN 'JavaScript from Zero to Hero' THEN 'JavaScript desde Cero hasta Experto'
    WHEN 'React: Building Modern Interfaces' THEN 'React: Construcción de Interfaces Modernas'
    WHEN 'Python for Data Analysis' THEN 'Python para Análisis de Datos'
    WHEN 'UX Design Fundamentals' THEN 'Fundamentos de Diseño UX'
    WHEN 'REST APIs with Node.js & Express' THEN 'APIs REST con Node.js y Express'
    ELSE title
  END,
  description = CASE title
    WHEN 'HTML & CSS Fundamentals' THEN 'Aprende las bases de la web. Domina la estructura HTML y los estilos CSS para crear páginas atractivas y responsivas desde cero. Al final publicarás un portafolio real.'
    WHEN 'JavaScript from Zero to Hero' THEN 'Pasa de principiante absoluto a desarrollar con confianza en JavaScript. Estudia variables, funciones, manipulación del DOM, programación asíncrona y termina con un proyecto real que consume una API pública.'
    WHEN 'React: Building Modern Interfaces' THEN 'Domina React 18 con hooks, context y React Router. Construye tres aplicaciones completas: un gestor de tareas, un panel del clima y un feed social, todas conectadas a APIs reales.'
    WHEN 'Python for Data Analysis' THEN 'Aprende Python, pandas y Matplotlib para explorar, limpiar y visualizar conjuntos de datos reales. No necesitas experiencia previa en programación: empieza desde cero y construye un panel completo de datos.'
    WHEN 'UX Design Fundamentals' THEN 'Comprende el diseño centrado en usuarios desde la investigación hasta el prototipo de alta fidelidad. Practica design thinking, wireframes en Figma y pruebas de usabilidad con participantes reales.'
    WHEN 'REST APIs with Node.js & Express' THEN 'Diseña y construye APIs REST listas para producción. Cubre rutas, middleware, autenticación JWT, validación de entradas, manejo de errores y conexión a PostgreSQL con un ORM.'
    ELSE description
  END
WHERE title IN (
  'HTML & CSS Fundamentals',
  'JavaScript from Zero to Hero',
  'React: Building Modern Interfaces',
  'Python for Data Analysis',
  'UX Design Fundamentals',
  'REST APIs with Node.js & Express'
);

UPDATE modules
SET title = CASE title
    WHEN 'Introduction to HTML' THEN 'Introducción a HTML'
    WHEN 'Styling with CSS' THEN 'Estilos con CSS'
    WHEN 'Building a Real Project' THEN 'Construcción de un Proyecto Real'
    WHEN 'JS Fundamentals' THEN 'Fundamentos de JavaScript'
    WHEN 'Working with Data' THEN 'Trabajo con Datos'
    WHEN 'The DOM and Async JS' THEN 'El DOM y JavaScript Asíncrono'
    WHEN 'React Core Concepts' THEN 'Conceptos Principales de React'
    WHEN 'Hooks and Side Effects' THEN 'Hooks y Efectos Secundarios'
    WHEN 'Building a Full App' THEN 'Construcción de una Aplicación Completa'
    WHEN 'Python Essentials' THEN 'Esenciales de Python'
    WHEN 'Data Analysis with pandas' THEN 'Análisis de Datos con pandas'
    WHEN 'Data Visualization' THEN 'Visualización de Datos'
    WHEN 'Design Thinking' THEN 'Pensamiento de Diseño'
    WHEN 'Wireframing & Prototyping' THEN 'Wireframes y Prototipado'
    WHEN 'Usability Testing' THEN 'Pruebas de Usabilidad'
    WHEN 'Node.js Basics' THEN 'Bases de Node.js'
    ELSE title
  END,
  description = CASE title
    WHEN 'Introduction to HTML' THEN 'Comprende la estructura de toda página web.'
    WHEN 'Styling with CSS' THEN 'Haz que tus páginas se vean bien usando selectores, modelo de caja, Flexbox y Grid.'
    WHEN 'Building a Real Project' THEN 'Integra todo y publica un portafolio responsivo.'
    WHEN 'JS Fundamentals' THEN 'Variables, tipos de datos, operadores y flujo de control.'
    WHEN 'Working with Data' THEN 'Arreglos, objetos, destructuring y operador spread.'
    WHEN 'The DOM and Async JS' THEN 'Manipula el DOM, maneja eventos y consume datos desde APIs.'
    WHEN 'React Core Concepts' THEN 'JSX, componentes, props y estado con useState.'
    WHEN 'Hooks and Side Effects' THEN 'useEffect, hooks personalizados y estado global con useContext.'
    WHEN 'Building a Full App' THEN 'React Router, integración con API y proyecto final integrador.'
    WHEN 'Python Essentials' THEN 'Sintaxis, tipos de datos, listas, diccionarios, funciones y módulos.'
    WHEN 'Data Analysis with pandas' THEN 'DataFrames, limpieza de datos, agrupamiento y agregación.'
    WHEN 'Data Visualization' THEN 'Gráficas con Matplotlib y Seaborn, y construcción de un panel de datos.'
    WHEN 'Design Thinking' THEN 'Empatizar, definir e idear: las primeras tres fases del pensamiento de diseño.'
    WHEN 'Wireframing & Prototyping' THEN 'Desde bocetos en papel hasta prototipos interactivos en Figma.'
    WHEN 'Usability Testing' THEN 'Planifica, ejecuta y analiza pruebas de usabilidad con usuarios reales.'
    WHEN 'Node.js Basics' THEN 'El event loop, npm y tu primer servidor HTTP.'
    WHEN 'Express.js' THEN 'Rutas, middleware, manejo de errores y validación de solicitudes.'
    ELSE description
  END
WHERE title IN (
  'Introduction to HTML', 'Styling with CSS', 'Building a Real Project',
  'JS Fundamentals', 'Working with Data', 'The DOM and Async JS',
  'React Core Concepts', 'Hooks and Side Effects', 'Building a Full App',
  'Python Essentials', 'Data Analysis with pandas', 'Data Visualization',
  'Design Thinking', 'Wireframing & Prototyping', 'Usability Testing',
  'Node.js Basics', 'Express.js'
);

UPDATE lessons
SET title = CASE title
    WHEN 'How the Web Works' THEN 'Cómo Funciona la Web'
    WHEN 'Your First HTML Document' THEN 'Tu Primer Documento HTML'
    WHEN 'Semantic HTML Elements' THEN 'Elementos Semánticos de HTML'
    WHEN 'HTML Forms and Inputs' THEN 'Formularios y Campos en HTML'
    WHEN 'CSS Selectors and Specificity' THEN 'Selectores y Especificidad en CSS'
    WHEN 'The Box Model' THEN 'El Modelo de Caja'
    WHEN 'Flexbox Layout' THEN 'Diseño con Flexbox'
    WHEN 'CSS Grid Layout' THEN 'Diseño con CSS Grid'
    WHEN 'Planning Your Portfolio' THEN 'Planificación de tu Portafolio'
    WHEN 'Building the Portfolio Page' THEN 'Construcción de la Página de Portafolio'
    WHEN 'Making It Responsive' THEN 'Haciéndolo Responsivo'
    WHEN 'Variables and Data Types' THEN 'Variables y Tipos de Datos'
    WHEN 'Control Flow and Loops' THEN 'Flujo de Control y Bucles'
    WHEN 'Functions and Scope' THEN 'Funciones y Alcance'
    WHEN 'Arrays and Array Methods' THEN 'Arreglos y Métodos de Arreglos'
    WHEN 'Objects and JSON' THEN 'Objetos y JSON'
    WHEN 'Destructuring and Spread' THEN 'Destructuring y Spread'
    WHEN 'DOM Selection and Manipulation' THEN 'Selección y Manipulación del DOM'
    WHEN 'Events and Event Listeners' THEN 'Eventos y Event Listeners'
    WHEN 'Promises and Async/Await' THEN 'Promesas y Async/Await'
    WHEN 'Fetching Data with the Fetch API' THEN 'Obtención de Datos con Fetch API'
    WHEN 'Why React and How It Works' THEN 'Por Qué React y Cómo Funciona'
    WHEN 'JSX and Your First Component' THEN 'JSX y tu Primer Componente'
    WHEN 'State Management with useState' THEN 'Manejo de Estado con useState'
    WHEN 'useEffect and the Component Lifecycle' THEN 'useEffect y el Ciclo de Vida del Componente'
    WHEN 'Building Custom Hooks' THEN 'Construcción de Hooks Personalizados'
    WHEN 'Global State with useContext' THEN 'Estado Global con useContext'
    WHEN 'Client-Side Routing with React Router' THEN 'Rutas del Cliente con React Router'
    WHEN 'Connecting to a REST API' THEN 'Conexión a una API REST'
    WHEN 'Capstone: Full Social Feed App' THEN 'Proyecto Final: Aplicación Completa de Feed Social'
    WHEN 'Python Syntax and Data Types' THEN 'Sintaxis de Python y Tipos de Datos'
    WHEN 'Lists, Tuples, and Dictionaries' THEN 'Listas, Tuplas y Diccionarios'
    WHEN 'Functions and Modules' THEN 'Funciones y Módulos'
    WHEN 'Introduction to pandas DataFrames' THEN 'Introducción a DataFrames de pandas'
    WHEN 'Cleaning and Transforming Data' THEN 'Limpieza y Transformación de Datos'
    WHEN 'Grouping and Aggregation' THEN 'Agrupamiento y Agregación'
    WHEN 'Matplotlib Basics' THEN 'Bases de Matplotlib'
    WHEN 'Beautiful Charts with Seaborn' THEN 'Gráficas Atractivas con Seaborn'
    WHEN 'Capstone: Sales Analytics Dashboard' THEN 'Proyecto Final: Panel de Análisis de Ventas'
    WHEN 'What is UX Design?' THEN '¿Qué es el Diseño UX?'
    WHEN 'User Research Methods' THEN 'Métodos de Investigación de Usuarios'
    WHEN 'Personas and User Journey Maps' THEN 'Personas y Mapas de Recorrido de Usuario'
    WHEN 'Sketching and Low-Fi Wireframes' THEN 'Bocetos y Wireframes de Baja Fidelidad'
    WHEN 'High-Fidelity Wireframes in Figma' THEN 'Wireframes de Alta Fidelidad en Figma'
    WHEN 'Interactive Prototyping' THEN 'Prototipado Interactivo'
    WHEN 'Planning a Usability Test' THEN 'Planificación de una Prueba de Usabilidad'
    WHEN 'Conducting User Interviews' THEN 'Conducción de Entrevistas con Usuarios'
    WHEN 'Analyzing Results and Reporting' THEN 'Análisis de Resultados y Reportes'
    WHEN 'Node.js Architecture and the Event Loop' THEN 'Arquitectura de Node.js y el Event Loop'
    WHEN 'npm and Package Management' THEN 'npm y Gestión de Paquetes'
    WHEN 'Your First HTTP Server' THEN 'Tu Primer Servidor HTTP'
    WHEN 'Express Routing' THEN 'Rutas con Express'
    WHEN 'Middleware and Error Handling' THEN 'Middleware y Manejo de Errores'
    WHEN 'Connecting to PostgreSQL with an ORM' THEN 'Conexión a PostgreSQL con un ORM'
    ELSE title
  END
WHERE title IN (
  'How the Web Works', 'Your First HTML Document', 'Semantic HTML Elements',
  'HTML Forms and Inputs', 'CSS Selectors and Specificity', 'The Box Model',
  'Flexbox Layout', 'CSS Grid Layout', 'Planning Your Portfolio',
  'Building the Portfolio Page', 'Making It Responsive', 'Variables and Data Types',
  'Control Flow and Loops', 'Functions and Scope', 'Arrays and Array Methods',
  'Objects and JSON', 'Destructuring and Spread', 'DOM Selection and Manipulation',
  'Events and Event Listeners', 'Promises and Async/Await', 'Fetching Data with the Fetch API',
  'Why React and How It Works', 'JSX and Your First Component',
  'State Management with useState', 'useEffect and the Component Lifecycle',
  'Building Custom Hooks', 'Global State with useContext',
  'Client-Side Routing with React Router', 'Connecting to a REST API',
  'Capstone: Full Social Feed App', 'Python Syntax and Data Types',
  'Lists, Tuples, and Dictionaries', 'Functions and Modules',
  'Introduction to pandas DataFrames', 'Cleaning and Transforming Data',
  'Grouping and Aggregation', 'Matplotlib Basics', 'Beautiful Charts with Seaborn',
  'Capstone: Sales Analytics Dashboard', 'What is UX Design?', 'User Research Methods',
  'Personas and User Journey Maps', 'Sketching and Low-Fi Wireframes',
  'High-Fidelity Wireframes in Figma', 'Interactive Prototyping',
  'Planning a Usability Test', 'Conducting User Interviews',
  'Analyzing Results and Reporting', 'Node.js Architecture and the Event Loop',
  'npm and Package Management', 'Your First HTTP Server', 'Express Routing',
  'Middleware and Error Handling', 'Connecting to PostgreSQL with an ORM'
);

UPDATE lessons
SET description = CASE title
    WHEN 'Cómo Funciona la Web' THEN 'Navegadores, servidores y solicitudes HTTP: comprende qué ocurre cuando visitas una URL.'
    WHEN 'Tu Primer Documento HTML' THEN 'Crea desde cero un archivo HTML5 válido: doctype, head, body y tus primeras etiquetas.'
    WHEN 'Elementos Semánticos de HTML' THEN 'Reemplaza divs genéricos con header, nav, main, section, article y footer.'
    WHEN 'Formularios y Campos en HTML' THEN 'Construye formularios accesibles con text, email, select, checkbox, radio y textarea.'
    WHEN 'Selectores y Especificidad en CSS' THEN 'Selectores de clase, ID, atributo, pseudo-clase y pseudo-elemento, y cómo la especificidad resuelve conflictos.'
    WHEN 'El Modelo de Caja' THEN 'Domina contenido, relleno, borde y margen. Comprende box-sizing: border-box.'
    WHEN 'Diseño con Flexbox' THEN 'Alinea y distribuye elementos en una dimensión con display:flex, gap, align-items y justify-content.'
    WHEN 'Diseño con CSS Grid' THEN 'Construye diseños bidimensionales con grid-template-columns, grid-template-rows y áreas de grid.'
    WHEN 'Planificación de tu Portafolio' THEN 'Dibuja tu layout en papel y define paleta de colores y tipografía antes de escribir código.'
    WHEN 'Construcción de la Página de Portafolio' THEN 'Programa el portafolio completo: encabezado, hero, grid de proyectos y sección de contacto.'
    WHEN 'Haciéndolo Responsivo' THEN 'Agrega media queries para que tu portafolio se vea bien en móvil, tablet y escritorio.'
    WHEN 'Variables y Tipos de Datos' THEN 'var vs let vs const, tipos primitivos, typeof y conversión de tipos.'
    WHEN 'Flujo de Control y Bucles' THEN 'if/else, switch, ternario, for, while y for...of: decide y repite.'
    WHEN 'Funciones y Alcance' THEN 'Declaraciones, expresiones, funciones flecha, parámetros por defecto, closures y call stack.'
    WHEN 'Arreglos y Métodos de Arreglos' THEN 'map, filter, reduce, find, some y every: manipulación funcional de arreglos.'
    WHEN 'Objetos y JSON' THEN 'Objetos literales, notación de punto vs corchetes, métodos y JSON.parse / JSON.stringify.'
    WHEN 'Destructuring y Spread' THEN 'Desempaqueta arreglos y objetos, usa parámetros rest y compone datos con el operador spread.'
    WHEN 'Selección y Manipulación del DOM' THEN 'querySelector, innerHTML, classList, style, createElement y appendChild.'
    WHEN 'Eventos y Event Listeners' THEN 'addEventListener, delegación de eventos, preventDefault, stopPropagation y eventos de teclado.'
    WHEN 'Promesas y Async/Await' THEN 'Event loop, callbacks, cadenas de promesas y código asíncrono más limpio con async/await.'
    WHEN 'Obtención de Datos con Fetch API' THEN 'Solicitudes GET y POST, manejo de respuestas JSON, manejo de errores y construcción de una app del clima en vivo.'
    WHEN 'Por Qué React y Cómo Funciona' THEN 'El DOM virtual, la reconciliación y por qué las interfaces basadas en componentes escalan mejor.'
    WHEN 'JSX y tu Primer Componente' THEN 'Escribe JSX, comprende las reglas, crea componentes funcionales y pasa props.'
    WHEN 'Manejo de Estado con useState' THEN 'Declara estado, dispara renderizados, maneja formularios y eleva estado a componentes padre.'
    WHEN 'useEffect y el Ciclo de Vida del Componente' THEN 'Ejecuta efectos al montar, actualizar y desmontar: consulta datos, configura temporizadores y suscríbete a eventos.'
    WHEN 'Construcción de Hooks Personalizados' THEN 'Extrae y reutiliza lógica con estado entre componentes usando tus propios hooks useFetch y useLocalStorage.'
    WHEN 'Estado Global con useContext' THEN 'Evita prop drilling creando un contexto, un provider y consumiéndolo con useContext.'
    WHEN 'Rutas del Cliente con React Router' THEN 'Define rutas, usa Link y NavLink, lee parámetros de URL y protege rutas privadas.'
    WHEN 'Conexión a una API REST' THEN 'Consulta, muestra y pagina datos desde una API real. Maneja estados de carga y error correctamente.'
    WHEN 'Proyecto Final: Aplicación Completa de Feed Social' THEN 'Construye un feed social completo con autenticación, publicaciones, likes y comentarios, integrado con el backend.'
    WHEN 'Sintaxis de Python y Tipos de Datos' THEN 'Cadenas, enteros, flotantes, booleanos y None. Variables, print e input.'
    WHEN 'Listas, Tuplas y Diccionarios' THEN 'Crea, indexa, corta e itera colecciones de Python. Comprende la mutabilidad.'
    WHEN 'Funciones y Módulos' THEN 'Define funciones reutilizables, usa *args y **kwargs e importa desde la biblioteca estándar.'
    WHEN 'Introducción a DataFrames de pandas' THEN 'Carga archivos CSV y JSON, inspecciona shape, dtypes, head, describe e info.'
    WHEN 'Limpieza y Transformación de Datos' THEN 'Maneja valores faltantes, renombra columnas, cambia dtypes y aplica funciones personalizadas.'
    WHEN 'Agrupamiento y Agregación' THEN 'groupby, tablas dinámicas, merge y concat: responde preguntas reales de negocio con datos.'
    WHEN 'Bases de Matplotlib' THEN 'Gráficas de línea, barras, dispersión e histogramas. Personaliza títulos, ejes, colores y leyendas.'
    WHEN 'Gráficas Atractivas con Seaborn' THEN 'Heatmaps, pair plots, gráficas de violín y visualizaciones estadísticas con una sola línea.'
    WHEN 'Proyecto Final: Panel de Análisis de Ventas' THEN 'Combina todo: carga un conjunto de ventas real, límpialo, analízalo y produce un reporte visual completo.'
    WHEN '¿Qué es el Diseño UX?' THEN 'UX vs UI, el proceso de diseño UX y por qué la empatía es la herramienta más importante del diseño.'
    WHEN 'Métodos de Investigación de Usuarios' THEN 'Entrevistas, encuestas, investigación contextual, card sorting y síntesis de hallazgos.'
    WHEN 'Personas y Mapas de Recorrido de Usuario' THEN 'Convierte investigación en personas y mapas de recorrido accionables para todo el equipo.'
    WHEN 'Bocetos y Wireframes de Baja Fidelidad' THEN 'Prototipado en papel, Crazy 8s e ideación rápida: falla rápido antes de abrir Figma.'
    WHEN 'Wireframes de Alta Fidelidad en Figma' THEN 'Domina frames, auto-layout, componentes y tokens de diseño en Figma para crear wireframes precisos.'
    WHEN 'Prototipado Interactivo' THEN 'Conecta frames, agrega transiciones, crea overlays y comparte un prototipo navegable con interesados.'
    WHEN 'Planificación de una Prueba de Usabilidad' THEN 'Escribe un plan de prueba, define tareas, recluta participantes y prepara tu guion.'
    WHEN 'Conducción de Entrevistas con Usuarios' THEN 'Protocolo de pensar en voz alta, toma de notas y cómo evitar dirigir a los participantes.'
    WHEN 'Análisis de Resultados y Reportes' THEN 'Mapeo de afinidad, niveles de severidad y presentación de recomendaciones accionables.'
    WHEN 'Arquitectura de Node.js y el Event Loop' THEN 'Por qué Node es rápido, cómo funciona el event loop y cuándo conviene usarlo.'
    WHEN 'npm y Gestión de Paquetes' THEN 'package.json, npm install, scripts, devDependencies y versionado semántico.'
    WHEN 'Tu Primer Servidor HTTP' THEN 'Usa el módulo http integrado para manejar solicitudes GET y POST sin frameworks.'
    WHEN 'Rutas con Express' THEN 'Define rutas, usa parámetros y query strings, y organiza rutas con Router.'
    WHEN 'Middleware y Manejo de Errores' THEN 'Escribe middleware personalizado, usa morgan y cors, y construye un manejador global de errores.'
    WHEN 'Conexión a PostgreSQL con un ORM' THEN 'Configura Prisma, define un esquema, ejecuta migraciones y realiza operaciones CRUD.'
    ELSE description
  END
WHERE title IN (
  'Cómo Funciona la Web', 'Tu Primer Documento HTML', 'Elementos Semánticos de HTML',
  'Formularios y Campos en HTML', 'Selectores y Especificidad en CSS', 'El Modelo de Caja',
  'Diseño con Flexbox', 'Diseño con CSS Grid', 'Planificación de tu Portafolio',
  'Construcción de la Página de Portafolio', 'Haciéndolo Responsivo',
  'Variables y Tipos de Datos', 'Flujo de Control y Bucles', 'Funciones y Alcance',
  'Arreglos y Métodos de Arreglos', 'Objetos y JSON', 'Destructuring y Spread',
  'Selección y Manipulación del DOM', 'Eventos y Event Listeners', 'Promesas y Async/Await',
  'Obtención de Datos con Fetch API', 'Por Qué React y Cómo Funciona',
  'JSX y tu Primer Componente', 'Manejo de Estado con useState',
  'useEffect y el Ciclo de Vida del Componente', 'Construcción de Hooks Personalizados',
  'Estado Global con useContext', 'Rutas del Cliente con React Router',
  'Conexión a una API REST', 'Proyecto Final: Aplicación Completa de Feed Social',
  'Sintaxis de Python y Tipos de Datos', 'Listas, Tuplas y Diccionarios',
  'Funciones y Módulos', 'Introducción a DataFrames de pandas',
  'Limpieza y Transformación de Datos', 'Agrupamiento y Agregación',
  'Bases de Matplotlib', 'Gráficas Atractivas con Seaborn',
  'Proyecto Final: Panel de Análisis de Ventas', '¿Qué es el Diseño UX?',
  'Métodos de Investigación de Usuarios', 'Personas y Mapas de Recorrido de Usuario',
  'Bocetos y Wireframes de Baja Fidelidad', 'Wireframes de Alta Fidelidad en Figma',
  'Prototipado Interactivo', 'Planificación de una Prueba de Usabilidad',
  'Conducción de Entrevistas con Usuarios', 'Análisis de Resultados y Reportes',
  'Arquitectura de Node.js y el Event Loop', 'npm y Gestión de Paquetes',
  'Tu Primer Servidor HTTP', 'Rutas con Express', 'Middleware y Manejo de Errores',
  'Conexión a PostgreSQL con un ORM'
);

UPDATE reviews
SET body = CASE body
    WHEN 'Sofia explains everything with incredible clarity. I went from knowing nothing about HTML to deploying my own portfolio in just three weeks. The project-based approach makes every concept stick. Highly recommend to anyone starting from scratch.'
      THEN 'Sofía explica todo con muchísima claridad. Pasé de no saber nada de HTML a publicar mi propio portafolio en solo tres semanas. El enfoque basado en proyectos ayuda a fijar cada concepto. Muy recomendado para quien empieza desde cero.'
    WHEN 'This course completely changed the way I think about building products. The usability testing module was an eye-opener — I had never talked to real users before. Ana is an incredible teacher and the Figma exercises are top notch.'
      THEN 'Este curso cambió por completo mi forma de pensar al construir productos. El módulo de pruebas de usabilidad me abrió los ojos: nunca había hablado con usuarios reales. Ana es una docente excelente y los ejercicios en Figma son de primer nivel.'
    WHEN 'Really solid foundation course. The CSS Grid and Flexbox lessons are worth the price of admission alone. I would have loved a bit more content on CSS animations, but the portfolio project is genuinely impressive to show recruiters.'
      THEN 'Curso de fundamentos muy sólido. Las lecciones de CSS Grid y Flexbox valen muchísimo por sí solas. Me habría gustado un poco más de contenido sobre animaciones CSS, pero el proyecto de portafolio queda muy bien para mostrarlo.'
    ELSE body
  END
WHERE body IN (
  'Sofia explains everything with incredible clarity. I went from knowing nothing about HTML to deploying my own portfolio in just three weeks. The project-based approach makes every concept stick. Highly recommend to anyone starting from scratch.',
  'This course completely changed the way I think about building products. The usability testing module was an eye-opener — I had never talked to real users before. Ana is an incredible teacher and the Figma exercises are top notch.',
  'Really solid foundation course. The CSS Grid and Flexbox lessons are worth the price of admission alone. I would have loved a bit more content on CSS animations, but the portfolio project is genuinely impressive to show recruiters.'
);
