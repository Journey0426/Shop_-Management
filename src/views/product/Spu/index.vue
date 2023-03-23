<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @Categoryid="Categoryid" :show="contrl!=0"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="contrl==0">
        <el-button type="primary" icon="el-icon-plus" @click="addspu" :disabled="!Category3id">添加SPU</el-button>
        <el-table
          border
          style="width: 100%"
          :data="records"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template v-slot="{row,$index}">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addsku(row)"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updatesp(row)"
              ></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="skuview(row)"
              ></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" @click="deletespu(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>

      <SPUform v-show="contrl==1" @canselSpu="canselSpu" ref="spu"></SPUform>
      <SKUform v-show="contrl==2" @changeSKU="changeSKU" ref="sku"></SKUform>
    </el-card>
    <!-- Table -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table style="width: 100%" border :data="skuList" v-loading="loading">
        <el-table-column property="skuName" label="名称" width="width"></el-table-column>
        <el-table-column property="price" label="价格" width="width"></el-table-column>
        <el-table-column property="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template v-slot="{row,$index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { reqdeletespu, reqSkuById, reqSkuList, reqspulist } from '@/api/product/spu'
import SKUform from '@/views/product/Spu/SKUform/SKUform'
import SPUform from '@/views/product/Spu/SPUform/SPUform'

export default {
  components: { SPUform, SKUform },
  name: 'Spu',
  data() {
    return {
      Category1id: '',
      Category2id: '',
      Category3id: '',
      page: 1, //分页器当前第几页
      limit: 3, //每一页需要展示多少条数据
      records: [], //spu列表的数据
      total: 0, //分页器一共需要展示数据的条数
      contrl: 0,//控制哪个页面显示 0展示spu 1修改|添加spu 2添加sku
      dialogTableVisible: false,//控制sku详情显示
      spu: {},
      skuList: [], //存储的是SKU列表的数据
      loading: true
    }
  },
  methods: {
    //三级联动事件
    Categoryid({ level, Categoryid }) {
      if (level == 1) {
        this.Category1id = Categoryid
        this.Category2id = '',
          this.Category3id = ''
      } else if (level == 2) {
        this.Category2id = Categoryid
        this.Category3id = ''
      } else {
        this.Category3id = Categoryid
        //获取品牌属性
        this.getSpuList()
      }
    },
    //获取SPU列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages
      const { page, limit, Category3id } = this
      //携带三个参数:page 第几页  limit 每一页需要展示多少条数据  三级分类id
      let result = await this.$API.spu.reqspulist(page, limit, Category3id)
      if (result.code = 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    //事件展示数据
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    //添加spu
    addspu() {
      this.contrl = 1
      //通知子组件SpuForm发请求---两个
      this.$refs.spu.addSpuData(this.Category3id)
    },
    //修改spu
    updatesp(row) {
      this.contrl = 1
      this.$refs.spu.initSpudate(row)
    },
    //子组件点击取消变换界面
    canselSpu({ contrl, flag }) {
      //flag这个形参为了区分保存按钮是添加还是修改
      //切换结构（场景）
      this.contrl = contrl
      if (flag == '修改') {
        this.getSpuList()
      } else {
        this.page = 1
        this.getSpuList()
      }
    },
    //删除spu
    deletespu(row) {
      this.$confirm('此操作将永久删除该列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        //当用户点击确定按钮的时候会出发
        //向服务器发请求
      }).then(async() => {
        let result = await this.$API.spu.reqdeletespu(row.id)
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
          console.log(this)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //点击添加sku
    addsku(row) {
      this.contrl = 2
      //父组件给子组件传递子组件需要的数据
      this.$refs.sku.getData(this.Category1id, this.Category2id, row)
    },
    //点击取消
    changeSKU({ contrl }) {
      this.contrl = contrl
    },
    //sku列表展示
    async skuview(spu) {
      this.dialogTableVisible = true
      //保存spu信息
      this.spu = spu
      let result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    //关闭对话框
    close(done){
      //loading属性再次变为真
      this.loading = true;
      //清除sku列表的数据
      this.skuList=[]
      done();

    }
  }

}
</script>

<style scoped>

</style>
