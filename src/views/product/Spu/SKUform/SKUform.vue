<template>
<el-form label-width="80px">
  <el-form-item label="SPU名称">
    {{ spu.spuName }}
  </el-form-item>
  <el-form-item label="SKU名称">
  <el-input placeholder="SKU名称" v-model="skuInfo.skuName">
  </el-input>
  </el-form-item>
  <el-form-item label="价格(元)">
    <el-input  placeholder="价格(元)" type="number" v-model="skuInfo.price">
    </el-input>
  </el-form-item>
  <el-form-item label="重量(千克)" >
    <el-input v-model="skuInfo.weight"></el-input>
  </el-form-item>
  <el-form-item label="规格描述">
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4}"
      placeholder="请输入内容"
      v-model="skuInfo.skuDesc"
    >
    </el-input>
  </el-form-item>
  <el-form-item label="平台属性">
   <el-form :inline="true" label-width="80px">
  <el-form-item :label="attr.attrName" v-for="attr in attrInfoList":key="attr.id">
    <el-select placeholder="请选择"  v-model="attr.attrIdAndValueId">
      <el-option
        :label="attrvalue.valueName"
        v-for="attrvalue in attr.attrValueList" :key="attrvalue.id"
        :value="`${attr.id}:${attrvalue.id}`">
      </el-option>
    </el-select>
  </el-form-item>
   </el-form>
  </el-form-item>
  <el-form-item label="销售属性">
    <el-form :inline="true" label-width="80px">
      <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList":key="saleAttr.id">
        <el-select placeholder="请选择"  v-model="saleAttr.attrIdAndValueId">
          <el-option
            :label="saleAttrValue.saleAttrValueName"
            :value="`${saleAttr.id}:${saleAttrValue.id}`"
           v-for="saleAttrValue in saleAttr.spuSaleAttrValueList":key="saleAttrValue.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-form-item>
  <el-form-item label="图片列表">
    <el-table
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    :data="spuImageList">
      <el-table-column
        type="selection"
        width="80">
      </el-table-column>
      <el-table-column
        prop="prop"
        label="图片"
        width="width">
        <template v-slot="{row,$index}">
          <img :src="row.imgUrl" style="width: 100px;height: 100px">
        </template>
      </el-table-column>
      <el-table-column
        prop="imgName"
        label="名称"
        width="width">
      </el-table-column>
      <el-table-column
        prop="prop"
        width="width"
        label="操作">
        <template v-slot="{row,$index}">
          <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
          <el-button v-else @click="">默认</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="save" >保存</el-button>
    <el-button @click="cansel">取消</el-button>
  </el-form-item>
</el-form>
</template>

<script>

import { reqAddSku } from '@/api/product/spu'

export default {
  name: 'SKUform',
  data(){
    return{
      //存储图片的信息
      spuImageList: [],
      //存储销售是属性
      spuSaleAttrList: [],
      //存储平台属性的数据
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",//描述
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu:{},
      //暂时存放数据
      imgList:[]
    }
  },
  methods:{
    async getData(Category1Id,Category2Id,spu){
      //收取父给子的数据
      this.skuInfo.category3Id=spu.Category3id
      this.skuInfo.spuId=spu.id
      this.skuInfo.tmId = spu.tmId;
      this.spu=spu
      //获取图片数据
     let spuimglist=await this.$API.spu.reqSpuImageLIst(spu.id)
      if (spuimglist.code==200){
        //给每一个图片加一个isdeafault属性
        let imglist=spuimglist.data
        imglist.forEach(item=>{
          item.isDefault = 0;
        })
        this.spuImageList=imglist
      }
      ////获取销售属性的数据
     let spuattrlist= await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (spuattrlist.code==200){
        this.spuSaleAttrList=spuattrlist.data
      }
      //获取平台属性的数据
      let attrinfolist=await this.$API.spu.reqAttrInfoList(Category1Id,Category2Id,spu.category3Id)
      if (attrinfolist.code==200){
        this.attrInfoList=attrinfolist.data
      }
    },
    //table表格复选框按钮的事件
    handleSelectionChange(prams){
     //prams是所选择的信息
      //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
      this.imgList=prams
    },
    //排他操作
    changeDefault(row){
      //row是点击的
      this.spuImageList.forEach(item=>{
        item.isDefault=0
      })
      row.isDefault=1
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg=row.imgUrl
    },
    //取消
    cansel(){
     this.$emit('changeSKU',{contrl:0})
      //清空数据
      Object.assign(this._data, this.$options.data());
    },
    //保存
    async save(){
      //保存销售属性的数据
      let arr=[]
      const{spuSaleAttrList,attrInfoList,spuImageList,skuInfo}=this
      spuSaleAttrList.forEach(item=>{
          if (item.attrIdAndValueId){
            const [saleAttrId,saleAttrValueId]=item.attrIdAndValueId.split(":")
            //携带给服务器的是对象
            let obj={saleAttrId,saleAttrValueId}
            arr.push(obj)
          }
      })
      //将新数组给  skuInfo.skuSaleAttrValueList
      skuInfo.skuSaleAttrValueList=arr
      let arr1=[]
      //保存存储平台属性的数据
      attrInfoList.forEach(item=>{
        if (item.attrIdAndValueId){
          const [attrId,valueId]=item.attrIdAndValueId.split(":")
          //携带给服务器的是对象
          let obj={attrId,valueId}
          arr1.push(obj)
        }
      })
      skuInfo.skuAttrValueList=arr1
      ////存储图片的信息
      skuInfo.skuImageList=spuImageList.map(item=>{
        return{imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
      //发请求
      let result=await this.$API.spu.reqAddSku(skuInfo)
      if (result.code==200){
        this.$message({type:'success',message:'添加SKU成功'})
        this.$emit('changeSKU',{contrl:0})
      }
    }
  }
}
</script>

<style scoped>

</style>
