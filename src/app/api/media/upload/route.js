import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { appConfig } from "@/config/app";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const tempFilePath = join("/tmp", `${randomUUID()}-${file.name}`);
  await writeFile(tempFilePath, buffer);

  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: appConfig.cloudinary.folderName,
    });

    return new Response(
      JSON.stringify({ url: result.secure_url, public_id: result.public_id }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
