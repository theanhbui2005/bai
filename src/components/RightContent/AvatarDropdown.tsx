import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { type ItemType } from 'antd/lib/menu/hooks/useItems';
import React from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
	menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
	const { initialState } = useModel('@@initialState');
	const { logout } = useModel('auth');

	const handleLogout = () => {
		logout();
		history.push('/user/login');
	};

	// Kiểm tra role từ localStorage
	const adminInfo = localStorage.getItem('adminInfo');
	const userInfo = localStorage.getItem('userInfo');
	
	// Nếu chưa đăng nhập
	if (!adminInfo && !userInfo) {
		return (
			<span className={`${styles.action} ${styles.account}`}>
				<Spin size='small' style={{ marginLeft: 8, marginRight: 8 }} />
			</span>
		);
	}
	
	// Lấy thông tin người dùng từ localStorage
	const userData = adminInfo ? JSON.parse(adminInfo) : JSON.parse(userInfo || '{}');
	const fullName = userData?.ho_ten || 'Người dùng';
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();
	const isAdmin = adminInfo !== null;

	const items: ItemType[] = [
		{
			key: 'name',
			icon: <UserOutlined />,
			label: fullName,
		}
	];
	
	// Nếu là admin, thêm liên kết đến trang admin
	if (isAdmin) {
		items.push({
			key: 'admin',
			icon: <UserOutlined />,
			label: 'Trang quản trị',
			onClick: () => history.push('/admin/dashboard'),
		});
	}
	
	// Thêm nút đăng xuất
	items.push(
		{ type: 'divider', key: 'divider' },
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Đăng xuất',
			onClick: handleLogout,
			danger: true,
		}
	);

	return (
		<>
			<HeaderDropdown overlay={<Menu className={styles.menu} items={items} />}>
				<span className={`${styles.action} ${styles.account}`}>
					<Avatar
						className={styles.avatar}
						icon={<UserOutlined />}
						alt='avatar'
					/>
					<span className={`${styles.name}`}>{fullName}</span>
				</span>
			</HeaderDropdown>
		</>
	);
};

export default AvatarDropdown;
