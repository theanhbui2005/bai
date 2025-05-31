/**
 * Mail service - Dịch vụ gửi email
 * Hiện tại là giả lập bằng console.log, có thể mở rộng để dùng EmailJS hoặc dịch vụ email khác
 */

// Interface cho email
export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

/**
 * Gửi email (hiện tại là giả lập)
 * @param options Thông tin email cần gửi
 * @returns boolean Kết quả gửi email
 */
export const sendEmail = (options: EmailOptions): boolean => {
  const { to, subject, body } = options;
  
  console.log('=============================================');
  console.log(`Gửi email tới: ${to}`);
  console.log(`Chủ đề: ${subject}`);
  console.log(`Nội dung:\n${body}`);
  console.log('=============================================');
  
  return true;
};

/**
 * Gửi email thông báo duyệt hồ sơ
 * @param email Email người nhận
 * @param name Tên người nhận
 * @param schoolName Tên trường
 * @param majorName Tên ngành
 * @param score Điểm thi
 * @param note Ghi chú (nếu có)
 * @returns boolean Kết quả gửi email
 */
export const sendApprovalEmail = (
  email: string,
  name: string,
  schoolName: string,
  majorName: string,
  score: number,
  note: string = ''
): boolean => {
  return sendEmail({
    to: email,
    subject: `Chúc mừng! Hồ sơ xét tuyển của bạn đã được chấp nhận`,
    body: `Kính gửi ${name},

Chúc mừng bạn đã được chấp nhận vào ngành ${majorName} của ${schoolName}.

Thông tin chi tiết:
- Họ tên: ${name}
- Ngành: ${majorName}
- Trường: ${schoolName}
- Điểm thi: ${score}

Ghi chú: ${note || 'Không có'}

Xin chúc mừng và hoan nghênh bạn gia nhập trường chúng tôi!

Trân trọng,
Ban tuyển sinh`
  });
};

/**
 * Gửi email thông báo từ chối hồ sơ
 * @param email Email người nhận
 * @param name Tên người nhận
 * @param schoolName Tên trường
 * @param majorName Tên ngành
 * @param score Điểm thi
 * @param reason Lý do từ chối
 * @returns boolean Kết quả gửi email
 */
export const sendRejectionEmail = (
  email: string,
  name: string,
  schoolName: string,
  majorName: string,
  score: number,
  reason: string = ''
): boolean => {
  return sendEmail({
    to: email,
    subject: `Thông báo về kết quả xét tuyển của bạn`,
    body: `Kính gửi ${name},

Chúng tôi rất tiếc phải thông báo rằng hồ sơ xét tuyển của bạn vào ngành ${majorName} của ${schoolName} đã không được chấp nhận.

Thông tin chi tiết:
- Họ tên: ${name}
- Ngành: ${majorName}
- Trường: ${schoolName}
- Điểm thi: ${score}

Lý do: ${reason || 'Không có thông tin cụ thể'}

Chúng tôi chân thành cảm ơn sự quan tâm của bạn đến trường chúng tôi và chúc bạn may mắn trong tương lai.

Trân trọng,
Ban tuyển sinh`
  });
}; 