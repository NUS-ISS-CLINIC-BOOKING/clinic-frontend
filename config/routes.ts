export default [
  // {
  //   path: '/user',
  //   layout: false,
  //   routes: [
  //     {
  //       path: '/user', routes: [
  //         {name: '登录', path: '/user/login', component: './user/Login'},
  //         {name: '注册', path: '/user/register', component: './user/Register'},
  //         {name: '填写健康信息', path: '/user/health_info/:userId', component: './user/HealthInfo'}
  //       ]
  //     },
  //     {component: './404'},
  //   ],
  // },
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './user/Login' },
      { name: '注册', path: '/user/register', component: './user/Register' },
      { name: '填写健康信息', path: '/user/health_info/:userId', component: './user/HealthInfo' },
      { component: './404' }
    ]
  },
  {
    path: '/user/health_info/:userId',
    component: './user/HealthInfo',
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  //clinic routes
  {
    path: '/clinic/all',
    name: 'Clinic Info',
    icon: 'medicineBox', // 可选一个图标
    component: './clinic/all',
  },
  {
    path: '/clinic/:clinicId/specialtyList',
    component: './clinic/specialtyList/index',
  },
  //queue routes
  {
    path: '/queue/clinicSpecialtyDoctor/:clinicId/:specialty',
    component: './queue/clinicSpecialtyDoctor/index',
  },

  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
