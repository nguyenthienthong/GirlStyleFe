import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { imageBase64, filename } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ success: false, message: 'Thiếu dữ liệu ảnh Base64' }, { status: 400 });
    }

    const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ success: false, message: 'Định dạng Base64 không hợp lệ' }, { status: 400 });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const dataBuffer = Buffer.from(matches[2], 'base64');

    const cleanName = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '_') : 'img';
    const finalFilename = `${cleanName}_${Date.now()}.${ext}`;

    const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, finalFilename);
    fs.writeFileSync(filePath, dataBuffer);

    const imageUrl = `/uploads/${finalFilename}`;
    return NextResponse.json({ success: true, imageUrl, filename: finalFilename });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
