<template>
  <el-row :gutter="20">
    <!-- 左侧内容-->
    <el-col :span="12">
      <search></search>
    </el-col>
    <!-- 右侧内容-->
    <el-col :span="12">
      <SaleCategory></SaleCategory>
    </el-col>
  </el-row>
</template>

<script>
import search from '@/views/dashboard/observe/search'
import SaleCategory from '@/views/dashboard/observe/SaleCategory'
export default {
  name: 'index',
  components:{search,SaleCategory}
}
</script>

<style scoped>
</style>
