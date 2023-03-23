<template>
  <div>
    <el-table
      border
      style="width: 100%"
      :data="records"
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        width="width"
      >
      </el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        width="width"
      >
      </el-table-column>
      <el-table-column
        label="默认图片"
        width="110"
      >
        <template v-slot="{row,$index}">
          <img :src="row.skuDefaultImg" style="height: 80px;width: 80px">
        </template>
      </el-table-column>
      <el-table-column
        prop="weight"
        label="重量"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="80"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            v-if="row.isSale==0"
            @click="upsale(row)"
            size="mini"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            v-else
            @click="downsale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
           @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px;text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size=limit
      :pager-count="5"
      layout="prev,pager,next,jumper, ->,total, sizes "
      :total=total
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList":key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel trigger="click" height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import { reqSkuById } from '@/api/product/sku'

export default {
  name: 'Sku',
  data() {
    return {
      page: 1,//当前页面
      limit: 10,//显示数据
      records: [], //spu列表的数据
      total: 0 ,//分页器一共需要展示数据的条数
      drawer: false,//控制抽屉是否显示
      skuInfo:{},//存储SKU信息
    }
  },
  methods: {
    async getSkuList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      let result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    //修改显示条数
    handleSizeChange(value) {
      this.limit = value
      this.getSkuList()
    },
    //上架
    async upsale(row) {
      let result = await this.$API.sku.reqSale(row.id)
      if (result.code == 200) {
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    //下架
    async downsale(row) {
      let result = await this.$API.sku.reqCancel(row.id)
      if (result.code == 200) {
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    edit() {
      this.$message("正在开发中");
    },
    //控制抽屉
    async getSkuInfo(row){
      //展示抽屉
      this.drawer=true
      let result=await this.$API.sku.reqSkuById(row.id)
      if (result.code==200){
        this.skuInfo=result.data
      }
    }
  },
  mounted() {
    this.getSkuList()
  }
}
</script>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

</style>
<style scoped>
>>>.el-carousel__button{
  width:10px;
  height:10px;
  background:red;
  border-radius:50%;
}
el-row .el-col-5{
  font-size:18px;
  text-align:right;
}
.el-col{
  margin:10px 10px;
}
</style>
