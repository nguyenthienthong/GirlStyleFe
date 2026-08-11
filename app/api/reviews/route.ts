import { NextResponse } from 'next/server';

export async function GET() {
  const reviews = [
    {
      id: 'rev_1',
      customerName: 'Minh Anh',
      role: 'Khách hàng VIP Hà Nội',
      comment: 'Váy lên phom cực chuẩn, chất vải lụa tơ tằm mềm mịn và mát vô cùng. Giao hàng hoả tốc rất nhanh!',
      rating: 5,
      tryOnPhoto: '/products/silk_cocktail_dress.jpg'
    },
    {
      id: 'rev_2',
      customerName: 'Thanh Hằng',
      role: 'Khách hàng TP.HCM',
      comment: 'Set dạ Tweed phom may cao cấp cực tôn dáng. Mặc đi sự kiện ai cũng khen hết lời luôn 💖',
      rating: 5,
      tryOnPhoto: '/products/tweed_suit_set.jpg'
    },
    {
      id: 'rev_3',
      customerName: 'Khánh Linh',
      role: 'Khách hàng Đà Nẵng',
      comment: 'Dịch vụ tư vấn AI của GirlStyle chọn size chuẩn 100%. Áo Voil tơ mặc rất sang và thanh lịch.',
      rating: 5,
      tryOnPhoto: '/products/korean_voile_top.jpg'
    }
  ];

  return NextResponse.json({ success: true, reviews });
}
