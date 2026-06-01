import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

type SaveLocalFileInput = {
  buffer: Buffer;
  originalname: string;
  folder?: string; // default: public/uploads
};

const ensureDir = async (dirPath: string) => {
  await fs.promises.mkdir(dirPath, { recursive: true });
};

const safeExt = (originalname: string) => {
  const ext = path.extname(originalname).toLowerCase();
  return ext || ".png";
};

const uniqueName = (ext: string) => {
  const id = crypto.randomBytes(16).toString("hex");
  return `${Date.now()}-${id}${ext}`;
};

export const saveLocalImage = async ({
  buffer,
  originalname,
  folder,
}: SaveLocalFileInput): Promise<{ url: string; absolutePath: string }> => {
  const baseDir = folder ?? path.join(process.cwd(), "public", "uploads");
  await ensureDir(baseDir);

  const filename = uniqueName(safeExt(originalname));
  const absolutePath = path.join(baseDir, filename);

  const readStream = Readable.from(buffer);
  const writeStream = fs.createWriteStream(absolutePath);

  await pipeline(readStream, writeStream);

  
  return { url: `/uploads/${filename}`, absolutePath };
};

export const deleteLocalFileByUrl = async (fileUrl?: string | null) => {
  if (!fileUrl) return;

  
  if (!fileUrl.startsWith("/uploads/")) return;

  const absolutePath = path.join(process.cwd(), "public", fileUrl);
  try {
    await fs.promises.unlink(absolutePath);
  } catch (err: any) {
    
    if (err?.code !== "ENOENT") throw err;
  }
};
