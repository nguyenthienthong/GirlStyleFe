import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawImage = body.image || body.imageBase64;
    const rawFileName = body.fileName || body.filename || 'uploaded_image';

    if (!rawImage) {
      return NextResponse.json(
        { success: false, message: 'Thiếu dữ liệu tệp hình ảnh Base64' },
        { status: 400 }
      );
    }

    let base64Data = rawImage;
    let ext = 'jpg';

    if (rawImage.includes(';base64,')) {
      const parts = rawImage.split(';base64,');
      base64Data = parts[1];
      const match = parts[0].match(/data:image\/([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      }
    }

    const cleanName = rawFileName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
    const finalFilename = `${cleanName}_${Date.now()}.${ext}`;

    const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, finalFilename);
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${finalFilename}`;

    console.log(`[Upload Success] File written to ${filePath} -> Served at ${imageUrl}`);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      imageUrl: imageUrl,
      filename: finalFilename
    });
  } catch (err: any) {
    console.error('[Upload Error]', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
