export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	{
		path: '/student',
		name: 'Thí sinh',
		icon: 'UserOutlined',
		access: 'studentOnly',
		routes: [
			{
				path: '/student/profile',
				name: 'Thông tin hồ sơ',
				component: './Student',
				icon: 'ProfileOutlined',
			},
			{
				path: '/student',
				redirect: '/student/profile',
			},
		],
	},

	// Quản trị viên
	{
		path: '/admin',
		name: 'Quản trị viên',
		icon: 'UserOutlined',
		access: 'adminOnly',
		routes: [
			{
				path: '/admin/dashboard',
				name: 'Dashboard',
				component: './Admin/Dashboard',
			},
			{
				path: '/admin/schools',
				name: 'Quản lý trường',
				component: './Admin/School',
				icon: 'BankOutlined',
			},
			{
				path: '/admin/schools/:id',
				name: 'Chi tiết trường',
				component: './Admin/School/SchoolDetail',
				hideInMenu: true,
			},
			{
				path: '/admin/applications',
				name: 'Quản lý hồ sơ',
				component: './Admin/Application',
				icon: 'FileOutlined',
			},
			{
				path: '/admin/email-settings',
				name: 'Cấu hình email',
				component: './Admin/EmailSettings',
				icon: 'MailOutlined',
			},
			{
				path: '/admin',
				redirect: '/admin/dashboard',
			},
		],
	},



	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
		redirect: '/user/login',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];