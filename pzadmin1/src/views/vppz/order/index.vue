<template>
    <panel-head :route="route" />
    <div class="form">
        <!-- :inline="true" 同一行显示 -->
        <el-form :inline="true" :model="searchForm">
            <el-form-item prop="out_trade_no">
                <el-input v-model="searchForm.out_trade_no" placeholder="订单号" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" >查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData.list">
        <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
        <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
        <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
        <el-table-column label="陪护师头像">
            <template #default="scope">
                <el-image style="width: 40px;height: 40px;" :src="scope.row.companion.avatar"/>
            </template>
        </el-table-column>
        <el-table-column label="陪护师手机号" width="120">
            <template #default="scope">
                {{ scope.row.companion.mobile }}
            </template>
        </el-table-column>
        <el-table-column prop="price" label="总价"></el-table-column>
        <el-table-column prop="paidPrice" label="已付"></el-table-column>
        <el-table-column label="下单时间" width="120">
            <template #default="scope">
                {{ dayjs(scope.row.order_start_time).format("YYYY-MM-DD")}}
            </template>
        </el-table-column>
        
        <el-table-column label="订单状态">
            <template #default="scope">
                <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="service_state" label="接单状态"></el-table-column>
        <el-table-column prop="tel" label="联系人手机号" width="120"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
                <el-popconfirm
                    v-if="scope.row.trade_state==='待服务'"
                    confirm-button-text="是"
                    cancel-button-text="否"
                    :icon="InfoFilled"
                    icon-color="#626AEF"
                    title="是否确认完成?"
                    @confirm="confirmEvent(scope.row.out_trade_no)"
                   
                >
                    <template #reference>
                        <el-button  type="primary" link>服务完成</el-button>
                    </template>
                    
                 </el-popconfirm>
                 <el-button v-else type="primary" link disabled>暂无服务</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination
            v-model:current-page="paginationData.pageNum"
            :page-size="paginationData.pageSize"
            :background="false"
            size="small"
            layout="total, prev, pager, next"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
  </div>
</template>
  
<script setup>
import { ref,onMounted,reactive} from 'vue'
import { useRouter, useRoute} from 'vue-router'
import { adminOrder,updateOrder } from '../../../api'
import dayjs from "dayjs";
import {  InfoFilled,  Delete } from "@element-plus/icons-vue"; //图标

const route = useRoute();

onMounted (()=>{
    getListData()
})

//分页数据
const paginationData = reactive({
    pageNum:1,
    pageSize:10
})

//表单搜索
const searchForm = reactive({
    out_trade_no:''
})
const onSubmit = () =>{
    getListData(searchForm)
}

//列表数据
const tableData = reactive({
  list:[],
  total :0
})

const getListData = (params={} ) =>{ //定义列表数据
    adminOrder({...paginationData,...params}).then(({data})=>{ //三个点表示把两组参数合并，先调用aip在把分页数据传递进去,在.then里面拿到当前数据返回的内容
        const {list,total} =data.data
        tableData.list = list
        tableData.total = total
  })
} 
//分页
const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}

const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}
const statusMap = (key) =>{
    const obj = {
        '已取消' :'info',
        '已支付' :'success',
        '待支付' :'warning'

    }
    return obj[key]
}
const confirmEvent =(id) =>{
    updateOrder({id}).then(({data})=>{
        if(data.code===10000){
            getListData()  //最后一章
        }
    })
}


</script>
  
<style lang="less" scoped>
.form{
    display: flex;
    justify-content: flex-end;
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
</style>
  