import { Category, PackageItem, Photo, AddonItem } from "./types";

export const SHEETDB_API_URL = "https://sheetdb.io/api/v1/vtw78mod9lrzq";
export const CLOUDINARY_URL = "cloudinary://579251134143585:BmZI37AVN3AcZK8RhGL0wN1LJpo@ihfrcyan";
export const CLOUDINARY_CLOUD_NAME = "ihfrcyan";
export const DEFAULT_HERO_BG_URL = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80";

export const DEFAULT_ADMIN = {
  username: "admin",
  password: "lensaarsya2026", // Default secure password
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: "1", name: "Wisuda" },
  { id: "2", name: "Foto Produk" },
];

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: "1",
    title: "Headphone Studio Premium",
    description: "Visualisasi produk komersial audio high-end dengan lighting terarah",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Foto Produk",
    sort_order: 1,
    created_at: "2026-09-01",
  },
  {
    id: "2",
    title: "Wisuda Universitas Indonesia",
    description: "Momen kelulusan toga outdoor dengan nuansa hangat penuh kebanggaan",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80",
    category: "Wisuda",
    sort_order: 2,
    created_at: "2026-09-05",
  },
  {
    id: "3",
    title: "Sneakers Sport Red Ruby",
    description: "Detail tekstur sepatu sport dinamis bernuansa merah berani",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    category: "Foto Produk",
    sort_order: 3,
    created_at: "2026-09-10",
  },
  {
    id: "4",
    title: "Momen Syukur Wisudawan",
    description: "Ekspresi kebahagiaan wisudawati didampingi keluarga tercinta",
    image_url: "https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?w=800&q=80",
    category: "Wisuda",
    sort_order: 4,
    created_at: "2026-09-12",
  },
  {
    id: "5",
    title: "Jam Tangan Minimalist Luxury",
    description: "Fotografi still life produk jam tangan dengan refleksi halus",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Foto Produk",
    sort_order: 5,
    created_at: "2026-09-15",
  },
  {
    id: "6",
    title: "Sahabat Seperjuangan Toga",
    description: "Dokumentasi kebersamaan sahabat satu angkatan kelulusan",
    image_url: "https://images.unsplash.com/photo-1564979045531-fa386a275b27?w=800&q=80",
    category: "Wisuda",
    sort_order: 6,
    created_at: "2026-09-18",
  },
];

export const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: "1",
    name: "Standar",
    price: "Rp 150.000",
    popular: false,
    tagline: "Dokumentasi Cepat & Praktis",
    features: [
      "Semua foto via Google Drive",
      "Pengiriman file digital cepat",
      "File mentahan (tanpa edit)",
      "Sesi foto terarah",
    ],
  },
  {
    id: "2",
    name: "Menengah",
    price: "Rp 300.000",
    popular: false,
    tagline: "Hasil Rapi & Siap Upload",
    features: [
      "Semua foto via Google Drive",
      "Pengeditan foto lanjutan (retouch & color grading)",
      "Pengiriman file digital cepat",
      "Pilihan foto terbaik",
    ],
  },
  {
    id: "3",
    name: "Premium",
    price: "Rp 500.000",
    popular: true,
    tagline: "Paket Terlengkap & Favorit",
    features: [
      "Semua foto via Google Drive",
      "Video singkat (highlight/Reels sinematik)",
      "Pengiriman file digital cepat",
      "Prioritas pengerjaan",
      "Format siap untuk medsos",
    ],
  },
  {
    id: "4",
    name: "Eksklusif",
    price: "Rp 800.000",
    popular: false,
    tagline: "Dokumentasi Penuh & Mewah",
    features: [
      "Sesi dokumentasi intensif 2 jam",
      "Video sinematik rangkaian acara",
      "Master file & hasil edit digital",
      "Bebas request konsep",
    ],
  },
];

export const INITIAL_ADDONS: AddonItem[] = [
  {
    id: "addon-1",
    name: "Tambahan Durasi Pemotretan",
    price: "Rp 100.000 / Jam",
    desc: "Fleksibel jika Anda ingin eksplorasi lokasi lebih banyak",
  },
  {
    id: "addon-2",
    name: "Cetak Frame Kayu Minimalis (12R/A3)",
    price: "Rp 85.000 / Buah",
    desc: "Termasuk cetak foto laminasi matte & bingkai kayu elegan",
  },
  {
    id: "addon-3",
    name: "Flashdisk Kayu Eksklusif 32GB",
    price: "Rp 95.000 / Box",
    desc: "Cocok sebagai kado wisuda fisik yang berkesan",
  },
  {
    id: "addon-4",
    name: "Sesi Luar Kota / Custom Venue",
    price: "Menyesuaikan Lokasi",
    desc: "Biaya transport & akomodasi disesuaikan jarak",
  },
];

