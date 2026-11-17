/**
 * ESPAÑOL (idioma principal)
 * ─────────────────────────────────────────────────────────────
 * ✏️  Este archivo define la forma de TODAS las traducciones.
 *     Si agregás una clave acá, TypeScript te va a pedir que la
 *     agregues en los demás idiomas.
 *
 *     {age}, {year}, {city}… se reemplazan automáticamente.
 */
const es = {
  meta: {
    title: "Jesús Benjamin Márquez Vargas — Programación, diseño y proyectos digitales",
    description:
      "Jesús Benjamin Márquez Vargas, estudiante de Salta, Argentina. Diseño y programo proyectos como SalesCost y SPATIUM IV, el juego que hicimos para la NASA Space Apps Challenge.",
  },
  nav: {
    skip: "Saltar al contenido",
    about: "Sobre mí",
    work: "Proyectos",
    team: "Equipo",
    wins: "Logros",
    contact: "Contacto",
    menu: "Menú",
    close: "Cerrar",
    language: "Idioma",
    home: "Inicio",
    sections: "Secciones",
    soundOn: "Activar música",
    soundOff: "Silenciar música",
  },
  intro: {
    loading: "Cargando",
  },
  hero: {
    hello: "Hola, soy",
    tagline: "Creo, programo y convierto ideas en experiencias digitales.",
    sub: "Exploro ideas, diseño soluciones y construyo proyectos que quiero compartir.",
    ctaProjects: "Explorar proyectos",
    ctaInstagram: "Ver Instagram",
    ageCity: "{age} años · {city}",
    scroll: "Bajá",
  },
  marquee: ["Programación", "Diseño web", "Aplicaciones", "Ideas", "Estrategia", "Equipo"],
  about: {
    title: "Antes que los proyectos, la persona.",
    p1: "Soy Jesús Benjamin Márquez Vargas, aunque casi todos me dicen Benjamin. Me gusta entender cómo funcionan las cosas y después construir las mías: una web, una app o una idea que todavía no existe.",
    p2: "Soy atento, curioso y bastante estratégico. Cuando me propongo algo, lo termino. Y si es en equipo, mejor: me gusta participar, aportar ideas y aprender de los demás.",
    p3: "Paso mucho tiempo en la computadora, programando, diseñando y armando publicaciones. Mi objetivo es seguir aprendiendo y crear proyectos útiles, atractivos y memorables.",
    facts: { age: "Edad", city: "Ciudad", school: "Colegio", birthday: "Cumpleaños", studies: "Estudios" },
    ageValue: "{age} años",
    studiesValue: "Nivel secundario",
    traits: ["atento", "estratégico", "creativo", "comprometido", "curioso", "colaborativo", "participativo"],
  },
  mind: {
    title: "Cómo pienso",
    items: [
      {
        title: "Primero entiendo, después construyo.",
        text: "Antes de abrir el editor pienso para quién es, qué problema resuelve y qué tendría que sentir quien lo usa.",
      },
      {
        title: "Juego varias jugadas adelante.",
        text: "Es una costumbre del ajedrez que me sirve en todo: en un torneo, en una hackatón y cuando organizo el código.",
      },
      {
        title: "Aprendo haciendo.",
        text: "Cada proyecto me deja una herramienta nueva. No espero saber todo para empezar: empiezo y aprendo en el camino.",
      },
    ],
  },
  skills: {
    title: "Lo que sé hacer",
    hint: "Pasá el mouse por cada habilidad para ver dónde la usé.",
    usedIn: "Usada en",
    groups: { create: "Crear", think: "Pensar", share: "Compartir" },
    items: {
      programming: "Programación",
      webdesign: "Diseño web",
      apps: "Creación de aplicaciones",
      posts: "Publicaciones",
      tools: "Herramientas digitales",
      strategy: "Pensamiento estratégico",
      ideas: "Generación de ideas",
      problems: "Resolución de problemas",
      detail: "Atención al detalle",
      learning: "Aprendizaje constante",
      teamwork: "Trabajo en equipo",
      collaboration: "Colaboración",
      communication: "Comunicar ideas",
      competitions: "Competencias",
    },
  },
  evidence: {
    salescost: "SalesCost",
    spatium: "SPATIUM IV",
    acindar: "Hackatón Acindar",
    chess: "Ajedrez",
    sumo: "Sumo Robótico",
    linefollower: "Seguidor de línea",
    instagram: "Instagram",
    pitch: "Pitch en NASA Space Apps",
  },
  hobbies: {
    title: "Fuera de horario",
    intro: "Cuando no estoy programando, probablemente estoy jugando. O programando otra cosa.",
    gamesLabel: "Lo que juego",
    alsoTitle: "También disfruto",
    also: {
      webs: "crear webs",
      apps: "crear aplicaciones",
      coding: "programar",
      computer: "usar la compu",
      tools: "aprender herramientas nuevas",
      ideas: "pensar ideas",
      posts: "hacer publicaciones",
      events: "participar en eventos",
      people: "conocer personas",
      experiments: "experimentar con proyectos digitales",
    },
  },
  solo: {
    title: "Lo que creo por mi cuenta",
    intro: "Proyectos que pensé, diseñé y desarrollé yo.",
  },
  projects: {
    salescost: {
      tagline: "Una calculadora de costos y precios para negocios chicos.",
      description:
        "SalesCost ayuda a talleres, tiendas, ferias y emprendedores a saber cuánto ganan de verdad. Separa lo que cuesta cada producto de los gastos del negocio, reparte esos gastos y sugiere un precio con el margen que buscás. También calcula cuántas ventas por mes hacen falta y arma reportes en Excel.",
      roles: [
        "Pensé la idea",
        "Definí qué iba a hacer y sus funciones",
        "Diseñé la página",
        "Construí la experiencia y la desarrollé",
      ],
      context: "Con SalesCost participé en una competencia de la municipalidad.",
      imageAlt: "Página de inicio de SalesCost con el panel de ejemplo de ganancia, costo por unidad y precio.",
    },
  },
  labels: {
    myPart: "Mi aporte",
    tech: "Tecnologías",
    competition: "Competencia",
    result: "Resultado",
    year: "Año",
    team: "Equipo",
    role: "Mi rol",
    with: "Con",
    project: "Proyecto",
    challenge: "Desafío",
    links: {
      site: "Visitar sitio",
      github: "Ver código",
      demo: "Ver demo",
      docs: "Conocer el proyecto",
      video: "Ver video",
      download: "Descargar",
      images: "Ver capturas",
    },
    opensNewTab: "(se abre en otra pestaña)",
  },
  team: {
    title: "Lo que construimos juntos",
    intro: "Las mejores ideas que tuve aparecieron hablando con otros. Estas son las experiencias en equipo que más me marcaron.",
    spatium: {
      subtitle: "Junior Astronaut Mission Trainer",
      challenge: "«Build a Junior Astronaut Mission Trainer»",
      description:
        "Un juego 3D para chicos de 7 a 12 años. Vivís en una colonia lunar y tomás las mismas decisiones que un planificador de misiones: cómo repartir la energía, cuándo blindarte contra la radiación, qué cultivar, dónde buscar agua y cómo fabricar propelente para volver a la Tierra.",
      lesson:
        "Ninguna decisión es gratis. Cada número del juego indica si es un dato real de la NASA, un dato real adaptado o un valor de juego.",
      features: [
        "13 misiones, de la llegada al regreso a la Tierra",
        "Tormentas solares: blindar o ahorrar energía",
        "Eventos aleatorios: polvo en los paneles, fisuras, cortes de comunicación",
        "Cultivos, búsqueda de agua y fabricación de propelente",
        "Construcción y ampliación de la base lunar",
        "Tutorial guiado, con voz y textos en español e inglés",
      ],
      dataTitle: "Datos reales que usa",
      data: [
        "NASA DONKI — tormentas solares (archivo)",
        "LCROSS — hielo de agua en el cráter Cabeus",
        "Chang'e 4 — radiación en la superficie lunar",
        "NASA Veggie y Plant Habitat — cultivos en el espacio",
        "NSSDCA — datos planetarios",
        "Muestras Apollo — rocas y helio-3",
      ],
      moonHint: "Arrastrá para girarla",
      memoryTitle: "Lo que más me gustó",
      memory:
        "Fue mi competencia favorita. Hubo charlas, nos acompañaron todo el tiempo, nos ayudaron con el pitch y conocimos a un montón de participantes. Aprendí muchísimo. Y sí: todavía tengo la gorra del evento.",
    },
    acindar: {
      description: "Una hackatón en equipo que disfruté mucho, con casi el mismo grupo con el que fuimos a la NASA Space Apps.",
    },
  },
  wins: {
    title: "Logros y competencias",
    items: {
      chess: {
        name: "Torneo Institucional de Ajedrez",
        result: "Campeón dos años seguidos",
        tags: ["Estrategia", "Concentración", "Planificación", "Toma de decisiones", "Constancia"],
        text: "Un torneo entre estudiantes del colegio. Ganarlo dos veces seguidas me enseñó a planificar, concentrarme, tomar decisiones con calma y ser constante.",
      },
      sumo: {
        name: "Sumo Robótico Virtual",
        result: "Robótica y programación en Python",
        tags: ["Programación", "Estrategia", "Trabajo en equipo", "Robótica", "Toma de decisiones", "Competencia"],
        text: "Programamos un robot en un simulador basado en Webots, con sensores de distancia, color y tacto, y motores. Podíamos ubicar y rotar cada sensor. El objetivo: sacar al robot rival del dohyo antes de que se termine el tiempo.",
        extra: "y estudiantes de primer y segundo año",
      },
      linefollower: {
        name: "Torneo de Robótica — Técnica «Albert Einstein»",
        result: "Categoría seguidor de línea",
        tags: ["Programación", "Sensores", "Estrategia", "Trabajo en equipo", "Aprendizaje técnico", "Competencia"],
        text: "En segundo año competimos con un robot seguidor de línea: sensores, programación y estrategia para que no se salga del recorrido.",
      },
    },
  },
  contact: {
    title: "¿Tenés una idea?",
    text: "Si querés hablar de un proyecto, una competencia o simplemente saludar, escribime.",
    email: "Escribime un mail",
    whatsapp: "Escribime por WhatsApp",
    whatsappText: "Hola Benjamin, vi tu web y quería escribirte.",
    copy: "Copiar mail",
    copied: "Mail copiado",
    socials: "Redes",
  },
  footer: {
    made: "Hecho por Benjamin en {city}.",
    top: "Volver arriba",
  },
};

export default es;
export type Dict = typeof es;
