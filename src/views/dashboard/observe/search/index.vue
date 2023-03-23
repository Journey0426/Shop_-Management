<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div class="search-header">
      <span>线上热门搜索</span>
      <el-dropdown>
  <span class="el-dropdown-link">
    <i class="el-icon-more" ></i>
  </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>路飞</el-dropdown-item>
          <el-dropdown-item>索隆</el-dropdown-item>
          <el-dropdown-item>山治</el-dropdown-item>
          <el-dropdown-item >甚平</el-dropdown-item>
          <el-dropdown-item >艾斯</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </div>
    </div>
    <!--图表 -->
    <linechart  ></linechart>
    <div style="margin:0px 10px">
      <el-table
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="排名"
          width="80">
        </el-table-column>
        <el-table-column
          prop="prop"
          label="搜索关键字"
          width="width">
        </el-table-column>
        <el-table-column
          prop="prop"
          label="用户数"
          sortable
          width="width">
        </el-table-column>
        <el-table-column
          label="周涨幅度"
          prop="prop"
          sortable
          width="width">
        </el-table-column>
      </el-table>
    </div>
    <div  class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="100">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import linechart from '@/views/dashboard/observe/search/linechart'
export default {
  name: 'search',
  components:{linechart}
}
</script>

<style scoped>

.search-header {
  display: flex;
  justify-content: space-between;
}
.el-icon-more{
  color: black;
}
.pagination{
  float: right;
}
</style>
