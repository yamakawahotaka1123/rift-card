// Brazilian Portuguese page contents. Same shape as ja.mjs.
const X = '<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X (@hotaka_1123)</a>';

export default ({ UPDATED, LEGAL, IMG, HOME }) => ({
  htmlLang: 'pt-BR',
  locale: 'pt_BR',
  siteSub: 'Criador de card de invocador',
  nav: { make: 'Criar card', guide: 'Como usar', templates: 'Modelos', banner: 'Banners', faq: 'Perguntas frequentes' },
  footerNav: { guide: 'Como usar', templates: 'Modelos', banner: 'Banners de divulgação', faq: 'Perguntas frequentes', about: 'Sobre e contato', privacy: 'Política de privacidade', terms: 'Termos de uso' },
  footer: {
    storage: 'Tudo o que você digita fica neste navegador e nunca é enviado a um servidor. Use as imagens que criar nas redes sociais, lives e onde quiser.',
    contact: `Bugs ou sugestões? Fale comigo no ${X}.`,
    analytics: 'Para melhorar o site, usamos o Google Analytics para contar visitas e o uso dos recursos (o que você digita e suas imagens não são enviados). Veja a <a href="/privacy/">política de privacidade</a> para mais detalhes.',
  },
  aria: { menu: 'Menu', siteInfo: 'Informações do site', breadcrumbs: 'Navegação estrutural', toc: 'Conteúdo' },
  top: 'Início',
  cta: 'Crie seu card de invocador →',
  translationNote: 'Esta é uma tradução do original em japonês. Se houver diferenças, prevalece a versão em japonês.',
  copied: 'Copiado',
  copyFailed: 'Não foi possível copiar. Selecione o texto e copie manualmente',

  themes: [
    ['halloween', 'Halloween', 'Roxo noturno e laranja abóbora com morcegos, teias de aranha e uma abóbora iluminada. Seu ícone ganha um chapéu de bruxa. Fica ótimo com uma skin Enfeitiçada de fundo.'],
    ['christmas', 'Natal', 'Vermelho e verde com borda de bengala doce, pisca-pisca, flocos de neve e um presente. Seu ícone ganha um gorro de Papai Noel. Experimente com uma skin de inverno.'],
    ['newyear', 'Ano-Novo', 'Carmesim e dourado com raios de sol nascente, flores de ameixeira e kagami mochi. Seu ícone ganha um leque. Perfeito para um post de “Feliz Ano-Novo”.'],
    ['hextech', 'Hextec', 'O visual clássico dourado e azul-marinho, parecido com o cliente do LoL. Combina com qualquer fundo de skin; na dúvida, escolha este.'],
    ['noxus', 'Noxus', 'Um design vermelho e preto marcante. Perfeito com skins de campeões noxianos como Darius ou Sion.'],
    ['freljord', 'Freljord', 'Um design azul-gelo. Ótimo com Ashe, Sejuani ou qualquer skin de inverno.'],
    ['shadow', 'Ilhas das Sombras', 'Um design verde brilhante e sinistro para Thresh, Viego e os campeões das Ilhas das Sombras.'],
    ['ionia', 'Ionia', 'Um design suave rosa e roxo para Ahri, Irelia e skins de flor de cerejeira.'],
    ['fairy', 'Rosa sonhador', 'Um design “yume-kawaii” rosa pastel com chifre de unicórnio, doces e piso xadrez.'],
    ['fairy-mint', 'Azul sonhador', 'A versão azul do Rosa sonhador, misturando azul pastel e lavanda.'],
    ['guardian', 'Guardiã Estelar', 'Um design claro, brilhante e fofo para skins de Guardiã Estelar e de garota mágica.'],
    ['jirai', 'Jirai-kei', 'O estilo japonês “jirai-kei” em preto e rosa com laços, corações, borda de renda e xadrez vichy.'],
    ['ryousan', 'Ryousan-kei', 'O doce estilo japonês “ryousan-kei” em branco e rosa-claro com pérolas, renda e laços.'],
    ['y2k', 'Y2K', 'Estrelas cromadas, carinhas sorridentes, borboletas e moldura arco-íris para um visual retrô Y2K.'],
    ['gaming', 'Gamer RGB', 'Moldura neon arco-íris RGB, texto brilhante e grade synthwave sobre preto. Pura energia de PC gamer.'],
    ['wafu', 'Japonês', 'Um design japonês moderno: papel washi, vermelho, branco e dourado, ondas seigaiha, pétalas de cerejeira e fonte Mincho.'],
  ],

  templates: {
    title: 'Modelos de card de invocador (temas) | SUMMONER CARD',
    description: 'Mais de 15 modelos grátis de card de invocador de League of Legends: Halloween, Natal, Gamer RGB, Y2K, japonês e mais. Escolha um tema e crie seu card de perfil de LoL na hora.',
    h1: 'Modelos de card de invocador (temas)',
    intro: `
      <p>O SUMMONER CARD tem mais de 15 modelos (temas) para escolher. Não precisa editar imagem: preencha os campos e o card fica pronto. Toque em “Usar este modelo” abaixo de um exemplo para abrir o criador com esse tema selecionado.</p>
      <p>Todos os temas aceitam qualquer skin de campeão ou uma imagem sua como fundo. Só de trocar o fundo, o card muda totalmente.</p>`,
    button: 'Usar este modelo →',
    alt: (name) => `Modelo de card de invocador: ${name}`,
  },

  faq: {
    title: 'Perguntas frequentes | SUMMONER CARD (Summoner Card Maker)',
    description: 'Perguntas frequentes sobre o SUMMONER CARD, o criador de card de invocador de LoL: se é grátis, como salvar no celular, o que fazer se não salvar no app do X, como seus dados são tratados e mais.',
    h1: 'Perguntas frequentes',
    items: [
      ['O que é um card de invocador?', 'É uma imagem de perfil em que jogadores de League of Legends resumem elo, rotas, campeões principais, horário de jogo e mais. É usado para achar duo e amigos no X, servidores do Discord e outros lugares.'],
      ['É grátis? Preciso de conta?', 'É totalmente grátis, sem cadastro nem login.'],
      ['Dá para criar no celular?', 'Sim, direto no navegador do celular. No iPhone, ao tocar em “Salvar imagem” o card aparece em tamanho cheio; toque e segure para salvar em Fotos.'],
      ['Não consigo salvar quando abro o site pelo app do X', 'Navegadores dentro de apps (X, Instagram, Discord e outros) costumam bloquear salvar e compartilhar imagens. Escolha “Abrir no navegador” no menu “…” no canto superior direito para abrir o site no Safari ou Chrome. Você também pode tocar e segurar a imagem que aparece para salvar.'],
      ['Preciso editar uma imagem de modelo?', 'Não precisa de nenhum editor de imagem. Preencha os campos e escolha um tema, e o card é gerado com ícones de campeões e de elo.'],
      ['E se eu não quiser mostrar meu nome de invocador?', 'Abaixo do campo de nome dá para escolher uma opção no lugar: “Privado”, “Conto quando jogarmos”, “Me chama na DM” ou “Quando ficarmos amigos”.'],
      ['Meu elo é puxado automaticamente?', 'Por enquanto não; você escolhe. Quem não tem elo ou prefere não mostrar pode deixar assim.'],
      ['O que eu digito é enviado para algum lugar?', 'Não. O que você digita e as imagens que envia são processados e salvos só no seu navegador e nunca são enviados ao nosso servidor.'],
      ['Posso editar meu card depois?', 'O que você digita é salvo automaticamente no navegador, então dá para continuar de onde parou. Não é mantido se você limpar os dados do navegador ou abrir o site em outro aparelho ou navegador.'],
      ['Posso usar as imagens como quiser?', 'Pode postar à vontade no X, Discord, na sua live, em painéis da Twitch e afins. Não pode vender as imagens nem a arte do LoL que elas contêm. Veja os termos de uso para mais detalhes.'],
      ['Posso tirar a URL do canto inferior direito?', 'Sim: desmarque “Colocar a URL do site no canto inferior direito do card” abaixo da seção de design. Se deixar, ajuda demais o site a crescer!'],
      ['Achei um bug / quero um recurso', 'Fale comigo no X (@hotaka_1123). Pode escrever em inglês ou usar um tradutor.'],
    ],
  },

  guide: {
    title: 'Como criar um card de invocador | SUMMONER CARD',
    description: 'Guia passo a passo para criar um card de invocador (card de perfil) de League of Legends: cada campo explicado, os quatro níveis de rota, recortar ícones da arte de skins, ajustar o fundo e salvar no celular.',
    h1: 'Como criar um card de invocador',
    body: `
      <p>O SUMMONER CARD é uma ferramenta grátis para criar cards de perfil de League of Legends, conhecidos como cards de invocador, direto no navegador. Este guia explica cada campo e dá dicas para um card caprichado.</p>

      <nav class="toc" aria-label="Conteúdo">
        <p>Conteúdo</p>
        <ol>
          <li><a href="#basic">Informações básicas (nome e ícone)</a></li>
          <li><a href="#rank">Elo</a></li>
          <li><a href="#role">Rotas</a></li>
          <li><a href="#champs">Campeões principais</a></li>
          <li><a href="#tags">Estilo de jogo</a></li>
          <li><a href="#contact">Horário e contato</a></li>
          <li><a href="#comment">Mensagem</a></li>
          <li><a href="#design">Design (tema e fundo)</a></li>
          <li><a href="#save">Salvar e compartilhar</a></li>
          <li><a href="#tips">Dicas para achar amigos com seu card</a></li>
        </ol>
      </nav>

      <section id="basic">
        <h2>1. Informações básicas (nome e ícone)</h2>
        <h3>Nome de invocador e tag</h3>
        <p>Digite a parte do nome do seu Riot ID e sua tag (o que vem depois do #). A tag aparece em letra pequena ao lado do nome, como “#BR1”.</p>
        <p>Se preferir não mostrar seu nome, toque numa das opções abaixo do campo — <strong>“Privado”, “Conto quando jogarmos”, “Me chama na DM” ou “Quando ficarmos amigos”</strong> — e esse texto aparece no lugar do nome.</p>
        <h3>Nível</h3>
        <p>Digite seu nível de invocador para mostrar “Lv.○○” abaixo do ícone. Deixe vazio para esconder.</p>
        <h3>Ícone</h3>
        <p>“Escolher ícone” tem três opções:</p>
        <ul>
          <li><strong>Ícones de invocador</strong>: escolha entre cerca de 5.000 ícones do jogo. Busque pelo nome, como “Ahri”, “K/DA” ou “Poro”.</li>
          <li><strong>Campeões</strong>: use o retrato de um campeão.</li>
          <li><strong>Enviar imagem</strong>: use qualquer imagem. Depois de enviar, abre uma janela de recorte; arraste e dê zoom para escolher a parte que quiser.</li>
        </ul>
        <p>O ícone pode ser redondo ou quadrado.</p>
      </section>

      <section id="rank">
        <h2>2. Elo</h2>
        <p>Escolha seu elo (Ferro a Desafiante) e divisão (I–IV) para mostrar o emblema. Do Mestre para cima não há divisão. Se preferir não mostrar o elo, deixe em “Sem classificação”.</p>
      </section>

      <section id="role">
        <h2>3. Rotas</h2>
        <p>Para TOP, JG, MID, ADC e SUP você marca um de quatro níveis conforme a vontade de jogar.</p>
        <table class="doc-table">
          <thead><tr><th>Botão</th><th>No card</th><th>Significado</th></tr></thead>
          <tbody>
            <tr><td>Principal</td><td>MAIN (destacado)</td><td>Sua melhor rota. Só pode haver uma</td></tr>
            <tr><td>Secundária</td><td>SUB</td><td>Uma rota que você também joga na ranqueada</td></tr>
            <tr><td>Normal OK</td><td>NORM</td><td>Uma rota que você joga em partidas normais</td></tr>
            <tr><td>Não</td><td>NG (vermelho, riscado)</td><td>Uma rota que você não joga</td></tr>
          </tbody>
        </table>
        <p>Toque de novo no botão selecionado para desmarcar.</p>
      </section>

      <section id="champs">
        <h2>4. Campeões principais</h2>
        <p>Adicione até cinco campeões com “+ Adicionar”. Escolha antes uma rota no topo do seletor de campeões, e o campeão é adicionado <strong>com o ícone dessa rota</strong>. Dá para adicionar o mesmo campeão em rotas diferentes também (por exemplo, Lux de SUP e de MID).</p>
        <ul>
          <li><strong>Arte da skin</strong>: toque no botão “Arte da skin” de um campeão, escolha qualquer skin e recorte qualquer parte da splash art como ícone. “Desfazer” volta ao retrato normal.</li>
          <li><strong>Título</strong>: alterne entre “Campeões principais” e “Campeões favoritos”.</li>
          <li><strong>Ordem</strong>: “←” move um campeão para a esquerda e “×” remove.</li>
        </ul>
      </section>

      <section id="tags">
        <h2>5. Estilo de jogo</h2>
        <p>Escolha até seis tags como Casual, Ranqueada, ARAM, Com voz ou Procuro duo. Se não tiver a que você quer, crie a sua (até 12 caracteres) com “+ Criar a sua”.</p>
      </section>

      <section id="contact">
        <h2>6. Horário e contato</h2>
        <p>Preencha horário de jogo, Discord, X, Twitch e YouTube. Só os campos preenchidos aparecem abaixo do nome, e eles se organizam em duas colunas automaticamente quando são muitos.</p>
      </section>

      <section id="comment">
        <h2>7. Mensagem</h2>
        <p>Até 80 caracteres, mostrada no pé do card. Quebras de linha também funcionam (até duas linhas).</p>
      </section>

      <section id="design">
        <h2>8. Design (tema e fundo)</h2>
        <h3>Tema</h3>
        <p>Escolha entre mais de 15 temas. Veja todos na página de <a href="/templates/">modelos</a>.</p>
        <h3>Fundo</h3>
        <ul>
          <li><strong>Escolher de uma skin</strong>: escolha um campeão e uma skin, e a splash art vira o fundo.</li>
          <li><strong>Enviar sua própria imagem</strong>: use qualquer imagem como fundo (dá para recortar ao enviar).</li>
          <li><strong>Posição, zoom e escurecimento</strong>: ajuste com os controles. Também dá para arrastar direto na prévia ou dar zoom com a roda do mouse.</li>
        </ul>
        <p>Se o texto ficar difícil de ler, aumente “Escurecer fundo”.</p>
      </section>

      <section id="save">
        <h2>9. Salvar e compartilhar</h2>
        <ul>
          <li><strong>Salvar imagem</strong>: baixa o card como PNG. No iPhone a imagem aparece em tamanho cheio; toque e segure e escolha “Salvar em Fotos”.</li>
          <li><strong>Copiar imagem</strong>: no computador, cole direto no X ou Discord com Ctrl+V.</li>
          <li><strong>Compartilhar no X</strong>: no celular, envie a imagem pelo menu de compartilhar. No computador, a imagem é copiada e a janela de post do X abre.</li>
          <li><strong>Banner de divulgação</strong>: você também pode criar um banner com seu card. Veja <a href="/banner/">banners de divulgação</a>.</li>
        </ul>
        <p>O que você digita é salvo no navegador automaticamente. “Limpar” em cada seção limpa só aquela seção, e “Redefinir tudo” lá embaixo limpa tudo.</p>
        <p class="note">Pode não salvar em navegadores de apps como o do X. Escolha “Abrir no navegador” no menu “…” no canto superior direito.</p>
      </section>

      <section id="tips">
        <h2>10. Dicas para achar amigos com seu card</h2>
        <ul>
          <li><strong>Seja específico no horário</strong>: “dias úteis das 22h à 1h” deixa bem mais claro se dá para jogar junto do que só “à noite”.</li>
          <li><strong>Marque as rotas que você não joga</strong>: saber suas rotas “NG” ajuda a galera a te achar como duo ou para um time de 5.</li>
          <li><strong>Diga o que procura com tags</strong>: “Procuro duo”, “Procuro time 5” ou “Iniciantes bem-vindos” atraem gente com o mesmo objetivo.</li>
          <li><strong>Use hashtags ao postar</strong>: no X, colocar “#LeagueOfLegends” e “#SummonerCard” ajuda a te encontrarem.</li>
        </ul>
      </section>`,
  },

  banner: {
    title: 'Banners de divulgação (uso livre) | SUMMONER CARD',
    description: 'Banners de divulgação do SUMMONER CARD. Grátis para seu overlay de live, painéis da Twitch, YouTube, blog ou site. Você também pode criar um banner com seu próprio card.',
    h1: 'Banners de divulgação (uso livre)',
    body: `
      <p>Estes banners são para quem quiser indicar o SUMMONER CARD. Coloque no overlay da live, nos painéis da Twitch, na descrição do YouTube, no blog ou no site — <strong>sem precisar pedir</strong>. Onde der para colocar link, vou agradecer muito se apontar para <code>${HOME}</code>.</p>
      <p class="thanks">Não precisa pedir, mas se usar, um alô no ${X} vai me deixar muito feliz 🙏 Adoraria ver sua live ou seu post!</p>

      <section>
        <h2>Crie um banner com seu próprio card</h2>
        <p>Toque em “🎨 Crie um banner de divulgação com seu card” no criador para ganhar um banner (1800×600) com o card que você fez. Serve também como imagem de painel da Twitch ou capa do X. Cards com tema sonhador ganham um banner pastel.</p>
      </section>

      <section>
        <h2>Banners para baixar (todos os temas)</h2>
        <p>Clique numa imagem para abrir em tamanho cheio (1800×600) e salve por lá.</p>
        <!--BANNERS-->
      </section>

      <section>
        <h2>Como colocar</h2>
        <h3>Blog ou site</h3>
        <p>Cole este HTML do jeito que está.</p>
        <pre class="embed-code" id="embed-code">&lt;a href="${HOME}" target="_blank" rel="noopener"&gt;&lt;img src="https://summonercard.com${IMG}/banner.jpg" alt="SUMMONER CARD | Summoner Card Maker" width="600" height="200"&gt;&lt;/a&gt;</pre>
        <button type="button" class="btn ghost small" data-copy-target="embed-code">Copiar HTML</button>
        <p>Para outro tema, troque <code>banner.jpg</code> pelo nome do arquivo dessa imagem (por exemplo <code>banner-halloween.jpg</code>).</p>
        <h3>Painel da Twitch</h3>
        <p>No seu canal, vá em “Sobre” → “Editar painéis”, envie o banner como imagem e coloque <code>${HOME}</code> em “A imagem leva a”.</p>
        <h3>Como texto</h3>
        <pre class="embed-code" id="text-code">Crie seu card de invocador de LoL aqui👉 ${HOME}</pre>
        <button type="button" class="btn ghost small" data-copy-target="text-code">Copiar texto</button>
      </section>

      <section>
        <h2>Atenção</h2>
        <ul>
          <li>Fique à vontade para redimensionar ou recortar os banners.</li>
          <li>Não venda os banners nem use de um jeito que pareça que você é o SUMMONER CARD oficial.</li>
          <li>Os banners contêm arte do LoL. Veja os <a href="/terms/">termos de uso</a> sobre os direitos da Riot Games.</li>
        </ul>
      </section>`,
  },

  privacy: {
    title: 'Política de privacidade | SUMMONER CARD',
    description: 'Política de privacidade do SUMMONER CARD (Summoner Card Maker): como tratamos o que você digita, as análises e os serviços externos.',
    h1: 'Política de privacidade',
    body: `
      <p>O SUMMONER CARD (“o Site”) trata as informações dos usuários da seguinte forma.</p>

      <section>
        <h2>1. O que você digita e suas imagens</h2>
        <p>O que você digita no card (nome de invocador, contatos etc.) e as imagens que envia são processados só no seu navegador. Nunca são enviados nem armazenados em nosso servidor.</p>
        <p>Para que você possa continuar de onde parou, o que você digita fica salvo no armazenamento do navegador (localStorage). Esses dados existem só no seu aparelho e são apagados quando você exclui os dados do site no navegador ou toca em “Redefinir tudo” na ferramenta.</p>
      </section>

      <section>
        <h2>2. Análises</h2>
        <p>Para melhorar o Site, usamos o Google Analytics, uma ferramenta de análise da Google LLC. O Google Analytics usa cookies para coletar visualizações de página, origens de acesso, tipos de aparelho e a frequência de uso dos recursos do Site (como quantas imagens são salvas e quais temas são escolhidos). Esses dados são agregados de forma anônima e não identificam ninguém. O texto que você digita e suas imagens não são enviados.</p>
        <p>Você pode recusar essa coleta desativando os cookies no navegador ou usando o <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">complemento de desativação do Google Analytics</a>. Para saber como o Google trata os dados, veja <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Privacidade e Termos do Google</a>.</p>
      </section>

      <section>
        <h2>3. Publicidade</h2>
        <p>Para cobrir os custos, o Site poderá usar no futuro serviços de publicidade de terceiros (como o Google AdSense). Nesse caso, os provedores de anúncios poderão usar cookies para mostrar anúncios de acordo com seus interesses. Vamos atualizar esta política antes de colocar anúncios.</p>
      </section>

      <section>
        <h2>4. Serviços externos</h2>
        <p>O Site carrega dados dos seguintes serviços externos para exibir conteúdo. Nisso, informações de conexão como o endereço IP do seu aparelho são enviadas a cada serviço.</p>
        <ul>
          <li>“Data Dragon” da Riot Games (imagens de campeões, ícones e skins)</li>
          <li>Community Dragon (emblemas de elo, ícones de rota e imagens de ícones de invocador)</li>
          <li>Google Fonts (fontes web)</li>
          <li>GitHub Pages (hospedagem do Site)</li>
        </ul>
      </section>

      <section>
        <h2>5. Isenção de responsabilidade</h2>
        <p>O responsável não se responsabiliza por danos decorrentes do uso do Site. Veja os <a href="/terms/">termos de uso</a> para mais detalhes.</p>
      </section>

      <section>
        <h2>6. Contato</h2>
        <p>Para dúvidas sobre esta política, entre em contato pelo ${X}.</p>
      </section>

      <section>
        <h2>7. Alterações</h2>
        <p>Esta política pode ser alterada sem aviso quando necessário. As alterações valem a partir da publicação nesta página.</p>
        <p class="note">Data de criação: ${UPDATED}</p>
      </section>`,
  },

  terms: {
    title: 'Termos de uso e isenção de responsabilidade | SUMMONER CARD',
    description: 'Termos de uso e isenção de responsabilidade do SUMMONER CARD (Summoner Card Maker): como você pode usar as imagens que cria, usos proibidos e direitos da Riot Games.',
    h1: 'Termos de uso e isenção de responsabilidade',
    body: `
      <p>Estes termos de uso (“os Termos”) definem as condições de uso do SUMMONER CARD (“o Site”). Ao usar o Site, considera-se que você aceitou os Termos.</p>

      <section>
        <h2>1. O serviço</h2>
        <p>O Site é uma ferramenta web grátis para criar imagens de card de perfil (card de invocador) de League of Legends. Não é preciso conta.</p>
      </section>

      <section>
        <h2>2. Uso das imagens que você cria</h2>
        <ul>
          <li>Você pode usar as imagens que cria <strong>livremente em atividades pessoais</strong>, como posts em redes sociais (X, Discord, Instagram etc.), perfis, overlays de live, painéis da Twitch e blogs. Usar em lives ou canais monetizados também pode.</li>
          <li>Você <strong>não pode vender nem distribuir mediante pagamento</strong> as imagens ou a arte do jogo que elas contêm.</li>
          <li>O nome e a URL do site no canto inferior direito da imagem podem ser ocultados nas configurações.</li>
        </ul>
      </section>

      <section>
        <h2>3. Direitos da Riot Games</h2>
        <p>Os direitos sobre imagens de campeões, skins, ícones, emblemas de elo e outras exibidas nos cards pertencem à Riot Games, Inc. O Site é conteúdo de fã feito sob a política “<a href="https://www.riotgames.com/en/legal" target="_blank" rel="noopener">Legal Jibber Jabber</a>” da Riot Games e não é endossado nem patrocinado pela Riot Games.</p>
        <p class="legal">${LEGAL}</p>
      </section>

      <section>
        <h2>4. Imagens que você envia</h2>
        <p>Envie como ícone ou fundo apenas imagens que você tem direito de usar. As imagens enviadas são processadas só no seu navegador e não são enviadas ao nosso servidor.</p>
      </section>

      <section>
        <h2>5. Usos proibidos</h2>
        <ul>
          <li>Criar ou publicar cards que se passem por outra pessoa ou usem o nome ou a conta de outra pessoa sem permissão</li>
          <li>Criar ou publicar cards com conteúdo difamatório, discriminatório ou obsceno</li>
          <li>Violar direitos autorais, de imagem ou outros direitos de terceiros</li>
          <li>Atrapalhar o funcionamento do Site ou se passar pelo Site oficial</li>
          <li>Qualquer outra coisa que viole a lei, a ordem pública ou os bons costumes</li>
        </ul>
      </section>

      <section>
        <h2>6. Isenção de responsabilidade</h2>
        <ul>
          <li>O Site é oferecido como está. Não garantimos a exatidão do conteúdo, o funcionamento em todos os aparelhos e navegadores nem a continuidade do serviço.</li>
          <li>O que fica salvo no navegador pode se perder dependendo das configurações ou ações do navegador.</li>
          <li>O responsável não se responsabiliza por problemas ou danos decorrentes do uso do Site ou das imagens que você cria.</li>
          <li>O Site pode alterar, suspender ou encerrar o serviço sem aviso.</li>
        </ul>
      </section>

      <section>
        <h2>7. Alterações nos Termos</h2>
        <p>Os Termos podem ser alterados sem aviso quando necessário. As alterações valem a partir da publicação nesta página.</p>
        <p class="note">Data de criação: ${UPDATED}</p>
      </section>`,
  },

  about: {
    title: 'Sobre e contato | SUMMONER CARD',
    description: 'Sobre o SUMMONER CARD (Summoner Card Maker): quem mantém, como entrar em contato e os recursos usados.',
    h1: 'Sobre e contato',
    body: `
      <section>
        <h2>Sobre o SUMMONER CARD</h2>
        <p>O SUMMONER CARD é uma ferramenta grátis mantida por uma pessoa, feita para que jogadores de League of Legends criem com facilidade “cards de invocador” para se apresentar e achar amigos. A ideia é você fazer um card só preenchendo campos, sem editar um modelo.</p>
      </section>

      <section>
        <h2>Responsável</h2>
        <table class="doc-table">
          <tbody>
            <tr><th>Nome do site</th><td>SUMMONER CARD (Summoner Card Maker)</td></tr>
            <tr><th>URL</th><td><a href="/">${HOME}</a></td></tr>
            <tr><th>Mantido por</th><td>hotaka (pessoa física)</td></tr>
            <tr><th>Contato</th><td>${X}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Contato</h2>
        <p>Bugs, ideias de recursos ou qualquer coisa sobre o site: mande uma DM ou responda no ${X}. O responsável mora no Japão, mas pode escrever em inglês ou usar um tradutor. Se for bug, ajuda muito dizer o aparelho e o navegador (por exemplo, Safari no iPhone ou dentro do app do X) e o que você estava fazendo quando aconteceu.</p>
      </section>

      <section>
        <h2>Recursos usados</h2>
        <ul>
          <li>Imagens de campeões, skins e ícones: “Data Dragon” da Riot Games</li>
          <li>Emblemas de elo, ícones de rota e ícones de invocador: <a href="https://www.communitydragon.org/" target="_blank" rel="noopener">Community Dragon</a></li>
          <li>Fontes: Google Fonts (M PLUS 1p, M PLUS Rounded 1c, Cinzel, Dancing Script, Noto Sans)</li>
        </ul>
        <p class="legal">${LEGAL}</p>
      </section>`,
  },
});
