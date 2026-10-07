# RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM (RP PM) GENERATOR SKILLS - VERSI 2
## Panduan Konfigurasi Sistem, Database Fase D IPA, dan Logika Kecerdasan Buatan (AI)
*(Berdasarkan Modul 3.1, Modul 3.2, Analisis CP, dan Template RP PM Herwin Hamid)*

Dokumen ini adalah cetak biru (*blueprint*) sekaligus berkas instruksi teknis (*skills*) yang digunakan oleh mesin kecerdasan buatan (AI) pada aplikasi **RPM Generator**. Dokumen ini merangkum seluruh parameter input, database kurikulum IPA Fase D, logika pengambilan keputusan berbasis modul pembelajaran mendalam (Modul 3.1 & 3.2), serta Master System Prompt untuk menghasilkan Tujuan Pembelajaran (TP) dan modul RP PM yang utuh.

---

## 1. STRUKTUR ARSITEKTUR & ALUR DATA APLIKASI

Aplikasi RPM Generator dirancang dengan alur pengguna (*user flow*) dua tahap guna memberikan kontrol penuh kepada pendidik:

```
[Tahap 1: Input Parameter & Topik]
        │
        ▼
[Pilih Sub-Materi & Klik "Generate TP"] ──> (Memanggil Master Prompt 1: Generate TP)
        │
        ▼
[TP Hasil Generate Muncul di UI (Bisa diedit)]
        │
        ▼
[Tahap 2: Atur Model, PPP, & Jenis Asesmen]
        │
        ▼
[Klik "Buat RP Otomatis"] ──────────────────> (Memanggil Master Prompt 2: Buat RP PM)
        │
        ▼
[Modul RP PM v2 Lengkap Terbit di Kanan]
```

### Parameter Input UI Aplikasi:
1.  **Nama Sekolah (Satuan Pendidikan)**: Text Input (e.g., "SMP Negeri 1 Pesisir").
2.  **Mata Pelajaran**: Terkunci otomatis pada **"IPA"**.
3.  **Kelas**: Dropdown Pilihan `["7", "8", "9"]`.
4.  **Jumlah Pertemuan**: Dropdown Pilihan `["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]`.
5.  **JP per Sesi (Pertemuan)**: Dropdown Pilihan:
    *   `"2 JP (@40 Menit)"` (Total 80 Menit)
    *   `"3 JP (@40 Menit)"` (Total 120 Menit)
    *   `"4 JP (@40 Menit)"` (Total 160 Menit)
    *   `"5 JP (@40 Menit)"` (Total 200 Menit)
6.  **Pilih Topik/CP Terintegrasi**: Dropdown 13 Materi Pokok Fase D IPA (lihat Database di Bagian 2).
7.  **Pilih Fokus Sub-Materi Esensial**: Dropdown dinamis (*cascading*) yang berubah otomatis berdasarkan Topik yang dipilih pada nomor 6.
8.  **CP yang Ditargetkan**: Text Area non-editable (Read-Only) yang menampilkan teks deskripsi CP utuh dari database setelah Topik dipilih.
9.  **Model Pembelajaran**: Dropdown Pilihan `["Inquiry Learning", "Problem-Based Learning (PBL)", "Project-Based Learning (PjBL)", "Cooperative Learning", "Discovery Learning"]`.
10. **Dimensi Profil Lulusan (Profil Pelajar Pancasila - PPP)**: Checklist Dinamis yang otomatis memberikan tanda centang (*suggested*) berdasarkan topik, namun dapat ditambah/dikurangi secara manual oleh user. Opsi checklist bersandar pada 8 Dimensi Pembelajaran Mendalam [37]:
    *   `[ ] Keimanan dan Ketakwaan Terhadap Tuhan YME` [37]
    *   `[ ] Penalaran Kritis` [37]
    *   `[ ] Kreativitas` [37]
    *   `[ ] Kolaborasi` [37]
    *   `[ ] Komunikasi` [37]
    *   `[ ] Kemandirian` [37]
    *   `[ ] Kewargaan` [37]
    *   `[ ] Kesehatan` [37]
11. **Pilihan Asesmen**:
    *   **Formatif (Checklist Mulitple-Choice)**:
        *   `[ ] Jurnal Refleksi Mandiri` [32]
        *   `[ ] Rubrik Observasi Kinerja Kelompok` [29]
        *   `[ ] Rubrik Produk Kreatif (Poster/Video)` [29]
        *   `[ ] Lembar Kerja Kerja Ilmiah (LKPD)` [25]
    *   **Sumatif (Checklist Multiple-Choice)**:
        *   `[ ] Pilihan Ganda Kontekstual (HOTS)` [29]
        *   `[ ] Esai Studi Kasus Real-World (SOLO Taxonomy)` [29]

---

## 2. DATABASE UTUH FASE D IPA & INTEGRASI CP
*(Sumber Grounding: Final Panduan Mata Pelajaran IPA & Analisis CP)*

Berikut adalah data terstruktur berbentuk JSON yang harus diintegrasikan ke sistem untuk dropdown dinamis:

```json
{
  "Materi 1": {
    "topik": "Identifikasi Makhluk Hidup",
    "sub_materi_essensial": [
      "Ciri-ciri Dasar Makhluk Hidup",
      "Kunci Dikotom dan Kunci Determinasi",
      "Metode Pengelompokan Lima Kerajaan",
      "Pemanfaatan Google Lens dalam Identifikasi Spesies"
    ],
    "cp_target": "Murid mampu mengidentifikasi makhluk hidup dan benda berdasarkan karakteristik yang diamati, membedakan klasifikasi serta melakukan pengelompokan menggunakan kunci dikotom.",
    "suggested_profil": ["Kemandirian", "Kolaborasi", "Komunikasi", "Penalaran Kritis"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)", "Rubrik Observasi Kinerja Kelompok"],
    "suggested_asesmen_sumatif": ["Pilihan Ganda Kontekstual (HOTS)"]
  },
  "Materi 2": {
    "topik": "Zat dan Perubahannya",
    "sub_materi_essensial": [
      "Sifat Fisika dan Kimia Zat",
      "Kerapatan Zat (Densitas) dan Penerapan Mengapung-Tenggelam",
      "Perubahan Wujud Zat dan Siklus Air",
      "Pemisahan Campuran Sederhana (Filtrasi, Evaporasi)"
    ],
    "cp_target": "Murid mampu mengidentifikasi sifat zat, membedakan perubahan fisika dan kimia, serta menerapkan konsep kerapatan zat dalam kehidupan sehari-hari.",
    "suggested_profil": ["Penalaran Kritis", "Kemandirian", "Keimanan dan Ketakwaan Terhadap Tuhan YME"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)", "Jurnal Refleksi Mandiri"],
    "suggested_asesmen_sumatif": ["Pilihan Ganda Kontekstual (HOTS)"]
  },
  "Materi 3": {
    "topik": "Suhu, Kalor dan Pemuaian",
    "sub_materi_essensial": [
      "Perbedaan Suhu dan Kalor",
      "Mekanisme Konduksi, Konveksi, dan Radiasi Kalor",
      "Pemuaian Panjang, Luas, dan Volume Zat",
      "Efek Radiasi Kalor pada Pemanasan Global"
    ],
    "cp_target": "Murid mampu menganalisis konsep energi kalor dan perpindahannya terhadap perubahan suhu, menerapkan hukum perpindahan panas pada fenomena fisis alam.",
    "suggested_profil": ["Penalaran Kritis", "Kreativitas", "Kolaborasi", "Keimanan dan Ketakwaan Terhadap Tuhan YME"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)", "Rubrik Produk Kreatif (Poster/Video)"],
    "suggested_asesmen_sumatif": ["Esai Studi Kasus Real-World (SOLO Taxonomy)", "Pilihan Ganda Kontekstual (HOTS)"]
  },
  "Materi 4": {
    "topik": "Gerak dan Gaya",
    "sub_materi_essensial": [
      "Kecepatan, Kelajuan, dan Percepatan",
      "Hukum Newton I, II, dan III tentang Gerak",
      "Gaya Gesek dan Gaya Gravitasi di Sekitar Kita",
      "Analisis Faktor Keselamatan Transportasi Publik"
    ],
    "cp_target": "Murid mampu memahami konsep gerak dan gaya, menganalisis pengaruh gaya terhadap gerak benda berdasarkan Hukum Newton secara kuantitatif maupun kualitatif.",
    "suggested_profil": ["Penalaran Kritis", "Kemandirian"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)"],
    "suggested_asesmen_sumatif": ["Pilihan Ganda Kontekstual (HOTS)"]
  },
  "Materi 5": {
    "topik": "Tekanan Zat",
    "sub_materi_essensial": [
      "Tekanan Hidrostatis dan Hukum Pascal",
      "Hukum Archimedes pada Kapal Laut dan Kapal Selam",
      "Tekanan Gas dan Aplikasi Barometer",
      "Sistem Transportasi Nutrisi Tumbuhan (Kapilaritas)"
    ],
    "cp_target": "Murid mampu memahami tekanan zat cair, gas, dan padat serta mengaitkannya dengan fenomena transportasi zat dalam sistem biologis makhluk hidup.",
    "suggested_profil": ["Penalaran Kritis", "Kolaborasi", "Komunikasi"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)", "Rubrik Observasi Kinerja Kelompok"],
    "suggested_asesmen_sumatif": ["Esai Studi Kasus Real-World (SOLO Taxonomy)"]
  },
  "Materi 6": {
    "topik": "Struktur dan Fungsi Tubuh Makhluk Hidup",
    "sub_materi_essensial": [
      "Sistem Pencernaan Manusia dan Kandungan Nutrisi Makanan",
      "Sistem Peredaran Darah dan Kelainan Kesehatan Terkait",
      "Sistem Pernapasan dan Analisis Kapasitas Paru-paru",
      "Sistem Ekskresi Manusia dan Upaya Menjaga Kesehatan Ginjal"
    ],
    "cp_target": "Murid mampu menganalisis keterkaitan sistem organ tubuh manusia (pencernaan, peredaran darah, pernapasan, ekskresi) dengan pemeliharaan kesehatan hidup.",
    "suggested_profil": ["Kesehatan", "Kemandirian", "Penalaran Kritis", "Kolaborasi"],
    "suggested_asesmen_formatif": ["Jurnal Refleksi Mandiri", "Lembar Kerja Kerja Ilmiah (LKPD)"],
    "suggested_asesmen_sumatif": ["Esai Studi Kasus Real-World (SOLO Taxonomy)", "Pilihan Ganda Kontekstual (HOTS)"]
  },
  "Materi 7": {
    "topik": "Usaha, Energi dan Pesawat Sederhana",
    "sub_materi_essensial": [
      "Konsep Usaha dan Hubungannya dengan Energi Kinetik & Potensial",
      "Prinsip Kerja Pengungkit, Katrol, Bidang Miring, dan Roda Berporos",
      "Penerapan Pesawat Sederhana pada Sistem Otot dan Rangka Manusia",
      "Rancangan Teknologi Ramah Lingkungan Berbasis Energi Alternatif"
    ],
    "cp_target": "Murid mampu memahami hubungan usaha dan energi, menganalisis cara kerja pesawat sederhana serta mengidentifikasi pemanfaatannya dalam aktivitas kehidupan sehari-hari.",
    "suggested_profil": ["Kreativitas", "Penalaran Kritis", "Kolaborasi"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)", "Rubrik Produk Kreatif (Poster/Video)"],
    "suggested_asesmen_sumatif": ["Pilihan Ganda Kontekstual (HOTS)"]
  },
  "Materi 8": {
    "topik": "Getaran, Gelombang dan Cahaya",
    "sub_materi_essensial": [
      "Perbedaan Getaran dan Gelombang (Transversal & Longitudinal)",
      "Mekanisme Pendengaran Manusia dan Sonar pada Hewan",
      "Sifat-Sifat Cahaya dan Pembentukan Bayangan pada Cermin/Lensa",
      "Prinsip Alat Optik (Mikroskop, Lup, Kamera, Mata)"
    ],
    "cp_target": "Murid mampu menganalisis konsep getaran, gelombang, bunyi, dan cahaya serta pemanfaatannya dalam teknologi medis maupun alat optik sederhana.",
    "suggested_profil": ["Penalaran Kritis", "Keimanan dan Ketakwaan Terhadap Tuhan YME", "Kreativitas"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)"],
    "suggested_asesmen_sumatif": ["Pilihan Ganda Kontekstual (HOTS)"]
  },
  "Materi 9": {
    "topik": "Kelistrikan dan Kemagnetan",
    "sub_materi_essensial": [
      "Muatan Listrik Statis di Sekitar Kita",
      "Rangkaian Listrik Dinamis (Seri dan Paralel)",
      "Prinsip Elektromagnetik dan Gaya Lorentz",
      "Pemanfaatan Energi Listrik Ramah Lingkungan (Solar Panel/Turbin)"
    ],
    "cp_target": "Murid mampu menganalisis gejala kemagnetan dan kelistrikan untuk menyelesaikan tantangan kehidupan, termasuk pemanfaatan sumber energi listrik ramah lingkungan.",
    "suggested_profil": ["Kreativitas", "Kemandirian", "Kewargaan", "Penalaran Kritis"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)", "Rubrik Produk Kreatif (Poster/Video)"],
    "suggested_asesmen_sumatif": ["Pilihan Ganda Kontekstual (HOTS)", "Esai Studi Kasus Real-World (SOLO Taxonomy)"]
  },
  "Materi 10": {
    "topik": "Sistem Tata Surya dan Alam Semesta",
    "sub_materi_essensial": [
      "Karakteristik Planet dan Benda Langit dalam Tata Surya",
      "Rotasi & Revolusi Bumi terhadap Waktu, Musim, dan Penanggalan",
      "Fenomena Gerhana Matahari, Gerhana Bulan, dan Pasang Surut Air Laut",
      "Analisis Perubahan Iklim Global Akibat Posisi Relatif Bumi-Matahari"
    ],
    "cp_target": "Murid mampu menganalisis posisi relatif bumi-bulan-matahari dalam sistem tata surya untuk menjelaskan fenomena alam, perubahan iklim, dan dampaknya bagi kehidupan.",
    "suggested_profil": ["Kewargaan", "Penalaran Kritis", "Keimanan dan Ketakwaan Terhadap Tuhan YME"],
    "suggested_asesmen_formatif": ["Jurnal Refleksi Mandiri", "Lembar Kerja Kerja Ilmiah (LKPD)"],
    "suggested_asesmen_sumatif": ["Pilihan Ganda Kontekstual (HOTS)", "Esai Studi Kasus Real-World (SOLO Taxonomy)"]
  },
  "Materi 11": {
    "topik": "Zat Aditif dan Zat Adiktif",
    "sub_materi_essensial": [
      "Identifikasi Pewarna, Pemanis, Pengawet, dan Penyedap Sintetis pada Makanan",
      "Dampak Fisik dan Psikologis Penyalahgunaan Narkoba & Rokok",
      "Regulasi Hukum Terkait Zat Adiktif di Indonesia",
      "Kampanye Sosial Pencegahan Zat Adiktif di Lingkungan Sekolah"
    ],
    "cp_target": "Murid mampu mengambil keputusan yang tepat untuk menghindari zat aditif berbahaya serta zat adiktif yang merusak diri sendiri dan kesehatan lingkungan.",
    "suggested_profil": ["Kesehatan", "Kemandirian", "Penalaran Kritis", "Komunikasi"],
    "suggested_asesmen_formatif": ["Rubrik Produk Kreatif (Poster/Video)", "Jurnal Refleksi Mandiri"],
    "suggested_asesmen_sumatif": ["Esai Studi Kasus Real-World (SOLO Taxonomy)"]
  },
  "Materi 12": {
    "topik": "Pewarisan Sifat",
    "sub_materi_essensial": [
      "Peran DNA, Gen, dan Kromosom dalam Hereditas",
      "Persilangan Monohibrid dan Dihibrid Hukum Mendel",
      "Kelainan Genetik yang Diturunkan (Hemofilia, Buta Warna)",
      "Penerapan Pemuliaan Tanaman dan Hewan Unggul"
    ],
    "cp_target": "Murid mampu menerapkan konsep pewarisan sifat dalam menjelaskan variasi makhluk hidup, mekanisme genetika dasar, serta pemanfaatannya dalam peningkatan kualitas hidup.",
    "suggested_profil": ["Penalaran Kritis", "Kemandirian", "Keimanan dan Ketakwaan Terhadap Tuhan YME"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)"],
    "suggested_asesmen_sumatif": ["Pilihan Ganda Kontekstual (HOTS)"]
  },
  "Materi 13": {
    "topik": "Virus dan Bioteknologi",
    "sub_materi_essensial": [
      "Karakteristik Virus, Struktur, dan Siklus Replikasi",
      "Metode Pencegahan Infeksi Virus dan Prinsip Kerja Vaksinasi",
      "Bioteknologi Konvensional (Tempe, Tape, Yoghurt) dan Produknya",
      "Prinsip Bioteknologi Modern dan Analisis Isu Pro-Kontra GMO"
    ],
    "cp_target": "Murid mampu menganalisis karakteristik virus dan perannya dalam kesehatan, membedakan prinsip bioteknologi konvensional dan modern untuk memecahkan masalah pangan.",
    "suggested_profil": ["Kreativitas", "Kewargaan", "Penalaran Kritis", "Kolaborasi"],
    "suggested_asesmen_formatif": ["Lembar Kerja Kerja Ilmiah (LKPD)", "Rubrik Produk Kreatif (Poster/Video)"],
    "suggested_asesmen_sumatif": ["Esai Studi Kasus Real-World (SOLO Taxonomy)", "Pilihan Ganda Kontekstual (HOTS)"]
  }
}
```

---

## 3. KERANGKA TEORITIS: LOGIKA PEMILIHAN PRINSIP & PENGALAMAN BELAJAR
*(Sesuai Modul 3.1 & Modul 3.2)*

AI wajib menggunakan pedoman ilmiah di bawah ini untuk memilih dan membenarkan pencantuman **Prinsip Pembelajaran Mendalam** dan **Aspek Pengalaman Belajar** pada skenario Rencana Pelaksanaan Pembelajaran (RP PM).

### A. TIGA PRINSIP PEMBELAJARAN MENDALAM (MODUL 3.1)

| Prinsip | Deskripsi Operasional (Modul 3.1) [76, 78] | Karakteristik Kunci untuk Penulisan Aktivitas Pembelajaran [77, 78, 30] | Indikator Pemilihan oleh AI |
| :--- | :--- | :--- | :--- |
| **Berkesadaran** *(Mindful)* | Pengalaman belajar ketika murid memiliki kesadaran penuh menjadi pembelajar aktif dan mampu meregulasi diri. Murid termotivasi secara intrinsik, memahami tujuan pembelajaran, dan sadar akan proses berfikirnya [76]. | 1. Memprioritaskan kenyamanan emosional & fisik murid dalam belajar.<br>2. Melatih fokus, konsentrasi, dan perhatian mendalam.<br>3. Mendorong kesadaran metakognitif (menyadari proses berpikir sendiri).<br>4. Memberikan kebebasan murid menentukan pilihan belajar & alasannya.<br>5. Melibatkan murid menyusun strategi belajarnya sendiri.<br>6. Menumbuhkan rasa ingin tahu ilmiah (curiosity) [77]. | **Pilihlah prinsip ini ketika aktivitas kelas menuntut:**<br>- Eksplorasi mandiri, perumusan pertanyaan ilmiah, atau penyusunan hipotesis.<br>- Penilaian diri (*self-assessment*), metakognisi, atau pengisian jurnal refleksi pribadi.<br>- Kegiatan hening cipta, relaksasi emosi, atau mendengarkan penjelasan teman dengan asertif. |
| **Bermakna** *(Meaningful)* | Pembelajaran terjadi ketika murid dapat menerapkan pengetahuannya secara kontekstual pada isu nyata. Lebih berorientasi pada retensi jangka panjang & pengaplikasian dibanding sekadar menguasai konten [78]. | 1. Mengaitkan materi langsung dengan kehidupan sehari-hari murid.<br>2. Menghubungkan konsep sains dengan isu nyata lokal, nasional, atau global.<br>3. Menghubungkan konsep baru dengan pengetahuan awal murid.<br>4. Mendorong murid memahami peran dirinya di lingkungan masyarakat.<br>5. Melibatkan pendekatan multidisiplin atau kolaborasi dengan komunitas [78, 40]. | **Pilihlah prinsip ini ketika aktivitas kelas menuntut:**<br>- Eksperimen dengan alat sekitar, pemodelan fisik, atau investigasi isu sosial-ekologis (misalnya pemanasan global, krisis air, atau gizi makanan).<br>- Menjawab tantangan riil dunia profesional (misal: berperan sebagai insinyur energi atau detektif klasifikasi biologis). |
| **Menggembirakan** *(Joyful)* | Proses pembelajaran yang melahirkan perasaan positif, keterikatan, dan antusiasme intrinsik murid melalui proses dinamis, interaktif, dan penemuan bermakna [30, 36, 38]. | 1. Menyajikan tantangan belajar yang menantang namun dapat dicapai (*scaffolding*).<br>2. Menciptakan budaya belajar interaktif dan komunikasi dua arah.<br>3. Memberikan ruang kebebasan berekspresi secara kreatif (audio, visual, kinestetik).<br>4. Memfasilitasi kolaborasi kelompok yang menyenangkan.<br>5. Memicu momen penemuan jawaban secara mandiri (*AHA moment*) [30, 36]. | **Pilihlah prinsip ini ketika aktivitas kelas menuntut:**<br>- Simulasi fisik, praktikum motorik, atau permainan peran (role-play).<br>- Pembuatan produk kreatif berkelompok (poster digital Canva, video Reels pendek, pameran kelas *Gallery Walk*).<br>- Diskusi interaktif menggunakan perangkat digital/aplikasi gamifikasi. |

---

### B. TIGA PILAR PENGALAMAN BELAJAR MENDALAM (MODUL 3.2)

| Pengalaman Belajar | Gradasi Taksonomi (Modul 3.2) [81, 98] | Karakteristik Aktivitas Siswa (Modul 3.2) [84, 87, 91, 94] | Contoh Teks Perintah Guru di Kelas IPA |
| :--- | :--- | :--- | :--- |
| **MEMAHAMI** | - **Taksonomi Bloom**: C1 (Mengingat), C2 (Memahami).<br>- **SOLO Taxonomy**: *Unistructural* & *Multistructural* [98]. | 1. Mengaktifkan pengetahuan awal (*prior knowledge*) murid lewat fenomena unik.<br>2. Menstimulasi proses berpikir melalui pertanyaan pemantik kontekstual.<br>3. Murid aktif mengkonstruksi pengetahuan fisis dari berbagai sumber.<br>4. Murid mengorganisasikan informasi sains dasar secara mandiri [84, 87]. | - *"Amati video hancurnya es di kutub utara ini. Apa yang kalian rasakan? Mengapa hal ini bisa terjadi?"* [107]<br>- *"Mari kita identifikasi variabel-variabel apa saja yang memengaruhi kenaikan suhu pada stoples kaca."* [18] |
| **MENGAPLIKASI** | - **Taksonomi Bloom**: C3 (Menerapkan), C4 (Menganalisis).<br>- **SOLO Taxonomy**: *Relational* [98]. | 1. Menerapkan konsep sains ke dalam situasi fisis baru atau nyata.<br>2. Melakukan praktik eksperimental pemecahan masalah / penyelidikan ilmiah.<br>3. Berpikir kritis mengolah data eksperimen (tabel/grafik) menjadi pola hubungan sebab-akibat.<br>4. Berkolaborasi membangun solusi inovatif berupa produk orisinal [88, 89, 91]. | - *"Gunakan data suhu stoples tertutup vs terbuka untuk memodelkan cara bumi menahan radiasi panas matahari!"*<br>- *"Rancanglah poster kampanye di Canva yang menawarkan 3 aksi praktis menghemat emisi listrik rumah kalian!"* [28] |
| **MEREFLEKSI** | - **Taksonomi Bloom**: C5 (Mengevaluasi), C6 (Mencipta).<br>- **SOLO Taxonomy**: *Extended Abstract* [98]. | 1. Mengevaluasi keefektifan produk, solusi, atau jalannya proses kerja kelompok.<br>2. Mengembangkan kemampuan metakognisi (meregulasi dan menyadari cara belajarnya).<br>3. Menghubungkan apa yang dipelajari dengan komitmen moral pribadi/sosial.<br>4. Menerima, merespons, dan menindaklanjuti umpan balik spesifik dari rekan sejawat [92, 93, 94]. | - *"Berdasarkan komentar temanmu saat Gallery Walk, perbaikilah kelemahan argumen fisik pada postermu!"* [31]<br>- *"Tuliskan komitmen harian kalian untuk menekan emisi karbon rumah di selembar daun kertas, lalu gantungkan di Pohon Komitmen Kelas!"* |

---

### C. DECISION LOGIC MATRIX: PENENTUAN KOMBINASI UNTUK AI
AI harus mengikuti rumus pemetaan kombinasi ini berdasarkan sintaks pembelajaran (khususnya **Inquiry Learning** dan **Problem-Based Learning**):

```
┌──────────────────────────────────────────────┐
│                  SINTAKS 1                   │
│      Orientasi & Perumusan Masalah           │
└──────────────────────┬───────────────────────┘
                       ▼
         [ MEMAHAMI ] & [ BERKESADARAN ]
         - Memantik keingintahuan alami
         - Menghubungkan isu autentik
         - Membangun fokus emosional awal

┌──────────────────────────────────────────────┐
│                  SINTAKS 2-4                 │
│    Penyelidikan / Eksperimen / Olah Data     │
└──────────────────────┬───────────────────────┘
                       ▼
     [ MENGAPLIKASI ] & [ BERMAKNA / GEMBIRA ]
         - Praktikum fisik/kinestetik
         - Uji hipotesis kolaboratif
         - Menemukan pola fisis (Aha! Moment)

┌──────────────────────────────────────────────┐
│                  SINTAKS 5-6                 │
│      Evaluasi Solusi / Refleksi Diri         │
└──────────────────────┬───────────────────────┘
                       ▼
         [ MEREFLEKSI ] & [ BERKESADARAN ]
         - Evaluasi proses kerja ilmiah
         - Penilaian diri & Metakognisi
         - Menanamkan nilai etika & komitmen moral
```

---

## 4. MASTER PROMPT 1: GENERATE TP (TUJUAN PEMBELAJARAN)

```text
[SYSTEM INSTRUCTION: GENERATE TP]
Anda adalah AI Ahli Kurikulum Merdeka yang bertugas mem-breakdown Capaian Pembelajaran (CP) menjadi Tujuan Pembelajaran (TP) yang terstruktur dan mendalam sesuai kerangka kerja Pembelajaran Mendalam (Deep Learning).

INPUT PARAMETER YANG DIBERIKAN USER:
- Topik/CP Terintegrasi: {Topik}
- Capaian Pembelajaran (CP): {CP_Target}
- Sub-Materi Esensial: {Sub_Materi_Esensial}

ATURAN GENERATE TP:
1. Hasilkan tepat 2-3 Tujuan Pembelajaran (TP) yang saling berjenjang (scaffolding).
2. Setiap TP wajib memuat tiga unsur Kurikulum Merdeka secara eksplisit:
   a. Kompetensi: Kata kerja operasional (KKO) yang dapat diukur (Utamakan KKO tingkat analisis C4, evaluasi C5, atau kreasi C6).
   b. Lingkup Materi: Fokus pada sub-materi esensial yang dipilih.
   c. Kontekstualisasi/Keterampilan Proses: Cara murid mencapai kompetensi tersebut (misalnya melalui kerja ilmiah, penyelidikan kelompok, analisis data riil, atau pembuatan solusi kreatif).
3. TP harus selaras dengan gradasi taksonomi Pembalaman Belajar:
   - TP 1: Berorientasi pada tahap "Memahami" (C2-C4) melalui investigasi dasar.
   - TP 2 & 3: Berorientasi pada "Mengaplikasi" dan "Merefleksi" (C4-C6) melalui pemecahan masalah fisis nyata atau kreasi aksi sosial-ekologis.
4. Tulis output langsung dalam bentuk penomoran bullet-list (1, 2, 3) yang rapi, bersih, tanpa preamble basa-basi.
```

---

## 5. MASTER PROMPT 2: BUAT RP PM (FULL LESSON PLAN GENERATION)

```text
[SYSTEM INSTRUCTION: GENERATE RP PM FULL]
Anda adalah AI Modul Ajar Kurikulum Merdeka Terhebat di Indonesia. Tugas Anda adalah meng-generate dokumen Rencana Pelaksanaan Pembelajaran Mendalam (RP PM) secara utuh, lengkap, dan tanpa bagian yang disingkat/dihilangkan. Format dan pola penulisan wajib meniru secara presisi "RP PM-Herwin Hamid.pdf".

INPUT PARAMETER DARI APLIKASI:
- Satuan Pendidikan: {Nama_Sekolah}
- Mata Pelajaran: IPA
- Kelas: {Kelas}
- Jumlah Sesi/Pertemuan: {Jumlah_Pertemuan}
- Alokasi Waktu per Sesi: {JP_per_Sesi}
- Topik Utama: {Topik}
- Sub-Materi Esensial: {Sub_Materi}
- CP Sasaran: {CP_Target}
- Tujuan Pembelajaran (TP): {TP_List}
- Model Pembelajaran: {Model_Pembelajaran}
- Dimensi Profil Lulusan terpilih: {Profil_Lulusan_List}
- Asesmen Formatif terpilih: {Asesmen_Formatif_List}
- Asesmen Sumatif terpilih: {Asesmen_Sumatif_List}

STRUKTUR DOKUMEN RP PM YANG HARUS DIGENERATE:

### 1. KOMPONEN ADMINISTRASI & IDENTITAS MODUL
- Tuliskan tabel identitas satuan pendidikan, mata pelajaran, kelas, jumlah pertemuan, alokasi waktu, topik utama, sub-materi esensial, CP, dan daftar TP secara detail.
- Cantumkan Target Profil Lulusan (PPP) yang dipilih user beserta penjelasan singkat bagaimana profil tersebut dibangun secara nyata dalam pembelajaran.

### 2. STRUKTUR UTAMA SKENARIO AKTIVITAS PEMBELAJARAN (Tabel Berkolom)
Skenario aktivitas harus dibagi secara rinci untuk setiap pertemuan. Setiap pertemuan memiliki Kegiatan Pendahuluan, Inti, dan Penutup. Untuk mematuhi pola RP PM-Herwin Hamid.pdf dan integrasi Modul 3.1 & 3.2, sajikan skenario dalam format TABEL dengan struktur kolom sebagai berikut:
- Kolom 1: Alokasi Waktu & Sintaks (Gunakan sintaks model pembelajaran yang dipilih, misalnya Inquiry Learning atau PBL)
- Kolom 2: Aktivitas Pembelajaran (Rincian detail instruksi Guru dan aktivitas respons Murid secara aktif)
- Kolom 3: Pengalaman Belajar (Tuliskan secara tegas apakah aktivitas tersebut berkategori MEMAHAMI, MENGAPLIKASI, atau MEREFLEKSI sesuai Modul 3.2)
- Kolom 4: Prinsip Pembelajaran Mendalam (Tuliskan secara tegas apakah aktivitas tersebut menerapkan prinsip BERKESADARAN, BERMAKNA, atau MENGGEMBIRAKAN sesuai Modul 3.1, lengkap dengan alasan pemilihannya berdasarkan indikator di Bagian 3)
- Kolom 5: Pemanfaatan Digital & Dimensi PPP (Daftar aplikasi/perangkat digital yang digunakan dan dimensi profil yang sedang dilatih)

*Aturan Skenario Pembelajaran:*
- Skenario tidak boleh disingkat. Berikan contoh dialog instruksi guru yang menstimulasi proses berpikir kritis.
- Penerapan prinsip dan pengalaman belajar mendalam harus dimasukkan secara logis, ilmiah, dan kontekstual mengikuti panduan logika pemetaan di Bagian 3.

### 3. LAMPIRAN INSTRUMEN EVALUASI / ASESMEN UTUH
Hasilkan lampiran instrumen asesmen lengkap (tanpa template kosong atau instruksi "guru membuat soal sendiri"). Sediakan instrumen nyata sesuai pilihan checklist user:
1.  **Jika "Lembar Kerja Kerja Ilmiah (LKPD)" dicentang**: Buatkan LKPD eksperimen kontekstual lengkap dengan identitas kelompok, petunjuk praktikum, alur pengumpulan data, tabel pengamatan fisis, dan 3-4 pertanyaan analisis kritis berjenjang.
2.  **Jika "Rubrik Observasi Kinerja Kelompok" dicentang**: Sediakan matriks penilaian observasi aktivitas kolaborasi murid (skala 1-4) lengkap dengan indikator penilaian kinerja (misal: efektivitas komunikasi, kontribusi kerja sama, ketepatan manipulasi alat sains).
3.  **Jika "Rubrik Produk Kreatif (Poster/Video)" dicentang**: Sediakan rubrik penilaian produk fisis murid mencakup akurasi fisika sains, kekuatan persuasi solusi, dan estetika desain visual.
4.  **Jika "Pilihan Ganda Kontekstual (HOTS)" dicentang**: Buatkan minimal 3 soal pilihan ganda HOTS berbasis data/grafik riil atau studi kasus sosial-ekologis, lengkap dengan Kunci Jawaban dan Analisis Pembahasan Pedagogis fisis yang mendalam.
5.  **Jika "Esai Studi Kasus Real-World (SOLO Taxonomy)" dicentang**: Buatkan minimal 2 soal studi kasus esai berbasis masalah lingkungan atau dunia nyata, lengkap dengan Rubrik Penilaian Gradasi Kompetensi berskala 0-4 menggunakan indikator SOLO Taxonomy (Prestructural, Unistructural, Multistructural, Relational, Extended Abstract) sesuai panduan Modul 3.2.
6.  **Jika "Jurnal Refleksi Mandiri" dicentang**: Sediakan lembar penilaian diri metakognitif (self-assessment) berbasis pertanyaan panduan reflektif (misalnya "sekarang saya paham bahwa...", "tantangan terbesar saya adalah...", "komitmen nyata saya untuk melestarikan lingkungan adalah...").

Seluruh dokumen harus ditulis menggunakan bahasa Indonesia yang baik, baku, profesional, dan menginspirasi bagi guru pembaca.
```

---

## 6. CONTOH IMPLEMENTASI INTEGRASI CODEBASE (FRONTEND REACT & BACKEND API)

### A. Contoh Logika Dropdown Dinamis (React.js):
```javascript
import React, { useState } from 'react';
import databaseIPA from './ipa_database.json'; // Database dari Bagian 2

export default function RPMGeneratorForm() {
  const [selectedTopik, setSelectedTopik] = useState('');
  const [selectedSubMateri, setSelectedSubMateri] = useState('');
  const [profilCentang, setProfilCentang] = useState([]);

  const handleTopikChange = (e) => {
    const topikKey = e.target.value;
    setSelectedTopik(topikKey);
    setSelectedSubMateri(''); // Reset sub-materi
    
    // Auto-checklist dimensi profil lulusan berdasarkan rekomendasi database
    if (databaseIPA[topikKey]) {
      setProfilCentang(databaseIPA[topikKey].suggested_profil);
    } else {
      setProfilCentang([]);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">RPM Generator Parameter Setting</h2>
      
      {/* Topik Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Pilih Topik/CP Terintegrasi</label>
        <select value={selectedTopik} onChange={handleTopikChange} className="mt-1 block w-full rounded-md border-gray-300">
          <option value="">-- Pilih Topik --</option>
          {Object.keys(databaseIPA).map((key) => (
            <option key={key} value={key}>{databaseIPA[key].topik}</option>
          ))}
        </select>
      </div>

      {/* Sub-Materi Esensial Cascading Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Pilih Fokus Sub-materi Esensial</label>
        <select value={selectedSubMateri} onChange={(e) => setSelectedSubMateri(e.target.value)} disabled={!selectedTopik} className="mt-1 block w-full rounded-md border-gray-300">
          <option value="">-- Pilih Sub-Materi --</option>
          {selectedTopik && databaseIPA[selectedTopik].sub_materi_essensial.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      {/* CP Read-Only Display */}
      <div>
        <label className="block text-sm font-medium text-gray-700">CP yang Ditargetkan (Read-Only)</label>
        <textarea readOnly value={selectedTopik ? databaseIPA[selectedTopik].cp_target : ''} className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300" rows="3" />
      </div>

      {/* Profil Lulusan Checklist */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Dimensi Profil Lulusan (PPP)</label>
        {["Keimanan dan Ketakwaan Terhadap Tuhan YME", "Penalaran Kritis", "Kreativitas", "Kolaborasi", "Komunikasi", "Kemandirian", "Kewargaan", "Kesehatan"].map((dimensi) => (
          <div key={dimensi} className="flex items-center mt-1">
            <input 
              type="checkbox" 
              checked={profilCentang.includes(dimensi)}
              onChange={(e) => {
                if (e.target.checked) {
                  setProfilCentang([...profilCentang, dimensi]);
                } else {
                  setProfilCentang(profilCentang.filter(p => p !== dimensi));
                }
              }}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">{dimensi}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### B. Contoh Integrasi Payload API Request (Node.js/Express & Gemini SDK):
```javascript
const express = require('express');
const { GoogleGenAI } = require('@google/generative-ai');
const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/generate-rpm', async (req, res) => {
  const { 
    sekolah, topik, sub_materi, cp_target, tp_list, 
    model_pembelajaran, profil_lulusan, asesmen_formatif, asesmen_sumatif,
    jumlah_pertemuan, jp_per_sesi 
  } = req.body;

  const systemInstruction = `
    Anda adalah AI Modul Ajar Kurikulum Merdeka Terhebat. Buatkan berkas RP PM utuh sesuai template Herwin Hamid.
    Logika wajib dalam menentukan Prinsip Pembelajaran (Modul 3.1) dan Pengalaman Belajar (Modul 3.2):
    - Tahap Pendahuluan / Orientasi wajib memicu Pengalaman "MEMAHAMI" dan Prinsip "BERKESADARAN".
    - Tahap Penyelidikan / Eksperimen / Kerja Ilmiah wajib memicu Pengalaman "MENGAPLIKASI" dan Prinsip "BERMAKNA" serta "MENGGEMBIRAKAN" melalui aktivitas interaktif.
    - Tahap Penutup / Evaluasi / Refleksi Diri wajib memicu Pengalaman "MEREFLEKSI" dan Prinsip "BERKESADARAN" melalui evaluasi diri, metakognisi, dan komitmen moral pribadi siswa.
  `;

  const userPrompt = `
    Buatkan modul RP PM lengkap dengan data parameter berikut:
    Satuan Pendidikan: ${sekolah}
    Mata Pelajaran: IPA SMP
    Kelas: 8
    Topik Utama: ${topik}
    Sub-materi: ${sub_materi}
    Capaian Pembelajaran: ${cp_target}
    Tujuan Pembelajaran (TP): ${tp_list.join(', ')}
    Model Pembelajaran: ${model_pembelajaran}
    Dimensi PPP: ${profil_lulusan.join(', ')}
    Asesmen Formatif: ${asesmen_formatif.join(', ')}
    Asesmen Sumatif: ${asesmen_sumatif.join(', ')}
    Pertemuan: ${jumlah_pertemuan} Sesi, Alokasi waktu: ${jp_per_sesi}
  `;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-pro", systemInstruction });
    const result = await model.generateContent(userPrompt);
    res.json({ success: true, markdown_output: result.response.text });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```
