<template>
  <panel-head :route="route" />
  <button class="btns">
    <el-button :icon="Plus" type="primary" size="small" @click="open(null)">新增</el-button>
    <el-popconfirm
    confirm-button-text="是"
    cancel-button-text="否"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="是否确认删除?"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
  >
      <template #reference>
        <el-button :icon="Delete" type="danger" size="small">删除</el-button>
      </template>
    
  </el-popconfirm>
  </button>
  <el-table :data="tableData.list" style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"/>
    <el-table-column prop="id" label="id"/>
      <el-table-column prop="name" label="昵称"/>
      <el-table-column  label="头像">
        <template #default="scope">
            <el-image style="width: 50px;height: 50px;"
                      :src="scope.row.avatar"
            ></el-image>
          </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
            {{ scope.row.sex === '1' ? '男' : '女' }}
          </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"/>
      <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">
          {{scope.row.active ? "正常" : "失效"}}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon> <Clock /> </el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
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

  <el-dialog
    v-model="dialogFormVisable"
    :beforeClose="beforeClose"
    title="陪护师添加"
    width="500"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>

      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item label="头像" prop="avatar">
        <el-button
          v-if="!form.avatar"
          type="primary"
          @click="dialogImgVisable = true"
          >点击上传</el-button
        >
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
        ></el-image>
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="年龄" prop="age">
        <el-input-number
          v-model="form.age"
          :min="18"
          :max="60"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号码" />
      </el-form-item>

      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogImgVisable"
    :beforeClose="beforeClose"
    title="选择图片"
    width="680"
  >
    <div class="image-list">
      <!-- 拿到当前的数据以及数据的索引 -->
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectIndex = index"
      >
        <!-- 如果选中的图片，则添加勾选样式 -->
        <div v-if="selectIndex === index" class="select">
          <el-icon color="#fff"> <Check /> </el-icon>
        </div>
        <el-image style="width: 148px; height: 148px" :src="item.url" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisable = false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
  
<script setup>
import { reactive, ref,nextTick} from "vue"; //定义响应式变量
import { onMounted } from "vue";
import { Plus, InfoFilled,  Delete } from "@element-plus/icons-vue"; //图标
import { photoList, companion,companionList,deleteCompanion } from "../../../api";
import { fa, fr } from "element-plus/es/locale/index.mjs";
import {useRoute} from "vue-router";
import dayjs from "dayjs";
const route = useRoute();


onMounted(() => {
  //调用生命周期来拿到头像数据
  photoList().then(({ data }) => {
    fileList.value = data.data;
  });
  getListData()
});



//分页数据
const paginationData = reactive({
    pageNum:1,
    pageSize:10
})

//列表数据
const tableData = reactive({
  list:[],
  total :0
})

const getListData = ( ) =>{ //定义列表数据
  companionList(paginationData).then(({data})=>{ //先调用aip在把分页数据传递进去,在.then里面拿到当前数据返回的内容
    const {list,total} =data.data
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
      tableData.list = list
      tableData.total = total
  })
} 
const dialogFormVisable = ref(false); //控制弹窗显示或者隐藏的属性
const beforeClose = () => {
  dialogFormVisable.value = false;
  formRef.value.resetFields();
};

const formRef = ref();

//form的数据
const form = reactive({
  id: "",
  mobile: "",
  active: "",
  age: 28,
  avatar: "",
  name: "",
  sex: "",
});

//表单校验
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请填写昵称" }],
  avatar: [{ required: true, message: "选择头像" }],
  sex: [{ required: true, trigger: "change", message: "请选择性别" }],
  mobile: [
    { required: true, trigger: "blur", message: "请填写手机号" },
    {
      pattern: /^1[3456789]\d{9}$/,
      trigger: "blur",
      message: "手机号格式不正确",
    },
  ],
});

const confirm = async (formEl) => {
  console.log(formEl);
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success("添加成功");
          beforeClose();
          getListData();
        } else {
          ElMessage.error(data.message);
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const open = (rowData={}) => {
  //定义打开弹窗的方法
  dialogFormVisable.value = true;


  //点击编辑，显示数据的回写
  nextTick(()=>{
    //如果是编辑
    if(rowData){
      Object.assign(form,rowData)
    }
  })
};

//选择头像弹窗
const dialogImgVisable = ref(false);
const fileList = ref([]);
const selectIndex = ref(0);
const confirmImage = () => {
  //确认选择图片
  form.avatar = fileList.value[selectIndex.value].url;
  dialogImgVisable.value = false;
};

const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getListData()
}

const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getListData()
}

//存储勾选的数据
const selectTableData = ref([])
const handleSelectionChange = (val) =>{
  selectTableData.value = val.map(item => ({id:item.id}))//遍历拿到数组的id
}
const confirmEvent = () =>{
  //没有选择
  if(!selectTableData.value.length){
    return ElMessage.warning('请选择至少一项数据')
  }
  deleteCompanion({id:selectTableData.value}).then(({data})=>{
    if(data.code === 10000){ //数据请求成功
      ElMessage.success('删除成功')
      getListData()
    }
  })
}
</script>
  
<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  border: 0px;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
  