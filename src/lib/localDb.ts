import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { Category, PackageItem, Photo, SiteSettings, AddonItem } from "./types";
import { INITIAL_CATEGORIES, INITIAL_PACKAGES, INITIAL_PHOTOS, DEFAULT_HERO_BG_URL, INITIAL_ADDONS } from "./constants";

export interface LocalDbData {
  photos: Photo[];
  categories: Category[];
  packages: PackageItem[];
  addons?: AddonItem[];
  settings?: SiteSettings;
  admin: {
    username: string;
    passwordHash: string;
    name: string;
    email: string;
  };
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "local-db.json");

let memoryCache: LocalDbData | null = null;

async function getInitialData(): Promise<LocalDbData> {
  const defaultPasswordHash = await bcrypt.hash("lensaarsya2026", 10);
  return {
    photos: [...INITIAL_PHOTOS],
    categories: [...INITIAL_CATEGORIES],
    packages: [...INITIAL_PACKAGES],
    addons: [...INITIAL_ADDONS],
    settings: {
      hero_bg_url: DEFAULT_HERO_BG_URL,
    },
    admin: {
      username: "admin",
      passwordHash: defaultPasswordHash,
      name: "Admin Lensa Arsya",
      email: "crewlensaarsya@gmail.com",
    },
  };
}

export async function readLocalDb(): Promise<LocalDbData> {
  if (memoryCache) return memoryCache;

  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    const content = await fs.readFile(DB_FILE, "utf-8");
    memoryCache = JSON.parse(content);
    return memoryCache!;
  } catch {
    const initial = await getInitialData();
    memoryCache = initial;
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    } catch (e) {
      console.error("Gagal menulis file local-db.json:", e);
    }
    return initial;
  }
}

export async function writeLocalDb(data: LocalDbData): Promise<void> {
  memoryCache = data;
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Gagal menyimpan ke local-db.json:", err);
  }
}

// ================= PHOTOS =================
export async function getLocalPhotos(): Promise<Photo[]> {
  const db = await readLocalDb();
  return [...db.photos].sort((a, b) => (a.sort_order || 1) - (b.sort_order || 1));
}

export async function addLocalPhoto(photoData: {
  title: string;
  description?: string;
  image_url: string;
  category: string;
  sort_order?: number;
}): Promise<Photo> {
  const db = await readLocalDb();
  const newPhoto: Photo = {
    id: `photo-${Date.now()}`,
    title: photoData.title.trim(),
    description: photoData.description?.trim() || "",
    image_url: photoData.image_url.trim(),
    category: photoData.category.trim(),
    sort_order: Number(photoData.sort_order) || 1,
    created_at: new Date().toISOString(),
  };

  db.photos.push(newPhoto);
  await writeLocalDb(db);
  return newPhoto;
}

export async function updateLocalPhoto(
  id: string,
  updateData: {
    title: string;
    description?: string;
    image_url: string;
    category: string;
    sort_order?: number;
  }
): Promise<boolean> {
  const db = await readLocalDb();
  const index = db.photos.findIndex((p) => p.id === id);
  if (index === -1) return false;

  db.photos[index] = {
    ...db.photos[index],
    title: updateData.title.trim(),
    description: updateData.description?.trim() || "",
    image_url: updateData.image_url.trim(),
    category: updateData.category.trim(),
    sort_order: Number(updateData.sort_order) || 1,
  };

  await writeLocalDb(db);
  return true;
}

export async function deleteLocalPhoto(id: string): Promise<boolean> {
  const db = await readLocalDb();
  const initialLen = db.photos.length;
  db.photos = db.photos.filter((p) => p.id !== id);
  if (db.photos.length === initialLen) return false;

  await writeLocalDb(db);
  return true;
}

// ================= CATEGORIES =================
export async function getLocalCategories(): Promise<Category[]> {
  const db = await readLocalDb();
  return db.categories;
}

export async function addLocalCategory(name: string): Promise<Category> {
  const db = await readLocalDb();
  const trimmed = name.trim();
  const existing = db.categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing;

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: trimmed,
  };
  db.categories.push(newCat);
  await writeLocalDb(db);
  return newCat;
}

export async function deleteLocalCategory(id: string): Promise<boolean> {
  const db = await readLocalDb();
  const initialLen = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id);
  if (db.categories.length === initialLen) return false;

  await writeLocalDb(db);
  return true;
}

// ================= PACKAGES =================
export async function getLocalPackages(): Promise<PackageItem[]> {
  const db = await readLocalDb();
  return db.packages;
}

export async function addLocalPackage(pkgData: {
  name: string;
  price: string;
  tagline?: string;
  popular?: boolean;
  features: string[];
}): Promise<PackageItem> {
  const db = await readLocalDb();
  const newPkg: PackageItem = {
    id: `pkg-${Date.now()}`,
    name: pkgData.name.trim(),
    price: pkgData.price.trim(),
    tagline: pkgData.tagline?.trim() || "",
    popular: Boolean(pkgData.popular),
    features: Array.isArray(pkgData.features) ? pkgData.features : [],
  };

  db.packages.push(newPkg);
  await writeLocalDb(db);
  return newPkg;
}

export async function updateLocalPackage(
  id: string,
  pkgData: {
    name: string;
    price: string;
    tagline?: string;
    popular?: boolean;
    features: string[];
  }
): Promise<boolean> {
  const db = await readLocalDb();
  const index = db.packages.findIndex((p) => p.id === id);
  if (index === -1) return false;

  db.packages[index] = {
    ...db.packages[index],
    name: pkgData.name.trim(),
    price: pkgData.price.trim(),
    tagline: pkgData.tagline?.trim() || "",
    popular: Boolean(pkgData.popular),
    features: Array.isArray(pkgData.features) ? pkgData.features : [],
  };

  await writeLocalDb(db);
  return true;
}

export async function deleteLocalPackage(id: string): Promise<boolean> {
  const db = await readLocalDb();
  const initialLen = db.packages.length;
  db.packages = db.packages.filter((p) => p.id !== id);
  if (db.packages.length === initialLen) return false;

  await writeLocalDb(db);
  return true;
}

// ================= ADMIN PROFILE =================
export async function getLocalAdminProfile(): Promise<{ username: string; name: string; email: string }> {
  const db = await readLocalDb();
  return {
    username: db.admin.username,
    name: db.admin.name,
    email: db.admin.email,
  };
}

export async function updateLocalAdminProfile(username?: string, newPassword?: string): Promise<boolean> {
  const db = await readLocalDb();
  if (username && username.trim()) {
    db.admin.username = username.trim();
  }
  if (newPassword && newPassword.length >= 6) {
    db.admin.passwordHash = await bcrypt.hash(newPassword, 10);
  }
  await writeLocalDb(db);
  return true;
}

export async function verifyLocalAdminPassword(password: string): Promise<boolean> {
  const db = await readLocalDb();
  if (!db.admin.passwordHash) return password === "lensaarsya2026";
  return bcrypt.compare(password, db.admin.passwordHash);
}

// ================= STATS =================
export async function getLocalDbStats() {
  const db = await readLocalDb();
  return {
    photos: db.photos.length,
    categories: db.categories.length,
    packages: db.packages.length,
    addons: db.addons ? db.addons.length : INITIAL_ADDONS.length,
    admins: 1,
  };
}

// ================= SETTINGS =================
export async function getLocalSettings(): Promise<SiteSettings> {
  const db = await readLocalDb();
  if (!db.settings || !db.settings.hero_bg_url) {
    db.settings = { hero_bg_url: DEFAULT_HERO_BG_URL };
    await writeLocalDb(db);
  }
  return db.settings;
}

export async function updateLocalSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = await readLocalDb();
  db.settings = {
    hero_bg_url: newSettings.hero_bg_url?.trim() || db.settings?.hero_bg_url || DEFAULT_HERO_BG_URL,
  };
  await writeLocalDb(db);
  return db.settings;
}

// ================= ADDONS =================
export async function getLocalAddons(): Promise<AddonItem[]> {
  const db = await readLocalDb();
  if (!db.addons || !Array.isArray(db.addons) || db.addons.length === 0) {
    db.addons = [...INITIAL_ADDONS];
    await writeLocalDb(db);
  }
  return db.addons;
}

export async function addLocalAddon(data: { name: string; price: string; desc?: string }): Promise<AddonItem> {
  const db = await readLocalDb();
  if (!db.addons) db.addons = [...INITIAL_ADDONS];

  const newAddon: AddonItem = {
    id: `addon-${Date.now()}`,
    name: data.name.trim(),
    price: data.price.trim(),
    desc: data.desc?.trim() || "",
  };

  db.addons.push(newAddon);
  await writeLocalDb(db);
  return newAddon;
}

export async function updateLocalAddon(
  id: string,
  data: { name: string; price: string; desc?: string }
): Promise<boolean> {
  const db = await readLocalDb();
  if (!db.addons) db.addons = [...INITIAL_ADDONS];

  const index = db.addons.findIndex((a) => a.id === id);
  if (index === -1) return false;

  db.addons[index] = {
    ...db.addons[index],
    name: data.name.trim(),
    price: data.price.trim(),
    desc: data.desc?.trim() || "",
  };

  await writeLocalDb(db);
  return true;
}

export async function deleteLocalAddon(id: string): Promise<boolean> {
  const db = await readLocalDb();
  if (!db.addons) db.addons = [...INITIAL_ADDONS];

  const initialLen = db.addons.length;
  db.addons = db.addons.filter((a) => a.id !== id);
  if (db.addons.length === initialLen) return false;

  await writeLocalDb(db);
  return true;
}


