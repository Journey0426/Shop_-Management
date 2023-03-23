<template>
  <el-card class="box-card">
    <div slot="header" class="header">
      <div class="search-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <!--图表 -->
    <div>
      <div class="charts" ref="charts"></div>
    </div>

  </el-card>
</template>

<script>
import *as echarts from 'echarts'
export default {
  name: 'index',
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let mycharts=echarts.init(this.$refs.charts)
    mycharts.setOption({
      title: {
        text: "视频",
        subtext: '5000+',
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: ["40%", "70%"],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: 1048, name: "恶搞之家" },
            { value: 735, name: "红楼梦" },
            { value: 590, name: "狂飙" },
            { value: 684,  name: "辛普森一家" },
            { value: 1266, name: "海贼王" },
            { value: 888, name: "西游记" },
            { value: 999, name: "水浒传" },
            { value: 777, name: "三国演义" },
          ]
        }
      ]
    })
  }
}
</script>

<style scoped>
.search-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header {
  border-bottom: 1px solid #eee;
}
.charts {
  width: 100%;
  height: 500px;
}
>>>.el-card__header{
  border-bottom: none;
}
</style>
