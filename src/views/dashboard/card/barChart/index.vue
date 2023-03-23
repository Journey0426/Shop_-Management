<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import *as echarts from 'echarts'

export default {
  name: 'index',
  mounted() {
    let mychat = echarts.init(this.$refs.charts)
    mychat.setOption({
      xAxis: {
        show: false,
        type: 'category',
      },
      yAxis: {
        show: false
      },
      series: [
        {
          data: [50, 80, 120, 200, 150, 80, 70, 110, 130, 180],
          type: 'bar'
        }
      ],
      //布局调试
      grid:{
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }
    })
  }
}

</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
