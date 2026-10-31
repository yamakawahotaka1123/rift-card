// Vietnamese page contents. Same shape as ja.mjs.
const X = '<a href="https://x.com/hotaka_1123" target="_blank" rel="noopener">X (@hotaka_1123)</a>';

export default ({ UPDATED, LEGAL, IMG, HOME }) => ({
  htmlLang: 'vi',
  locale: 'vi_VN',
  siteSub: 'Tạo thẻ triệu hồi sư',
  nav: { make: 'Tạo thẻ', guide: 'Hướng dẫn', templates: 'Mẫu thẻ', banner: 'Banner quảng bá', faq: 'Câu hỏi thường gặp' },
  footerNav: { guide: 'Hướng dẫn', templates: 'Mẫu thẻ', banner: 'Banner quảng bá', faq: 'Câu hỏi thường gặp', about: 'Giới thiệu & liên hệ', privacy: 'Chính sách quyền riêng tư', terms: 'Điều khoản sử dụng' },
  footer: {
    storage: 'Mọi thông tin bạn nhập chỉ lưu trong trình duyệt này và không bao giờ gửi lên máy chủ. Ảnh tạo ra có thể dùng thoải mái trên mạng xã hội, stream và mọi nơi.',
    contact: `Báo lỗi hoặc góp ý? Hãy liên hệ qua ${X}.`,
    analytics: 'Để cải thiện trang web, chúng tôi dùng Google Analytics để đếm lượt truy cập và mức độ sử dụng tính năng (không gửi nội dung bạn nhập hay ảnh của bạn). Xem chi tiết tại <a href="/privacy/">chính sách quyền riêng tư</a>.',
  },
  aria: { menu: 'Menu', siteInfo: 'Thông tin trang', breadcrumbs: 'Đường dẫn', toc: 'Mục lục' },
  top: 'Trang chủ',
  cta: 'Tạo thẻ triệu hồi sư của bạn →',
  translationNote: 'Đây là bản dịch từ bản gốc tiếng Nhật. Nếu có khác biệt, bản tiếng Nhật được ưu tiên.',
  copied: 'Đã sao chép',
  copyFailed: 'Không sao chép được. Hãy chọn văn bản và sao chép thủ công',

  themes: [
    ['halloween', 'Halloween', 'Tím đêm và cam bí ngô cùng dơi, mạng nhện và đèn bí ngô. Biểu tượng được đội mũ phù thủy. Rất hợp với nền trang phục Phù Thủy.'],
    ['christmas', 'Giáng Sinh', 'Đỏ và xanh lá với viền kẹo gậy, dây đèn, bông tuyết và hộp quà. Biểu tượng được đội mũ ông già Noel. Thử với trang phục mùa đông nhé.'],
    ['newyear', 'Năm Mới', 'Đỏ thẫm và vàng với tia nắng bình minh, hoa mai và bánh dày kagami mochi. Biểu tượng có thêm quạt xếp. Hợp để đăng lời chúc năm mới.'],
    ['hextech', 'Hextech', 'Phong cách cổ điển vàng và xanh navy, gần giống client LMHT. Hợp với mọi hình nền trang phục, phân vân thì chọn cái này.'],
    ['noxus', 'Noxus', 'Thiết kế đỏ đen mạnh mẽ. Rất hợp với trang phục của các tướng Noxus như Darius hay Sion.'],
    ['freljord', 'Freljord', 'Thiết kế xanh băng giá. Hợp với Ashe, Sejuani hoặc trang phục mùa đông.'],
    ['shadow', 'Quần Đảo Bóng Đêm', 'Thiết kế xanh lá phát sáng ma mị cho Thresh, Viego và các tướng Quần Đảo Bóng Đêm.'],
    ['ionia', 'Ionia', 'Thiết kế hồng tím dịu dàng cho Ahri, Irelia và các trang phục hoa anh đào.'],
    ['fairy', 'Mộng mơ hồng', 'Phong cách “yume-kawaii” hồng pastel với sừng kỳ lân, kẹo ngọt và sàn caro.'],
    ['fairy-mint', 'Mộng mơ xanh', 'Phiên bản xanh của Mộng mơ hồng, pha xanh pastel và tím oải hương.'],
    ['guardian', 'Vệ Binh Tinh Tú', 'Thiết kế sáng và dễ thương cho trang phục Vệ Binh Tinh Tú và phong cách thiếu nữ phép thuật.'],
    ['jirai', 'Jirai-kei', 'Phong cách “jirai-kei” Nhật Bản đen hồng với nơ, trái tim, viền ren và họa tiết caro.'],
    ['ryousan', 'Ryousan-kei', 'Phong cách “ryousan-kei” Nhật Bản trắng hồng ngọt ngào với ngọc trai, ren và nơ.'],
    ['y2k', 'Y2K', 'Ngôi sao chrome, mặt cười, bươm bướm và khung cầu vồng cho vẻ retro Y2K.'],
    ['gaming', 'Gaming RGB', 'Khung neon cầu vồng RGB, chữ phát sáng và lưới synthwave trên nền đen. Chuẩn chất PC gaming.'],
    ['wafu', 'Phong cách Nhật', 'Thiết kế Nhật hiện đại: giấy washi, đỏ trắng vàng, sóng seigaiha, cánh hoa anh đào và chữ Mincho.'],
  ],

  templates: {
    title: 'Mẫu thẻ triệu hồi sư (giao diện) | SUMMONER CARD',
    description: 'Hơn 15 mẫu thẻ triệu hồi sư Liên Minh Huyền Thoại miễn phí: Halloween, Giáng Sinh, Gaming RGB, Y2K, phong cách Nhật và nhiều hơn. Chọn giao diện và tạo thẻ giới thiệu LMHT ngay.',
    h1: 'Mẫu thẻ triệu hồi sư (giao diện)',
    intro: `
      <p>SUMMONER CARD có hơn 15 mẫu (giao diện) để chọn. Không cần chỉnh ảnh: điền thông tin là thẻ hoàn thành. Bấm “Dùng mẫu này” bên dưới ví dụ để mở trang tạo thẻ với giao diện đó.</p>
      <p>Mọi giao diện đều dùng được trang phục tướng hoặc ảnh bạn tải lên làm nền. Chỉ cần đổi nền là thẻ trông khác hẳn.</p>`,
    button: 'Dùng mẫu này →',
    alt: (name) => `Mẫu thẻ triệu hồi sư: ${name}`,
  },

  faq: {
    title: 'Câu hỏi thường gặp | SUMMONER CARD (Summoner Card Maker)',
    description: 'Câu hỏi thường gặp về SUMMONER CARD, trang tạo thẻ triệu hồi sư LMHT: có miễn phí không, cách lưu trên điện thoại, làm gì khi không lưu được trong app X, dữ liệu được xử lý thế nào và hơn nữa.',
    h1: 'Câu hỏi thường gặp',
    items: [
      ['Thẻ triệu hồi sư là gì?', 'Là ảnh giới thiệu bản thân, nơi người chơi Liên Minh Huyền Thoại tóm tắt rank, vị trí, tướng tủ, giờ chơi… Mọi người dùng để tìm bạn duo và bạn chơi trên X, server Discord và nhiều nơi khác.'],
      ['Có miễn phí không? Có cần tài khoản không?', 'Hoàn toàn miễn phí, không cần đăng ký hay đăng nhập.'],
      ['Tạo trên điện thoại được không?', 'Được, ngay trên trình duyệt điện thoại. Trên iPhone, bấm “Lưu ảnh” sẽ hiện thẻ kích thước đầy đủ; nhấn giữ để lưu vào Ảnh.'],
      ['Mở trang từ app X thì không lưu được', 'Trình duyệt trong app (X, Instagram, Discord…) thường chặn lưu và chia sẻ ảnh. Chọn “Mở trong trình duyệt” từ menu “…” góc trên bên phải để mở bằng Safari hoặc Chrome. Bạn cũng có thể nhấn giữ ảnh hiện ra để lưu.'],
      ['Có cần chỉnh ảnh mẫu không?', 'Không cần app chỉnh ảnh. Điền thông tin và chọn giao diện là thẻ được tạo kèm biểu tượng tướng và rank.'],
      ['Không muốn hiện tên triệu hồi sư thì sao?', 'Bên dưới ô tên có sẵn lựa chọn để thay thế: “Bí mật”, “Chơi cùng sẽ nói”, “Nhắn riêng để hỏi” hoặc “Thân rồi sẽ nói”.'],
      ['Rank có được lấy tự động không?', 'Hiện tại chưa, bạn tự chọn. Người chưa có rank hoặc không muốn hiện rank cứ để nguyên.'],
      ['Thông tin tôi nhập có bị gửi đi đâu không?', 'Không. Nội dung bạn nhập và ảnh bạn tải lên chỉ được xử lý và lưu trong trình duyệt của bạn, không bao giờ gửi lên máy chủ của chúng tôi.'],
      ['Sau này sửa thẻ được không?', 'Thông tin được tự động lưu trong trình duyệt, lần sau mở lại có thể làm tiếp. Nếu xóa dữ liệu trình duyệt hoặc mở trên thiết bị, trình duyệt khác thì dữ liệu sẽ không theo sang.'],
      ['Ảnh có dùng tự do được không?', 'Bạn có thể đăng thoải mái lên X, Discord, stream, panel Twitch… Không được bán ảnh hay tác phẩm nghệ thuật LMHT trong ảnh. Xem chi tiết tại điều khoản sử dụng.'],
      ['Có xóa được URL ở góc dưới bên phải thẻ không?', 'Được: bỏ chọn “Thêm URL trang web ở góc dưới bên phải thẻ” bên dưới phần thiết kế. Nếu giữ lại thì giúp trang phát triển rất nhiều!'],
      ['Tôi gặp lỗi / muốn có thêm tính năng', 'Hãy liên hệ qua X (@hotaka_1123). Nhắn bằng tiếng Anh hoặc dùng công cụ dịch đều được.'],
    ],
  },

  guide: {
    title: 'Cách tạo thẻ triệu hồi sư | SUMMONER CARD',
    description: 'Hướng dẫn từng bước tạo thẻ triệu hồi sư (thẻ giới thiệu) Liên Minh Huyền Thoại: giải thích mọi mục, 4 mức độ vị trí, cắt biểu tượng từ ảnh trang phục, chỉnh nền và lưu trên điện thoại.',
    h1: 'Cách tạo thẻ triệu hồi sư',
    body: `
      <p>SUMMONER CARD là công cụ miễn phí để tạo thẻ giới thiệu Liên Minh Huyền Thoại, còn gọi là thẻ triệu hồi sư, ngay trên trình duyệt. Hướng dẫn này giải thích từng mục và chia sẻ mẹo để thẻ thật đẹp.</p>

      <nav class="toc" aria-label="Mục lục">
        <p>Mục lục</p>
        <ol>
          <li><a href="#basic">Thông tin cơ bản (tên và biểu tượng)</a></li>
          <li><a href="#rank">Rank</a></li>
          <li><a href="#role">Vị trí</a></li>
          <li><a href="#champs">Tướng tủ</a></li>
          <li><a href="#tags">Phong cách chơi</a></li>
          <li><a href="#contact">Giờ chơi & liên hệ</a></li>
          <li><a href="#comment">Lời nhắn</a></li>
          <li><a href="#design">Thiết kế (giao diện và nền)</a></li>
          <li><a href="#save">Lưu và chia sẻ</a></li>
          <li><a href="#tips">Mẹo tìm bạn bằng thẻ</a></li>
        </ol>
      </nav>

      <section id="basic">
        <h2>1. Thông tin cơ bản (tên và biểu tượng)</h2>
        <h3>Tên triệu hồi sư và tag</h3>
        <p>Nhập phần tên của Riot ID và tag (phần sau dấu #). Tag hiển thị chữ nhỏ cạnh tên, ví dụ “#VN2”.</p>
        <p>Nếu không muốn hiện tên, bấm một lựa chọn bên dưới ô nhập — <strong>“Bí mật”, “Chơi cùng sẽ nói”, “Nhắn riêng để hỏi” hoặc “Thân rồi sẽ nói”</strong> — chữ đó sẽ hiện thay cho tên.</p>
        <h3>Cấp độ</h3>
        <p>Nhập cấp độ triệu hồi sư để hiện “Lv.○○” dưới biểu tượng. Để trống thì không hiện.</p>
        <h3>Biểu tượng</h3>
        <p>“Chọn biểu tượng” có 3 cách:</p>
        <ul>
          <li><strong>Biểu tượng triệu hồi sư</strong>: chọn trong khoảng 5.000 biểu tượng trong game. Tìm theo tên như “Ahri”, “K/DA” hoặc “Poro”.</li>
          <li><strong>Tướng</strong>: dùng ảnh chân dung của tướng.</li>
          <li><strong>Tải ảnh lên</strong>: dùng ảnh bất kỳ. Sau khi tải lên sẽ mở cửa sổ cắt ảnh; kéo và phóng to để chọn phần bạn muốn.</li>
        </ul>
        <p>Biểu tượng có thể là hình tròn hoặc hình vuông.</p>
      </section>

      <section id="rank">
        <h2>2. Rank</h2>
        <p>Chọn bậc (Sắt đến Thách Đấu) và hạng (I–IV) để hiện huy hiệu rank. Từ Cao Thủ trở lên không có hạng. Nếu không muốn hiện rank, để nguyên “Chưa xếp hạng”.</p>
      </section>

      <section id="role">
        <h2>3. Vị trí</h2>
        <p>Với mỗi vị trí TOP, JG, MID, ADC và SUP, bạn đặt một trong 4 mức độ sẵn sàng chơi.</p>
        <table class="doc-table">
          <thead><tr><th>Nút</th><th>Trên thẻ</th><th>Ý nghĩa</th></tr></thead>
          <tbody>
            <tr><td>Chính</td><td>MAIN (nổi bật)</td><td>Vị trí sở trường nhất. Chỉ chọn được một</td></tr>
            <tr><td>Phụ</td><td>SUB</td><td>Vị trí cũng chơi được khi leo rank</td></tr>
            <tr><td>Thường OK</td><td>NORM</td><td>Vị trí chơi được ở đấu thường</td></tr>
            <tr><td>Không</td><td>NG (đỏ, gạch chéo)</td><td>Vị trí không chơi được</td></tr>
          </tbody>
        </table>
        <p>Bấm lại nút đang chọn để bỏ chọn.</p>
      </section>

      <section id="champs">
        <h2>4. Tướng tủ</h2>
        <p>Thêm tối đa 5 tướng bằng “+ Thêm”. Chọn vị trí ở phía trên cửa sổ chọn tướng trước, tướng sẽ được thêm <strong>kèm biểu tượng vị trí đó</strong>. Bạn cũng có thể thêm cùng một tướng với vị trí khác (ví dụ Lux ở cả SUP và MID).</p>
        <ul>
          <li><strong>Ảnh trang phục</strong>: bấm nút “Ảnh trang phục” của tướng, chọn trang phục bất kỳ và cắt một phần ảnh nền làm biểu tượng. “Hoàn tác” để quay về chân dung thường.</li>
          <li><strong>Tiêu đề</strong>: đổi giữa “Tướng tủ” và “Tướng yêu thích”.</li>
          <li><strong>Sắp xếp</strong>: “←” chuyển tướng sang trái và “×” để xóa.</li>
        </ul>
      </section>

      <section id="tags">
        <h2>5. Phong cách chơi</h2>
        <p>Chọn tối đa 6 tag như Chơi cho vui, Leo rank, ARAM, Có voice hay Tìm duo. Nếu không có tag bạn muốn, tự tạo (tối đa 12 ký tự) bằng “+ Tự thêm”.</p>
      </section>

      <section id="contact">
        <h2>6. Giờ chơi & liên hệ</h2>
        <p>Nhập giờ chơi, Discord, X, Twitch và YouTube. Chỉ những mục bạn điền mới hiện dưới tên, và khi có nhiều mục sẽ tự xếp thành 2 cột.</p>
      </section>

      <section id="comment">
        <h2>7. Lời nhắn</h2>
        <p>Tối đa 80 ký tự, hiện ở cuối thẻ. Có thể xuống dòng (tối đa 2 dòng).</p>
      </section>

      <section id="design">
        <h2>8. Thiết kế (giao diện và nền)</h2>
        <h3>Giao diện</h3>
        <p>Chọn trong hơn 15 giao diện. Xem tất cả tại trang <a href="/templates/">mẫu thẻ</a>.</p>
        <h3>Hình nền</h3>
        <ul>
          <li><strong>Chọn từ trang phục</strong>: chọn tướng và trang phục, ảnh nền của nó sẽ thành hình nền.</li>
          <li><strong>Tải ảnh của bạn lên</strong>: dùng ảnh bất kỳ làm nền (có thể cắt khi tải lên).</li>
          <li><strong>Vị trí, phóng to và độ tối</strong>: chỉnh bằng thanh trượt. Bạn cũng có thể kéo trực tiếp trên thẻ xem trước hoặc phóng to bằng con lăn chuột.</li>
        </ul>
        <p>Nếu chữ khó đọc, hãy tăng “Làm tối nền”.</p>
      </section>

      <section id="save">
        <h2>9. Lưu và chia sẻ</h2>
        <ul>
          <li><strong>Lưu ảnh</strong>: tải thẻ về dạng PNG. Trên iPhone ảnh hiện kích thước đầy đủ; nhấn giữ và chọn “Lưu vào Ảnh”.</li>
          <li><strong>Sao chép ảnh</strong>: trên máy tính, dán thẳng vào X hoặc Discord bằng Ctrl+V.</li>
          <li><strong>Chia sẻ lên X</strong>: trên điện thoại, gửi ảnh qua menu chia sẻ. Trên máy tính, ảnh được sao chép và cửa sổ đăng bài X sẽ mở.</li>
          <li><strong>Banner quảng bá</strong>: bạn cũng có thể tạo banner có thẻ của mình. Xem <a href="/banner/">banner quảng bá</a>.</li>
        </ul>
        <p>Thông tin được tự động lưu trong trình duyệt. “Xóa” ở mỗi phần chỉ xóa phần đó, còn “Đặt lại tất cả” ở cuối sẽ xóa hết.</p>
        <p class="note">Trình duyệt trong app như X có thể không lưu được. Chọn “Mở trong trình duyệt” từ menu “…” góc trên bên phải.</p>
      </section>

      <section id="tips">
        <h2>10. Mẹo tìm bạn bằng thẻ</h2>
        <ul>
          <li><strong>Ghi giờ chơi cụ thể</strong>: “tối ngày thường 22h–1h” giúp người khác biết có chơi cùng được không dễ hơn nhiều so với chỉ ghi “buổi tối”.</li>
          <li><strong>Đánh dấu vị trí không chơi</strong>: biết vị trí “NG” của bạn giúp người khác tìm bạn làm duo hoặc team 5.</li>
          <li><strong>Dùng tag để nói bạn đang tìm gì</strong>: “Tìm duo”, “Tìm team 5” hay “Chào người mới” sẽ thu hút người cùng mục tiêu.</li>
          <li><strong>Dùng hashtag khi đăng</strong>: trên X, thêm “#LMHT” và “#SummonerCard” giúp mọi người tìm thấy bạn.</li>
        </ul>
      </section>`,
  },

  banner: {
    title: 'Banner quảng bá (dùng miễn phí) | SUMMONER CARD',
    description: 'Banner quảng bá SUMMONER CARD. Dùng miễn phí trên màn hình stream, panel Twitch, YouTube, blog hoặc website. Bạn cũng có thể tạo banner có thẻ của riêng mình.',
    h1: 'Banner quảng bá (dùng miễn phí)',
    body: `
      <p>Những banner này dành cho ai muốn giới thiệu SUMMONER CARD. Đặt trên màn hình stream, panel Twitch, mô tả YouTube, blog hoặc website — <strong>không cần xin phép</strong>. Nếu gắn được link, rất cảm ơn nếu bạn dẫn về <code>${HOME}</code>.</p>
      <p class="thanks">Không cần xin phép, nhưng nếu dùng thì nhắn một câu qua ${X} sẽ làm mình rất vui 🙏 Mình muốn ghé xem stream hoặc bài đăng của bạn!</p>

      <section>
        <h2>Tạo banner bằng thẻ của bạn</h2>
        <p>Bấm “🎨 Tạo banner quảng bá từ thẻ của bạn” trong trang tạo thẻ để nhận banner (1800×600) có thẻ bạn đã làm. Dùng làm ảnh panel Twitch hoặc ảnh bìa X cũng được. Thẻ giao diện mộng mơ sẽ có banner tông pastel.</p>
      </section>

      <section>
        <h2>Banner để tải về (mọi giao diện)</h2>
        <p>Bấm vào ảnh để mở kích thước đầy đủ (1800×600) và lưu từ đó.</p>
        <!--BANNERS-->
      </section>

      <section>
        <h2>Cách gắn banner</h2>
        <h3>Blog hoặc website</h3>
        <p>Dán nguyên đoạn HTML này.</p>
        <pre class="embed-code" id="embed-code">&lt;a href="${HOME}" target="_blank" rel="noopener"&gt;&lt;img src="https://summonercard.com${IMG}/banner.jpg" alt="SUMMONER CARD | Summoner Card Maker" width="600" height="200"&gt;&lt;/a&gt;</pre>
        <button type="button" class="btn ghost small" data-copy-target="embed-code">Sao chép HTML</button>
        <p>Muốn dùng giao diện khác, đổi <code>banner.jpg</code> thành tên tệp của ảnh đó (ví dụ <code>banner-halloween.jpg</code>).</p>
        <h3>Panel Twitch</h3>
        <p>Trên kênh của bạn, vào “Giới thiệu” → “Chỉnh sửa panel”, tải banner lên làm ảnh và điền <code>${HOME}</code> vào “Liên kết ảnh tới”.</p>
        <h3>Dạng chữ</h3>
        <pre class="embed-code" id="text-code">Tạo thẻ triệu hồi sư LMHT tại đây👉 ${HOME}</pre>
        <button type="button" class="btn ghost small" data-copy-target="text-code">Sao chép chữ</button>
      </section>

      <section>
        <h2>Lưu ý</h2>
        <ul>
          <li>Thoải mái đổi kích thước hoặc cắt banner.</li>
          <li>Không bán banner hoặc dùng theo cách khiến người khác nghĩ bạn là SUMMONER CARD chính thức.</li>
          <li>Banner có tác phẩm nghệ thuật LMHT. Xem quyền của Riot Games tại <a href="/terms/">điều khoản sử dụng</a>.</li>
        </ul>
      </section>`,
  },

  privacy: {
    title: 'Chính sách quyền riêng tư | SUMMONER CARD',
    description: 'Chính sách quyền riêng tư của SUMMONER CARD (Summoner Card Maker): cách xử lý thông tin bạn nhập, phân tích truy cập và dịch vụ bên ngoài.',
    h1: 'Chính sách quyền riêng tư',
    body: `
      <p>SUMMONER CARD (“Trang”) xử lý thông tin người dùng như sau.</p>

      <section>
        <h2>1. Thông tin bạn nhập và hình ảnh</h2>
        <p>Nội dung bạn nhập trên thẻ (tên triệu hồi sư, thông tin liên hệ…) và ảnh bạn tải lên chỉ được xử lý trong trình duyệt của bạn. Chúng không bao giờ được gửi tới hay lưu trên máy chủ của chúng tôi.</p>
        <p>Để bạn có thể làm tiếp, thông tin được lưu trong bộ nhớ của trình duyệt (localStorage). Dữ liệu này chỉ tồn tại trên thiết bị của bạn và sẽ bị xóa khi bạn xóa dữ liệu trang trong trình duyệt hoặc bấm “Đặt lại tất cả” trong công cụ.</p>
      </section>

      <section>
        <h2>2. Phân tích truy cập</h2>
        <p>Để cải thiện Trang, chúng tôi dùng Google Analytics, công cụ phân tích của Google LLC. Google Analytics dùng cookie để thu thập lượt xem trang, nguồn truy cập, loại thiết bị và mức độ sử dụng tính năng (như số ảnh được lưu và giao diện được chọn). Dữ liệu này được tổng hợp ẩn danh và không xác định được cá nhân. Nội dung bạn nhập và bản thân ảnh của bạn không được gửi đi.</p>
        <p>Bạn có thể từ chối việc thu thập này bằng cách tắt cookie trong trình duyệt hoặc dùng <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">tiện ích chọn không tham gia Google Analytics</a>. Về cách Google xử lý dữ liệu, xem <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Chính sách quyền riêng tư và Điều khoản của Google</a>.</p>
      </section>

      <section>
        <h2>3. Quảng cáo</h2>
        <p>Để trang trải chi phí vận hành, trong tương lai Trang có thể dùng dịch vụ quảng cáo của bên thứ ba (như Google AdSense). Khi đó, nhà cung cấp quảng cáo có thể dùng cookie để hiển thị quảng cáo theo sở thích của bạn. Chúng tôi sẽ cập nhật chính sách này trước khi đưa quảng cáo vào.</p>
      </section>

      <section>
        <h2>4. Dịch vụ bên ngoài</h2>
        <p>Trang tải dữ liệu từ các dịch vụ bên ngoài sau để hiển thị nội dung. Khi đó, thông tin kết nối như địa chỉ IP của thiết bị sẽ được gửi tới từng dịch vụ.</p>
        <ul>
          <li>“Data Dragon” của Riot Games (ảnh tướng, biểu tượng và trang phục)</li>
          <li>Community Dragon (huy hiệu rank, biểu tượng vị trí và ảnh biểu tượng triệu hồi sư)</li>
          <li>Google Fonts (phông chữ web)</li>
          <li>GitHub Pages (lưu trữ Trang)</li>
        </ul>
      </section>

      <section>
        <h2>5. Miễn trừ trách nhiệm</h2>
        <p>Người vận hành không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng Trang. Xem chi tiết tại <a href="/terms/">điều khoản sử dụng</a>.</p>
      </section>

      <section>
        <h2>6. Liên hệ</h2>
        <p>Mọi thắc mắc về chính sách này, vui lòng liên hệ ${X}.</p>
      </section>

      <section>
        <h2>7. Thay đổi</h2>
        <p>Chính sách này có thể được sửa đổi mà không cần báo trước khi cần thiết. Bản sửa đổi có hiệu lực khi được đăng trên trang này.</p>
        <p class="note">Ngày ban hành: ${UPDATED}</p>
      </section>`,
  },

  terms: {
    title: 'Điều khoản sử dụng & miễn trừ trách nhiệm | SUMMONER CARD',
    description: 'Điều khoản sử dụng và miễn trừ trách nhiệm của SUMMONER CARD (Summoner Card Maker): cách dùng ảnh bạn tạo, hành vi bị cấm và quyền của Riot Games.',
    h1: 'Điều khoản sử dụng & miễn trừ trách nhiệm',
    body: `
      <p>Điều khoản sử dụng này (“Điều khoản”) quy định điều kiện sử dụng SUMMONER CARD (“Trang”). Khi sử dụng Trang, bạn được coi là đã đồng ý với Điều khoản.</p>

      <section>
        <h2>1. Dịch vụ</h2>
        <p>Trang là công cụ web miễn phí để tạo ảnh thẻ giới thiệu (thẻ triệu hồi sư) Liên Minh Huyền Thoại. Không cần tài khoản.</p>
      </section>

      <section>
        <h2>2. Sử dụng ảnh bạn tạo</h2>
        <ul>
          <li>Bạn có thể dùng ảnh đã tạo <strong>tự do cho hoạt động cá nhân</strong>, như đăng trên mạng xã hội (X, Discord, Instagram…), hồ sơ, màn hình stream, panel Twitch và blog. Dùng trên stream hoặc kênh có kiếm tiền cũng được.</li>
          <li>Bạn <strong>không được bán hoặc phân phối có thu phí</strong> bản thân ảnh hoặc tác phẩm nghệ thuật trong game có trong ảnh.</li>
          <li>Tên trang và URL ở góc dưới bên phải ảnh có thể ẩn trong cài đặt.</li>
        </ul>
      </section>

      <section>
        <h2>3. Quyền của Riot Games</h2>
        <p>Quyền đối với ảnh tướng, trang phục, biểu tượng, huy hiệu rank và các ảnh khác hiển thị trên thẻ thuộc về Riot Games, Inc. Trang là nội dung của người hâm mộ được làm theo chính sách “<a href="https://www.riotgames.com/en/legal" target="_blank" rel="noopener">Legal Jibber Jabber</a>” của Riot Games và không được Riot Games xác nhận hay tài trợ.</p>
        <p class="legal">${LEGAL}</p>
      </section>

      <section>
        <h2>4. Ảnh bạn tải lên</h2>
        <p>Chỉ tải lên làm biểu tượng hoặc nền những ảnh bạn có quyền sử dụng. Ảnh tải lên chỉ được xử lý trong trình duyệt của bạn và không được gửi lên máy chủ của chúng tôi.</p>
      </section>

      <section>
        <h2>5. Hành vi bị cấm</h2>
        <ul>
          <li>Tạo hoặc công khai thẻ mạo danh người khác hoặc dùng tên, tài khoản của người khác khi chưa được phép</li>
          <li>Tạo hoặc công khai thẻ có nội dung bôi nhọ, phân biệt đối xử hoặc khiêu dâm</li>
          <li>Xâm phạm bản quyền, quyền hình ảnh hoặc quyền khác của bên thứ ba</li>
          <li>Cản trở hoạt động của Trang, hoặc giả làm Trang chính thức</li>
          <li>Bất kỳ hành vi nào khác vi phạm pháp luật hoặc trật tự, đạo đức xã hội</li>
        </ul>
      </section>

      <section>
        <h2>6. Miễn trừ trách nhiệm</h2>
        <ul>
          <li>Trang được cung cấp nguyên trạng. Chúng tôi không bảo đảm tính chính xác của nội dung, việc hoạt động trên mọi thiết bị và trình duyệt, hay việc duy trì dịch vụ liên tục.</li>
          <li>Thông tin lưu trong trình duyệt có thể bị mất tùy theo cài đặt hoặc thao tác của trình duyệt.</li>
          <li>Người vận hành không chịu trách nhiệm về bất kỳ sự cố hay thiệt hại nào phát sinh từ việc sử dụng Trang hoặc ảnh bạn tạo.</li>
          <li>Trang có thể thay đổi, tạm dừng hoặc chấm dứt dịch vụ mà không cần báo trước.</li>
        </ul>
      </section>

      <section>
        <h2>7. Thay đổi Điều khoản</h2>
        <p>Điều khoản có thể được thay đổi mà không cần báo trước khi cần thiết. Thay đổi có hiệu lực khi được đăng trên trang này.</p>
        <p class="note">Ngày ban hành: ${UPDATED}</p>
      </section>`,
  },

  about: {
    title: 'Giới thiệu & liên hệ | SUMMONER CARD',
    description: 'Giới thiệu SUMMONER CARD (Summoner Card Maker): người vận hành, cách liên hệ và tài nguyên sử dụng.',
    h1: 'Giới thiệu & liên hệ',
    body: `
      <section>
        <h2>Về SUMMONER CARD</h2>
        <p>SUMMONER CARD là công cụ miễn phí do cá nhân vận hành, giúp người chơi Liên Minh Huyền Thoại dễ dàng tạo “thẻ triệu hồi sư” để giới thiệu bản thân và tìm bạn. Mục tiêu là chỉ cần điền thông tin là có thẻ, không phải chỉnh ảnh mẫu.</p>
      </section>

      <section>
        <h2>Người vận hành</h2>
        <table class="doc-table">
          <tbody>
            <tr><th>Tên trang</th><td>SUMMONER CARD (Summoner Card Maker)</td></tr>
            <tr><th>URL</th><td><a href="/">${HOME}</a></td></tr>
            <tr><th>Vận hành bởi</th><td>hotaka (cá nhân)</td></tr>
            <tr><th>Liên hệ</th><td>${X}</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Liên hệ</h2>
        <p>Báo lỗi, đề xuất tính năng hay bất cứ điều gì về trang: cứ nhắn DM hoặc trả lời trên ${X}. Người vận hành ở Nhật Bản, nhưng nhắn bằng tiếng Anh hoặc dùng công cụ dịch đều được. Khi báo lỗi, cho biết thiết bị và trình duyệt (ví dụ Safari trên iPhone, hoặc trong app X) và bạn đang làm gì lúc xảy ra lỗi sẽ giúp ích rất nhiều.</p>
      </section>

      <section>
        <h2>Tài nguyên sử dụng</h2>
        <ul>
          <li>Ảnh tướng, trang phục và biểu tượng: “Data Dragon” của Riot Games</li>
          <li>Huy hiệu rank, biểu tượng vị trí và biểu tượng triệu hồi sư: <a href="https://www.communitydragon.org/" target="_blank" rel="noopener">Community Dragon</a></li>
          <li>Phông chữ: Google Fonts (M PLUS 1p, M PLUS Rounded 1c, Cinzel, Dancing Script, Noto Sans)</li>
        </ul>
        <p class="legal">${LEGAL}</p>
      </section>`,
  },
});
