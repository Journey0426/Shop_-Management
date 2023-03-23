<template>
<div>
  <el-form :inline="true"  class="demo-form-inline" :model="formId">
    <el-form-item label="一级分类" >
      <el-select  placeholder="请选择"  v-model="formId.Category1id" @change="handlel1" :disabled="show" >
        <el-option  :label="item1.name" :value="item1.id" v-for="item1 in list1" :key="item1.id" ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select  placeholder="请选择" v-model="formId.Category2id" @change="handlel2"  :disabled="show">
        <el-option :label="item2.name" :value="item2.id" v-for="item2 in list2" :key="item2.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select  placeholder="请选择"  v-model="formId.Category3id" @change="handlel3"  :disabled="show">
        <el-option :label="item3.name" :value="item3.id" v-for="item3 in list3" :key="item3.id"></el-option>
      </el-select>
    </el-form-item>

  </el-form>
</div>
</template>

<script>
export default {
  props:['show'],
  name: 'CategorySelect',
  data(){
    return{
      //一级列表数据
      list1:[],
      //二级列表数据
      list2:[],
      //三级列表数据
      list3:[],
      //可以根据选择的id让框中显示
      formId:{
        Category1id:'',
        Category2id:'',
        Category3id:'',
      }
    }
  },
  //组件挂载完毕：向服务器发请求，获取相应的一级分类的数据
  mounted() {
   this.getCategory()
    },
  methods:{
    //获取一级分类数据的方法
   async getCategory(){
     let result=await this.$API.attr.reqCategory()
    if (result.code===200){
      this.list1=result.data
    }
    },
    //当一级分类框改变后二级分类就有了
    async handlel1(){
     const {Category1id}=this.formId
      //同时一级改变二、三为空
      this.list2=[]
      this.list3=[]
     this.formId.Category2id=''
      this.formId.Category3id=''
    let result=await this.$API.attr.reqCategory2(Category1id)
      //传递参数
      this.$emit('Categoryid',{Categoryid:Category1id,level:1})
      if (result.code==200){
        this.list2=result.data
      }
    },
    ////当二级分类框改变后三级分类就有了
    async handlel2(){
      const {Category2id}=this.formId
      //同时二级改、三为空
      this.list3=[]
      this.formId.Category3id=''
      let result=await this.$API.attr.reqCategory3(Category2id)
      //传递参数
      this.$emit('Categoryid',{Categoryid:Category2id,level:2})
      if (result.code==200){
        this.list3=result.data
      }
    },
    //三级分类事件
    handlel3(){
     const {Category3id}=this.formId
      //传递参数
      this.$emit('Categoryid',{Categoryid:Category3id,level:3})
    }
  }
  }



</script>

<style scoped>

</style>
