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

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},

	// Quản trị viên
	{
		path: '/admin',
		name: 'Quản trị viên',
		icon: 'UserOutlined',
		routes: [
			{
				path: '/admin/login',
				name: 'Đăng nhập',
				component: './Admin/Login',
				hideInMenu: true,
			},
			{
				path: '/admin/dashboard',
				name: 'Dashboard',
				component: './Admin/Dashboard',
				hideInMenu: true,
			},
			{
				path: '/admin/schools',
				name: 'Quản lý trường',
				component: './Admin/School',
				icon: 'BankOutlined',
				hideInMenu: true,
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
				hideInMenu: true,
			},
			{
				path: '/admin',
				redirect: '/admin/login',
			},
		],
	},
	{
		path: '/thi-sinh',
		name: 'ThiSinh',
		component: './ThiSinh',
		icon: 'ArrowsAltOutlined',
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
        path: '/ho-so',
        name: 'Hồ sơ',
        icon: 'ProfileOutlined',
        routes: [
            {
                path: '/ho-so/thong-ke',
                name: 'Thống kê hồ sơ',
                component: './HoSo/ThongKe',
                icon: 'BarChartOutlined',
            },
            {
                path: '/ho-so/tra-cuu',
                name: 'Tra cứu hồ sơ',
                component: './HoSo/TraCuu',
                icon: 'SearchOutlined',
            },
            {
                path: '/ho-so',
                redirect: '/ho-so/thong-ke',
            },
        ],
    },
	{
		path: '/',
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