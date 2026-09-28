"use client";

import { Category, PackageItem, Photo, AdminUser } from "./types";
import {
  DEFAULT_ADMIN,
  INITIAL_CATEGORIES,
  INITIAL_PACKAGES,
  INITIAL_PHOTOS,
  SHEETDB_API_URL,
} from "./constants";

const STORAGE_KEYS = {
  PHOTOS: "lensa_photos_data",
  CATEGORIES: "lensa_categories_data",
  PACKAGES: "lensa_packages_data",
  ADMIN: "lensa_admin_user",
  AUTH_SESSION: "lensa_admin_logged_in",
};

// --- AUTH HELPER ---
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === "true";
}

export function setAdminSession(loggedIn: boolean): void {
  if (typeof window === "undefined") return;
  if (loggedIn) {
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, "true");
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }
}

export function getAdminCredentials(): AdminUser {
  if (typeof window === "undefined") return DEFAULT_ADMIN;
  const saved = localStorage.getItem(STORAGE_KEYS.ADMIN);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_ADMIN;
    }
  }
  return DEFAULT_ADMIN;
}

export function saveAdminCredentials(user: AdminUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(user));
}

// --- PHOTOS ---
export function getStoredPhotos(): Photo[] {
  if (typeof window === "undefined") return INITIAL_PHOTOS;
  const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PHOTOS;
    }
  }
  return INITIAL_PHOTOS;
}
export const getPhotos = getStoredPhotos;

export function saveStoredPhotos(photos: Photo[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
}
export const savePhotos = saveStoredPhotos;

// --- CATEGORIES ---
export function getStoredCategories(): Category[] {
  if (typeof window === "undefined") return INITIAL_CATEGORIES;
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }
  return INITIAL_CATEGORIES;
}
export const getCategories = getStoredCategories;

export function saveStoredCategories(categories: Category[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}
export const saveCategories = saveStoredCategories;

// --- PACKAGES ---
export function getStoredPackages(): PackageItem[] {
  if (typeof window === "undefined") return INITIAL_PACKAGES;
  const data = localStorage.getItem(STORAGE_KEYS.PACKAGES);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PACKAGES;
    }
  }
  return INITIAL_PACKAGES;
}
export const getPackages = getStoredPackages;

export function saveStoredPackages(packages: PackageItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
}
export const savePackages = saveStoredPackages;

// --- SHEETDB SYNC HELPERS (Optional Background Sync) ---
export async function testSheetDbConnection(): Promise<{ ok: boolean; message: string; sheets?: string[] }> {
  try {
    const res = await fetch(`${SHEETDB_API_URL}`, { method: "GET" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, message: err.error || "Gagal menghubungkan ke SheetDB" };
    }
    const data = await res.json();
    return { ok: true, message: "Koneksi SheetDB berhasil!", sheets: Array.isArray(data) ? ["Aktif"] : [] };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Tidak dapat mengakses SheetDB";
    return { ok: false, message: msg };
  }
}
