"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Category, PackageItem, Photo } from "@/lib/types";
import { CLOUDINARY_CLOUD_NAME } from "@/lib/constants";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"photos" | "categories" | "packages" | "database" | "security">("photos");

  // Data states
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Notification / Alert message
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Photo Form Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);

  // STAGED UPLOAD STATE:
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  const [photoForm, setPhotoForm] = useState({
    title: "",
    category: "",
    image_url: "",
    description: "",
    sort_order: 1,
  });

  // Category Form Modal / Inline
  const [newCategoryName, setNewCategoryName] = useState("");

  // Package Form Modal
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    price: "",
    tagline: "",
    popular: false,
    featuresText: "",
  });

  // Admin credentials state
  const [adminUsername, setAdminUsername] = useState("admin");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Database status state
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    connected?: boolean;
    message?: string;
    stats?: { photos: number; categories: number; packages: number; admins: number };
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadAllData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [resPhotos, resCats, resPkgs, resProfile, resDb] = await Promise.all([
        fetch("/api/photos").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
        fetch("/api/packages").then((r) => r.json()),
        fetch("/api/admin/profile").then((r) => r.json()).catch(() => ({ data: { username: "admin" } })),
        fetch("/api/admin/db-status").then((r) => r.json()).catch(() => null),
      ]);

      if (resPhotos?.data) setPhotos(resPhotos.data);
      if (resCats?.data) setCategories(resCats.data);
      if (resPkgs?.data) setPackages(resPkgs.data);
      if (resProfile?.data?.username) setAdminUsername(resProfile.data.username);
      if (resDb) setDbStatus(resDb);
    } catch (err: unknown) {
      console.error("Gagal memuat data dari API:", err);
      showToast("Gagal memuat beberapa data dari database.", "error");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // --- STAGED FILE SELECTION ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("Ukuran file terlalu besar! Maksimal 10MB.", "error");
      return;
    }

    if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setLocalPreviewUrl(objectUrl);

    setPhotoForm((prev) => ({
      ...prev,
      title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    }));

    showToast("File foto dipilih. Foto akan diunggah ke Cloudinary saat Anda menekan 'Simpan Foto'.");
  };

  const handleClosePhotoModal = () => {
    if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setSelectedFile(null);
    setLocalPreviewUrl(null);
    setIsPhotoModalOpen(false);
  };

  // --- PHOTO ACTIONS ---
  const handleOpenAddPhoto = () => {
    setEditingPhotoId(null);
    setSelectedFile(null);
    setLocalPreviewUrl(null);
    setPhotoForm({
      title: "",
      category: categories[0]?.name || "Wisuda",
      image_url: "",
      description: "",
      sort_order: photos.length + 1,
    });
    setIsPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (photo: Photo) => {
    setEditingPhotoId(photo.id);
    setSelectedFile(null);
    setLocalPreviewUrl(null);
    setPhotoForm({
      title: photo.title,
      category: photo.category,
      image_url: photo.image_url,
      description: photo.description || "",
      sort_order: photo.sort_order || 1,
    });
    setIsPhotoModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoForm.title) {
      showToast("Judul foto wajib diisi!", "error");
      return;
    }

    if (!selectedFile && !photoForm.image_url) {
      showToast("Pilih file foto atau masukkan URL foto terlebih dahulu!", "error");
      return;
    }

    setIsSavingPhoto(true);
    let finalImageUrl = photoForm.image_url;

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success) {
          finalImageUrl = data.url;
        } else {
          showToast(data.error || "Gagal mengunggah foto ke Cloudinary", "error");
          setIsSavingPhoto(false);
          return;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal menghubungi server upload";
        showToast(msg, "error");
        setIsSavingPhoto(false);
        return;
      }
    }

    try {
      const payload = {
        ...photoForm,
        image_url: finalImageUrl,
        category: photoForm.category || categories[0]?.name || "Umum",
        sort_order: Number(photoForm.sort_order) || 1,
      };

      if (editingPhotoId) {
        const res = await fetch(`/api/photos/${editingPhotoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal memperbarui foto di database");
        showToast("Foto berhasil diperbarui di Vercel Postgres!");
      } else {
        const res = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menyimpan foto ke database");
        showToast("Foto baru berhasil disimpan ke Vercel Postgres!");
      }

      await loadAllData();
      handleClosePhotoModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan foto";
      showToast(msg, "error");
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleDeletePhoto = async (id: string, title: string, imageUrl: string) => {
    if (!confirm(`Yakin ingin menghapus foto "${title}"?`)) return;

    try {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus foto dari database");

      showToast(`Foto "${title}" telah dihapus.`);
      await loadAllData();

      if (imageUrl && imageUrl.includes("cloudinary.com") && imageUrl.includes("lensa-arsya")) {
        const match = imageUrl.match(/lensa-arsya\/[^.]+/);
        if (match) {
          fetch("/api/upload", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id: match[0] }),
          }).catch(() => {});
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus foto";
      showToast(msg, "error");
    }
  };

  // --- CATEGORY ACTIONS ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      showToast("Kategori dengan nama tersebut sudah ada!", "error");
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) throw new Error("Gagal menambahkan kategori");

      setNewCategoryName("");
      showToast(`Kategori "${trimmed}" berhasil ditambahkan ke database!`);
      await loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan kategori";
      showToast(msg, "error");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const isUsed = photos.some((p) => p.category.toLowerCase() === name.toLowerCase());
    if (isUsed) {
      if (!confirm(`Kategori "${name}" masih digunakan oleh beberapa foto. Hapus kategori ini? Foto terkait akan tetap tersimpan.`)) {
        return;
      }
    } else {
      if (!confirm(`Hapus kategori "${name}"?`)) return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus kategori");

      showToast(`Kategori "${name}" telah dihapus.`);
      await loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kategori";
      showToast(msg, "error");
    }
  };

  // --- PACKAGE ACTIONS ---
  const handleOpenAddPackage = () => {
    setEditingPackageId(null);
    setPackageForm({
      name: "",
      price: "Rp ",
      tagline: "",
      popular: false,
      featuresText: "",
    });
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg: PackageItem) => {
    setEditingPackageId(pkg.id);
    setPackageForm({
      name: pkg.name,
      price: pkg.price,
      tagline: pkg.tagline || "",
      popular: !!pkg.popular,
      featuresText: Array.isArray(pkg.features) ? pkg.features.join("\n") : "",
    });
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.name || !packageForm.price) {
      showToast("Nama paket dan harga wajib diisi!", "error");
      return;
    }

    const featuresArray = packageForm.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      name: packageForm.name,
      price: packageForm.price,
      tagline: packageForm.tagline,
      popular: packageForm.popular,
      features: featuresArray,
    };

    try {
      if (editingPackageId) {
        const res = await fetch(`/api/packages/${editingPackageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal memperbarui paket");
        showToast("Paket harga berhasil diperbarui di Postgres!");
      } else {
        const res = await fetch("/api/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal menambahkan paket");
        showToast("Paket harga baru berhasil ditambahkan ke Postgres!");
      }

      await loadAllData();
      setIsPackageModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan paket";
      showToast(msg, "error");
    }
  };

  const handleDeletePackage = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus paket "${name}"?`)) return;

    try {
      const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus paket");

      showToast(`Paket "${name}" telah dihapus.`);
      await loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus paket";
      showToast(msg, "error");
    }
  };

  // --- ADMIN SECURITY ---
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim()) {
      showToast("Username tidak boleh kosong!", "error");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      showToast("Konfirmasi password baru tidak cocok!", "error");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      showToast("Password minimal 6 karakter!", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: adminUsername.trim(),
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui profil");
      }

      setNewPassword("");
      setConfirmPassword("");
      showToast("Kredensial admin berhasil di-hash dan disimpan di Vercel Postgres!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui password";
      showToast(msg, "error");
    }
  };

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    try {
      const res = await fetch("/api/admin/db-status");
      const data = await res.json();
      setDbStatus(data);
      if (data.connected) {
        showToast("Database Vercel Postgres terhubung & aktif!");
      } else {
        showToast(data.message || "Gagal menghubungkan ke Postgres.", "error");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengecek status DB";
      showToast(msg, "error");
    } finally {
      setIsTestingDb(false);
    }
  };

  const filteredPhotos =
    categoryFilter === "Semua"
      ? photos
      : photos.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#07080d] text-white pb-24">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-4 sm:right-8 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up border ${
            notification.type === "success"
              ? "bg-[#142318] border-emerald-500/50 text-emerald-200"
              : "bg-red-950/90 border-red-500 text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          <span className="text-sm font-semibold">{notification.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-red-500/20 bg-[#0c0e17]/95 backdrop-blur-xl sticky top-0 z-30 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-[3px] items-center">
                <div className="w-[3px] h-6 bg-[#e11d48] rounded-full"></div>
                <div className="w-[3px] h-7 bg-white rounded-full"></div>
                <div className="w-[3px] h-6 bg-[#be123c] rounded-full"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black tracking-tight text-white">
                    lensa<span className="text-red-500">.</span>arsya
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white tracking-wider">
                    Admin Subdomain
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  {session?.user?.name || "Administrator"} • Vercel Postgres Edition
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 flex items-center gap-1.5 transition-all"
              >
                <span>Website Publik</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white transition-all flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-8">
          <div className="glass-card p-4 sm:p-5 border-red-500/25">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-semibold">Total Foto Katalog</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {isLoadingData ? "..." : photos.length}
            </div>
            <div className="text-[11px] text-red-400 mt-1">Vercel Postgres</div>
          </div>

          <div className="glass-card p-4 sm:p-5 border-red-500/25">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-semibold">Kategori / Tema</span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {isLoadingData ? "..." : categories.length}
            </div>
            <div className="text-[11px] text-red-400 mt-1">Filter Dinamis</div>
          </div>

          <div className="glass-card p-4 sm:p-5 border-red-500/25">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-semibold">Paket Harga</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {isLoadingData ? "..." : packages.length}
            </div>
            <div className="text-[11px] text-red-400 mt-1">Tampil di Publik</div>
          </div>

          <div className="glass-card p-4 sm:p-5 border-red-500/25">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-semibold">Database Engine</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus?.connected ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"
                }`}
              ></span>
            </div>
            <div className="text-sm font-bold text-white mt-1.5 flex items-center gap-1.5">
              <span>{dbStatus?.connected ? "Vercel Postgres Aktif" : "Postgres Ready"}</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Drizzle ORM + NextAuth</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "photos"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Kelola Foto ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "categories"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>Kategori / Tema ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "packages"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Paket Harga ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "database"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
            <span>Vercel Postgres</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "security"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Akun Admin</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: KELOLA FOTO */}
        {/* ======================================================== */}
        {activeTab === "photos" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <button
                  onClick={() => setCategoryFilter("Semua")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    categoryFilter === "Semua" ? "bg-white text-black" : "bg-white/5 text-gray-300 hover:text-white"
                  }`}
                >
                  Semua ({photos.length})
                </button>
                {categories.map((c) => {
                  const count = photos.filter((p) => p.category.toLowerCase() === c.name.toLowerCase()).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCategoryFilter(c.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        categoryFilter === c.name ? "bg-white text-black" : "bg-white/5 text-gray-300 hover:text-white"
                      }`}
                    >
                      {c.name} ({count})
                    </button>
                  );
                })}
              </div>

              <button onClick={handleOpenAddPhoto} className="btn-primary text-xs sm:text-sm !py-2.5 !px-5 whitespace-nowrap">
                <span>+ Upload Foto Baru</span>
              </button>
            </div>

            {filteredPhotos.length === 0 ? (
              <div className="glass-card p-12 text-center border-white/10">
                <p className="text-gray-400 text-sm">Belum ada foto dalam kategori ini.</p>
                <button onClick={handleOpenAddPhoto} className="btn-primary text-xs !py-2 !px-4 mt-4">
                  <span>+ Tambah Foto Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPhotos.map((photo) => (
                  <div key={photo.id} className="glass-card overflow-hidden group border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.image_url}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-red-300 border border-red-500/30">
                          {photo.category}
                        </span>
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-gray-300">
                          Urutan: {photo.sort_order}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-white text-sm line-clamp-1 mb-1">{photo.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2">{photo.description || "Tanpa deskripsi"}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex gap-2 border-t border-white/5 mt-2">
                      <button
                        onClick={() => handleOpenEditPhoto(photo)}
                        className="flex-1 py-1.5 text-center rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id, photo.title, photo.image_url)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: KELOLA KATEGORI */}
        {/* ======================================================== */}
        {activeTab === "categories" && (
          <div className="max-w-2xl space-y-6">
            <div className="glass-card p-6 border-red-500/30">
              <h3 className="text-base font-bold text-white mb-2">Tambah Kategori / Tema Baru</h3>
              <p className="text-xs text-gray-400 mb-4">
                Kategori yang ditambahkan di sini otomatis muncul sebagai filter di galeri portofolio publik.
              </p>
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Contoh: Prewedding, Dokumentasi Event"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                />
                <button type="submit" className="btn-primary text-xs !py-2.5 !px-5 whitespace-nowrap">
                  <span>+ Tambah</span>
                </button>
              </form>
            </div>

            <div className="glass-card p-6 border-white/10">
              <h3 className="text-base font-bold text-white mb-4">Daftar Kategori Aktif</h3>
              <div className="divide-y divide-white/10">
                {categories.map((cat) => {
                  const usageCount = photos.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                  return (
                    <div key={cat.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-sm text-white">{cat.name}</span>
                        <span className="ml-2 text-xs text-gray-400">({usageCount} foto terhubung)</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="text-xs text-red-400 hover:text-red-300 px-3 py-1 rounded bg-red-950/40 border border-red-500/20 hover:border-red-500/50"
                      >
                        Hapus
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: KELOLA PAKET HARGA */}
        {/* ======================================================== */}
        {activeTab === "packages" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Daftar Paket Fotografi Publik</h2>
              <button onClick={handleOpenAddPackage} className="btn-primary text-xs sm:text-sm !py-2.5 !px-5">
                <span>+ Tambah Paket Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`glass-card p-6 flex flex-col justify-between relative ${
                    pkg.popular ? "!border-red-500/60 shadow-xl shadow-red-950/50 bg-[#19101a]" : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 pointer-events-none">
                      <span className="badge-popular !text-[11px] !whitespace-nowrap shadow-lg">
                        ★ Paling Diminati
                      </span>
                    </div>
                  )}

                  <div className={pkg.popular ? "pt-2" : ""}>
                    <div className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-1">
                      {pkg.tagline}
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">{pkg.name}</h3>
                    <div className="text-2xl font-black gradient-text mb-4">{pkg.price}</div>

                    <ul className="space-y-2 mb-6 border-t border-white/5 pt-4">
                      {Array.isArray(pkg.features) &&
                        pkg.features.map((f, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-red-400">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleOpenEditPackage(pkg)}
                      className="flex-1 py-2 text-center rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                      className="px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: VERCEL POSTGRES DATABASE MONITORING */}
        {/* ======================================================== */}
        {activeTab === "database" && (
          <div className="max-w-4xl space-y-8">
            <div className="glass-card p-6 sm:p-8 border-red-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Database Vercel Postgres</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        dbStatus?.connected ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}
                    >
                      {dbStatus?.connected ? "Connected" : "Not Initialized"}
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Powered by Neon Serverless Driver & Drizzle ORM
                  </p>
                </div>
                <button
                  onClick={handleTestDatabase}
                  disabled={isTestingDb}
                  className="btn-outline text-xs !py-2 !px-4"
                >
                  <span>{isTestingDb ? "Menghubungkan..." : "Uji Koneksi & Sync"}</span>
                </button>
              </div>

              {dbStatus?.message && (
                <div
                  className={`mb-6 p-4 rounded-xl border text-xs font-mono ${
                    dbStatus.connected
                      ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                      : "bg-yellow-950/30 border-yellow-500/30 text-yellow-200"
                  }`}
                >
                  {dbStatus.message}
                </div>
              )}

              {/* DB Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase font-semibold">Tabel Photos</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {dbStatus?.stats?.photos ?? photos.length}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Baris data</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase font-semibold">Tabel Categories</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {dbStatus?.stats?.categories ?? categories.length}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Baris data</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase font-semibold">Tabel Packages</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {dbStatus?.stats?.packages ?? packages.length}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Baris data</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase font-semibold">Tabel Users</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {dbStatus?.stats?.admins ?? 1}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Admin aktif</div>
                </div>
              </div>

              {/* Deployment Guide Info */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  <span>Petunjuk Deploy Vercel Postgres:</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Saat Anda mendeploy project ini ke Vercel:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-gray-300">
                  <li>Buka project Anda di <strong>Vercel Dashboard</strong> → tab <strong>Storage</strong>.</li>
                  <li>Pilih <strong>Create Database</strong> → <strong>Postgres</strong> (Neon).</li>
                  <li>Hubungkan database ke project (otomatis memasukkan <code className="text-white">POSTGRES_URL</code>).</li>
                  <li>Database akan otomatis membuat tabel (<code className="text-white">users</code>, <code className="text-white">photos</code>, <code className="text-white">categories</code>, <code className="text-white">packages</code>) dan auto-seed data default saat pertama kali diakses.</li>
                </ol>
              </div>
            </div>

            {/* Cloudinary Integration Info */}
            <div className="glass-card p-6 sm:p-8 border-red-500/20">
              <h2 className="text-xl font-bold text-white mb-2">Cloudinary Staged Upload (Hemat & Bersih)</h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-4">
                Sistem upload foto bekerja secara <strong>Staged Upload</strong>: file foto hanya dikirim ke Cloudinary saat Anda menekan tombol <strong>&quot;Simpan Foto&quot;</strong>. Jika form dibatalkan, foto tidak akan tersimpan di cloud storage Anda.
              </p>
              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 text-xs text-gray-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span>✓</span>
                  <span>Proteksi Penyimpanan: Bersih dari file sampah/batal simpan.</span>
                </div>
                <div className="text-gray-400">
                  Folder Cloudinary: <code className="text-white">lensa-arsya</code> di Cloud <code className="text-white">{CLOUDINARY_CLOUD_NAME}</code>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PENGATURAN AKUN ADMIN */}
        {/* ======================================================== */}
        {activeTab === "security" && (
          <div className="max-w-md">
            <div className="glass-card p-6 sm:p-8 border-red-500/30">
              <h2 className="text-xl font-bold text-white mb-1">Ganti Password Admin</h2>
              <p className="text-xs text-gray-400 mb-6">
                Perbarui username atau password login dashboard yang tersimpan di Vercel Postgres
              </p>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Username Admin
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <button type="submit" className="btn-primary w-full !py-3 text-sm font-bold mt-4">
                  <span>Simpan Perubahan Akun</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: TAMBAH / EDIT FOTO */}
      {/* ======================================================== */}
      {isPhotoModalOpen && (
        <div className="lightbox-overlay" onClick={handleClosePhotoModal}>
          <div className="relative max-w-lg w-full mx-auto my-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="glass-card p-6 sm:p-8 border-red-500/40 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-white">
                  {editingPhotoId ? "Edit Foto Katalog" : "Upload & Tambah Foto Baru"}
                </h3>
                <button
                  type="button"
                  onClick={handleClosePhotoModal}
                  className="text-gray-400 hover:text-white p-1 text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Pilih File Foto dari Perangkat
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-red-500/30 hover:border-red-500 rounded-xl p-5 text-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-red-600/20 group-hover:bg-red-600/30 flex items-center justify-center text-red-400 mb-2 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-white block">
                      Klik untuk memilih file foto
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      JPG, PNG, WebP (Maksimal 10MB)
                    </span>
                  </div>
                </div>

                {localPreviewUrl && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-black/40 overflow-hidden flex-shrink-0 border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={localPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span>✓</span> Foto Siap Diunggah
                      </div>
                      <div className="text-[11px] text-gray-300 truncate mt-0.5">
                        {selectedFile?.name || "Foto Baru"}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ""}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Atau Masukkan URL Gambar (Opsional)
                  </label>
                  <input
                    type="url"
                    value={photoForm.image_url}
                    onChange={(e) => setPhotoForm({ ...photoForm, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Judul Foto
                  </label>
                  <input
                    type="text"
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    placeholder="Contoh: Wisuda Outdoor UI"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Kategori / Tema
                    </label>
                    <select
                      value={photoForm.category}
                      onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141624] border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name} className="bg-[#141624] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Urutan Tampil
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={photoForm.sort_order}
                      onChange={(e) => setPhotoForm({ ...photoForm, sort_order: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={2}
                    value={photoForm.description}
                    onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                    placeholder="Ceritakan detail sesi atau konsep foto..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleClosePhotoModal}
                    disabled={isSavingPhoto}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPhoto}
                    className="btn-primary flex-1 !py-2.5 text-xs font-bold justify-center"
                  >
                    <span>{isSavingPhoto ? "Menyimpan ke Cloud..." : "Simpan Foto"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TAMBAH / EDIT PAKET HARGA */}
      {/* ======================================================== */}
      {isPackageModalOpen && (
        <div className="lightbox-overlay" onClick={() => setIsPackageModalOpen(false)}>
          <div className="relative max-w-lg w-full mx-auto my-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="glass-card p-6 sm:p-8 border-red-500/40 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-white">
                  {editingPackageId ? "Edit Paket Fotografi" : "Tambah Paket Harga Baru"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPackageModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Nama Paket
                    </label>
                    <input
                      type="text"
                      value={packageForm.name}
                      onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                      placeholder="Contoh: Premium"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Harga
                    </label>
                    <input
                      type="text"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                      placeholder="Rp 500.000"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Tagline Paket
                  </label>
                  <input
                    type="text"
                    value={packageForm.tagline}
                    onChange={(e) => setPackageForm({ ...packageForm, tagline: e.target.value })}
                    placeholder="Contoh: Dokumentasi Sinematik Lengkap"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Fitur & Benefit (Satu per baris)
                  </label>
                  <textarea
                    rows={4}
                    value={packageForm.featuresText}
                    onChange={(e) => setPackageForm({ ...packageForm, featuresText: e.target.value })}
                    placeholder={"semua foto via google drive\npengeditan foto lanjutan\npengiriman file digital cepat"}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="popular-pkg"
                    checked={packageForm.popular}
                    onChange={(e) => setPackageForm({ ...packageForm, popular: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-white/5 border-white/10"
                  />
                  <label htmlFor="popular-pkg" className="text-xs font-semibold text-gray-300 cursor-pointer">
                    Tandai sebagai Paket Paling Diminati (Badge Bintang)
                  </label>
                </div>

                <div className="flex gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsPackageModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn-primary flex-1 !py-2.5 text-xs font-bold justify-center">
                    <span>Simpan Paket</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
