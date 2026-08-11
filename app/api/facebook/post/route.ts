import { NextResponse } from 'next/server';
import { publishToFacebookPage } from '../../../../lib/services/facebookService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.body) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập Tiêu đề và Nội dung bài viết!' }, { status: 400 });
    }

    const result = await publishToFacebookPage({
      title: body.title,
      body: body.body,
      imageUrl: body.imageUrl,
      linkUrl: body.linkUrl
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
