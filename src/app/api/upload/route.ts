import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CLOUD_NAME = "ihfrcyan";
const API_KEY = "579251134143585";
const API_SECRET = "BmZI37AVN3AcZK8RhGL0wN1LJpo";
const FOLDER = "lensa-arsya";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File foto tidak ditemukan." },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // Generate Cloudinary signature
    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = `folder=${FOLDER}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    // Send payload to Cloudinary
    const uploadBody = new FormData();
    uploadBody.append("file", base64Data);
    uploadBody.append("api_key", API_KEY);
    uploadBody.append("timestamp", timestamp.toString());
    uploadBody.append("folder", FOLDER);
    uploadBody.append("signature", signature);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadBody,
      }
    );

    const data = await cloudRes.json();

    if (!cloudRes.ok || data.error) {
      return NextResponse.json(
        { success: false, error: data.error?.message || "Gagal mengunggah ke Cloudinary." },
        { status: cloudRes.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.secure_url,
      public_id: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan internal server";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return NextResponse.json(
        { success: false, error: "public_id foto diperlukan." },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = `public_id=${public_id}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    const deleteBody = new FormData();
    deleteBody.append("public_id", public_id);
    deleteBody.append("api_key", API_KEY);
    deleteBody.append("timestamp", timestamp.toString());
    deleteBody.append("signature", signature);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        body: deleteBody,
      }
    );

    const data = await cloudRes.json();

    return NextResponse.json({
      success: true,
      result: data.result,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus file dari Cloudinary";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
