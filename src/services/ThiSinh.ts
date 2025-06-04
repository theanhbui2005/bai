// Nếu bạn gặp lỗi "Cannot find module '../../utils/request'", bạn cần tạo file sau:
// d:\code\base-web-umi\utils\request.ts
// hoặc kiểm tra lại đường dẫn import cho phù hợp với cấu trúc thư mục dự án của bạn.

import request from "@/utils/request";

export async function getThiSinhData(): Promise<API.ThiSinhResponse> {
	return request('/api/thisinh');
}

export async function submitHoSo(data: API.ThiSinh): Promise<API.ThiSinhResponse> {
	return request('/api/thisinh', {
		method: 'POST',
		data,
	});
}
