import fs from "fs";
import path from "path";
import type { Request, Response } from "express";
import AppError from "../../errorHelper/AppError.js";
import { StatusCodes } from "http-status-codes";

const uploadDir = path.resolve("./public/uploads");

const getImagePath = (filename: string): string => {
  // ✅ prevent directory traversal
  const safeName = path.basename(filename);
  return path.join(uploadDir, safeName);
};

const getMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();

  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };

  return map[ext] || "application/octet-stream";
};

const streamImage = async (req: Request, res: Response, filename: string) => {
  const filePath = getImagePath(filename);

  if (!fs.existsSync(filePath)) {
    throw new AppError(StatusCodes.NOT_FOUND, "Image not found");
  }

  const stat = await fs.promises.stat(filePath);
  const fileSize = stat.size;

  const range = req.headers.range;

  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0] as string, 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": getMimeType(filePath),
    });

    stream.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": getMimeType(filePath),
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }
};

export const imageService = {
  streamImage,
};
