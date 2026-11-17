# e-Advokasi Kemenkeu

Sistem Permohonan Bantuan Hukum & e-Advokasi mengelola siklus permintaan bantuan hukum dari satuan kerja hingga penanganan perkara, pendampingan, putusan, dan telaahan kasus hukum, serta integrasi dengan sistem eksternal melalui API.

## Penanganan & Siklus Permohonan

**Permohonan**:
Permintaan bantuan hukum resmi yang diajukan satuan kerja atau ditarik dari surat masuk, sebelum diteruskan ke penanganan. Konsep terpisah dari berkas penanganan dengan relasi banyak-ke-banyak (satu `Permohonan` dapat dilampirkan ke beberapa kasus, dan satu kasus dapat menerima beberapa `Permohonan`).
_Avoid_: Kasus, tiket penanganan

**Disposisi**:
Penugasan dan arahan tindak lanjut atas `Permohonan` dari pengirim kepada unit atau pejabat tujuan sebelum direkam ke modul penanganan.
_Avoid_: Pengarsipan, status selesai

**Penanganan Perkara**:
Siklus litigasi atas perkara pengadilan sejak pendaftaran gugatan hingga seluruh tingkatan persidangan (Pertama, Banding, Kasasi, Peninjauan Kembali).
_Avoid_: Penanganan Putusan, gugatan saja

**Pendampingan**:
Layanan bantuan hukum non-litigasi bagi pegawai atau pejabat yang dipanggil sebagai saksi atau pihak terkait oleh instansi pemeriksa atau penegak hukum.
_Avoid_: Litigasi, konsultasi informal

**Penanganan Putusan**:
Siklus pasca-putusan yang berdiri sebagai modul dan siklus hidup tersendiri di luar `Penanganan Perkara`, tertaut ke perkara asalnya melalui `perkaraId`, mencakup amar, `BHT`, dan tindak lanjut putusan.
_Avoid_: Sub-status perkara

**BHT (Berkekuatan Hukum Tetap)**:
Status hukum putusan pengadilan yang telah final (`Inkracht`) atau belum final beserta keterangan dampaknya terhadap kementerian.
_Avoid_: Selesai sidang

**Telaahan Kasus Hukum**:
Kajian yuridis tertulis untuk menganalisis suatu permasalahan hukum beserta rekomendasi kebijakan atau langkah hukumnya, hingga penerbitan naskah telaahan bertanda tangan elektronik.
_Avoid_: Pendampingan

## Organisasi, Tim & Retensi

**Tim Advokasi**:
Susunan pegawai yang ditugaskan menangani suatu `Permohonan` atau berkas penanganan dengan peran `PIC`, `Editor`, atau `Viewer`.
_Avoid_: User global

**PIC (Person in Charge)**:
Satu anggota utama `Tim Advokasi` yang bertanggung jawab penuh atas jalannya suatu berkas penanganan atau permohonan.
_Avoid_: Super Admin, Manajer

**Arsip**:
Penyimpanan permanen atau referensi historis untuk berkas penanganan yang telah selesai maupun arsip perkara historis.
_Avoid_: Recycle Bin

**Recycle Bin**:
Penampungan sementara untuk berkas yang dihapus secara lunak sebelum dipulihkan kembali atau dihapus permanen.
_Avoid_: Arsip

## Sistem Eksternal (Integrasi API)

**Nadine**:
Sistem naskah dinas eksternal yang diintegrasikan melalui API untuk menarik surat masuk permohonan dan mengirim serta menandatangani elektronik (TTE) naskah dinas atau laporan hasil penanganan.
_Avoid_: Modul internal

**Law Analyzer**:
Sistem analisis hukum eksternal yang diintegrasikan pada menu aplikasi untuk analisis dukungan regulasi dan perkara.
_Avoid_: Modul Telaahan
