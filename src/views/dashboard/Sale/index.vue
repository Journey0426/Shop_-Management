<template>
  <el-card class="box-card" style="margin: 10px 0px">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容  @tab-click="handleClick"-->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="first"></el-tab-pane>
        <el-tab-pane label="访问量" name="second"></el-tab-pane>
      </el-tabs>
      <!--右侧 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span  @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            class="block"
            type="daterange"
            size="mini"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
      </div>
    </div>
    <!--内容 -->
    <div class="maintext">
      <el-row :gutter="10">
        <el-col :span="16"><div class="charts" ref="chart"></div></el-col>
        <el-col :span="6" class="right">
          <h3>门店{{title}}排名</h3>
          <ul>
            <li>
              <svg t="1679316049766"  class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11750" width="16" height="16"><path d="M512 14.829568c-273.666048 0-495.5136 221.8496-495.5136 495.5136S238.333952 1005.858816 512 1005.858816s495.5136-221.8496 495.5136-495.5136S785.666048 14.829568 512 14.829568z m31.492096 691.914752h-38.649856V322.62144l-77.89568 75.515904-16.054272-30.920704 95.137792-89.192448h37.459968V706.74432z" fill="#2E333A" p-id="11751"></path><path d="M410.892288 367.21664l16.05632 30.920704 77.893632-75.515904v384.12288h38.649856V278.024192h-37.459968z" fill="#FFFFFF" p-id="11752"></path></svg>
              <span>路飞</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <svg t="1679316091776" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11955" width="16" height="16"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m169.6 768H352.64v-50.56C524.8 576 618.88 491.52 618.88 404.48A91.52 91.52 0 0 0 518.4 311.68a156.8 156.8 0 0 0-128 64l-38.4-40.32A200.96 200.96 0 0 1 518.4 256a148.48 148.48 0 0 1 160.64 148.48c0 103.04-99.2 196.48-232.32 307.84h234.88z" fill="#333333" p-id="11956"></path></svg>
              <span>乔巴</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
             <svg t="1679316111251" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12159" width="16" height="16"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m12.16 768a202.88 202.88 0 0 1-172.16-81.92l35.84-38.4a167.04 167.04 0 0 0 135.04 64c70.4 0 113.28-36.48 113.28-92.8s-49.28-86.4-120.32-86.4h-50.56v-55.68h49.92c64 0 112.64-24.32 112.64-81.92S576 311.04 520.32 311.04a163.2 163.2 0 0 0-128 60.16l-33.92-38.4A206.72 206.72 0 0 1 524.8 256c92.8 0 163.84 48 163.84 131.84a118.4 118.4 0 0 1-104.32 115.2 128 128 0 0 1 112 122.88C696.96 707.84 631.04 768 524.16 768z" fill="#333333" p-id="12160"></path></svg>
              <span>索隆</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>4</span>
              <span>山治</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>5</span>
              <span>甚平</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>6</span>
              <span>罗宾</span>
              <span class="rvalue">123456</span>
            </li>
            <li>
              <span>7</span>
              <span>娜美</span>
              <span class="rvalue">123456</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
//引入echarts
import *as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import home from '@/store/modules/home'
export default {
  name: 'index',
  data(){
    return{
      activeName: "first",
      date:[]
    }
  },
  mounted() {
    this. myecharts=echarts.init(this.$refs.chart)
    this.myecharts.setOption( {
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          data: [0,100,200,300,400],
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [],
          color: "yellowgreen",
        }
      ]
    })
  },
  //计算属性-标题
  computed:{
    title(){
      //重新设置配置项
      return this.activeName=='first'?"销售额" : "访问量";
    },
    //获取数据
    ...mapGetters({ home:'home' })
  },
  //监听属性
  watch:{
    title(){
      //重新修改图标的配置数据
      //图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
      this.myecharts.setOption({
        title: {
          text: this.title,
        },
        xAxis: {
        data: this.title == '销售额' ? this.home.orderFullYearAxis : this.home.userFullYearAxis,
      },
        series:[
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.title=='销售额'?this.home.orderFullYear:this.home.userFullYear,
            color: "yellowgreen",
          }
        ]

      })
    },
    //当刚进来时没有显示图是因为monted只执行一次执行时data由于为空所以没图表
    //可以监听getters home来解决
    home(){
      this.myecharts.setOption( {
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.home.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            data: [0,100,200,300,400],
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.home.orderFullYear,
            color: "yellowgreen",
          }
        ]
      })
    }
  },
  methods:{
    //本天
    setDay() {
    const day=dayjs().format("YYYY-MM-DD")
      this.date=[day,day]
    },
    //本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  }

}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.box-card{
  margin-top: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
>>>.el-card__header{
  border-bottom: none;
   }
.tab {
  width: 100%;
}
.right{
  position: absolute;
  right: 0px;
}
.right span {
  font-size: 80%;
  margin: 0px 10px;
}
.block{
  width: 250px;
  margin: 0px 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rvalue {
  float: right;
}
.maintext .icon{
  padding: 0px;
  margin: 0 5px;
}

</style>
