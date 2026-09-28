/* ============================================================
   DATA PROYEK — edit file ini buat nambah/ubah/hapus proyek,
   TANPA perlu sentuh index.html sama sekali.

   Tiap proyek adalah satu objek { ... } di dalam array PROJECTS
   di bawah. Field yang bisa diisi:

   - category     : nama kategori. Kategori baru otomatis dikasih
                    header sendiri, ikutin urutan kemunculan pertama.
   - categoryNote : keterangan kecil di sebelah nama kategori
                    (cuma dipakai dari proyek PERTAMA di kategori
                    itu — boleh dikosongkan '').
   - tag          : label kecil di kartu.
   - title        : judul proyek.
   - meta         : keterangan singkat (tampil di lightbox).
   - desc         : deskripsi lengkap (tampil di lightbox).
   - link         : URL proyek di tempat lain (YouTube, Instagram,
                    dst). Kosongkan '' kalau belum ada.
   - isTemplate   : true kalau masih slot kosong (border putus-
                    putus). Ganti ke false begitu udah diisi.
   - media        : daftar gambar/video. Tiap item salah satu dari:

       { type: 'youtube', id: 'VIDEO_ID', start: 0 }
         video YouTube. 'id' dari link (setelah watch?v= atau
         setelah youtu.be/). 'start' opsional (detik mulai).

       { type: 'image', src: 'assets/nama-file.jpg', alt: 'Deskripsi' }
         foto — taruh filenya di folder assets/ dulu.

       { type: 'embed', src: 'https://...' }
         sematan lain berbentuk link (contoh: flipbook buletin).

       { type: 'placeholder', label: '📷' }
         slot masih kosong.
   ============================================================ */
var PROJECTS = [
  {
    category: 'Project Based Learning',
    categoryNote: 'Semester 2–6',
    tag: 'Semester 2',
    title: 'Desain UI/UX — Website Pembayaran Sampah',
    meta: 'PBL · Semester 2 · UI/UX Design',
    desc: 'Merancang desain antarmuka (UI/UX) untuk website pembayaran sampah sebagai proyek Project Based Learning Semester 2.',
    link: 'https://www.youtube.com/watch?v=YRpkNLlsItI',
    isTemplate: false,
    media: [{ type: 'youtube', id: 'YRpkNLlsItI', start: 0 }]
  },
  {
    category: 'Project Based Learning',
    categoryNote: 'Semester 2–6',
    tag: 'Semester 3',
    title: 'Video Pembelajaran Bahasa Inggris — Sekolah Al Jabbar',
    meta: 'PBL · Semester 3 · Live Action & Ilustrasi 2D',
    desc: 'Memproduksi video pembelajaran bahasa Inggris untuk Sekolah Al Jabbar, Kota Batam, menggunakan teknik live action dan ilustrasi 2D.',
    link: 'https://youtu.be/KyYY96aPuGI',
    isTemplate: false,
    media: [{ type: 'youtube', id: 'KyYY96aPuGI', start: 0 }]
  },
  {
    category: 'Project Based Learning',
    categoryNote: 'Semester 2–6',
    tag: 'Semester 3',
    title: 'Podcast Kampus (Host)',
    meta: 'PBL · Semester 3 · Media Digital',
    desc: 'Memproduksi media digital podcast sebagai proyek Project Based Learning Semester 3, berperan sebagai host podcast.',
    link: 'https://www.youtube.com/watch?v=WfuE1HuAtx0&t=837s',
    isTemplate: false,
    media: [{ type: 'youtube', id: 'WfuE1HuAtx0', start: 837 }]
  },
  {
    category: 'Project Based Learning',
    categoryNote: 'Semester 2–6',
    tag: 'Semester 4',
    title: 'Aplikasi Mobile Pengukuran Baterai',
    meta: 'PBL · Semester 4 · IoT & Arduino Uno',
    desc: 'Mengembangkan aplikasi mobile untuk pengukuran baterai berbasis IoT menggunakan Arduino Uno.',
    link: 'https://www.youtube.com/watch?v=CD-qaXOuZJE',
    isTemplate: false,
    media: [{ type: 'youtube', id: 'CD-qaXOuZJE', start: 0 }]
  },
  {
    category: 'Project Based Learning',
    categoryNote: 'Semester 2–6',
    tag: 'Semester 5',
    title: 'Game PC & Controller Custom',
    meta: 'PBL · Semester 5 · Unity & Arduino Uno',
    desc: 'Mengembangkan game berbasis PC beserta perangkat controller (joystick) khusus, menggunakan Unity dan Arduino Uno untuk sistem kontrolernya.',
    link: 'https://youtu.be/hZGrRYrzjdk',
    isTemplate: false,
    media: [{ type: 'youtube', id: 'hZGrRYrzjdk', start: 0 }]
  },
  {
    category: 'Project Based Learning',
    categoryNote: 'Semester 2–6',
    tag: 'Semester 6',
    title: 'Mahakarya VR Game',
    meta: 'PBL · Semester 6 · Juara 1 International PBL Expo 2025',
    desc: 'Meraih Juara 1 pada Kategori Web and Mobile Application, International PBL Expo 2025.',
    link: 'https://www.youtube.com/watch?v=gHbNmALSW60',
    isTemplate: false,
    media: [{ type: 'youtube', id: 'gHbNmALSW60', start: 0 }, { type: 'image', src: 'assets/sertifikat-pbl-expo-2025.jpg', alt: 'Sertifikat Juara 1 International PBL Expo 2025' }]
  },
  {
    category: 'Proyek Magang',
    categoryNote: 'Semester 7',
    tag: 'Magang',
    title: 'Video BTS — Testimoni Klien',
    meta: 'Magang · Semester 7 · Luwis Photo Studio',
    desc: 'Video behind the scenes dengan format testimoni natural dari klien, diproduksi selama program magang di Luwis Photo Studio.',
    link: 'https://www.instagram.com/reel/DVnHFQWCAA7/',
    isTemplate: false,
    media: [{ type: 'placeholder', label: '🎬<br>Video BTS<br>Testimoni Klien' }]
  },
  {
    category: 'Proyek Magang',
    categoryNote: 'Semester 7',
    tag: 'Magang',
    title: 'Video BTS — Narasi Fotografer',
    meta: 'Magang · Semester 7 · Luwis Photo Studio',
    desc: 'Video behind the scenes dengan format narasi langsung dari sudut pandang fotografer, diproduksi selama program magang di Luwis Photo Studio.',
    link: 'https://www.instagram.com/reel/DVSfMW3CGDe/',
    isTemplate: false,
    media: [{ type: 'placeholder', label: '🎬<br>Video BTS<br>Narasi Fotografer' }]
  },
  {
    category: 'Proyek Magang',
    categoryNote: 'Semester 7',
    tag: 'Magang',
    title: 'Video BTS — Cinematic',
    meta: 'Magang · Semester 7 · Luwis Photo Studio',
    desc: 'Video behind the scenes dengan format sinematik, diproduksi selama program magang di Luwis Photo Studio.',
    link: 'https://www.instagram.com/reel/DVILYiECA7L/',
    isTemplate: false,
    media: [{ type: 'placeholder', label: '🎬<br>Video BTS<br>Cinematic' }]
  },
  {
    category: 'Proyek Magang',
    categoryNote: 'Semester 7',
    tag: 'Magang',
    title: 'Video Side Konten Studio',
    meta: 'Magang · Semester 7 · Luwis Photo Studio',
    desc: 'Konten pendukung studio yang diproduksi selama program magang di Luwis Photo Studio.',
    link: 'https://www.instagram.com/reel/DUms2ciiO4E/',
    isTemplate: false,
    media: [{ type: 'placeholder', label: '🎬<br>Video Side<br>Konten Studio' }]
  },
  {
    category: 'Proyek Organisasi — Media Cetak',
    categoryNote: 'Buletin Kampus',
    tag: 'Buletin',
    title: 'Buletin Kampus — Edisi 9',
    meta: 'Buletin · Paradigma Student Press',
    desc: 'Edisi 9 buletin kampus yang diterbitkan atas kontribusi dan arahan sebagai Pemimpin Redaksi di Paradigma Student Press.',
    link: 'https://pubhtml5.com/fignq/ueje/',
    isTemplate: false,
    media: [{ type: 'embed', src: 'https://pubhtml5.com/fignq/ueje/' }]
  },
  {
    category: 'Proyek Organisasi — Media Cetak',
    categoryNote: 'Buletin Kampus',
    tag: 'Buletin',
    title: 'Buletin Kampus — Edisi 10',
    meta: 'Buletin · Paradigma Student Press',
    desc: 'Edisi 10 buletin kampus yang diterbitkan atas kontribusi dan arahan sebagai Pemimpin Redaksi di Paradigma Student Press.',
    link: 'https://pubhtml5.com/fignq/ajja/',
    isTemplate: false,
    media: [{ type: 'embed', src: 'https://pubhtml5.com/fignq/ajja/' }]
  },
  {
    category: 'Proyek Organisasi — Media Cetak',
    categoryNote: 'Buletin Kampus',
    tag: 'Buletin',
    title: 'Buletin Kampus — Edisi 11',
    meta: 'Buletin · Paradigma Student Press',
    desc: 'Edisi 11 buletin kampus yang diterbitkan atas kontribusi dan arahan sebagai Pemimpin Redaksi di Paradigma Student Press.',
    link: 'https://pubhtml5.com/fignq/iogm/',
    isTemplate: false,
    media: [{ type: 'embed', src: 'https://pubhtml5.com/fignq/iogm/' }]
  },
  {
    category: 'Proyek Organisasi — Media Cetak',
    categoryNote: 'Buletin Kampus',
    tag: 'Buletin',
    title: 'Buletin Kampus — Edisi 15',
    meta: 'Buletin · Paradigma Student Press',
    desc: 'Edisi 15 buletin kampus yang diterbitkan atas kontribusi dan arahan sebagai Pemimpin Redaksi di Paradigma Student Press.',
    link: 'https://pubhtml5.com/fignq/lmtj/',
    isTemplate: false,
    media: [{ type: 'embed', src: 'https://pubhtml5.com/fignq/lmtj/' }]
  },
  {
    category: 'Proyek Organisasi — Media Digital',
    categoryNote: 'Podcast Kampus',
    tag: 'Podcast',
    title: 'Siniar Paradigma — Episode 1',
    meta: 'Host & Pengarah Produksi · Paradigma Student Press 2024/2025',
    desc: 'Episode siniar (podcast) yang diproduksi selama menjabat sebagai Pimpinan Redaksi di Paradigma Student Press, berperan sebagai host merangkap pengarah produksi.',
    link: 'https://www.youtube.com/watch?v=BV8AfVBfMJY&t=3080s',
    isTemplate: false,
    media: [{ type: 'youtube', id: 'BV8AfVBfMJY', start: 3080 }]
  },
  {
    category: 'Proyek Organisasi — Media Digital',
    categoryNote: 'Podcast Kampus',
    tag: 'Podcast',
    title: 'Siniar Paradigma — Episode 2',
    meta: 'Pengarah Produksi Utama · Paradigma Student Press 2024/2025',
    desc: 'Episode siniar (podcast) yang diproduksi selama menjabat sebagai Pimpinan Redaksi di Paradigma Student Press, berperan sebagai pengarah produksi utama.',
    link: 'https://www.youtube.com/watch?v=MoqlP0yTdHE&t=12s',
    isTemplate: false,
    media: [{ type: 'youtube', id: 'MoqlP0yTdHE', start: 12 }]
  }
];