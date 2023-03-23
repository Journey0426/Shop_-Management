<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showdialog"
    >
      添加
    </el-button>
    <!--
           表格组件
           data:表格组件将来需要展示的数据------数组类型
           border：是给表格添加边框
           column属性
           label：显示标题
           width：对应列的宽度
           align：标题的对齐方式
           prop:对应列内容的字段名
           注意1：elmentUI当中的table组件，展示的数据是以一列一列进行展示数据
         -->
    <el-table
      border
      style="width: 100%"
      :data="list"
    >
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="80px"
      >
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="商品名称"
        width="width"
      >
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="商品logo"
        width="width"
      >
        <!--显示图片 -->
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column
        prop="prop"
        label="操作"
        width="width"
      >
        <template slot-scope={row,$index}>
          <el-button type="warning" plain icon="el-icon-edit" @click="updateinfo(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete-solid" @click="deleteinfo(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
      分页器
      当前第几页、数据总条数、每一页展示条数、连续页码数
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"

      current-page:代表的是当前第几页
      total：代表分页器一共需要展示数据条数
      page-size：代表的是每一页需要展示多少条数据
      page-sizes：代表可以设置每一页展示多少条数据
      layout：可以实现分页器布局
      pager-count:按钮的数量  如果 9  连续页码是7

    -->
    <el-pagination
      style="margin-top: 20px;text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size=limit
      :pager-count="5"
      layout="prev,pager,next,jumper, ->,total, sizes "
      :total=total
      @current-change="UpDate"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <!-- form表单 :model属性，这个属性的作用是,把表单的数据收集到那个对象的身上 ，将来表单验证，也需要这个属性-->
      <el-form :model="tmForm" :rules="rules" ref="tmForm">
        <el-form-item label="品牌名称" label-width="100px" style="width: 80%" prop="tmName" >
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <!--这里收集数据：不能使用v-model，因为不是表单元素
           action:设置图片上传的地址
           :on-success:可以检测到图片上传成功，当图片上传成功，会执行一次
           :before-upload：可以在上传图片之前，会执行一次

         -->
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl" >
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddorUpdatrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'tradeMark',
  data() {
    //自定义校验规则
    var tmNamerule = (rule, value, callback) => {
      if (value.length<2||value.length>8) {
        callback(new Error('输入的名称必须在2-8位之间'));
      } else {
        callback();
      }
    };
    return {
      //代表的分页器第几页
      page: 1,
      //当前页数展示数据条数
      limit: 3,
      //总共数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      //收集品牌信息:对象身上的属性，不能瞎写，需要看文档的
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      rules:{
        tmName: [
          //require:必须要校验字段（前面五角星有关系）  message 提示信息    trigger:用户行为设置（事件的设置:blur、change）
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          {validator:tmNamerule,trigger:'change'}
        ],
        logoUrl:[
          {required:true,message: '请上传品牌LOGO'}
        ]
      }
    }
  },
  methods: {
    async UpDate(pager=1) {
       this.page = pager;
      const { page, limit } = this
       //获取品牌列表的接口
       //当你向服务器发请求的时候，这个函数需要带参数，因此老师在data当中初始化两个字段，代表给服务器传递参数
      let result = await this.$API.trademark.reqTrademark(page, limit);
      if (result.code == 200) {
        //分别是展示数据总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //修改页面展示多少条数据
    handleSizeChange(value) {
      this.limit = value
      this.UpDate()
    },
    //点击添加按钮事件
    showdialog(){
      this.dialogFormVisible=true
      this.tmForm={tmName:"",logoUrl: "",}
    },
    //上传图片相关的回调
    //上传成功后
    handleAvatarSuccess(res, file) {
      //res：上传成功之后返回前端数据
      //file:上传成功之后服务器返回前端数据
      //收集品牌图片数据，因为将来需要带给服务器
      this.tmForm.logoUrl=res.data
    },
    //上传成功前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //修改或删除事件
    AddorUpdatrademark(){
      //当全部验证字段通过，再去书写业务逻辑
      this.$refs.tmForm.validate(async(success) => {
        if (success) {
          this.dialogFormVisible = false
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code == 200) {
            //弹出成功信息
            this.$message({
              message: this.tmForm.id ? '修改信息成功' : '添加品牌成功',
              type: 'success'
            });
            this.UpDate(this.tmForm.id ? this.page = this.tableinfo.current:1)
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    //修改数据
    updateinfo(row){
      this.dialogFormVisible=true
      //为什么不能这么写 是因为model双向绑定 你改页面就改，你改完后悔点取消页面还变
      //this.tmForm=row
      //将已有的品牌信息赋值给tmForm进行展示
      //将服务器返回品牌的信息，直接赋值给了tmForm进行展示。
      //也就是tmForm存储即为服务器返回品牌信息
      //可以浅复制合并对象当确定后数据才变动
      this.tmForm={...row}
    },
    //删除数据
    deleteinfo(row){
     this.$confirm(`此操作将永久删除${row.tmName}`, '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
       //当用户点击确定按钮的时候会出发
       //向服务器发请求
     }).then(async() => {
      let result=await this.$API.trademark.reqDeleteinfo(row.id)
       if (result.code===200) {
         this.$message({
           type: 'success',
           message: '删除成功!'
         });
         //解决这页数据删完还停留在这一页的问题
         this.UpDate(this.list.length>1?this.page:this.page-1)
       }
     }).catch(() => {
       this.$message({
         type: 'info',
         message: '已取消删除'
       });
     });
    }
  },
  mounted() {
    this.UpDate()
  },
  }

</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
