/**
 * Mail service - Dịch vụ gửi email
<<<<<<< HEAD
 * Hiện tại là giả lập bằng console.log, có thể mở rộng để dùng EmailJS hoặc dịch vụ email khác
 */
=======
 * Dùng EmailJS để gửi email thực sự đến người dùng
 */
import emailjs from '@emailjs/browser';

// ID dịch vụ EmailJS mặc định (có thể thay thế từ localStorage)
let SERVICE_ID = 'default_service';
let TEMPLATE_ID_APPROVAL = 'approval_template';
let TEMPLATE_ID_REJECTION = 'rejection_template';
let EMAILJS_USER_ID = ''; // Sẽ được lấy từ localStorage
>>>>>>> theanh2

// Interface cho email
export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

<<<<<<< HEAD
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
=======
// Interface cho cấu hình EmailJS
export interface EmailJSConfig {
  user_id: string;
  service_id: string;
  template_id_approval: string;
  template_id_rejection: string;
}

/**
 * Đọc cấu hình EmailJS từ localStorage
 * @returns EmailJSConfig Cấu hình EmailJS
 */
export const getEmailJSConfig = (): EmailJSConfig | null => {
  try {
    const config = localStorage.getItem('emailjs_settings');
    if (config) {
      const parsedConfig = JSON.parse(config);
      return {
        user_id: parsedConfig.user_id,
        service_id: parsedConfig.service_id,
        template_id_approval: parsedConfig.template_id_approval,
        template_id_rejection: parsedConfig.template_id_rejection
      };
    }
  } catch (error) {
    console.error('Lỗi khi đọc cấu hình EmailJS:', error);
  }
  return null;
};

/**
 * Cập nhật biến cấu hình với giá trị từ localStorage
 */
const updateConfigFromStorage = (): void => {
  const config = getEmailJSConfig();
  if (config) {
    EMAILJS_USER_ID = config.user_id;
    SERVICE_ID = config.service_id;
    TEMPLATE_ID_APPROVAL = config.template_id_approval;
    TEMPLATE_ID_REJECTION = config.template_id_rejection;
  }
};

/**
 * Khởi tạo EmailJS
 * Cần gọi hàm này trước khi sử dụng các dịch vụ email
 */
export const initEmailService = (userId?: string): void => {
  // Cập nhật từ localStorage nếu không cung cấp userId cụ thể
  if (!userId) {
    updateConfigFromStorage();
    // eslint-disable-next-line no-param-reassign
    userId = EMAILJS_USER_ID;
  }

  try {
    if (userId) {
      // Khởi tạo EmailJS với user ID
      emailjs.init(userId);
      console.log('EmailJS đã được khởi tạo với ID:', userId);
    } else {
      console.warn('Không thể khởi tạo EmailJS: User ID không được cung cấp');
    }
  } catch (error) {
    console.error('Lỗi khi khởi tạo EmailJS:', error);
  }
};

/**
 * Gửi email với EmailJS
 * @param options Thông tin email cần gửi
 * @returns Promise<boolean> Kết quả gửi email
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  const { to, subject, body } = options;
  
  // Đảm bảo cấu hình được cập nhật
  updateConfigFromStorage();
  
  // Kiểm tra cấu hình
  if (!EMAILJS_USER_ID) {
    console.error('Chưa cấu hình EmailJS!');
    
    // Ghi log nội dung email
    console.log('=============================================');
    console.log(`LỖI - chưa cấu hình EmailJS!`);
    console.log(`Gửi tới: ${to}`);
    console.log(`Chủ đề: ${subject}`);
    console.log(`Nội dung:\n${body}`);
    console.log('=============================================');
    
    return false;
  }
  
  try {
    // Gửi email với EmailJS
    const result = await emailjs.send(
      SERVICE_ID,
      'template_general', // Template chung
      {
        to_email: to,
        subject: subject,
        message: body,
      }
    );
    
    // Vẫn giữ log để theo dõi
    console.log('=============================================');
    console.log(`Đã gửi email tới: ${to}`);
    console.log(`Chủ đề: ${subject}`);
    console.log(`ID phản hồi: ${result.text}`);
    console.log('=============================================');
    
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    
    // Ghi log nội dung email nếu gửi thất bại
    console.log('=============================================');
    console.log(`LỖI - không gửi được email tới: ${to}`);
    console.log(`Chủ đề: ${subject}`);
    console.log(`Nội dung:\n${body}`);
    console.log('=============================================');
    
    return false;
  }
>>>>>>> theanh2
};

/**
 * Gửi email thông báo duyệt hồ sơ
 * @param email Email người nhận
 * @param name Tên người nhận
 * @param schoolName Tên trường
 * @param majorName Tên ngành
 * @param score Điểm thi
 * @param note Ghi chú (nếu có)
<<<<<<< HEAD
 * @returns boolean Kết quả gửi email
 */
export const sendApprovalEmail = (
=======
 * @returns Promise<boolean> Kết quả gửi email
 */
export const sendApprovalEmail = async (
>>>>>>> theanh2
  email: string,
  name: string,
  schoolName: string,
  majorName: string,
  score: number,
  note: string = ''
<<<<<<< HEAD
): boolean => {
  return sendEmail({
    to: email,
    subject: `Chúc mừng! Hồ sơ xét tuyển của bạn đã được chấp nhận`,
    body: `Kính gửi ${name},
=======
): Promise<boolean> => {
  // Đảm bảo cấu hình được cập nhật
  updateConfigFromStorage();
  console.log('Đang gửi email thông báo chấp nhận hồ sơ với template:', TEMPLATE_ID_APPROVAL);
  
  try {
    // Gửi email với template duyệt hồ sơ
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_APPROVAL,
      {
        to_email: email,
        to_name: name,
        school_name: schoolName,
        major_name: majorName,
        score: score.toString(),
        note: note || 'Không có',
      }
    );
    
    // Ghi log
    console.log('=============================================');
    console.log(`Đã gửi email DUYỆT HỒ SƠ tới: ${email}`);
    console.log(`Tên người nhận: ${name}`);
    console.log(`Trường: ${schoolName}, Ngành: ${majorName}`);
    console.log(`ID phản hồi: ${result.text}`);
    console.log('=============================================');
    
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email duyệt hồ sơ:', error);
    
    // Fallback: Gửi bằng phương thức thông thường
    return sendEmail({
      to: email,
      subject: `Chúc mừng! Hồ sơ xét tuyển của bạn đã được chấp nhận`,
      body: `Kính gửi ${name},
>>>>>>> theanh2

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
<<<<<<< HEAD
  });
=======
    });
  }
>>>>>>> theanh2
};

/**
 * Gửi email thông báo từ chối hồ sơ
 * @param email Email người nhận
 * @param name Tên người nhận
 * @param schoolName Tên trường
 * @param majorName Tên ngành
 * @param score Điểm thi
 * @param reason Lý do từ chối
<<<<<<< HEAD
 * @returns boolean Kết quả gửi email
 */
export const sendRejectionEmail = (
=======
 * @returns Promise<boolean> Kết quả gửi email
 */
export const sendRejectionEmail = async (
>>>>>>> theanh2
  email: string,
  name: string,
  schoolName: string,
  majorName: string,
  score: number,
  reason: string = ''
<<<<<<< HEAD
): boolean => {
  return sendEmail({
    to: email,
    subject: `Thông báo về kết quả xét tuyển của bạn`,
    body: `Kính gửi ${name},
=======
): Promise<boolean> => {
  // Đảm bảo cấu hình được cập nhật
  updateConfigFromStorage();
  console.log('Đang gửi email thông báo từ chối hồ sơ với template:', TEMPLATE_ID_REJECTION);
  
  try {
    // Gửi email với template từ chối hồ sơ
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_REJECTION,
      {
        to_email: email,
        to_name: name,
        school_name: schoolName,
        major_name: majorName,
        score: score.toString(),
        reason: reason || 'Điểm không đủ để trúng tuyển',
      }
    );
    
    // Ghi log
    console.log('=============================================');
    console.log(`Đã gửi email TỪ CHỐI HỒ SƠ tới: ${email}`);
    console.log(`Tên người nhận: ${name}`);
    console.log(`Trường: ${schoolName}, Ngành: ${majorName}`);
    console.log(`Lý do: ${reason || 'Không có thông tin cụ thể'}`);
    console.log(`ID phản hồi: ${result.text}`);
    console.log('=============================================');
    
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi email từ chối hồ sơ:', error);
    
    // Fallback: Gửi bằng phương thức thông thường
    return sendEmail({
      to: email,
      subject: `Thông báo về kết quả xét tuyển của bạn`,
      body: `Kính gửi ${name},
>>>>>>> theanh2

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
<<<<<<< HEAD
  });
=======
    });
  }
>>>>>>> theanh2
}; 