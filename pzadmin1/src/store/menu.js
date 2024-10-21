const localData = localStorage.getItem('pz_v3pz')

const state = localData ? localData.menu:{
    isCollapse: false,
    selectMenu: [],
    routerList: [       
      {
        path: 'dashboard',
        meta: { id: '1', name: '控制台', icon: 'Platform', path: '/dashboard', describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据' },
        component: 'Dashboard'
      },
      {
        path: 'auth',
        meta: { id: '2' ,name: '权限管理', icon: 'Grid' },
        children: [
          {
            path: '',
            alias: ['admin'],
            meta: { id: '1', name: '账号管理', icon: 'Avatar', path: '/auth/admin', describe: '管理员可以进行编辑，权限修改后需要登出才会生效' },
            component: 'Admin'
          },
          {
            path: 'group',
            meta: { id: '2', name: '菜单管理', icon: 'Menu', path: '/auth/group', describe: '菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取' },
            component: 'Group'
          }
        ]
      },
      {
        path: 'vppz',
        meta: { id: '3', name: 'DIDI陪诊', icon: 'BellFilled' },
        children: [
          {
            path: '',
            alias: ['staff'],
            meta: { id: '1', name: '陪护管理', icon: 'Checked', path: '/vppz/staff', describe: '陪护师可以进行创建和修改，设置对应生效状态控制C端选择' },
            component: 'Staff'
          },
          {
            path: 'order',
            meta: { id: '2', name: '订单管理', icon: 'List', path: '/vppz/order', describe: 'C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改' },
            component: 'Order'
          }
        ]
      }
    ],
     menuActive:'1-1'
}

const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },
    addMenu(state, payload) {
        //对数据进行去重
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state,payload){
        //找到点击数据的索引
        const index = state.selectMenu.findIndex(val => val.name === payload.name)
        //通过索引删除数组指定元素
        state.selectMenu.splice(index,1)
    },
    dynamicMenu (state,payload){
        
        //通过glob导入文件
        const modules = import.meta.glob('../views/**/**/*.vue')
        console.log(modules)
        function routerSet(router){
            router.forEach(route =>{
                //判断没有子菜单，拼接路由数据
                if(!route.children){
                    const url = `../views${route.meta.path}/index.vue`
                    //拿到获取的vue组件
                    route.component = modules[url]
                }else{
                    routerSet(route.children)
                }
            })
        }
        routerSet(payload)
        //拿到完整的路由数据
        state.routerList = payload
    },
    updateMenuActive(state,payload){
        state.menuActive = payload
    }
}
export default {
    state,
    mutations
}