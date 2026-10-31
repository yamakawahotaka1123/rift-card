// French page contents. Same shape as ja.mjs.
const X = '<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X (@hotaka_1123)</a>';

export default ({ UPDATED, LEGAL, IMG, HOME }) => ({
  htmlLang: 'fr',
  locale: 'fr_FR',
  siteSub: 'Créateur de carte d’invocateur',
  nav: { make: 'Créer une carte', guide: 'Mode d’emploi', templates: 'Modèles', banner: 'Bannières', faq: 'FAQ' },
  footerNav: { guide: 'Mode d’emploi', templates: 'Modèles', banner: 'Bannières promo', faq: 'FAQ', about: 'À propos et contact', privacy: 'Confidentialité', terms: 'Conditions d’utilisation' },
  footer: {
    storage: 'Tout ce que tu saisis reste dans ce navigateur et n’est jamais envoyé à un serveur. Utilise librement tes images sur les réseaux, en stream ou ailleurs.',
    contact: `Un bug ou une idée ? Contacte-moi sur ${X}.`,
    analytics: 'Pour améliorer le site, nous utilisons Google Analytics pour compter les visites et l’utilisation des fonctions (ni tes saisies ni tes images ne sont envoyées). Détails dans la <a href="/privacy/">politique de confidentialité</a>.',
  },
  aria: { menu: 'Menu', siteInfo: 'Informations sur le site', breadcrumbs: 'Fil d’Ariane', toc: 'Sommaire' },
  top: 'Accueil',
  cta: 'Crée ta carte d’invocateur →',
  translationNote: 'Ceci est une traduction de l’original japonais. En cas de différence, la version japonaise fait foi.',
  copied: 'Copié',
  copyFailed: 'Impossible de copier. Sélectionne le texte et copie-le à la main',

  themes: [
    ['halloween', 'Halloween', 'Violet nuit et orange citrouille avec chauves-souris, toiles d’araignée et citrouille lanterne. Ton icône porte un chapeau de sorcière. Superbe avec un skin Ensorcelé en fond.'],
    ['christmas', 'Noël', 'Rouge et vert avec bordure sucre d’orge, guirlande lumineuse, flocons et cadeau. Ton icône porte un bonnet de Père Noël. Essaie-le avec un skin d’hiver.'],
    ['newyear', 'Nouvel An', 'Cramoisi et or avec rayons du soleil levant, fleurs de prunier et kagami mochi. Ton icône reçoit un éventail. Parfait pour un post « Bonne année ».'],
    ['hextech', 'Hextech', 'Le look classique or et bleu marine, proche du client LoL. Va avec n’importe quel fond de skin ; si tu hésites, prends celui-ci.'],
    ['noxus', 'Noxus', 'Un design rouge et noir percutant. Parfait avec les skins de champions noxiens comme Darius ou Sion.'],
    ['freljord', 'Freljord', 'Un design bleu glacier. Idéal avec Ashe, Sejuani ou n’importe quel skin d’hiver.'],
    ['shadow', 'Îles obscures', 'Un design vert lumineux et inquiétant pour Thresh, Viego et les autres champions des Îles obscures.'],
    ['ionia', 'Ionia', 'Un design doux rose et violet pour Ahri, Irelia et les skins fleur de cerisier.'],
    ['fairy', 'Rose rêveur', 'Un design « yume-kawaii » rose pastel avec corne de licorne, bonbons et sol en damier.'],
    ['fairy-mint', 'Bleu rêveur', 'La version bleue de Rose rêveur, entre bleu pastel et lavande.'],
    ['guardian', 'Gardienne des étoiles', 'Un design clair, lumineux et mignon pour les skins Gardienne des étoiles et magical girl.'],
    ['jirai', 'Jirai-kei', 'Le style japonais « jirai-kei » noir et rose avec rubans, cœurs, bordure en dentelle et vichy.'],
    ['ryousan', 'Ryousan-kei', 'Le doux style japonais « ryousan-kei » blanc et rose pâle avec perles, dentelle et rubans.'],
    ['y2k', 'Y2K', 'Étoiles chromées, smileys, papillons et cadre arc-en-ciel pour un look rétro Y2K.'],
    ['gaming', 'Gaming RGB', 'Cadre néon arc-en-ciel RGB, texte lumineux et grille synthwave sur fond noir. Ambiance PC gamer à fond.'],
    ['wafu', 'Japonais', 'Un design japonais moderne : papier washi, rouge, blanc et or, vagues seigaiha, pétales de cerisier et police Mincho.'],
  ],

  templates: {
    title: 'Modèles de carte d’invocateur (thèmes) | SUMMONER CARD',
    description: 'Plus de 15 modèles gratuits de carte d’invocateur League of Legends : Halloween, Noël, Gaming RGB, Y2K, japonais et plus. Choisis un thème et crée ta carte de profil LoL tout de suite.',
    h1: 'Modèles de carte d’invocateur (thèmes)',
    intro: `
      <p>SUMMONER CARD propose plus de 15 modèles (thèmes). Aucune retouche d’image : remplis les champs et ta carte est prête. Appuie sur « Utiliser ce modèle » sous un exemple pour ouvrir le créateur avec ce thème.</p>
      <p>Chaque thème accepte n’importe quel skin de champion ou ta propre image en fond. Rien qu’en changeant le fond, la carte change complètement.</p>`,
    button: 'Utiliser ce modèle →',
    alt: (name) => `Modèle de carte d’invocateur : ${name}`,
  },

  faq: {
    title: 'FAQ | SUMMONER CARD (Summoner Card Maker)',
    description: 'Questions fréquentes sur SUMMONER CARD, le créateur de cartes d’invocateur LoL : est-ce gratuit, comment enregistrer sur mobile, que faire si l’app X n’enregistre pas, comment tes données sont traitées et plus.',
    h1: 'FAQ',
    items: [
      ['C’est quoi, une carte d’invocateur ?', 'C’est une image de profil où les joueurs de League of Legends résument leur rang, leurs rôles, leurs champions principaux, leurs horaires, etc. On s’en sert pour trouver un duo et des amis sur X, dans des serveurs Discord et ailleurs.'],
      ['C’est gratuit ? Il faut un compte ?', 'C’est entièrement gratuit, sans inscription ni connexion.'],
      ['Je peux la créer sur mobile ?', 'Oui, directement dans le navigateur de ton téléphone. Sur iPhone, après « Enregistrer l’image », la carte s’affiche en taille réelle ; appuie longuement dessus pour l’enregistrer dans Photos.'],
      ['L’enregistrement ne marche pas quand j’ouvre le site depuis l’app X', 'Les navigateurs intégrés aux apps (X, Instagram, Discord, etc.) bloquent souvent l’enregistrement et le partage d’images. Choisis « Ouvrir dans le navigateur » dans le menu « … » en haut à droite pour ouvrir le site dans Safari ou Chrome. Tu peux aussi appuyer longuement sur l’image affichée pour l’enregistrer.'],
      ['Faut-il modifier une image modèle ?', 'Aucun logiciel de retouche nécessaire. Remplis les champs et choisis un thème, et la carte est générée avec les icônes de champions et de rang.'],
      ['Et si je ne veux pas afficher mon nom d’invocateur ?', 'Sous le champ du nom, tu peux choisir à la place : « Privé », « Je te dis en jeu », « Demande-moi en DM » ou « Quand on se connaîtra ».'],
      ['Mon rang est-il récupéré automatiquement ?', 'Pas pour l’instant ; tu le choisis toi-même. Si tu n’as pas de rang ou préfères ne pas l’afficher, laisse-le tel quel.'],
      ['Ce que je saisis est-il envoyé quelque part ?', 'Non. Tes saisies et les images importées sont traitées et enregistrées uniquement dans ton navigateur et ne sont jamais envoyées à notre serveur.'],
      ['Je peux modifier ma carte plus tard ?', 'Tes saisies sont enregistrées automatiquement dans ton navigateur, tu peux donc reprendre où tu en étais. Elles ne suivent pas si tu effaces les données du navigateur ou ouvres le site sur un autre appareil ou navigateur.'],
      ['Je peux utiliser les images comme je veux ?', 'Tu peux les publier librement sur X, Discord, en stream, sur des panneaux Twitch, etc. Tu ne peux pas vendre les images ni les illustrations LoL qu’elles contiennent. Détails dans les conditions d’utilisation.'],
      ['Je peux retirer l’URL en bas à droite ?', 'Oui : décoche « Ajouter l’URL du site en bas à droite de la carte » sous la section design. Si tu la laisses, ça aide énormément le site à grandir !'],
      ['J’ai trouvé un bug / je voudrais une fonction', 'Contacte-moi sur X (@hotaka_1123). L’anglais ou un traducteur, c’est parfait.'],
    ],
  },

  guide: {
    title: 'Comment créer une carte d’invocateur | SUMMONER CARD',
    description: 'Guide pas à pas pour créer une carte d’invocateur (carte de profil) League of Legends : chaque champ expliqué, les quatre niveaux de rôle, recadrer une icône depuis un skin, régler le fond et enregistrer sur mobile.',
    h1: 'Comment créer une carte d’invocateur',
    body: `
      <p>SUMMONER CARD est un outil gratuit pour créer des cartes de profil League of Legends, appelées cartes d’invocateur, directement dans ton navigateur. Ce guide explique chaque champ et donne des astuces pour une belle carte.</p>

      <nav class="toc" aria-label="Sommaire">
        <p>Sommaire</p>
        <ol>
          <li><a href="#basic">Infos de base (nom et icône)</a></li>
          <li><a href="#rank">Rang</a></li>
          <li><a href="#role">Rôles</a></li>
          <li><a href="#champs">Champions principaux</a></li>
          <li><a href="#tags">Style de jeu</a></li>
          <li><a href="#contact">Horaires et contact</a></li>
          <li><a href="#comment">Message</a></li>
          <li><a href="#design">Design (thème et fond)</a></li>
          <li><a href="#save">Enregistrer et partager</a></li>
          <li><a href="#tips">Astuces pour trouver des amis avec ta carte</a></li>
        </ol>
      </nav>

      <section id="basic">
        <h2>1. Infos de base (nom et icône)</h2>
        <h3>Nom d’invocateur et tag</h3>
        <p>Saisis la partie nom de ton Riot ID et ton tag (ce qui suit le #). Le tag s’affiche en petit à côté de ton nom, comme « #EUW ».</p>
        <p>Si tu préfères cacher ton nom, appuie sur un des choix sous le champ — <strong>« Privé », « Je te dis en jeu », « Demande-moi en DM » ou « Quand on se connaîtra »</strong> — et ce texte s’affiche à la place.</p>
        <h3>Niveau</h3>
        <p>Saisis ton niveau d’invocateur pour afficher « Lv.○○ » sous ton icône. Laisse vide pour le masquer.</p>
        <h3>Icône</h3>
        <p>« Choisir une icône » propose trois options :</p>
        <ul>
          <li><strong>Icônes d’invocateur</strong> : choisis parmi environ 5 000 icônes du jeu. Cherche par nom, comme « Ahri », « K/DA » ou « Poro ».</li>
          <li><strong>Champions</strong> : utilise le portrait d’un champion.</li>
          <li><strong>Importer une image</strong> : utilise l’image de ton choix. Une fenêtre de recadrage s’ouvre ensuite ; fais glisser et zoome pour choisir la partie voulue.</li>
        </ul>
        <p>L’icône peut être ronde ou carrée.</p>
      </section>

      <section id="rank">
        <h2>2. Rang</h2>
        <p>Choisis ton palier (Fer à Challenger) et ta division (I–IV) pour afficher ton emblème. À partir de Maître, il n’y a pas de division. Si tu ne veux pas afficher de rang, laisse « Non classé ».</p>
      </section>

      <section id="role">
        <h2>3. Rôles</h2>
        <p>Pour TOP, JG, MID, ADC et SUP, tu choisis un des quatre niveaux selon ton envie de jouer le rôle.</p>
        <table class="doc-table">
          <thead><tr><th>Bouton</th><th>Sur la carte</th><th>Signification</th></tr></thead>
          <tbody>
            <tr><td>Main</td><td>MAIN (mis en avant)</td><td>Ton meilleur rôle. Un seul possible</td></tr>
            <tr><td>Secondaire</td><td>SUB</td><td>Un rôle que tu joues aussi en ranked</td></tr>
            <tr><td>Normales OK</td><td>NORM</td><td>Un rôle que tu joues en normale</td></tr>
            <tr><td>Non</td><td>NG (rouge, barré)</td><td>Un rôle que tu ne joues pas</td></tr>
          </tbody>
        </table>
        <p>Appuie à nouveau sur le bouton choisi pour le décocher.</p>
      </section>

      <section id="champs">
        <h2>4. Champions principaux</h2>
        <p>Ajoute jusqu’à cinq champions avec « + Ajouter ». Choisis d’abord un rôle en haut du sélecteur de champions, et le champion est ajouté <strong>avec l’icône de ce rôle</strong>. Tu peux aussi ajouter le même champion avec d’autres rôles (par exemple Lux en SUP et en MID).</p>
        <ul>
          <li><strong>Image du skin</strong> : appuie sur « Image du skin » d’un champion, choisis un skin et recadre n’importe quelle partie de son splash art comme icône. « Annuler » remet le portrait normal.</li>
          <li><strong>Titre</strong> : bascule entre « Champions principaux » et « Champions préférés ».</li>
          <li><strong>Ordre</strong> : « ← » déplace un champion vers la gauche et « × » le retire.</li>
        </ul>
      </section>

      <section id="tags">
        <h2>5. Style de jeu</h2>
        <p>Choisis jusqu’à six tags comme Casual, Tryhard ranked, ARAM, Vocal OK ou Cherche duo. S’il manque ce que tu veux, crée le tien (jusqu’à 12 caractères) avec « + Ajouter le tien ».</p>
      </section>

      <section id="contact">
        <h2>6. Horaires et contact</h2>
        <p>Indique tes horaires de jeu, Discord, X, Twitch et YouTube. Seuls les champs remplis s’affichent sous ton nom, et ils passent automatiquement sur deux colonnes quand il y en a beaucoup.</p>
      </section>

      <section id="comment">
        <h2>7. Message</h2>
        <p>Jusqu’à 80 caractères, affiché en bas de la carte. Les retours à la ligne marchent aussi (deux lignes max).</p>
      </section>

      <section id="design">
        <h2>8. Design (thème et fond)</h2>
        <h3>Thème</h3>
        <p>Choisis parmi plus de 15 thèmes. Tous sont visibles sur la page <a href="/templates/">modèles</a>.</p>
        <h3>Fond</h3>
        <ul>
          <li><strong>Choisir dans un skin</strong> : choisis un champion et un skin, et son splash art devient le fond.</li>
          <li><strong>Importer ta propre image</strong> : utilise n’importe quelle image en fond (recadrable à l’import).</li>
          <li><strong>Position, zoom et assombrissement</strong> : règle-les avec les curseurs. Tu peux aussi faire glisser directement l’aperçu ou zoomer avec la molette.</li>
        </ul>
        <p>Si le texte se lit mal, augmente « Assombrir le fond ».</p>
      </section>

      <section id="save">
        <h2>9. Enregistrer et partager</h2>
        <ul>
          <li><strong>Enregistrer l’image</strong> : télécharge la carte en PNG. Sur iPhone, l’image s’affiche en taille réelle ; appuie longuement et choisis « Enregistrer dans Photos ».</li>
          <li><strong>Copier l’image</strong> : sur ordinateur, colle-la directement dans X ou Discord avec Ctrl+V.</li>
          <li><strong>Partager sur X</strong> : sur mobile, envoie l’image via le menu de partage. Sur ordinateur, l’image est copiée et la fenêtre de post X s’ouvre.</li>
          <li><strong>Bannière promo</strong> : tu peux aussi créer une bannière avec ta carte. Voir <a href="/banner/">bannières promo</a>.</li>
        </ul>
        <p>Tes saisies sont enregistrées automatiquement dans le navigateur. « Effacer » dans une section n’efface que celle-ci, et « Tout réinitialiser » en bas efface tout.</p>
        <p class="note">L’enregistrement peut échouer dans les navigateurs intégrés comme celui de X. Choisis « Ouvrir dans le navigateur » dans le menu « … » en haut à droite.</p>
      </section>

      <section id="tips">
        <h2>10. Astuces pour trouver des amis avec ta carte</h2>
        <ul>
          <li><strong>Sois précis sur tes horaires</strong> : « en semaine de 22 h à 1 h » montre bien mieux si vous pouvez jouer ensemble que juste « le soir ».</li>
          <li><strong>Indique les rôles que tu ne joues pas</strong> : connaître tes rôles « NG » aide les autres à te trouver comme duo ou pour une team de 5.</li>
          <li><strong>Dis ce que tu cherches avec les tags</strong> : « Cherche duo », « Cherche team 5 » ou « Débutants bienvenus » attirent des gens avec le même but.</li>
          <li><strong>Utilise des hashtags en postant</strong> : sur X, ajouter « #LeagueOfLegends » et « #SummonerCard » aide à te trouver.</li>
        </ul>
      </section>`,
  },

  banner: {
    title: 'Bannières promo (libres d’utilisation) | SUMMONER CARD',
    description: 'Bannières promo pour SUMMONER CARD. Gratuites pour ton overlay de stream, tes panneaux Twitch, YouTube, ton blog ou ton site. Tu peux aussi créer une bannière avec ta propre carte.',
    h1: 'Bannières promo (libres d’utilisation)',
    body: `
      <p>Ces bannières sont pour toutes les personnes qui veulent bien parler de SUMMONER CARD. Mets-les sur ton overlay de stream, tes panneaux Twitch, ta description YouTube, ton blog ou ton site — <strong>sans demander</strong>. Si tu peux mettre un lien, un lien vers <code>${HOME}</code> me ferait très plaisir.</p>
      <p class="thanks">Pas besoin de demander, mais si tu en utilises une, un petit coucou sur ${X} me ferait super plaisir 🙏 J’adorerais voir ton stream ou ton post !</p>

      <section>
        <h2>Crée une bannière avec ta propre carte</h2>
        <p>Appuie sur « 🎨 Créer une bannière promo avec ta carte » dans le créateur pour obtenir une bannière (1800×600) avec ta carte. Elle fonctionne aussi comme image de panneau Twitch ou bannière X. Les cartes au thème rêveur ont une bannière pastel.</p>
      </section>

      <section>
        <h2>Bannières à télécharger (tous les thèmes)</h2>
        <p>Clique sur une image pour l’ouvrir en taille réelle (1800×600) et enregistre-la depuis là.</p>
        <!--BANNERS-->
      </section>

      <section>
        <h2>Comment l’ajouter</h2>
        <h3>Blog ou site</h3>
        <p>Colle ce HTML tel quel.</p>
        <pre class="embed-code" id="embed-code">&lt;a href="${HOME}" target="_blank" rel="noopener"&gt;&lt;img src="https://summonercard.com${IMG}/banner.jpg" alt="SUMMONER CARD | Summoner Card Maker" width="600" height="200"&gt;&lt;/a&gt;</pre>
        <button type="button" class="btn ghost small" data-copy-target="embed-code">Copier le HTML</button>
        <p>Pour un autre thème, remplace <code>banner.jpg</code> par le nom de fichier de l’image (par exemple <code>banner-halloween.jpg</code>).</p>
        <h3>Panneau Twitch</h3>
        <p>Sur ta chaîne, va dans « À propos » → « Modifier les panneaux », importe la bannière comme image et mets <code>${HOME}</code> dans « L’image renvoie vers ».</p>
        <h3>En texte</h3>
        <pre class="embed-code" id="text-code">Crée ta carte d’invocateur LoL ici👉 ${HOME}</pre>
        <button type="button" class="btn ghost small" data-copy-target="text-code">Copier le texte</button>
      </section>

      <section>
        <h2>À noter</h2>
        <ul>
          <li>Tu peux redimensionner ou recadrer les bannières librement.</li>
          <li>Ne vends pas les bannières et ne les utilise pas d’une façon qui laisse croire que tu es le SUMMONER CARD officiel.</li>
          <li>Les bannières contiennent des illustrations LoL. Voir les <a href="/terms/">conditions d’utilisation</a> pour les droits de Riot Games.</li>
        </ul>
      </section>`,
  },

  privacy: {
    title: 'Politique de confidentialité | SUMMONER CARD',
    description: 'Politique de confidentialité de SUMMONER CARD (Summoner Card Maker) : traitement de tes saisies, mesure d’audience et services externes.',
    h1: 'Politique de confidentialité',
    body: `
      <p>SUMMONER CARD (« le Site ») traite les informations des utilisateurs comme suit.</p>

      <section>
        <h2>1. Tes saisies et tes images</h2>
        <p>Ce que tu saisis sur la carte (nom d’invocateur, coordonnées, etc.) et les images que tu importes sont traités uniquement dans ton navigateur. Ils ne sont jamais envoyés ni stockés sur notre serveur.</p>
        <p>Pour que tu puisses reprendre où tu en étais, tes saisies sont enregistrées dans le stockage de ton navigateur (localStorage). Ces données n’existent que sur ton appareil et sont effacées quand tu supprimes les données du site dans ton navigateur ou appuies sur « Tout réinitialiser » dans l’outil.</p>
      </section>

      <section>
        <h2>2. Mesure d’audience</h2>
        <p>Pour améliorer le Site, nous utilisons Google Analytics, un outil d’analyse de Google LLC. Google Analytics utilise des cookies pour collecter les pages vues, les sites de provenance, les types d’appareils et la fréquence d’utilisation des fonctions du Site (comme le nombre d’images enregistrées et les thèmes choisis). Ces données sont agrégées anonymement et n’identifient personne. Le texte que tu saisis et tes images ne sont pas envoyés.</p>
        <p>Tu peux refuser cette collecte en désactivant les cookies dans ton navigateur ou avec le <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">module de désactivation de Google Analytics</a>. Pour savoir comment Google traite les données, voir <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Règles de confidentialité et conditions d’utilisation de Google</a>.</p>
      </section>

      <section>
        <h2>3. Publicité</h2>
        <p>Pour couvrir les frais, le Site pourrait à l’avenir utiliser des services publicitaires tiers (comme Google AdSense). Les régies pourraient alors utiliser des cookies pour afficher des publicités selon tes centres d’intérêt. Nous mettrons cette politique à jour avant d’introduire de la publicité.</p>
      </section>

      <section>
        <h2>4. Services externes</h2>
        <p>Le Site charge des données depuis les services externes suivants pour afficher son contenu. Des informations de connexion comme l’adresse IP de ton appareil sont alors transmises à chaque service.</p>
        <ul>
          <li>« Data Dragon » de Riot Games (images de champions, d’icônes et de skins)</li>
          <li>Community Dragon (emblèmes de rang, icônes de rôle et icônes d’invocateur)</li>
          <li>Google Fonts (polices web)</li>
          <li>GitHub Pages (hébergement du Site)</li>
        </ul>
      </section>

      <section>
        <h2>5. Limitation de responsabilité</h2>
        <p>L’éditeur décline toute responsabilité pour les dommages résultant de l’utilisation du Site. Détails dans les <a href="/terms/">conditions d’utilisation</a>.</p>
      </section>

      <section>
        <h2>6. Contact</h2>
        <p>Pour toute question sur cette politique, contacte ${X}.</p>
      </section>

      <section>
        <h2>7. Modifications</h2>
        <p>Cette politique peut être modifiée sans préavis si nécessaire. Les modifications prennent effet dès leur publication sur cette page.</p>
        <p class="note">Date d’établissement : ${UPDATED}</p>
      </section>`,
  },

  terms: {
    title: 'Conditions d’utilisation et limitation de responsabilité | SUMMONER CARD',
    description: 'Conditions d’utilisation et limitation de responsabilité de SUMMONER CARD (Summoner Card Maker) : utilisation de tes images, usages interdits et droits de Riot Games.',
    h1: 'Conditions d’utilisation et limitation de responsabilité',
    body: `
      <p>Ces conditions d’utilisation (« les Conditions ») fixent les règles d’utilisation de SUMMONER CARD (« le Site »). En utilisant le Site, tu es réputé accepter les Conditions.</p>

      <section>
        <h2>1. Le service</h2>
        <p>Le Site est un outil web gratuit pour créer des images de cartes de profil (cartes d’invocateur) League of Legends. Aucun compte n’est nécessaire.</p>
      </section>

      <section>
        <h2>2. Utilisation de tes images</h2>
        <ul>
          <li>Tu peux utiliser les images que tu crées <strong>librement pour tes activités personnelles</strong>, comme des posts sur les réseaux (X, Discord, Instagram, etc.), des profils, des overlays de stream, des panneaux Twitch et des blogs. C’est aussi permis sur des streams ou chaînes monétisés.</li>
          <li>Tu <strong>ne peux pas vendre ni distribuer contre paiement</strong> les images ou les illustrations du jeu qu’elles contiennent.</li>
          <li>Le nom et l’URL du site en bas à droite de l’image peuvent être masqués dans les réglages.</li>
        </ul>
      </section>

      <section>
        <h2>3. Droits de Riot Games</h2>
        <p>Les droits sur les images de champions, skins, icônes, emblèmes de rang et autres affichées sur les cartes appartiennent à Riot Games, Inc. Le Site est un contenu de fan réalisé dans le cadre de la politique « <a href="https://www.riotgames.com/en/legal" target="_blank" rel="noopener">Legal Jibber Jabber</a> » de Riot Games et n’est ni approuvé ni sponsorisé par Riot Games.</p>
        <p class="legal">${LEGAL}</p>
      </section>

      <section>
        <h2>4. Images importées</h2>
        <p>N’importe comme icône ou fond que des images que tu as le droit d’utiliser. Les images importées sont traitées uniquement dans ton navigateur et ne sont pas envoyées à notre serveur.</p>
      </section>

      <section>
        <h2>5. Usages interdits</h2>
        <ul>
          <li>Créer ou publier des cartes qui usurpent l’identité de quelqu’un ou utilisent le nom ou le compte d’une autre personne sans autorisation</li>
          <li>Créer ou publier des cartes au contenu diffamatoire, discriminatoire ou obscène</li>
          <li>Porter atteinte aux droits d’auteur, au droit à l’image ou à d’autres droits de tiers</li>
          <li>Perturber le fonctionnement du Site ou se faire passer pour le Site officiel</li>
          <li>Tout autre acte contraire à la loi, à l’ordre public ou aux bonnes mœurs</li>
        </ul>
      </section>

      <section>
        <h2>6. Limitation de responsabilité</h2>
        <ul>
          <li>Le Site est fourni tel quel. Nous ne garantissons ni l’exactitude du contenu, ni le fonctionnement sur tous les appareils et navigateurs, ni la disponibilité continue du service.</li>
          <li>Les saisies enregistrées dans le navigateur peuvent être perdues selon les réglages ou actions du navigateur.</li>
          <li>L’éditeur décline toute responsabilité pour les problèmes ou dommages liés à l’utilisation du Site ou des images créées.</li>
          <li>Le Site peut modifier, suspendre ou arrêter son service sans préavis.</li>
        </ul>
      </section>

      <section>
        <h2>7. Modification des Conditions</h2>
        <p>Les Conditions peuvent être modifiées sans préavis si nécessaire. Les modifications prennent effet dès leur publication sur cette page.</p>
        <p class="note">Date d’établissement : ${UPDATED}</p>
      </section>`,
  },

  about: {
    title: 'À propos et contact | SUMMONER CARD',
    description: 'À propos de SUMMONER CARD (Summoner Card Maker) : qui gère le site, comment le contacter et les ressources utilisées.',
    h1: 'À propos et contact',
    body: `
      <section>
        <h2>À propos de SUMMONER CARD</h2>
        <p>SUMMONER CARD est un outil gratuit géré par un particulier, conçu pour que les joueurs de League of Legends créent facilement des « cartes d’invocateur » pour se présenter et trouver des amis. Le but : faire une carte juste en remplissant des champs, sans retoucher de modèle.</p>
      </section>

      <section>
        <h2>Éditeur</h2>
        <table class="doc-table">
          <tbody>
            <tr><th>Nom du site</th><td>SUMMONER CARD (Summoner Card Maker)</td></tr>
            <tr><th>URL</th><td><a href="/">${HOME}</a></td></tr>
            <tr><th>Géré par</th><td>hotaka (particulier)</td></tr>
            <tr><th>Contact</th><td>${X}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Bugs, idées de fonctions ou autre à propos du site : envoie un DM ou réponds sur ${X}. L’éditeur vit au Japon, mais les messages en anglais ou via un traducteur sont les bienvenus. Pour un bug, indiquer ton appareil et ton navigateur (par exemple Safari sur iPhone ou dans l’app X) et ce que tu faisais aide beaucoup.</p>
      </section>

      <section>
        <h2>Ressources utilisées</h2>
        <ul>
          <li>Images de champions, skins et icônes : « Data Dragon » de Riot Games</li>
          <li>Emblèmes de rang, icônes de rôle et icônes d’invocateur : <a href="https://www.communitydragon.org/" target="_blank" rel="noopener">Community Dragon</a></li>
          <li>Polices : Google Fonts (M PLUS 1p, M PLUS Rounded 1c, Cinzel, Dancing Script, Noto Sans)</li>
        </ul>
        <p class="legal">${LEGAL}</p>
      </section>`,
  },
});
