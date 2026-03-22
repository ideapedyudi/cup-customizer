# Project: 3D Drink Cup Customizer

## Tech Stack
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + shadcn/ui
- 3D Engine: React Three Fiber (Three.js)
- AI Integration: Google Gemini API (untuk generate desain sablon)
- Storage: Browser LocalStorage (untuk riwayat gambar)

## Fitur Utama
1. **3D Viewer**: Menampilkan model 3D Cup (Bisa menggunakan silinder dasar jika file .glb belum ada).
2. **Texture Mapping**: Gambar yang di-upload atau di-generate harus ditempelkan sebagai texture pada bagian badan cup.
3. **AI Generator**: Input teks untuk generate gambar via Gemini API, lalu hasilnya muncul di Cup.
4. **Image Gallery**: Sidebar yang menampilkan list gambar dari LocalStorage.

## Aturan Coding (Agent Rules)
- Gunakan TypeScript untuk semua komponen.
- Gunakan `lucide-react` untuk ikon.
- Komponen UI harus mengambil dari `@/components/ui` (shadcn).
- Pisahkan logika 3D ke dalam komponen `CupScene.tsx`.
- Simpan history gambar dalam array of objects: `{ id, url, type: 'upload' | 'ai' }`.

## Struktur Folder
- `/components/canvas` -> Komponen Three.js
- `/components/ui` -> Komponen shadcn
- `/lib/gemini.ts` -> Konfigurasi Google AI SDK