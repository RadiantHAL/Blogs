import ImageKit from "@imagekit/nodejs";

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

export const uploadToImageKit = async (
  buffer: Buffer,
  fileName: string,
  mimeType: string
) => {
  if (!buffer) {
    throw new Error("File buffer is required");
  }

  const result = await imageKit.files.upload({
    file: buffer.toString("base64"),
    fileName,
    folder: "/blogs",
    useUniqueFileName: true,
  });

  return {
    url: result.url,
    fileId: result.fileId,
    name: result.name,
    mimeType,
  };
};