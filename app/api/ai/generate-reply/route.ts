import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { customerName, message, type } = await request.json();

    const sampleReplies = [
      `Dạ GirlStyle xin chào ${customerName || 'Chị'} ạ! Cảm ơn chị đã góp ý về "${type || 'dịch vụ'}". Shop đã ghi nhận thông tin: "${message}" và sẽ hỗ trợ ngay cho chị ạ ❤️`,
      `Chào ${customerName || 'bạn'} yêu! GirlStyle rất trân trọng phản hồi của bạn. Đội ngũ CSKH đã chuẩn bị món quà tri ân gửi đến bạn trong đơn hàng tiếp theo nhé! ✨`
    ];

    const reply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];
    return NextResponse.json({ success: true, reply });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
