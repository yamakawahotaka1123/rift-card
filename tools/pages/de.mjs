// German page contents. Same shape as ja.mjs.
const X = '<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X (@hotaka_1123)</a>';

export default ({ UPDATED, LEGAL, IMG, HOME }) => ({
  htmlLang: 'de',
  locale: 'de_DE',
  siteSub: 'Summoner-Card-Generator',
  nav: { make: 'Karte erstellen', guide: 'Anleitung', templates: 'Vorlagen', banner: 'Werbebanner', faq: 'FAQ' },
  footerNav: { guide: 'Anleitung', templates: 'Vorlagen', banner: 'Werbebanner', faq: 'FAQ', about: 'Über & Kontakt', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen' },
  footer: {
    storage: 'Alles, was du eingibst, bleibt in diesem Browser und wird nie an einen Server gesendet. Die Bilder darfst du frei in sozialen Medien, Streams und überall sonst verwenden.',
    contact: `Fehler oder Wünsche? Melde dich gern auf ${X}.`,
    analytics: 'Um die Seite zu verbessern, nutzen wir Google Analytics, um Besuche und die Nutzung der Funktionen zu zählen (deine Eingaben und Bilder werden nicht gesendet). Details in der <a href="/privacy/">Datenschutzerklärung</a>.',
  },
  aria: { menu: 'Menü', siteInfo: 'Seiteninformationen', breadcrumbs: 'Brotkrumen-Navigation', toc: 'Inhalt' },
  top: 'Start',
  cta: 'Erstelle deine Summoner Card →',
  translationNote: 'Dies ist eine Übersetzung des japanischen Originals. Bei Abweichungen gilt die japanische Fassung.',
  copied: 'Kopiert',
  copyFailed: 'Kopieren fehlgeschlagen. Bitte markiere den Text und kopiere ihn manuell',

  themes: [
    ['halloween', 'Halloween', 'Nachtlila und Kürbisorange mit Fledermäusen, Spinnweben und einer Kürbislaterne. Dein Symbol bekommt einen Hexenhut. Sieht toll aus mit einem Hexen-Skin als Hintergrund.'],
    ['christmas', 'Weihnachten', 'Rot und Grün mit Zuckerstangen-Rand, Lichterkette, Schneeflocken und einem Geschenk. Dein Symbol bekommt eine Weihnachtsmütze. Probier es mit einem Winter-Skin.'],
    ['newyear', 'Neujahr', 'Karminrot und Gold mit Strahlen der aufgehenden Sonne, Pflaumenblüten und Kagami-Mochi. Dein Symbol bekommt einen Fächer. Perfekt für einen „Frohes neues Jahr“-Post.'],
    ['hextech', 'Hextech', 'Der klassische Gold-Marineblau-Look, nah am LoL-Client. Passt zu jedem Skin-Hintergrund – wenn du dich nicht entscheiden kannst, nimm diesen.'],
    ['noxus', 'Noxus', 'Ein kräftiges Rot-Schwarz-Design. Perfekt mit Skins noxianischer Champions wie Darius oder Sion.'],
    ['freljord', 'Freljord', 'Ein eisig hellblaues Design. Toll mit Ashe, Sejuani oder jedem Winter-Skin.'],
    ['shadow', 'Schatteninseln', 'Ein unheimliches, grün leuchtendes Design für Thresh, Viego und andere Champions der Schatteninseln.'],
    ['ionia', 'Ionia', 'Ein sanftes Rosa-Lila-Design für Ahri, Irelia und Kirschblüten-Skins.'],
    ['fairy', 'Traum-Rosa', 'Ein pastellrosa „Yume-Kawaii“-Design mit Einhorn-Horn, Süßigkeiten und Schachbrettboden.'],
    ['fairy-mint', 'Traum-Blau', 'Die blaue Version von Traum-Rosa in Pastellblau und Lavendel.'],
    ['guardian', 'Sternenwächterin', 'Ein helles, süßes Design für Sternenwächterinnen- und Magical-Girl-Skins.'],
    ['jirai', 'Jirai-kei', 'Der schwarz-rosa japanische „Jirai-kei“-Stil mit Schleifen, Herzen, Spitzenrand und Vichy-Karo.'],
    ['ryousan', 'Ryousan-kei', 'Der süße weiß-zartrosa japanische „Ryousan-kei“-Stil mit Perlen, Spitze und Schleifen.'],
    ['y2k', 'Y2K', 'Chromsterne, Smileys, Schmetterlinge und ein Regenbogenrahmen für den Y2K-Retro-Look.'],
    ['gaming', 'Gaming-RGB', 'RGB-Regenbogen-Neonrahmen, leuchtende Schrift und ein Synthwave-Gitter auf Schwarz. Pure Gaming-PC-Energie.'],
    ['wafu', 'Japanisch', 'Ein modernes japanisches Design: Washi-Papier, Rot, Weiß und Gold, Seigaiha-Wellen, Kirschblütenblätter und Mincho-Schrift.'],
  ],

  templates: {
    title: 'Summoner-Card-Vorlagen (Designs) | SUMMONER CARD',
    description: 'Über 15 kostenlose Summoner-Card-Vorlagen für League of Legends: Halloween, Weihnachten, Gaming-RGB, Y2K, Japanisch und mehr. Design wählen und sofort deine LoL-Profilkarte erstellen.',
    h1: 'Summoner-Card-Vorlagen (Designs)',
    intro: `
      <p>SUMMONER CARD bietet über 15 Vorlagen (Designs) zur Auswahl. Keine Bildbearbeitung nötig: Felder ausfüllen, fertig ist die Karte. Tippe unter einem Beispiel auf „Diese Vorlage nutzen“, um den Generator mit diesem Design zu öffnen.</p>
      <p>Jedes Design kann jeden Champion-Skin oder ein eigenes Bild als Hintergrund nutzen. Schon ein anderer Hintergrund verändert die ganze Karte.</p>`,
    button: 'Diese Vorlage nutzen →',
    alt: (name) => `Summoner-Card-Vorlage: ${name}`,
  },

  faq: {
    title: 'FAQ | SUMMONER CARD (Summoner Card Maker)',
    description: 'Häufige Fragen zu SUMMONER CARD, dem LoL-Summoner-Card-Generator: Ist es kostenlos, wie speichert man am Handy, was tun, wenn in der X-App nichts gespeichert wird, wie werden deine Daten behandelt und mehr.',
    h1: 'FAQ',
    items: [
      ['Was ist eine Summoner Card?', 'Ein Profilbild, auf dem League-of-Legends-Spieler Rang, Rollen, Main-Champions, Spielzeiten usw. zusammenfassen. Man nutzt sie, um auf X, in Discord-Servern und anderswo Duo-Partner und Freunde zu finden.'],
      ['Ist es kostenlos? Brauche ich ein Konto?', 'Komplett kostenlos, ohne Registrierung oder Login.'],
      ['Kann ich sie am Handy erstellen?', 'Ja, direkt im Browser deines Handys. Auf dem iPhone wird die Karte nach „Bild speichern“ in voller Größe angezeigt; halte sie gedrückt, um sie in Fotos zu sichern.'],
      ['Speichern klappt nicht, wenn ich die Seite aus der X-App öffne', 'In-App-Browser (X, Instagram, Discord und andere) blockieren oft das Speichern und Teilen von Bildern. Wähle „Im Browser öffnen“ im „…“-Menü oben rechts, um die Seite in Safari oder Chrome zu öffnen. Du kannst auch das angezeigte Bild gedrückt halten, um es zu speichern.'],
      ['Muss ich eine Vorlage bearbeiten?', 'Kein Bildbearbeitungsprogramm nötig. Felder ausfüllen und ein Design wählen, und die Karte wird mit Champion- und Rang-Symbolen erstellt.'],
      ['Was, wenn ich meinen Beschwörernamen nicht zeigen will?', 'Unter dem Namensfeld kannst du stattdessen eine Vorgabe wählen: „Privat“, „Sag ich beim Zocken“, „Frag mich per DM“ oder „Wenn wir uns kennen“.'],
      ['Wird mein Rang automatisch abgerufen?', 'Im Moment nicht; du wählst ihn selbst. Wer ungewertet ist oder seinen Rang nicht zeigen will, kann es einfach so lassen.'],
      ['Wird irgendetwas, das ich eingebe, verschickt?', 'Nein. Deine Eingaben und hochgeladenen Bilder werden nur in deinem Browser verarbeitet und gespeichert und nie an unseren Server gesendet.'],
      ['Kann ich meine Karte später bearbeiten?', 'Deine Eingaben werden automatisch im Browser gespeichert, sodass du später weitermachen kannst. Sie gehen verloren, wenn du die Browserdaten löschst, und sind auf anderen Geräten oder Browsern nicht da.'],
      ['Darf ich die Bilder beliebig nutzen?', 'Du darfst sie frei auf X, Discord, im Stream, in Twitch-Panels usw. posten. Verkaufen darfst du die Bilder oder die enthaltene LoL-Grafik nicht. Details in den Nutzungsbedingungen.'],
      ['Kann ich die URL unten rechts entfernen?', 'Ja: Entferne den Haken bei „Seiten-URL unten rechts auf der Karte anzeigen“ unter dem Design-Bereich. Wenn du sie drin lässt, hilft das der Seite enorm!'],
      ['Ich habe einen Fehler gefunden / wünsche mir eine Funktion', 'Melde dich gern auf X (@hotaka_1123). Englisch oder ein Übersetzer sind völlig okay.'],
    ],
  },

  guide: {
    title: 'So erstellst du eine Summoner Card | SUMMONER CARD',
    description: 'Schritt-für-Schritt-Anleitung für eine League-of-Legends-Summoner-Card (Profilkarte): alle Felder erklärt, die vier Rollenstufen, Symbole aus Skin-Bildern zuschneiden, Hintergrund anpassen und am Handy speichern.',
    h1: 'So erstellst du eine Summoner Card',
    body: `
      <p>SUMMONER CARD ist ein kostenloses Tool, mit dem du League-of-Legends-Profilkarten, sogenannte Summoner Cards, direkt im Browser erstellst. Diese Anleitung erklärt jedes Feld und gibt Tipps für eine gut aussehende Karte.</p>

      <nav class="toc" aria-label="Inhalt">
        <p>Inhalt</p>
        <ol>
          <li><a href="#basic">Grunddaten (Name und Symbol)</a></li>
          <li><a href="#rank">Rang</a></li>
          <li><a href="#role">Rollen</a></li>
          <li><a href="#champs">Main-Champions</a></li>
          <li><a href="#tags">Spielstil</a></li>
          <li><a href="#contact">Spielzeiten & Kontakt</a></li>
          <li><a href="#comment">Nachricht</a></li>
          <li><a href="#design">Design (Vorlage und Hintergrund)</a></li>
          <li><a href="#save">Speichern und teilen</a></li>
          <li><a href="#tips">Tipps, um mit deiner Karte Freunde zu finden</a></li>
        </ol>
      </nav>

      <section id="basic">
        <h2>1. Grunddaten (Name und Symbol)</h2>
        <h3>Beschwörername und Tag</h3>
        <p>Gib den Namensteil deiner Riot-ID und deinen Tag (was nach dem # kommt) ein. Der Tag erscheint klein neben deinem Namen, etwa „#EUW“.</p>
        <p>Wenn du deinen Namen nicht zeigen willst, tippe auf eine Vorgabe unter dem Feld — <strong>„Privat“, „Sag ich beim Zocken“, „Frag mich per DM“ oder „Wenn wir uns kennen“</strong> — und dieser Text erscheint statt deines Namens.</p>
        <h3>Level</h3>
        <p>Gib dein Beschwörerlevel ein, um „Lv.○○“ unter deinem Symbol anzuzeigen. Leer lassen, um es auszublenden.</p>
        <h3>Symbol</h3>
        <p>„Symbol wählen“ bietet drei Möglichkeiten:</p>
        <ul>
          <li><strong>Beschwörersymbole</strong>: wähle aus rund 5.000 Symbolen aus dem Spiel. Suche nach Namen wie „Ahri“, „K/DA“ oder „Poro“.</li>
          <li><strong>Champions</strong>: nutze das Porträt eines Champions.</li>
          <li><strong>Bild hochladen</strong>: nutze ein beliebiges Bild. Nach dem Hochladen öffnet sich ein Zuschneide-Fenster; ziehe und zoome, um den gewünschten Ausschnitt zu wählen.</li>
        </ul>
        <p>Das Symbol kann rund oder quadratisch sein.</p>
      </section>

      <section id="rank">
        <h2>2. Rang</h2>
        <p>Wähle deine Stufe (Eisen bis Herausforderer) und Division (I–IV), um dein Rangabzeichen zu zeigen. Ab Meister gibt es keine Division. Wenn du keinen Rang zeigen willst, lass es bei „Ungewertet“.</p>
      </section>

      <section id="role">
        <h2>3. Rollen</h2>
        <p>Für TOP, JG, MID, ADC und SUP kannst du jeweils eine von vier Stufen setzen, wie gern du die Rolle spielst.</p>
        <table class="doc-table">
          <thead><tr><th>Button</th><th>Auf der Karte</th><th>Bedeutung</th></tr></thead>
          <tbody>
            <tr><td>Main</td><td>MAIN (hervorgehoben)</td><td>Deine beste Rolle. Nur eine möglich</td></tr>
            <tr><td>Sub</td><td>SUB</td><td>Eine Rolle, die du auch in Ranked spielst</td></tr>
            <tr><td>Normals OK</td><td>NORM</td><td>Eine Rolle, die du in Normals spielst</td></tr>
            <tr><td>Nein</td><td>NG (rot, durchgestrichen)</td><td>Eine Rolle, die du nicht spielen kannst</td></tr>
          </tbody>
        </table>
        <p>Tippe den gewählten Button nochmal an, um ihn abzuwählen.</p>
      </section>

      <section id="champs">
        <h2>4. Main-Champions</h2>
        <p>Füge mit „+ Hinzufügen“ bis zu fünf Champions hinzu. Wähle zuerst oben in der Champion-Auswahl eine Rolle, dann wird der Champion <strong>mit dem Symbol dieser Rolle</strong> hinzugefügt. Du kannst denselben Champion auch mit verschiedenen Rollen hinzufügen (z. B. Lux als SUP und MID).</p>
        <ul>
          <li><strong>Skin-Bild</strong>: Tippe beim Champion auf „Skin-Bild“, wähle einen Skin und schneide einen beliebigen Teil des Splash-Arts als Symbol zu. „Rückgängig“ stellt das normale Porträt wieder her.</li>
          <li><strong>Überschrift</strong>: wechsle zwischen „Main-Champions“ und „Lieblings-Champions“.</li>
          <li><strong>Reihenfolge</strong>: „←“ verschiebt einen Champion nach links, „×“ entfernt ihn.</li>
        </ul>
      </section>

      <section id="tags">
        <h2>5. Spielstil</h2>
        <p>Wähle bis zu sechs Tags wie Casual, Ranked-Grinder, ARAM, Voice-Chat oder Suche Duo. Fehlt etwas, erstelle mit „+ Eigenen hinzufügen“ deinen eigenen (bis zu 12 Zeichen).</p>
      </section>

      <section id="contact">
        <h2>6. Spielzeiten & Kontakt</h2>
        <p>Trage Spielzeiten, Discord, X, Twitch und YouTube ein. Unter deinem Namen erscheinen nur die ausgefüllten Felder, und bei vielen werden sie automatisch in zwei Spalten angeordnet.</p>
      </section>

      <section id="comment">
        <h2>7. Nachricht</h2>
        <p>Bis zu 80 Zeichen, unten auf der Karte. Zeilenumbrüche gehen auch (bis zu zwei Zeilen).</p>
      </section>

      <section id="design">
        <h2>8. Design (Vorlage und Hintergrund)</h2>
        <h3>Design</h3>
        <p>Wähle aus über 15 Designs. Alle findest du auf der Seite <a href="/templates/">Vorlagen</a>.</p>
        <h3>Hintergrund</h3>
        <ul>
          <li><strong>Aus Skin wählen</strong>: wähle Champion und Skin, und das Splash-Art wird zum Hintergrund.</li>
          <li><strong>Eigenes Bild hochladen</strong>: nutze ein beliebiges Bild als Hintergrund (beim Hochladen zuschneidbar).</li>
          <li><strong>Position, Zoom und Abdunkeln</strong>: mit den Reglern einstellen. Du kannst auch direkt in der Vorschau ziehen oder mit dem Mausrad zoomen.</li>
        </ul>
        <p>Wenn der Text schwer lesbar ist, erhöhe „Hintergrund abdunkeln“.</p>
      </section>

      <section id="save">
        <h2>9. Speichern und teilen</h2>
        <ul>
          <li><strong>Bild speichern</strong>: lädt die Karte als PNG herunter. Auf dem iPhone wird das Bild in voller Größe angezeigt; gedrückt halten und „In Fotos sichern“ wählen.</li>
          <li><strong>Bild kopieren</strong>: am Computer direkt mit Strg+V in X oder Discord einfügen.</li>
          <li><strong>Auf X teilen</strong>: am Handy das Bild über das Teilen-Menü senden. Am Computer wird das Bild kopiert und das X-Post-Fenster geöffnet.</li>
          <li><strong>Werbebanner</strong>: du kannst auch ein Banner mit deiner Karte erstellen. Siehe <a href="/banner/">Werbebanner</a>.</li>
        </ul>
        <p>Deine Eingaben werden automatisch im Browser gespeichert. „Leeren“ in einem Abschnitt leert nur diesen, „Alles zurücksetzen“ unten leert alles.</p>
        <p class="note">In In-App-Browsern wie dem von X klappt das Speichern evtl. nicht. Wähle „Im Browser öffnen“ im „…“-Menü oben rechts.</p>
      </section>

      <section id="tips">
        <h2>10. Tipps, um mit deiner Karte Freunde zu finden</h2>
        <ul>
          <li><strong>Spielzeiten konkret angeben</strong>: „wochentags 22–1 Uhr“ zeigt viel klarer als nur „abends“, ob ihr zusammen spielen könnt.</li>
          <li><strong>Rollen markieren, die du nicht spielst</strong>: Wer deine „NG“-Rollen kennt, findet dich leichter als Duo- oder 5er-Partner.</li>
          <li><strong>Mit Tags sagen, was du suchst</strong>: „Suche Duo“, „Suche 5er-Team“ oder „Neulinge willkommen“ ziehen Leute mit dem gleichen Ziel an.</li>
          <li><strong>Beim Posten Hashtags nutzen</strong>: Auf X helfen „#LeagueOfLegends“ und „#SummonerCard“, damit man dich findet.</li>
        </ul>
      </section>`,
  },

  banner: {
    title: 'Werbebanner (frei nutzbar) | SUMMONER CARD',
    description: 'Werbebanner für SUMMONER CARD. Kostenlos für dein Stream-Overlay, Twitch-Panels, YouTube, Blog oder Website. Du kannst auch ein Banner mit deiner eigenen Karte erstellen.',
    h1: 'Werbebanner (frei nutzbar)',
    body: `
      <p>Diese Banner sind für alle, die SUMMONER CARD weiterempfehlen möchten. Pack sie in dein Stream-Overlay, deine Twitch-Panels, die YouTube-Beschreibung, deinen Blog oder deine Website — <strong>ohne zu fragen</strong>. Wo du einen Link setzen kannst, freue ich mich sehr über einen Link auf <code>${HOME}</code>.</p>
      <p class="thanks">Du musst nicht fragen, aber ein kurzes Hallo auf ${X} würde mich riesig freuen 🙏 Ich schaue mir gern deinen Stream oder Post an!</p>

      <section>
        <h2>Banner mit deiner eigenen Karte erstellen</h2>
        <p>Tippe im Generator auf „🎨 Werbebanner mit deiner Karte erstellen“ und du bekommst ein Banner (1800×600) mit deiner Karte. Es eignet sich auch als Twitch-Panel-Bild oder X-Header. Karten mit Traum-Design bekommen ein Pastell-Banner.</p>
      </section>

      <section>
        <h2>Banner zum Herunterladen (alle Designs)</h2>
        <p>Klicke auf ein Bild, um es in voller Größe (1800×600) zu öffnen, und speichere es dort.</p>
        <!--BANNERS-->
      </section>

      <section>
        <h2>So baust du es ein</h2>
        <h3>Blog oder Website</h3>
        <p>Füge dieses HTML einfach so ein.</p>
        <pre class="embed-code" id="embed-code">&lt;a href="${HOME}" target="_blank" rel="noopener"&gt;&lt;img src="https://summonercard.com${IMG}/banner.jpg" alt="SUMMONER CARD | Summoner Card Maker" width="600" height="200"&gt;&lt;/a&gt;</pre>
        <button type="button" class="btn ghost small" data-copy-target="embed-code">HTML kopieren</button>
        <p>Für ein anderes Design ersetze <code>banner.jpg</code> durch den Dateinamen des Bildes (z. B. <code>banner-halloween.jpg</code>).</p>
        <h3>Twitch-Panel</h3>
        <p>Geh auf deinem Kanal zu „Über“ → „Panels bearbeiten“, lade das Banner als Bild hoch und trage <code>${HOME}</code> bei „Bild verlinkt zu“ ein.</p>
        <h3>Als Text</h3>
        <pre class="embed-code" id="text-code">Erstell deine LoL-Summoner-Card hier👉 ${HOME}</pre>
        <button type="button" class="btn ghost small" data-copy-target="text-code">Text kopieren</button>
      </section>

      <section>
        <h2>Bitte beachten</h2>
        <ul>
          <li>Du darfst die Banner frei skalieren oder zuschneiden.</li>
          <li>Bitte verkaufe die Banner nicht und nutze sie nicht so, als wärst du das offizielle SUMMONER CARD.</li>
          <li>Die Banner enthalten LoL-Grafiken. Zu den Rechten von Riot Games siehe die <a href="/terms/">Nutzungsbedingungen</a>.</li>
        </ul>
      </section>`,
  },

  privacy: {
    title: 'Datenschutzerklärung | SUMMONER CARD',
    description: 'Datenschutzerklärung von SUMMONER CARD (Summoner Card Maker): wie deine Eingaben behandelt werden, Analyse und externe Dienste.',
    h1: 'Datenschutzerklärung',
    body: `
      <p>SUMMONER CARD („die Seite“) behandelt Nutzerinformationen wie folgt.</p>

      <section>
        <h2>1. Deine Eingaben und Bilder</h2>
        <p>Was du auf der Karte eingibst (Beschwörername, Kontaktdaten usw.) und die Bilder, die du hochlädst, werden nur in deinem Browser verarbeitet. Sie werden nie an unseren Server gesendet oder dort gespeichert.</p>
        <p>Damit du später weitermachen kannst, werden deine Eingaben im Speicher deines Browsers (localStorage) abgelegt. Diese Daten existieren nur auf deinem Gerät und werden gelöscht, wenn du die Websitedaten im Browser löschst oder im Tool auf „Alles zurücksetzen“ tippst.</p>
      </section>

      <section>
        <h2>2. Analyse</h2>
        <p>Um die Seite zu verbessern, nutzen wir Google Analytics, ein Analysetool der Google LLC. Google Analytics verwendet Cookies, um Seitenaufrufe, Verweisquellen, Gerätetypen und die Nutzungshäufigkeit der Funktionen (etwa wie viele Bilder gespeichert und welche Designs gewählt werden) zu erfassen. Diese Daten werden anonym zusammengefasst und lassen keine Rückschlüsse auf Personen zu. Dein eingegebener Text und deine Bilder selbst werden nicht gesendet.</p>
        <p>Du kannst diese Erfassung ablehnen, indem du Cookies im Browser deaktivierst oder das <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Browser-Add-on zur Deaktivierung von Google Analytics</a> nutzt. Wie Google mit Daten umgeht, steht in <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Datenschutzerklärung & Nutzungsbedingungen von Google</a>.</p>
      </section>

      <section>
        <h2>3. Werbung</h2>
        <p>Um die Betriebskosten zu decken, könnte die Seite künftig Werbedienste Dritter (z. B. Google AdSense) nutzen. Dann könnten Werbeanbieter Cookies verwenden, um interessenbasierte Werbung zu zeigen. Vor der Einführung von Werbung aktualisieren wir diese Erklärung.</p>
      </section>

      <section>
        <h2>4. Externe Dienste</h2>
        <p>Die Seite lädt Daten von folgenden externen Diensten, um Inhalte anzuzeigen. Dabei werden Verbindungsdaten wie die IP-Adresse deines Geräts an den jeweiligen Dienst übermittelt.</p>
        <ul>
          <li>„Data Dragon“ von Riot Games (Bilder von Champions, Symbolen und Skins)</li>
          <li>Community Dragon (Rangabzeichen, Rollensymbole und Beschwörersymbole)</li>
          <li>Google Fonts (Webschriften)</li>
          <li>GitHub Pages (Hosting der Seite)</li>
        </ul>
      </section>

      <section>
        <h2>5. Haftungsausschluss</h2>
        <p>Der Betreiber haftet nicht für Schäden, die aus der Nutzung der Seite entstehen. Details in den <a href="/terms/">Nutzungsbedingungen</a>.</p>
      </section>

      <section>
        <h2>6. Kontakt</h2>
        <p>Fragen zu dieser Erklärung bitte an ${X}.</p>
      </section>

      <section>
        <h2>7. Änderungen</h2>
        <p>Diese Erklärung kann bei Bedarf ohne Ankündigung geändert werden. Änderungen gelten ab ihrer Veröffentlichung auf dieser Seite.</p>
        <p class="note">Stand: ${UPDATED}</p>
      </section>`,
  },

  terms: {
    title: 'Nutzungsbedingungen & Haftungsausschluss | SUMMONER CARD',
    description: 'Nutzungsbedingungen und Haftungsausschluss von SUMMONER CARD (Summoner Card Maker): wie du deine Bilder nutzen darfst, verbotene Nutzungen und die Rechte von Riot Games.',
    h1: 'Nutzungsbedingungen & Haftungsausschluss',
    body: `
      <p>Diese Nutzungsbedingungen („die Bedingungen“) regeln die Nutzung von SUMMONER CARD („die Seite“). Mit der Nutzung der Seite gilt, dass du den Bedingungen zustimmst.</p>

      <section>
        <h2>1. Der Dienst</h2>
        <p>Die Seite ist ein kostenloses Web-Tool zum Erstellen von League-of-Legends-Profilkarten (Summoner Cards) als Bild. Ein Konto ist nicht nötig.</p>
      </section>

      <section>
        <h2>2. Nutzung deiner Bilder</h2>
        <ul>
          <li>Du darfst die erstellten Bilder <strong>frei für private Zwecke</strong> nutzen, etwa für Posts in sozialen Medien (X, Discord, Instagram usw.), Profile, Stream-Overlays, Twitch-Panels und Blogs. Auch in monetarisierten Streams oder Kanälen.</li>
          <li>Du <strong>darfst die Bilder</strong> oder die enthaltenen Spielgrafiken <strong>nicht verkaufen oder gegen Entgelt verbreiten</strong>.</li>
          <li>Seitenname und URL unten rechts im Bild lassen sich in den Einstellungen ausblenden.</li>
        </ul>
      </section>

      <section>
        <h2>3. Rechte von Riot Games</h2>
        <p>Die Rechte an den auf den Karten gezeigten Champion-, Skin-, Symbol-, Rangabzeichen- und sonstigen Bildern liegen bei Riot Games, Inc. Die Seite ist Fan-Content nach der Richtlinie „<a href="https://www.riotgames.com/en/legal" target="_blank" rel="noopener">Legal Jibber Jabber</a>“ von Riot Games und wird von Riot Games weder unterstützt noch gesponsert.</p>
        <p class="legal">${LEGAL}</p>
      </section>

      <section>
        <h2>4. Hochgeladene Bilder</h2>
        <p>Lade als Symbol oder Hintergrund nur Bilder hoch, die du nutzen darfst. Hochgeladene Bilder werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet.</p>
      </section>

      <section>
        <h2>5. Verbotene Nutzungen</h2>
        <ul>
          <li>Karten erstellen oder veröffentlichen, die sich als jemand anderes ausgeben oder ohne Erlaubnis Namen oder Konten anderer verwenden</li>
          <li>Karten mit verleumderischen, diskriminierenden oder obszönen Inhalten erstellen oder veröffentlichen</li>
          <li>Urheber-, Persönlichkeits- oder sonstige Rechte Dritter verletzen</li>
          <li>Den Betrieb der Seite stören oder sich als die offizielle Seite ausgeben</li>
          <li>Alles andere, was gegen Gesetze oder die guten Sitten verstößt</li>
        </ul>
      </section>

      <section>
        <h2>6. Haftungsausschluss</h2>
        <ul>
          <li>Die Seite wird so bereitgestellt, wie sie ist. Wir garantieren weder die Richtigkeit der Inhalte noch die Funktion auf allen Geräten und Browsern noch die dauerhafte Verfügbarkeit.</li>
          <li>Im Browser gespeicherte Eingaben können je nach Browser-Einstellungen oder -Aktionen verloren gehen.</li>
          <li>Der Betreiber haftet nicht für Probleme oder Schäden aus der Nutzung der Seite oder der erstellten Bilder.</li>
          <li>Die Seite kann ihren Dienst ohne Ankündigung ändern, unterbrechen oder einstellen.</li>
        </ul>
      </section>

      <section>
        <h2>7. Änderungen der Bedingungen</h2>
        <p>Die Bedingungen können bei Bedarf ohne Ankündigung geändert werden. Änderungen gelten ab ihrer Veröffentlichung auf dieser Seite.</p>
        <p class="note">Stand: ${UPDATED}</p>
      </section>`,
  },

  about: {
    title: 'Über & Kontakt | SUMMONER CARD',
    description: 'Über SUMMONER CARD (Summoner Card Maker): wer die Seite betreibt, wie du Kontakt aufnimmst und welche Ressourcen genutzt werden.',
    h1: 'Über & Kontakt',
    body: `
      <section>
        <h2>Über SUMMONER CARD</h2>
        <p>SUMMONER CARD ist ein kostenloses, privat betriebenes Tool, mit dem League-of-Legends-Spieler ganz einfach „Summoner Cards“ erstellen können, um sich vorzustellen und Freunde zu finden. Ziel ist, dass du eine Karte nur durch Ausfüllen von Feldern erstellst, ohne eine Vorlage zu bearbeiten.</p>
      </section>

      <section>
        <h2>Betreiber</h2>
        <table class="doc-table">
          <tbody>
            <tr><th>Seitenname</th><td>SUMMONER CARD (Summoner Card Maker)</td></tr>
            <tr><th>URL</th><td><a href="/">${HOME}</a></td></tr>
            <tr><th>Betrieben von</th><td>hotaka (Privatperson)</td></tr>
            <tr><th>Kontakt</th><td>${X}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>Fehlerberichte, Funktionswünsche oder sonst etwas zur Seite: schick einfach eine DM oder antworte auf ${X}. Der Betreiber lebt in Japan, aber Nachrichten auf Englisch oder per Übersetzer sind willkommen. Bei Fehlern hilft es sehr, Gerät und Browser zu nennen (z. B. Safari auf dem iPhone oder in der X-App) und was du gerade gemacht hast.</p>
      </section>

      <section>
        <h2>Verwendete Ressourcen</h2>
        <ul>
          <li>Champion-, Skin- und Symbolbilder: „Data Dragon“ von Riot Games</li>
          <li>Rangabzeichen, Rollensymbole und Beschwörersymbole: <a href="https://www.communitydragon.org/" target="_blank" rel="noopener">Community Dragon</a></li>
          <li>Schriften: Google Fonts (M PLUS 1p, M PLUS Rounded 1c, Cinzel, Dancing Script, Noto Sans)</li>
        </ul>
        <p class="legal">${LEGAL}</p>
      </section>`,
  },
});
