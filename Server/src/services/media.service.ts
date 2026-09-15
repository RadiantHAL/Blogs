import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export const convertImageToWebP = async (
  buffer: Buffer
): Promise<Buffer> => {
  return await sharp(buffer)
    .webp({ quality: 80 })
    .toBuffer();
};

export const convertVideoToWebM = async (
  buffer: Buffer
): Promise<Buffer> => {
  const inputPath = path.join(
    "/tmp",
    `input-${Date.now()}.video`
  );

  const outputPath = path.join(
    "/tmp",
    `output-${Date.now()}.webm`
  );

  await fs.writeFile(inputPath, buffer);

  await execFileAsync("ffmpeg", [
    "-i",
    inputPath,
    "-c:v",
    "libvpx-vp9",
    "-c:a",
    "libopus",
    "-crf",
    "30",
    "-b:v",
    "0",
    "-y",
    outputPath,
  ]);

  const outputBuffer = await fs.readFile(outputPath);

  await fs.unlink(inputPath);
  await fs.unlink(outputPath);

  return outputBuffer;
};