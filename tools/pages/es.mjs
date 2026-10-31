// Spanish page contents. Same shape as ja.mjs.
const X = '<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X (@hotaka_1123)</a>';

export default ({ UPDATED, LEGAL, IMG, HOME }) => ({
  htmlLang: 'es',
  locale: 'es_LA',
  siteSub: 'Creador de tarjetas de invocador',
  nav: { make: 'Crear tarjeta', guide: 'Cómo usarlo', templates: 'Plantillas', banner: 'Banners', faq: 'Preguntas frecuentes' },
  footerNav: { guide: 'Cómo usarlo', templates: 'Plantillas', banner: 'Banners promocionales', faq: 'Preguntas frecuentes', about: 'Acerca de y contacto', privacy: 'Política de privacidad', terms: 'Términos de uso' },
  footer: {
    storage: 'Todo lo que escribes se queda en este navegador y nunca se envía a un servidor. Puedes usar las imágenes que crees en redes sociales, streams y donde quieras.',
    contact: `¿Errores o sugerencias? Escríbeme en ${X}.`,
    analytics: 'Para mejorar el sitio usamos Google Analytics para contar visitas y el uso de las funciones (no se envía lo que escribes ni tus imágenes). Más detalles en la <a href="/privacy/">política de privacidad</a>.',
  },
  aria: { menu: 'Menú', siteInfo: 'Información del sitio', breadcrumbs: 'Ruta de navegación', toc: 'Contenido' },
  top: 'Inicio',
  cta: 'Crea tu tarjeta de invocador →',
  translationNote: 'Esta es una traducción del original en japonés. Si hay diferencias, prevalece la versión en japonés.',
  copied: 'Copiado',
  copyFailed: 'No se pudo copiar. Selecciona el texto y cópialo a mano',

  themes: [
    ['halloween', 'Halloween', 'Morado nocturno y naranja calabaza con murciélagos, telarañas y una calabaza iluminada. Tu ícono lleva sombrero de bruja. Queda genial con una skin Hechizada de fondo.'],
    ['christmas', 'Navidad', 'Rojo y verde con borde de bastón de caramelo, luces, copos de nieve y un regalo. Tu ícono lleva gorro de Santa. Pruébalo con una skin invernal.'],
    ['newyear', 'Año Nuevo', 'Carmesí y dorado con rayos de sol naciente, flores de ciruelo y kagami mochi. Tu ícono lleva un abanico. Perfecto para un post de “Feliz Año Nuevo”.'],
    ['hextech', 'Hextech', 'El look clásico dorado y azul marino, parecido al cliente de LoL. Combina con cualquier fondo de skin; si no sabes cuál elegir, elige este.'],
    ['noxus', 'Noxus', 'Un diseño rojo y negro contundente. Perfecto con skins de campeones noxianos como Darius o Sion.'],
    ['freljord', 'Freljord', 'Un diseño celeste helado. Ideal con Ashe, Sejuani o cualquier skin invernal.'],
    ['shadow', 'Islas de la Sombra', 'Un diseño verde brillante y siniestro para Thresh, Viego y los campeones de las Islas de la Sombra.'],
    ['ionia', 'Jonia', 'Un diseño suave rosa y morado para Ahri, Irelia y skins de flor de cerezo.'],
    ['fairy', 'Rosa soñador', 'Un diseño “yume-kawaii” rosa pastel con cuerno de unicornio, dulces y piso a cuadros.'],
    ['fairy-mint', 'Azul soñador', 'La versión azul de Rosa soñador, mezclando azul pastel y lavanda.'],
    ['guardian', 'Guardiana Estelar', 'Un diseño claro, brillante y tierno para skins de Guardiana Estelar y de chicas mágicas.'],
    ['jirai', 'Jirai-kei', 'El estilo japonés “jirai-kei” en negro y rosa con moños, corazones, borde de encaje y cuadros vichy.'],
    ['ryousan', 'Ryousan-kei', 'El dulce estilo japonés “ryousan-kei” en blanco y rosa pálido con perlas, encaje y moños.'],
    ['y2k', 'Y2K', 'Estrellas cromadas, caritas felices, mariposas y un marco arcoíris para un look retro Y2K.'],
    ['gaming', 'Gaming RGB', 'Marco neón arcoíris RGB, texto brillante y cuadrícula synthwave sobre negro. Pura energía de PC gamer.'],
    ['wafu', 'Japonés', 'Un diseño japonés moderno: papel washi, rojo, blanco y dorado, olas seigaiha, pétalos de cerezo y tipografía Mincho.'],
  ],

  templates: {
    title: 'Plantillas de tarjeta de invocador (temas) | SUMMONER CARD',
    description: 'Más de 15 plantillas gratis de tarjeta de invocador de League of Legends: Halloween, Navidad, Gaming RGB, Y2K, japonés y más. Elige un tema y crea tu tarjeta de perfil de LoL al instante.',
    h1: 'Plantillas de tarjeta de invocador (temas)',
    intro: `
      <p>SUMMONER CARD tiene más de 15 plantillas (temas) para elegir. No hay que editar imágenes: rellenas los campos y tu tarjeta está lista. Pulsa “Usar esta plantilla” bajo un ejemplo para abrir el creador con ese tema elegido.</p>
      <p>Todos los temas pueden usar cualquier skin de campeón o una imagen tuya como fondo. Solo con cambiar el fondo, la tarjeta cambia por completo.</p>`,
    button: 'Usar esta plantilla →',
    alt: (name) => `Plantilla de tarjeta de invocador: ${name}`,
  },

  faq: {
    title: 'Preguntas frecuentes | SUMMONER CARD (Summoner Card Maker)',
    description: 'Preguntas frecuentes sobre SUMMONER CARD, el creador de tarjetas de invocador de LoL: si es gratis, cómo guardar en el móvil, qué hacer si no guarda en la app de X, cómo se tratan tus datos y más.',
    h1: 'Preguntas frecuentes',
    items: [
      ['¿Qué es una tarjeta de invocador?', 'Es una imagen de perfil donde los jugadores de League of Legends resumen su rango, roles, campeones principales, horario de juego y más. Se usa para encontrar dúo y amigos en X, servidores de Discord y otros sitios.'],
      ['¿Es gratis? ¿Necesito una cuenta?', 'Es totalmente gratis y no requiere registro ni inicio de sesión.'],
      ['¿Puedo crearla en el móvil?', 'Sí, directamente en el navegador del móvil. En iPhone, al pulsar “Guardar imagen” la tarjeta se muestra a tamaño completo; mantenla pulsada para guardarla en Fotos.'],
      ['No puedo guardar cuando abro el sitio desde la app de X', 'Los navegadores dentro de apps (X, Instagram, Discord y otras) suelen bloquear guardar y compartir imágenes. Elige “Abrir en el navegador” en el menú “…” de arriba a la derecha para abrir el sitio en Safari o Chrome. También puedes mantener pulsada la imagen que aparece para guardarla.'],
      ['¿Tengo que editar una imagen de plantilla?', 'No necesitas ningún editor de imágenes. Rellena los campos y elige un tema, y la tarjeta se genera con los íconos de campeones y de rango.'],
      ['¿Y si no quiero mostrar mi nombre de invocador?', 'Debajo del campo de nombre puedes elegir una opción en su lugar: “Privado”, “Te lo digo al jugar”, “Pregúntame por DM” o “Cuando seamos amigos”.'],
      ['¿Mi rango se obtiene automáticamente?', 'Por ahora no; lo eliges tú. Si no tienes rango o prefieres no mostrarlo, puedes dejarlo así.'],
      ['¿Lo que escribo se envía a algún sitio?', 'No. Lo que escribes y las imágenes que subes se procesan y guardan solo en tu navegador y nunca se envían a nuestro servidor.'],
      ['¿Puedo editar mi tarjeta después?', 'Lo que escribes se guarda automáticamente en tu navegador, así que puedes seguir donde lo dejaste. No se conserva si borras los datos del navegador o abres el sitio en otro dispositivo o navegador.'],
      ['¿Puedo usar las imágenes como quiera?', 'Puedes publicarlas libremente en X, Discord, tu stream, paneles de Twitch y demás. No puedes vender las imágenes ni el arte de LoL que contienen. Consulta los términos de uso para más detalles.'],
      ['¿Puedo quitar la URL de abajo a la derecha?', 'Sí: desmarca “Añadir la URL del sitio abajo a la derecha de la tarjeta” debajo de la sección de diseño. Si la dejas, ¡ayudas muchísimo a que el sitio crezca!'],
      ['Encontré un error / quiero una función', 'Escríbeme en X (@hotaka_1123). Puedes escribir en inglés o con un traductor.'],
    ],
  },

  guide: {
    title: 'Cómo crear una tarjeta de invocador | SUMMONER CARD',
    description: 'Guía paso a paso para crear una tarjeta de invocador (tarjeta de perfil) de League of Legends: cada campo explicado, los cuatro niveles de rol, recortar íconos del arte de skins, ajustar el fondo y guardar en el móvil.',
    h1: 'Cómo crear una tarjeta de invocador',
    body: `
      <p>SUMMONER CARD es una herramienta gratuita para crear tarjetas de perfil de League of Legends, conocidas como tarjetas de invocador, directamente en tu navegador. Esta guía explica cada campo y comparte consejos para una tarjeta que luzca bien.</p>

      <nav class="toc" aria-label="Contenido">
        <p>Contenido</p>
        <ol>
          <li><a href="#basic">Datos básicos (nombre e ícono)</a></li>
          <li><a href="#rank">Rango</a></li>
          <li><a href="#role">Roles</a></li>
          <li><a href="#champs">Campeones principales</a></li>
          <li><a href="#tags">Estilo de juego</a></li>
          <li><a href="#contact">Horario y contacto</a></li>
          <li><a href="#comment">Mensaje</a></li>
          <li><a href="#design">Diseño (tema y fondo)</a></li>
          <li><a href="#save">Guardar y compartir</a></li>
          <li><a href="#tips">Consejos para encontrar amigos con tu tarjeta</a></li>
        </ol>
      </nav>

      <section id="basic">
        <h2>1. Datos básicos (nombre e ícono)</h2>
        <h3>Nombre de invocador y tag</h3>
        <p>Escribe la parte del nombre de tu Riot ID y tu tag (lo que va después del #). El tag aparece en letra pequeña junto a tu nombre, como “#LAN”.</p>
        <p>Si prefieres no mostrar tu nombre, pulsa una de las opciones bajo el campo — <strong>“Privado”, “Te lo digo al jugar”, “Pregúntame por DM” o “Cuando seamos amigos”</strong> — y ese texto aparece en lugar de tu nombre.</p>
        <h3>Nivel</h3>
        <p>Escribe tu nivel de invocador para mostrar “Lv.○○” bajo tu ícono. Déjalo vacío para ocultarlo.</p>
        <h3>Ícono</h3>
        <p>“Elegir ícono” te da tres opciones:</p>
        <ul>
          <li><strong>Íconos de invocador</strong>: elige entre unos 5000 íconos del juego. Busca por nombre, como “Ahri”, “K/DA” o “Poro”.</li>
          <li><strong>Campeones</strong>: usa el retrato de un campeón.</li>
          <li><strong>Subir imagen</strong>: usa la imagen que quieras. Tras subirla se abre una ventana de recorte; arrastra y haz zoom para elegir la parte que quieres.</li>
        </ul>
        <p>El ícono puede ser circular o cuadrado.</p>
      </section>

      <section id="rank">
        <h2>2. Rango</h2>
        <p>Elige tu liga (Hierro a Retador) y división (I–IV) para mostrar tu emblema de rango. De Maestro para arriba no hay división. Si prefieres no mostrar tu rango, déjalo en “Sin clasificar”.</p>
      </section>

      <section id="role">
        <h2>3. Roles</h2>
        <p>Para TOP, JG, MID, ADC y SUP puedes marcar uno de cuatro niveles según cuántas ganas tienes de jugarlo.</p>
        <table class="doc-table">
          <thead><tr><th>Botón</th><th>En la tarjeta</th><th>Significado</th></tr></thead>
          <tbody>
            <tr><td>Principal</td><td>MAIN (resaltado)</td><td>Tu mejor rol. Solo puede haber uno</td></tr>
            <tr><td>Secundario</td><td>SUB</td><td>Un rol que también juegas en ranked</td></tr>
            <tr><td>Normales OK</td><td>NORM</td><td>Un rol que juegas en normales</td></tr>
            <tr><td>No</td><td>NG (rojo, tachado)</td><td>Un rol que no puedes jugar</td></tr>
          </tbody>
        </table>
        <p>Pulsa de nuevo el botón elegido para desmarcarlo.</p>
      </section>

      <section id="champs">
        <h2>4. Campeones principales</h2>
        <p>Añade hasta cinco campeones con “+ Añadir”. Elige primero un rol arriba en el selector de campeones, y el campeón se añade <strong>con el ícono de ese rol</strong>. También puedes añadir el mismo campeón con distintos roles (por ejemplo, Lux de SUP y de MID).</p>
        <ul>
          <li><strong>Arte de skin</strong>: pulsa el botón “Arte de skin” de un campeón, elige cualquier skin y recorta cualquier parte de su splash art como ícono. “Deshacer” vuelve al retrato normal.</li>
          <li><strong>Título</strong>: cambia entre “Campeones principales” y “Campeones favoritos”.</li>
          <li><strong>Ordenar</strong>: “←” mueve un campeón a la izquierda y “×” lo quita.</li>
        </ul>
      </section>

      <section id="tags">
        <h2>5. Estilo de juego</h2>
        <p>Elige hasta seis etiquetas como Casual, Ranked, ARAM, Con voz o Busco dúo. Si no está la que quieres, crea la tuya (hasta 12 caracteres) con “+ Añadir la tuya”.</p>
      </section>

      <section id="contact">
        <h2>6. Horario y contacto</h2>
        <p>Escribe tu horario de juego, Discord, X, Twitch y YouTube. Solo aparecen bajo tu nombre los campos que rellenes, y se ordenan en dos columnas automáticamente cuando hay muchos.</p>
      </section>

      <section id="comment">
        <h2>7. Mensaje</h2>
        <p>Hasta 80 caracteres, mostrado al pie de la tarjeta. También admite saltos de línea (hasta dos líneas).</p>
      </section>

      <section id="design">
        <h2>8. Diseño (tema y fondo)</h2>
        <h3>Tema</h3>
        <p>Elige entre más de 15 temas. Míralos todos en la página de <a href="/templates/">plantillas</a>.</p>
        <h3>Fondo</h3>
        <ul>
          <li><strong>Elegir de una skin</strong>: elige un campeón y una skin, y su splash art se convierte en el fondo.</li>
          <li><strong>Subir tu propia imagen</strong>: usa cualquier imagen como fondo (puedes recortarla al subirla).</li>
          <li><strong>Posición, zoom y oscuridad</strong>: ajústalos con los deslizadores. También puedes arrastrar directamente la vista previa o hacer zoom con la rueda del ratón.</li>
        </ul>
        <p>Si el texto se lee mal, sube “Oscurecer fondo”.</p>
      </section>

      <section id="save">
        <h2>9. Guardar y compartir</h2>
        <ul>
          <li><strong>Guardar imagen</strong>: descarga la tarjeta como PNG. En iPhone la imagen se muestra a tamaño completo; mantenla pulsada y elige “Guardar en Fotos”.</li>
          <li><strong>Copiar imagen</strong>: en computadora, pégala directo en X o Discord con Ctrl+V.</li>
          <li><strong>Compartir en X</strong>: en el móvil, envía la imagen por el menú de compartir. En computadora, la imagen se copia y se abre la ventana de publicación de X.</li>
          <li><strong>Banner promocional</strong>: también puedes crear un banner con tu tarjeta. Mira <a href="/banner/">banners promocionales</a>.</li>
        </ul>
        <p>Lo que escribes se guarda solo en tu navegador. “Borrar” en cada sección borra solo esa sección, y “Reiniciar todo” abajo lo borra todo.</p>
        <p class="note">Puede que no se guarde en navegadores dentro de apps como el de X. Elige “Abrir en el navegador” en el menú “…” de arriba a la derecha.</p>
      </section>

      <section id="tips">
        <h2>10. Consejos para encontrar amigos con tu tarjeta</h2>
        <ul>
          <li><strong>Sé concreto con tu horario</strong>: “entre semana de 22 a 1 h” deja mucho más claro si pueden jugar juntos que solo “por la noche”.</li>
          <li><strong>Marca los roles que no juegas</strong>: conocer tus roles “NG” ayuda a que te encuentren como dúo o para una premade de 5.</li>
          <li><strong>Di lo que buscas con etiquetas</strong>: “Busco dúo”, “Busco premade” o “Novatos bienvenidos” atraen a gente con el mismo objetivo.</li>
          <li><strong>Usa hashtags al publicar</strong>: en X, añadir “#LeagueOfLegends” y “#SummonerCard” ayuda a que te encuentren.</li>
        </ul>
      </section>`,
  },

  banner: {
    title: 'Banners promocionales (uso libre) | SUMMONER CARD',
    description: 'Banners promocionales de SUMMONER CARD. Gratis para tu overlay de stream, paneles de Twitch, YouTube, blog o web. También puedes crear un banner con tu propia tarjeta.',
    h1: 'Banners promocionales (uso libre)',
    body: `
      <p>Estos banners son para quien quiera recomendar SUMMONER CARD. Ponlos en tu overlay de stream, paneles de Twitch, descripción de YouTube, blog o web — <strong>sin pedir permiso</strong>. Si puedes poner un enlace, te agradecería mucho que apunte a <code>${HOME}</code>.</p>
      <p class="thanks">No hace falta pedir permiso, pero si usas uno, un saludo en ${X} me alegraría el día 🙏 ¡Me encantaría ver tu stream o tu post!</p>

      <section>
        <h2>Crea un banner con tu propia tarjeta</h2>
        <p>Pulsa “🎨 Crea un banner promocional con tu tarjeta” en el creador para obtener un banner (1800×600) con la tarjeta que hiciste. También sirve como imagen de panel de Twitch o cabecera de X. Las tarjetas con tema soñador reciben un banner pastel.</p>
      </section>

      <section>
        <h2>Banners para descargar (todos los temas)</h2>
        <p>Haz clic en una imagen para abrirla a tamaño completo (1800×600) y guárdala desde ahí.</p>
        <!--BANNERS-->
      </section>

      <section>
        <h2>Cómo ponerlo</h2>
        <h3>Blog o web</h3>
        <p>Pega este HTML tal cual.</p>
        <pre class="embed-code" id="embed-code">&lt;a href="${HOME}" target="_blank" rel="noopener"&gt;&lt;img src="https://summonercard.com${IMG}/banner.jpg" alt="SUMMONER CARD | Summoner Card Maker" width="600" height="200"&gt;&lt;/a&gt;</pre>
        <button type="button" class="btn ghost small" data-copy-target="embed-code">Copiar HTML</button>
        <p>Para otro tema, cambia <code>banner.jpg</code> por el nombre de archivo de esa imagen (por ejemplo <code>banner-halloween.jpg</code>).</p>
        <h3>Panel de Twitch</h3>
        <p>En tu canal, ve a “Acerca de” → “Editar paneles”, sube el banner como imagen y pon <code>${HOME}</code> en “La imagen enlaza a”.</p>
        <h3>Como texto</h3>
        <pre class="embed-code" id="text-code">Crea tu tarjeta de invocador de LoL aquí👉 ${HOME}</pre>
        <button type="button" class="btn ghost small" data-copy-target="text-code">Copiar texto</button>
      </section>

      <section>
        <h2>Ten en cuenta</h2>
        <ul>
          <li>Puedes cambiar el tamaño o recortar los banners libremente.</li>
          <li>No vendas los banners ni los uses de forma que parezca que eres el SUMMONER CARD oficial.</li>
          <li>Los banners contienen arte de LoL. Consulta los <a href="/terms/">términos de uso</a> sobre los derechos de Riot Games.</li>
        </ul>
      </section>`,
  },

  privacy: {
    title: 'Política de privacidad | SUMMONER CARD',
    description: 'Política de privacidad de SUMMONER CARD (Summoner Card Maker): cómo se trata lo que escribes, la analítica y los servicios externos.',
    h1: 'Política de privacidad',
    body: `
      <p>SUMMONER CARD (“el Sitio”) trata la información de los usuarios de la siguiente manera.</p>

      <section>
        <h2>1. Lo que escribes y tus imágenes</h2>
        <p>Lo que escribes en la tarjeta (nombre de invocador, datos de contacto, etc.) y las imágenes que subes se procesan solo en tu navegador. Nunca se envían ni se guardan en nuestro servidor.</p>
        <p>Para que puedas seguir donde lo dejaste, lo que escribes se guarda en el almacenamiento de tu navegador (localStorage). Estos datos existen solo en tu dispositivo y se borran cuando eliminas los datos del sitio en tu navegador o pulsas “Reiniciar todo” en la herramienta.</p>
      </section>

      <section>
        <h2>2. Analítica</h2>
        <p>Para mejorar el Sitio usamos Google Analytics, una herramienta de análisis de Google LLC. Google Analytics usa cookies para recopilar páginas vistas, sitios de procedencia, tipos de dispositivo y la frecuencia de uso de las funciones del Sitio (como cuántas imágenes se guardan y qué temas se eligen). Estos datos se agregan de forma anónima y no identifican a nadie. El texto que escribes y tus imágenes no se envían.</p>
        <p>Puedes rechazar esta recopilación desactivando las cookies en tu navegador o usando el <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">complemento de inhabilitación de Google Analytics</a>. Para saber cómo trata Google los datos, consulta <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Privacidad y Términos de Google</a>.</p>
      </section>

      <section>
        <h2>3. Publicidad</h2>
        <p>Para cubrir los costos, el Sitio usa Google AdSense, un servicio de publicidad de terceros. Los proveedores de anuncios, incluido Google, usan cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Puedes desactivar los anuncios personalizados en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios</a> de Google y rechazar las cookies de terceros en <a href="https://www.aboutads.info/" target="_blank" rel="noopener">www.aboutads.info</a>.</p>
      </section>

      <section>
        <h2>4. Servicios externos</h2>
        <p>El Sitio carga datos de los siguientes servicios externos para mostrar contenido. Al hacerlo, se envía a cada servicio información de conexión como la dirección IP de tu dispositivo.</p>
        <ul>
          <li>“Data Dragon” de Riot Games (imágenes de campeones, íconos y skins)</li>
          <li>Community Dragon (emblemas de rango, íconos de rol e imágenes de íconos de invocador)</li>
          <li>Google Fonts (fuentes web)</li>
          <li>GitHub Pages (alojamiento del Sitio)</li>
        </ul>
      </section>

      <section>
        <h2>5. Exención de responsabilidad</h2>
        <p>El responsable no se hace responsable de ningún daño derivado del uso del Sitio. Consulta los <a href="/terms/">términos de uso</a> para más detalles.</p>
      </section>

      <section>
        <h2>6. Contacto</h2>
        <p>Para preguntas sobre esta política, contacta en ${X}.</p>
      </section>

      <section>
        <h2>7. Cambios</h2>
        <p>Esta política puede modificarse sin aviso cuando sea necesario. Los cambios entran en vigor al publicarse en esta página.</p>
        <p class="note">Fecha de establecimiento: ${UPDATED}</p>
      </section>`,
  },

  terms: {
    title: 'Términos de uso y exención de responsabilidad | SUMMONER CARD',
    description: 'Términos de uso y exención de responsabilidad de SUMMONER CARD (Summoner Card Maker): cómo puedes usar las imágenes que creas, usos prohibidos y derechos de Riot Games.',
    h1: 'Términos de uso y exención de responsabilidad',
    body: `
      <p>Estos términos de uso (“los Términos”) establecen las condiciones para usar SUMMONER CARD (“el Sitio”). Al usar el Sitio, se considera que aceptas los Términos.</p>

      <section>
        <h2>1. El servicio</h2>
        <p>El Sitio es una herramienta web gratuita para crear imágenes de tarjetas de perfil (tarjetas de invocador) de League of Legends. No se necesita cuenta.</p>
      </section>

      <section>
        <h2>2. Uso de las imágenes que creas</h2>
        <ul>
          <li>Puedes usar las imágenes que creas <strong>libremente para actividades personales</strong>, como publicaciones en redes sociales (X, Discord, Instagram, etc.), perfiles, overlays de stream, paneles de Twitch y blogs. También puedes usarlas en streams o canales monetizados.</li>
          <li><strong>No puedes vender ni distribuir a cambio de dinero</strong> las imágenes ni el arte del juego que contienen.</li>
          <li>El nombre y la URL del sitio en la esquina inferior derecha de la imagen se pueden ocultar en los ajustes.</li>
        </ul>
      </section>

      <section>
        <h2>3. Derechos de Riot Games</h2>
        <p>Los derechos de las imágenes de campeones, skins, íconos, emblemas de rango y demás que aparecen en las tarjetas pertenecen a Riot Games, Inc. El Sitio es contenido de fans hecho bajo la política “<a href="https://www.riotgames.com/en/legal" target="_blank" rel="noopener">Legal Jibber Jabber</a>” de Riot Games y no está respaldado ni patrocinado por Riot Games.</p>
        <p class="legal">${LEGAL}</p>
      </section>

      <section>
        <h2>4. Imágenes que subes</h2>
        <p>Sube como ícono o fondo solo imágenes que tengas derecho a usar. Las imágenes subidas se procesan solo en tu navegador y no se envían a nuestro servidor.</p>
      </section>

      <section>
        <h2>5. Usos prohibidos</h2>
        <ul>
          <li>Crear o publicar tarjetas que suplanten a otra persona o usen el nombre o la cuenta de otra persona sin permiso</li>
          <li>Crear o publicar tarjetas con contenido difamatorio, discriminatorio u obsceno</li>
          <li>Infringir derechos de autor, de imagen u otros derechos de terceros</li>
          <li>Interferir en el funcionamiento del Sitio o hacerse pasar por el Sitio oficial</li>
          <li>Cualquier otra cosa que viole la ley, el orden público o las buenas costumbres</li>
        </ul>
      </section>

      <section>
        <h2>6. Exención de responsabilidad</h2>
        <ul>
          <li>El Sitio se ofrece tal cual. No garantizamos la exactitud de su contenido, que funcione en todos los dispositivos y navegadores ni que siga disponible.</li>
          <li>Lo guardado en tu navegador puede perderse según los ajustes o acciones del navegador.</li>
          <li>El responsable no se hace responsable de problemas o daños derivados del uso del Sitio o de las imágenes que crees.</li>
          <li>El Sitio puede cambiar, suspender o terminar su servicio sin aviso.</li>
        </ul>
      </section>

      <section>
        <h2>7. Cambios en los Términos</h2>
        <p>Los Términos pueden cambiarse sin aviso cuando sea necesario. Los cambios entran en vigor al publicarse en esta página.</p>
        <p class="note">Fecha de establecimiento: ${UPDATED}</p>
      </section>`,
  },

  about: {
    title: 'Acerca de y contacto | SUMMONER CARD',
    description: 'Acerca de SUMMONER CARD (Summoner Card Maker): quién lo gestiona, cómo contactar y los recursos que usa.',
    h1: 'Acerca de y contacto',
    body: `
      <section>
        <h2>Sobre SUMMONER CARD</h2>
        <p>SUMMONER CARD es una herramienta gratuita gestionada por una persona, hecha para que los jugadores de League of Legends puedan crear fácilmente “tarjetas de invocador” para presentarse y encontrar amigos. La idea es que puedas hacer una tarjeta solo rellenando campos, sin editar una plantilla.</p>
      </section>

      <section>
        <h2>Responsable</h2>
        <table class="doc-table">
          <tbody>
            <tr><th>Nombre del sitio</th><td>SUMMONER CARD (Summoner Card Maker)</td></tr>
            <tr><th>URL</th><td><a href="/">${HOME}</a></td></tr>
            <tr><th>Gestionado por</th><td>hotaka (particular)</td></tr>
            <tr><th>Contacto</th><td>${X}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Contacto</h2>
        <p>Errores, ideas de funciones o lo que sea sobre el sitio: mándame un DM o responde en ${X}. El responsable vive en Japón, pero puedes escribir en inglés o con un traductor. Si es un error, ayuda mucho que indiques tu dispositivo y navegador (por ejemplo, Safari en iPhone o dentro de la app de X) y qué estabas haciendo cuando pasó.</p>
      </section>

      <section>
        <h2>Recursos usados</h2>
        <ul>
          <li>Imágenes de campeones, skins e íconos: “Data Dragon” de Riot Games</li>
          <li>Emblemas de rango, íconos de rol e íconos de invocador: <a href="https://www.communitydragon.org/" target="_blank" rel="noopener">Community Dragon</a></li>
          <li>Fuentes: Google Fonts (M PLUS 1p, M PLUS Rounded 1c, Cinzel, Dancing Script, Noto Sans)</li>
        </ul>
        <p class="legal">${LEGAL}</p>
      </section>`,
  },
});
