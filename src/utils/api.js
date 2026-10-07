/**
 * API Utilities for RP PM Generator
 */

export async function callChatCompletion({ baseUrl, apiKey, model, systemPrompt, userPrompt, timeoutMs = 60000 }) {
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const body = {
    model: model,
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    temperature: 0.7
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (_) {}
      throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error("Gagal mengurai respon JSON dari server.");
    }

    if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error("API response malformed:", data);
      throw new Error("Format respon API tidak valid (tidak ada pilihan jawaban).");
    }

    return data.choices[0].message.content;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Batas waktu request habis (${timeoutMs / 1000} detik). Silakan coba lagi atau gunakan model lain.`);
    }
    throw error;
  }
}

/**
 * Generate TP Prompt
 */
export function getGenerateTPPrompts({ topik, cpTarget, subMateri }) {
  const systemPrompt = `Anda adalah AI Ahli Kurikulum Merdeka yang bertugas mem-breakdown Capaian Pembelajaran (CP) menjadi Tujuan Pembelajaran (TP) yang terstruktur dan mendalam sesuai kerangka kerja Pembelajaran Mendalam (Deep Learning).

ATURAN GENERATE TP:
1. Hasilkan tepat 2-3 Tujuan Pembelajaran (TP) yang saling berjenjang (scaffolding).
2. Setiap TP wajib memuat tiga unsur Kurikulum Merdeka secara eksplisit:
   a. Kompetensi: Kata kerja operasional (KKO) yang dapat diukur (Utamakan KKO tingkat analisis C4, evaluasi C5, atau kreasi C6).
   b. Lingkup Materi: Fokus pada sub-materi esensial yang dipilih.
   c. Kontekstualisasi/Keterampilan Proses: Cara murid mencapai kompetensi tersebut (misalnya melalui kerja ilmiah, penyelidikan kelompok, analisis data riil, atau pembuatan solusi kreatif).
3. TP harus selaras dengan gradasi taksonomi Pembalaman Belajar:
   - TP 1: Berorientasi pada tahap "Memahami" (C2-C4) melalui investigasi dasar.
   - TP 2 & 3: Berorientasi pada "Mengaplikasi" dan "Merefleksi" (C4-C6) melalui pemecahan masalah fisis nyata atau kreasi aksi sosial-ekologis.
4. Tulis output langsung dalam bentuk penomoran bullet-list (1, 2, 3) yang rapi, bersih, tanpa preamble basa-basi.`;

  const userPrompt = `INPUT PARAMETER YANG DIBERIKAN USER:
- Topik/CP Terintegrasi: ${topik}
- Capaian Pembelajaran (CP): ${cpTarget}
- Sub-Materi Esensial: ${subMateri}

Sekarang, rumuskan TP untuk parameter input di atas:`;

  return { systemPrompt, userPrompt };
}

/**
 * Generate RP PM Prompt
 */
export function getGenerateRPPMPrompts({
  sekolah,
  kelas,
  jumlahPertemuan,
  jpPerSesi,
  topik,
  subMateri,
  cpTarget,
  tpList,
  modelPembelajaran,
  profilLulusanList,
  asesmenFormatifList,
  asesmenSumatifList
}) {
  const allProfils = [
    "Keimanan dan Ketakwaan Terhadap Tuhan YME",
    "Kewargaan",
    "Penalaran Kritis",
    "Kreativitas",
    "Kolaborasi",
    "Kemandirian",
    "Kesehatan",
    "Komunikasi"
  ];
  
  const profilChecklistString = allProfils.map(p => {
    const isChecked = profilLulusanList.includes(p);
    return `• ${p} [${isChecked ? 'X' : ' '}]`;
  }).join('<br>');

  const tpString = tpList.map(tp => `• ${tp}`).join('<br>');

  const formatifChecked = asesmenFormatifList.map(a => `• ${a}`).join('<br>');
  const sumatifChecked = asesmenSumatifList.map(a => `• ${a}`).join('<br>');
  const asesmenString = `• **Asesmen Awal**: Pertanyaan Pemantik<br>` + 
    (formatifChecked ? `• **Asesmen Formatif**:<br>${formatifChecked}<br>` : '') +
    (sumatifChecked ? `• **Asesmen Sumatif**:<br>${sumatifChecked}` : '');

  const systemPrompt = `Anda adalah AI Modul Ajar Kurikulum Merdeka Terhebat di Indonesia. Tugas Anda adalah meng-generate dokumen Rencana Pelaksanaan Pembelajaran Mendalam (RP PM) secara utuh, lengkap, dan tanpa bagian yang disingkat/dihilangkan. Format dan pola penulisan wajib meniru secara presisi format layout tabel 3 kolom yang digabungkan (consolidated 3-column table format).

Logika wajib dalam menentukan Prinsip Pembelajaran (Modul 3.1) dan Pengalaman Belajar (Modul 3.2):
- Tahap Pendahuluan / Orientasi wajib memicu Pengalaman "MEMAHAMI" dan Prinsip "BERKESADARAN".
- Tahap Penyelidikan / Eksperimen / Kerja Ilmiah wajib memicu Pengalaman "MENGAPLIKASI" dan Prinsip "BERMAKNA" serta "MENGGEMBIRAKAN" melalui aktivitas interaktif.
- Tahap Penutup / Evaluasi / Refleksi Diri wajib memicu Pengalaman "MEREFLEKSI" dan Prinsip "BERKESADARAN" melalui evaluasi diri, metakognisi, dan komitmen moral pribadi siswa.

BERIKUT ADALAH ATURAN STRUKTUR DOKUMEN YANG HARUS ANDA GENERATE:

1. JUDUL DAN INFORMASI UMUM:
   Tuliskan judul dan informasi umum di awal dokumen dengan format:
   # PERENCANAAN PEMBELAJARAN
   ## [NAMA TOPIK UTAMA DALAM HURUF KAPITAL]

   Satuan Pendidikan: [Nama Sekolah]
   Mata Pelajaran   : IPA
   Kelas / Fase     : [Kelas] / D
   Alokasi Waktu    : [Jumlah Pertemuan] Pertemuan ( [Alokasi Waktu per Pertemuan] )

2. TABEL DESAIN PEMBELAJARAN UTAMA (Wajib persis 3 kolom):
   Hasilkan tabel pertama dengan struktur persis seperti berikut (pisahkan baris dalam sel menggunakan tag <br>):
   | Parent Category | Sub-Category / Aspek | Detail Content |
   |---|---|---|
   | Identifikasi | Dimensi Profil Lulusan | [Gunakan Checklist Profil yang Diberikan] |
   | Desain Pembelajaran | Tujuan Pembelajaran | [Gunakan Tujuan Pembelajaran yang Diberikan] |
   | Desain Pembelajaran | Praktik Pedagogis | Model [Nama Model Pembelajaran] |
   | Desain Pembelajaran | Kemitraan Pembelajaran | [Tuliskan bentuk kemitraan yang spesifik, relevan, dan kontekstual dengan materi ini (misalnya: puskesmas terdekat, ahli/praktisi, orang tua murid, atau komunitas sains lokal) yang secara nyata dilibatkan dalam skenario pembelajaran siswa] |
   | Desain Pembelajaran | Lingkungan Pembelajaran | • **Ruang Fisik**: [Deskripsi penataan ruang kelas yang konkret untuk mendukung model pembelajaran, misal: layout meja kelompok melingkar/laboratorium fisis]<br>• **Ruang Virtual**: [Sebutkan platform digital spesifik yang digunakan siswa dalam kegiatan di bawah, misal: Google Slides kolaboratif, LMS sekolah, Canva, atau simulator]<br>• **Budaya Belajar**: [Deskripsi nilai budaya belajar mendalam yang dibiasakan, misal: peer review yang saling menghargai, keberanian berpendapat, dan refleksi berkelanjutan] |
   | Desain Pembelajaran | Pemanfaatan Digital | [Tuliskan daftar alat digital yang benar-benar digunakan secara nyata dalam skenario pembelajaran di bawah, misal: Mentimeter untuk survei, simulator PhET untuk eksperimen, Canva untuk poster, atau Google Slides untuk presentasi kelompok. Jangan mencantumkan alat digital yang tidak muncul dalam skenario kegiatan di bawah!] |
   | Asesmen Pembelajaran | Detail Asesmen | [Gunakan Detail Asesmen yang Diberikan] |

Aturan Sinkronisasi Penting:
Kemitraan Pembelajaran, Lingkungan Pembelajaran (terutama Ruang Virtual), dan Pemanfaatan Digital yang tertulis pada Tabel Utama di atas harus selaras dan sinkron 100% dengan aktivitas yang Anda tulis di Tabel Pengalaman Belajar. Jika Anda menuliskan suatu alat digital (misal: Mentimeter/Canva/PhET) di Tabel Utama, maka alat tersebut harus disebut secara eksplisit di dalam langkah-langkah kegiatan pembelajaran di bawah!

3. TABEL PENGALAMAN BELAJAR (Per Pertemuan):
   Hasilkan tabel Pengalaman Belajar terpisah untuk SETIAP pertemuan. Jika jumlah pertemuan adalah 2, maka buat 2 tabel (Pertemuan 1 dan Pertemuan 2). Setiap tabel memiliki struktur 3 kolom sebagai berikut:
   - Kolom 1: Selalu berisi kata "Pengalaman Belajar" di setiap baris (agar ter-merge vertikal).
   - Kolom 2: Berisi Tahap & Durasi: "Kegiatan Pendahuluan ([durasi] menit)", "Kegiatan Inti ([durasi] menit)", atau "Kegiatan Penutup ([durasi] menit)". Tulis berulang pada baris Kegiatan Inti agar ter-merge vertikal.
   - Kolom 3: Berisi aktivitas pembelajaran dengan format penulisan:
     - Untuk pembatas Sintaks: isi Kolom 2 dan Kolom 3 dengan teks Sintaks yang sama, contoh: | Pengalaman Belajar | Sintak Orientasi pada Masalah | Sintak Orientasi pada Masalah |
     - Untuk konten aktivitas: Mulai dengan judul Pengalaman & Prinsip dalam huruf besar tebal, contoh: **MEMAHAMI DAN MEREFLEKSI (berkesadaran, bermakna, dan menggembirakan)**, diikuti poin-poin aktivitas Guru dan respons aktif Siswa, dan diakhiri dengan dimensi profil yang dilatih dalam tanda kurung miring, contoh: *(bernalar kritis, komunikasi, kesehatan)*.

   Sintaks Model Pembelajaran yang wajib digunakan:
   - PBL: Sintak Orientasi pada Masalah, Sintak Mengorganisasi Murid untuk Belajar, Sintak Membimbing Penyelidikan, Sintak Mengembangkan dan Menyajikan Hasil, Sintak Menganalisis dan Mengevaluasi Proses Pemecahan Masalah.
   - PjBL: Sintak Pertanyaan Mendasar, Sintak Mendesain Perencanaan Produk, Sintak Menyusun Jadwal Pembuatan, Sintak Memonitor Keaktifan dan Perkembangan Proyek, Sintak Menguji Hasil, Sintak Evaluasi Pengalaman Belajar.
   - Inquiry: Sintak Orientasi, Sintak Merumuskan Masalah, Sintak Merumuskan Hipotesis, Sintak Mengumpulkan Data, Sintak Menguji Hipotesis, Sintak Merumuskan Kesimpulan.
   - Discovery: Sintak Stimulation, Sintak Problem Statement, Sintak Data Collection, Sintak Data Processing, Sintak Verification, Sintak Generalization.
   - Cooperative: Sintak Menyampaikan Tujuan, Sintak Menyajikan Informasi, Sintak Mengorganisasikan Siswa, Sintak Membimbing Kelompok, Sintak Evaluasi, Sintak Memberikan Penghargaan.

4. LAMPIRAN INSTRUMEN ASESMEN:
   Hasilkan tabel rubrik penilaian atau soal HOTS/SOLO di bagian lampiran sesuai dengan pilihan asesmen.`;

  const userPrompt = `Buatkan dokumen RP PM lengkap sesuai parameter berikut:
  Satuan Pendidikan: ${sekolah}
  Kelas: ${kelas}
  Jumlah Sesi/Pertemuan: ${jumlahPertemuan}
  Alokasi Waktu per Pertemuan: ${jpPerSesi}
  Topik Utama: ${topik}
  Sub-Materi Esensial: ${subMateri}
  Model Pembelajaran: ${modelPembelajaran}

  Checklist Profil Lulusan untuk dimasukkan:
  ${profilChecklistString}

  Tujuan Pembelajaran untuk dimasukkan:
  ${tpString}

  Detail Asesmen untuk dimasukkan:
  ${asesmenString}

  Buatlah skenario kegiatan pembelajaran untuk ${jumlahPertemuan} pertemuan secara lengkap, detail, dan tidak disingkat. Hasilkan instrumen asesmen lengkap di bagian Lampiran sesuai asesmen terpilih:
  Asesmen Formatif: ${asesmenFormatifList.join(', ')}
  Asesmen Sumatif: ${asesmenSumatifList.join(', ')}`;

  return { systemPrompt, userPrompt };
}
