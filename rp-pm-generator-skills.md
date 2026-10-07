# RENCANA PELAKSANAAN PEMBELAJARAN MENDALAM (RP PM) GENERATOR - master-prompt-skills.md

Dokumen ini berisi spesifikasi teknis, data mapping, logic system, dan Master System Prompt (Template) yang siap disalin dan dimasukkan ke dalam database atau backend aplikasi RP PM Generator Anda sebagai "Skills/Prompt Blueprint".

---

## BAGIAN 1: DATABASE & DATA MAPPING (FASE D - IPA)
Gunakan struktur data JSON di bawah ini pada backend atau state management frontend aplikasi Anda untuk mengatur dropdown dinamis (*Materi Pokok -> Sub-Materi Esensial -> Capaian Pembelajaran*).

```json
{
  "materi_pokok_fase_d": [
    {
      "id": "MAT-01",
      "nama": "Identifikasi Makhluk Hidup",
      "cp_target": "Murid mampu menelaah hasil identifikasi makhluk hidup sesuai dengan karakteristiknya dan mengidentifikasi peranannya dalam ekosistem.",
      "sub_materi_essensial": [
        "Karakteristik Kunci Objek Biotik",
        "Kunci Determinasi Sederhana",
        "Klasifikasi Lima Kingdom",
        "Peran Makhluk Hidup dalam Keseimbangan Ekosistem Pesisir/Lokal"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kolaborasi", "Komunikasi", "Kewargaan"],
      "suggested_asesmen_formatif": ["Penilaian Kinerja Praktikum Identifikasi", "Umpan Balik Laporan Observasi Lingkungan"],
      "suggested_asesmen_sumatif": ["Tes Kasus Ekologis Kerusakan Ekosistem", "Pameran Karya Klasifikasi Lingkungan Sekolah"]
    },
    {
      "id": "MAT-02",
      "nama": "Sistem Organ Manusia dan Gangguannya",
      "cp_target": "Murid mampu menganalisis sistem organisasi kehidupan, fungsi, serta kelainan atau gangguan yang muncul pada sistem organ manusia.",
      "sub_materi_essensial": [
        "Sistem Pencernaan & Nutrisi",
        "Sistem Peredaran Darah & Masalah Kardiovaskular",
        "Sistem Pernapasan & Dampak Polusi Udara",
        "Sistem Ekskresi & Gaya Hidup Sehat"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kesehatan", "Komunikasi", "Kemandirian"],
      "suggested_asesmen_formatif": ["Observasi Diskusi Kasus Klinis", "Refleksi Harian Jurnal Kesehatan"],
      "suggested_asesmen_sumatif": ["Penilaian Lembar Kerja Digital Analisis Kasus", "Rubrik Kampanye Media Poster/Canva/Video"]
    },
    {
      "id": "MAT-03",
      "nama": "Pewarisan Sifat",
      "cp_target": "Murid mampu menerapkan pemahaman pewarisan sifat untuk memprediksi keturunan serta menganalisis implikasi etis perkembangan genetika.",
      "sub_materi_essensial": [
        "Materi Genetik (DNA & RNA)",
        "Persilangan Monohibrid dan Dihibrid (Punnett Square)",
        "Aplikasi Pemuliaan Tanaman/Hewan",
        "Analisis Isu Pro-Kontra GMO (Genetically Modified Organism)"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kolaborasi", "Komunikasi"],
      "suggested_asesmen_formatif": ["Penilaian Kinerja Model Kancing Genetika", "Umpan Balik Hasil Prediksi Diagram Persilangan"],
      "suggested_asesmen_sumatif": ["Tes Tertulis Pemecahan Kasus Genetika", "Rubrik Laporan Analisis Etika GMO"]
    },
    {
      "id": "MAT-04",
      "nama": "Bioteknologi Konvensional",
      "cp_target": "Murid mampu menganalisis penerapan bioteknologi konvensional dalam kehidupan sehari-hari dan merancang produk pangan tradisional.",
      "sub_materi_essensial": [
        "Prinsip Fermentasi Pangan",
        "Pembuatan Tempe/Yoghurt/Nata de Coco sesuai Potensi Lokal",
        "Mikroorganisme Esensial dalam Fermentasi",
        "Analisis Peluang Karir dan Ekonomi Kreatif Bioteknologi"
      ],
      "suggested_profil": ["Kreativitas", "Kolaborasi", "Kemandirian", "Komunikasi"],
      "suggested_asesmen_formatif": ["Penilaian Rencana Proyek Pembuatan Produk", "Umpan Balik Proses Eksekusi Fermentasi"],
      "suggested_asesmen_sumatif": ["Penilaian Kualitas Produk Akhir (Rasa, Tekstur, Kebersihan)", "Laporan Analisis Hambatan dan Keberhasilan Proyek"]
    },
    {
      "id": "MAT-05",
      "nama": "Zat Aditif dan Zat Adiktif",
      "cp_target": "Murid mampu mengevaluasi keputusan yang tepat untuk menghindari zat aditif dan adiktif yang membahayakan dirinya dan lingkungan.",
      "sub_materi_essensial": [
        "Identifikasi Zat Aditif Alami dan Sintetis dalam Makanan Kemasan",
        "Bahaya Zat Adiktif (Narkoba, Rokok, Alkohol) bagi Tubuh",
        "Analisis Cerdas Membaca Label Kemasan (Nutritional Fact)",
        "Kampanye Sosial Pencegahan Penyalahgunaan NAPZA"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kesehatan", "Kemandirian", "Kewargaan"],
      "suggested_asesmen_formatif": ["Analisis Lembar Kerja Kandungan Label Makanan", "Peer Review Rencana Desain Edukasi"],
      "suggested_asesmen_sumatif": ["Tes Kasus Pengambilan Keputusan Konsumsi Sehat", "Rubrik Panduan Cerdas / Video Edukasi Kampanye Sekolah"]
    },
    {
      "id": "MAT-06",
      "nama": "Pengukuran, Besaran, dan Satuan",
      "cp_target": "Murid mampu menerapkan konsep pengukuran, besaran, satuan, dan teknik pengukuran menggunakan alat ukur yang sesuai dengan teliti.",
      "sub_materi_essensial": [
        "Besaran Pokok dan Turunan",
        "Teknik Membaca Alat Ukur Presisi (Jangka Sorong, Mikrometer Sekrup)",
        "Konsep 'Sense of Scale' dalam Kehidupan Sehari-hari",
        "Kesalahan Pengukuran dan Akurasi Data"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kolaborasi", "Kemandirian"],
      "suggested_asesmen_formatif": ["Kinerja Praktikum Penggunaan Alat Ukur", "Lembar Kerja Konversi Satuan Kontekstual"],
      "suggested_asesmen_sumatif": ["Tes Tulis Analisis Data dan Penyajian Grafik Ukuran", "Laporan Hasil Penyelidikan Ketidakpastian Alat Ukur"]
    },
    {
      "id": "MAT-07",
      "nama": "Gerak, Gaya, dan Tekanan",
      "cp_target": "Murid mampu menganalisis konsep gerak, gaya, tekanan, dan keterkaitannya dalam kehidupan sehari-hari serta teknologi transportasi.",
      "sub_materi_essensial": [
        "Kecepatan, Percepatan, dan Hukum Newton tentang Gerak",
        "Tekanan Zat Padat, Cair (Hukum Archimedes, Pascal), dan Gas",
        "Aplikasi Tekanan pada Sistem Peredaran Darah / Transportasi Air Tumbuhan",
        "Teknologi Penerapan Konsep Gerak (Mobil Sport, Roket Air Sederhana)"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kolaborasi", "Kreativitas", "Keimanan dan Ketakwaan"],
      "suggested_asesmen_formatif": ["Kinerja Percobaan Tekanan Plastisin", "Observasi Pembuatan Purwarupa Roket Air"],
      "suggested_asesmen_sumatif": ["Tes Kasus Perhitungan Resultan Gaya dan Tekanan Hidrostatis", "Rubrik Penilaian Produk Purwarupa Mekanis"]
    },
    {
      "id": "MAT-08",
      "nama": "Hubungan Usaha dan Energi",
      "cp_target": "Murid mampu menganalisis hubungan antara usaha, energi kinetik, energi potensial, energi mekanik, dan hukum kekekalan energi.",
      "sub_materi_essensial": [
        "Konsep Usaha Berbasis Gaya dan Perpindahan",
        "Analisis Energi Kinetik dan Potensial pada Wahana Permainan",
        "Hukum Kekekalan Energi Mekanik",
        "Aplikasi Energi Alternatif Ramah Lingkungan"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kolaborasi", "Kemandirian", "Komunikasi"],
      "suggested_asesmen_formatif": ["Lembar Kerja Analisis Data Energi Kinetik", "Pojok Tanya Jawab Interaktif Umpan Balik Konsep"],
      "suggested_asesmen_sumatif": ["Tes Studi Kasus Perhitungan Usaha dan Energi", "Penilaian Laporan Rancang Bangun Energi Alternatif"]
    },
    {
      "id": "MAT-09",
      "nama": "Klasifikasi, Sifat, dan Perubahan Materi",
      "cp_target": "Murid mampu menganalisis klasifikasi materi (unsur, senyawa, campuran), sifat fisika dan kimia, serta perubahan fisika dan kimia.",
      "sub_materi_essensial": [
        "Perbedaan Unsur, Senyawa, dan Campuran",
        "Perubahan Wujud Zat dan Teori Partikel",
        "Metode Pemisahan Campuran Sederhana (Filtrasi, Evaporasi, Kromatografi)",
        "Sifat Kimia: Korosi, Pembakaran, dan Pembusukan bahan sehari-hari"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kreativitas", "Kolaborasi", "Komunikasi"],
      "suggested_asesmen_formatif": ["Lembar Kerja Pengelompokan Zat Eksperimen", "Umpan Balik Pembuatan Model Partikel Materi"],
      "suggested_asesmen_sumatif": ["Penilaian Mind Map Klasifikasi Zat", "Pameran Karya Model Partikel dan Contoh Perubahan Zat"]
    },
    {
      "id": "MAT-10",
      "nama": "Pengaruh Kalor Dan Perpindahannya Terhadap Perubahan Suhu",
      "cp_target": "Murid mampu menganalisis energi kalor, perpindahan kalor (konduksi, konveksi, radiasi), pengaruhnya terhadap suhu, dan dampaknya pada pemanasan global.",
      "sub_materi_essensial": [
        "Kalor Jenis dan Perubahan Suhu (Q = m.c.dT)",
        "Mekanisme Perpindahan Kalor di Alam Semesta",
        "Efek Radiasi Kalor pada Pemanasan Global (Greenhouse Effect)",
        "Analisis Tindakan Preventif Pengurangan Jejak Karbon"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kolaborasi", "Kreativitas", "Kewargaan", "Komunikasi"],
      "suggested_asesmen_formatif": ["Laporan Kerja Ilmiah Eksperimen Pemodelan Efek Rumah Kaca", "Lembar Kerja Analisis Hubungan Emisi Karbon dengan Suhu Bumi"],
      "suggested_asesmen_sumatif": ["Tes Sumatif Pilihan Ganda dan Esai Kontekstual Radiasi Kalor", "Rubrik Produk Kampanye Hijau Pencegahan Pemanasan Global"]
    },
    {
      "id": "MAT-11",
      "nama": "Gelombang dan Pemanfaatannya",
      "cp_target": "Murid mampu menganalisis fenomena getaran, gelombang, bunyi, dan cahaya serta pemanfaatannya dalam teknologi alat optik sehari-hari.",
      "sub_materi_essensial": [
        "Karakteristik Getaran dan Gelombang (Frekuensi, Amplitudo, Cepat Rambat)",
        "Sifat Cahaya dan Pembentukan Bayangan pada Cermin dan Lensa",
        "Mekanisme Kerja Alat Optik (Kamera, Lup, Mikroskop, Kacamata)",
        "Pemanfaatan Gelombang Bunyi/Elektromagnetik dalam Teknologi Medis (USG/X-Ray)"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kolaborasi", "Kreativitas", "Keimanan dan Ketakwaan"],
      "suggested_asesmen_formatif": ["Lembar Kerja Penyelidikan Bayangan Alat Optik", "Aktivitas Refleksi Pola Kalimat Metakognitif"],
      "suggested_asesmen_sumatif": ["Tes Tertulis Pemahaman Sifat Gelombang & Pembiasan", "Penilaian Diorama / Karya Optik Sederhana"]
    },
    {
      "id": "MAT-12",
      "nama": "Gejala Kemagnetan dan Kelistrikan",
      "cp_target": "Murid mampu menganalisis gejala listrik statis, listrik dinamis, kemagnetan, induksi elektromagnetik, dan pemanfaatan sumber energi listrik ramah lingkungan.",
      "sub_materi_essensial": [
        "Hukum Coulomb dan Kelistrikan Statis pada Sel Saraf",
        "Rangkaian Listrik Seri-Paralel dan Hukum Ohm",
        "Prinsip Kemagnetan dan Induksi Elektromagnetik pada Generator",
        "Teknologi Motor Listrik dan Sel Panel Surya Ramah Lingkungan"
      ],
      "suggested_profil": ["Penalaran Kritis", "Kolaborasi", "Kreativitas", "Kemandirian"],
      "suggested_asesmen_formatif": ["Penilaian Kinerja Pembuatan Rangkaian Listrik Miniatur", "Lembar Refleksi Desain Rangkaian Listrik Rumah Mandiri"],
      "suggested_asesmen_sumatif": ["Tes Tulis Hukum Kelistrikan dan Kemagnetan", "Rubrik Poster/Infografis Cara Kerja Mobil Listrik dan Sel Surya"]
    },
    {
      "id": "MAT-13",
      "nama": "Sistem Tata Surya dan Perubahan Iklim",
      "cp_target": "Murid mampu menganalisis posisi relatif bumi-bulan-matahari dalam sistem tata surya untuk menjelaskan fenomena alam dan hubungannya dengan perubahan iklim global.",
      "sub_materi_essensial": [
        "Karakteristik Komponen Tata Surya dan Orbit Planet",
        "Fenomena Gerhana, Fase Bulan, Pasang Surut, dan Pergantian Musim",
        "Analisis Data Cuaca Ekstrem Akibat Perubahan Iklim Global",
        "Kampanye Aksi Nyata Adaptasi dan Mitigasi Perubahan Iklim Daerah"
      ],
      "suggested_profil": ["Keimanan dan Ketakwaan", "Penalaran Kritis", "Kreativitas", "Kewargaan"],
      "suggested_asesmen_formatif": ["Analisis Lembar Kerja Fenomena Astronomi", "Penilaian Proses Pembuatan Diorama Tata Surya"],
      "suggested_asesmen_sumatif": ["Tes Tulis Fenomena Astronomis & Klimatologi", "Rubrik Kampanye Aksi Nyata Mitigasi Perubahan Iklim"]
    }
  ]
}
```

---

## BAGIAN 2: LOGIC SUGGESTION SYSTEM
Ketika pengguna berinteraksi dengan form pada aplikasi Anda, terapkan aturan logika (*suggestion logic*) berikut untuk memberikan pengalaman pengguna (*User Experience*) yang mulus dan cerdas:

1.  **Jika Pengguna Memilih Topik/Materi Pokok**:
    *   **Materi Sub-Materi Dropdown**: Perbarui opsi dropdown sub-materi secara dinamis sesuai dengan array `sub_materi_essensial` dari objek materi pokok yang dipilih.
    *   **CP yang Ditargetkan (Read-only)**: Isi teks area CP secara otomatis dari field `cp_target`.
    *   **Saran Checklist Dimensi Profil Lulusan**: Secara otomatis centang (*checklist*) dimensi-dimensi profil yang terdapat pada `suggested_profil`. Pengguna tetap diberi keleluasaan untuk menambah atau menghapus centang secara manual.
2.  **Jika Pengguna Memilih Model Pembelajaran**:
    *   **Inquiry Learning**: Sarankan Profil Lulusan: *Penalaran Kritis* dan *Kolaborasi*. Sarankan Jenis Asesmen Formatif: *Kinerja Penyelidikan/Eksperimen*.
    *   **Problem Based Learning (PBL)**: Sarankan Profil Lulusan: *Penalaran Kritis*, *Komunikasi*, dan *Kesehatan/Kewargaan* (tergantung topik). Sarankan Jenis Asesmen Formatif: *Studi Kasus Kontekstual*.
    *   **Project Based Learning (PjBL)**: Sarankan Profil Lulusan: *Kreativitas*, *Kolaborasi*, dan *Kemandirian*. Sarankan Jenis Asesmen Sumatif: *Rubrik Produk/Alat* atau *Laporan Proyek*.
    *   **Cooperative Learning**: Sarankan Profil Lulusan: *Kolaborasi* dan *Komunikasi*. Sarankan Jenis Asesmen Formatif: *Penilaian Rekan Sejawat (Peer-Assessment)*.
3.  **Dropdown Jenis Penilaian (Asesmen)**:
    *   Jika pengguna mengaktifkan pilihan jenis penilaian, munculkan dua kategori multiselect:
        *   *Asesmen Formatif*: Observasi Aktivitas Kolaboratif, Lembar Kerja (LKPD), Jurnal Refleksi Metakognisi, Penilaian Diri, Penilaian Rekan Sejawat.
        *   *Asesmen Sumatif*: Tes Tertulis (Pilihan Ganda & Esai Kontekstual), Rubrik Penilaian Produk Kreatif, Rubrik Penilaian Presentasi/Kampanye.
    *   Berikan rekomendasi *default-checked* berdasarkan `suggested_asesmen_formatif` dan `suggested_asesmen_sumatif` pada database materi pokok di atas.

---

## BAGIAN 3: SYSTEM PROMPT TEMPLATE (MASTER PROMPT)
Berikut adalah instruksi master (*system prompt*) yang harus dikirimkan ke model AI (Gemini/GPT) melalui API backend Anda saat tombol **"Generate TP"** atau **"Buat RP Otomatis"** ditekan.

### MASTER PROMPT 1: GENERATE TP (TUJUAN PEMBELAJARAN)
Kirimkan prompt ini saat pengguna menekan tombol **"Generate TP"** setelah memilih materi dan sub-materi.

```text
Anda adalah AI Ahli Kurikulum Merdeka dan Pembelajaran Mendalam (Deep Learning). Tugas Anda adalah merumuskan Tujuan Pembelajaran (TP) yang tajam, operasional, dan mendalam berdasarkan parameter input berikut:

=== INPUT PARAMETER ===
Mata Pelajaran: {Mata Pelajaran}
Topik/Materi Pokok: {Materi Pokok}
Fokus Sub-materi Essensial: {Sub-materi}
Capaian Pembelajaran (CP) Target: {CP}
=======================

Aturan Merumuskan TP Pembelajaran Mendalam (Sesuai Panduan Kurikulum Merdeka & Modul 3.2):
1. TP harus mengintegrasikan KOMPETENSI (kata kerja operasional tingkat tinggi seperti menganalisis, mengevaluasi, merancang, memprediksi, dll.) dan LINGKUP MATERI (konten esensial).
2. Jangan membuat TP yang terpisah antara kognitif dan keterampilan proses. Integrasikan keterampilan proses (seperti menyelidiki, menganalisis data, mengomunikasikan) di dalam TP agar menjadi kompetensi yang utuh (seperti pada modul IPA Fase D).
3. Rumuskan TP dalam 2-3 butir tujuan pembelajaran yang saling berjenjang (scaffolding), mulai dari tahap analisis konsep fisis, penerapan kontekstual isu nyata, hingga perancangan solusi/aksi nyata.
4. Tuliskan output TP dalam format penomoran/bullet list yang rapi, sederhana, dan mudah dipahami guru.

CONTOH OUTPUT JIKA TOPIKNYA KALOR DAN RADIASI:
1. Murid mampu menganalisis pengaruh radiasi kalor terhadap perubahan suhu lingkungan melalui kerja ilmiah penyelidikan eksperimental efek rumah kaca secara kolaboratif.
2. Murid mampu menganalisis hubungan sebab-akibat antara radiasi kalor yang terperangkap oleh emisi gas rumah kaca dengan fenomena pemanasan global berdasarkan analisis grafik autentik NASA/BMKG.
3. Murid mampu merancang solusi kreatif dan aplikatif untuk meminimalisir emisi gas rumah kaca serta mengomunikasikannya melalui media kampanye digital/analog secara sistematis.

Sekarang, rumuskan TP untuk parameter input di atas:
```

---

### MASTER PROMPT 2: BUAT RP OTOMATIS (MEMBUAT RENCANA PEMBELAJARAN UTUH)
Kirimkan prompt ini saat pengguna menekan tombol **"Buat RP Otomatis"**. Ini akan menghasilkan modul pembelajaran lengkap yang memadukan pola **RP PM-Herwin Hamid.pdf** dengan prinsip **Pembelajaran Mendalam (Modul 3.1 & 3.2)**.

```text
Anda adalah AI Kurikulum Merdeka yang ahli dalam merancang Rencana Pembelajaran Pembelajaran Mendalam (RP PM). 
Tugas Anda adalah membuat dokumen RP PM yang sangat lengkap, aplikatif, dan detail sesuai dengan parameter input di bawah ini. Anda tidak boleh menyingkat aktivitas, membuat placeholder, atau menyembunyikan instruksi (misalnya "dan seterusnya" atau "aktivitas guru disesuaikan"). Seluruh isi harus ditulis lengkap dan siap pakai oleh guru di kelas.

=== PARAMETER INPUT APPLIKASI ===
Satuan Pendidikan : {Satuan Pendidikan}
Mata Pelajaran    : {Mata Pelajaran}
Kelas             : Kelas {Kelas} / Fase D
Jumlah Pertemuan  : {Jumlah Pertemuan} Pertemuan
Durasi per Sesi   : {JP per Sesi}
Topik/Materi Pokok: {Materi Pokok}
Fokus Sub-materi  : {Sub-materi}
Capaian Pembelajaran (CP) Target: {CP}
Tujuan Pembelajaran (TP) Terpilih:
{Tujuan Pembelajaran Terpilih}

Model Pembelajaran: {Model Pembelajaran} (Contoh: PBL, PjBL, Inquiry, Cooperative, dll.)
Dimensi Profil Lulusan Terchecklist: {Dimensi Profil Lulusan}
Jenis Penilaian Formatif: {Asesmen Formatif}
Jenis Penilaian Sumatif: {Asesmen Sumatif}
==================================

=== ATURAN DAN STRUKTUR FORMAT RP PM ===
Draf RP PM harus mengikuti pola "RP PM-Herwin Hamid.pdf" yang mencakup komponen esensial berikut:

1. IDENTITAS ADMINISTRASI
   Tuliskan Satuan Pendidikan, Mata Pelajaran, Kelas/Fase, Alokasi Waktu, dan Penyusun secara formal di bagian atas.

2. IDENTIFIKASI
   - Dimensi Profil Lulusan: Cantumkan hanya dimensi profil lulusan yang dichecklist oleh user.
   - Peta Karakter/Kesiapan Murid: Deskripsikan metode singkat guru dalam mendeteksi kesiapan murid di awal pembelajaran terkait materi ini.

3. DESAIN PEMBELAJARAN
   - Tujuan Pembelajaran (TP): Tuliskan TP sesuai pilihan input user.
   - Praktik Pedagogis: Sebutkan Model Pembelajaran yang dipilih user dan bagaimana sintaks umumnya akan diterapkan.
   - Kemitraan Pembelajaran: Jelaskan bagaimana murid berkolaborasi antar rekan, orang tua, masyarakat sekitar, atau tenaga ahli eksternal/dunia industri secara kontekstual dengan materi.
   - Lingkungan Pembelajaran: Jelaskan set-up lingkungan belajar yang aman dan saling memuliakan, meliputi Ruang Fisik (layout meja diskusi), Ruang Virtual (platform kolaboratif digital), dan Budaya Belajar.
   - Pemanfaatan Digital: Tuliskan tool digital yang digunakan secara praktis (AI, canva, aplikasi visual, dll.) baik untuk eksplorasi materi maupun pembuatan karya murid.

4. SKENARIO LANGKAH PEMBELAJARAN (DETAIL PERTEMUAN)
   Pecah skenario menjadi sejumlah {Jumlah Pertemuan} yang diminta. Setiap pertemuan harus memiliki:
   - Durasi Waktu Terperinci (Kegiatan Pendahuluan, Inti, Penutup sesuai alokasi JP persesi).
   - Aktivitas Guru dan Aktivitas Murid ditulis berdampingan atau terstruktur rapi yang mencerminkan sintaks dari Model Pembelajaran pilihan.
   - INTEGRASI TAISONOMI PENGALAMAN BELAJAR DAN PRINSIP PEMBELAJARAN MENDALAM (Wajib Grounded di Modul 3.1 & Modul 3.2):
     * Di setiap langkah skenario wajib mencantumkan penanda kategori pengalaman belajar: "MEMAHAMI", "MENGAPLIKASI", atau "MEREFLEKSI".
     * Di setiap langkah wajib mencantumkan prinsip pembelajaran mendalam yang aktif di langkah tersebut: "BERKESADARAN", "BERMAKNA", atau "MENGGEMBIRAKAN".
     * Jelaskan secara eksplisit tindakan fisik/praktis murid yang memicu pengalaman belajar tersebut (olah pikir, olah rasa, olah hati, tindakan fisik/praktik langsung).
     * Contoh penulisan dalam sintaks: 
       "Sintak Orientasi Masalah (Kegiatan Pendahuluan - 20 Menit) - MEMAHAMI (Berkesadaran dan Bermakna): Murid mengamati penayangan video nyata..."

5. ASESMEN PEMBELAJARAN LENGKAP
   Tuliskan secara utuh rancangan instrumen penilaian sesuai pilihan user:
   - Jika "Observasi Aktivitas Kolaboratif" dipilih: Sediakan RUBRIK OBSERVASI LENGKAP dengan aspek penilaian, deskripsi skala 1-4, dan rekomendasi tindak lanjut umpan balik guru yang memuliakan murid.
   - Jika "Refleksi Diri / Self-Assessment" dipilih: Berikan Lembar Penilaian Diri Mandiri berisi daftar checklist pertanyaan reflektif metakognitif.
   - Jika "Asesmen Sumatif Tes Tertulis" dipilih: Buatkan 3 Soal Pilihan Ganda Kontekstual HOTS tingkat tinggi (C4-C5) lengkap dengan stimulus data/studi kasus, kunci jawaban, dan pembahasan ilmiah pedagogis. Buatkan juga 1 Soal Esai Studi Kasus Kontekstual lengkap dengan Kunci Jawaban dan Rubrik Penilaian berbasis SOLO Taxonomy (Prestructural, Unistructural, Multistructural, Relational, Extended Abstract).
   - Jika "Asesmen Sumatif Produk/Karya" dipilih: Buatkan Rubrik Penilaian Produk Kreatif (Canva/Reels/Diorama/Laporan) yang memuat kriteria pemahaman materi, orisinalitas ide, visualisasi media, dan tindak lanjut umpan balik.

Tuliskan dokumen ini dalam format Markdown yang sangat rapi, tebal-miring (*bold-italic*) pada bagian penting untuk kemudahan keterbacaan, dan bebas dari metadata teknis internal AI. Buatlah rencana pembelajaran yang benar-benar siap saji, mendalam, dan inspiratif!
```

---

## BAGIAN 4: CARA INTEGRASI PADA CODEBASE APLIKASI ANDA

### Opsi A: Integrasi Backend NodeJS / Python (API Call ke Gemini)
Gunakan Master Prompt di atas dengan teknik string interpolation atau template literal.

**Contoh Kode Python (FastAPI/Flask Backend):**
```python
import google.generativeai as genai

def generate_rp_pm(user_inputs):
    # Load Master Prompt dari file master-prompt-skills.md
    with open("rp-pm-generator-system-instructions.md", "r") as f:
        master_prompt_template = f.read()
    
    # Isi parameter dinamis dari input form aplikasi
    formatted_prompt = master_prompt_template.format(
        Satuan_Pendidikan=user_inputs["sekolah"],
        Mata_Pelajaran=user_inputs["mapel"],
        Kelas=user_inputs["kelas"],
        Jumlah_Pertemuan=user_inputs["pertemuan"],
        JP_per_Sesi=user_inputs["jp_per_sesi"],
        Materi_Pokok=user_inputs["materi_pokok"],
        Sub_materi=user_inputs["sub_materi"],
        CP=user_inputs["cp"],
        Tujuan_Pembelajaran_Terpilih=user_inputs["tp_list"],
        Model_Pembelajaran=user_inputs["model_belajar"],
        Dimensi_Profil_Lulusan=user_inputs["profil_list"],
        Asesmen_Formatif=user_inputs["formatif_list"],
        Asesmen_Sumatif=user_inputs["sumatif_list"]
    )
    
    # Panggil API Gemini 1.5 Pro atau model terkuat lainnya
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(formatted_prompt)
    return response.text
```

### Opsi B: State Management di Frontend (React / Vue)
1. Buat file konfigurasinya menjadi static constants `MateriPokokData.json` berdasarkan pemetaan JSON di **Bagian 1**.
2. Buat state untuk melacak pilihan dropdown pertama (Materi Pokok).
3. Filter array `sub_materi_essensial` dan populate dropdown kedua (Sub-Materi).
4. Auto-update textarea Capaian Pembelajaran (`cp_target`) dan set state default checked pada list checkbox Dimensi Profil Lulusan serta Asesmen.
