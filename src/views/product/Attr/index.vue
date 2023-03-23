<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @Categoryid="Categoryid" :show="!istable" ></CategorySelect>
    </el-card>
    <div v-show="istable">
      <el-card>
        <el-row>
          <el-button :disabled="!Category3id" type="primary" icon="el-icon-plus" style="margin-bottom: 10px"
                     @click="addAttr"
          >添加属性
          </el-button>
        </el-row>
        <el-table
          :data="InfoList"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值列表"
            width="width"
          >
            <template slot-scope="{row, $index}">
              <el-tag type="success" v-for="item in row.attrValueList" :key="item.id" style="margin: 0 30px 10px 20px">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="180"
          >
            <template slot-scope="{row, $index}">
              <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateAttr(row)" ></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div>
      <el-card v-show="!istable">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="AttrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!AttrInfo.attrName" @click="addvalueinfo">添加属性值</el-button>
        <el-button @click="istable=true">取消</el-button>
        <el-table
          border
          style="width: 100%;margin: 20px 0 20px 0"
          :data="AttrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称"
            width="width"
          >
            <template v-slot="{row,$index}">
              <el-input placeholder="请输入属性值名称" size="mini"
                        v-model="row.valueName"
                        v-if="row.isflag"
                        @blur="Showinput(row)"
                        @keyup.native.enter="Showinput(row)"
              :ref="$index"></el-input>
              <span v-else style="display: block" @click="isfocus(row,$index)">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template v-slot="{row, $index}">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttr($index)"
              >
                <el-button type="danger" size="mini" icon="el-icon-delete" slot="reference" ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="getAddOrUpdateAttr" :disabled="this.AttrInfo.attrValueList.length<1">保存</el-button>
        <el-button type="primary" plain>取消</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
import item from '@/layout/components/Sidebar/Item'

export default {
  name: 'Attr',
  data() {
    return {
      Category1id: '',
      Category2id: '',
      Category3id: '',
      InfoList: [],
      //控制页面是否展示
      istable: true,
      //收集新增属性|修改属性使用的
      AttrInfo: {
        attrName: '',     // 属性名
        attrValueList: [   //属性名中属性值，因为属性值可以是多个，因此需要的是数组
        ],
        categoryId: 0,    //category3Id
        categoryLevel: 3
      }
    }
  },
  methods: {
    //自定义函数回调
    Categoryid({ Categoryid, level }) {
      if (level == 1) {
        this.Category1id = Categoryid
        this.Category2id = ''
        this.Category3id = ''
      } else if (level == 2) {
        this.Category2id = Categoryid
        this.Category3id = ''
      } else {
        this.Category3id = Categoryid
        //获取品牌属性
        this.getAttrInfoList()

      }
    },
    //信息界面
    async getAttrInfoList() {
      const { Category1id, Category2id, Category3id } = this
      let result = await this.$API.attr.reqAttrInfoList(Category1id, Category2id, Category3id)
      if (result.code == 200) {
        this.InfoList = result.data
      }
    },
    //点击增加属性事件
    addvalueinfo(){
      //向属性值的数组里面添加元素
      //attrId：是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
      //valueName:相应的属性值的名称
      this.AttrInfo.attrValueList.push( {
        //修改的时候因为有属性id所以attrid为属性id，增加新属性因为没有id所以为undefind
        attrId: this.InfoList.id,
        valueName: '',
        //给每一个属性加上isflag控制显示和隐藏
        isflag:true

      } );
      //安排自动聚焦
      this.$nextTick(()=>
        this.$refs[this.AttrInfo.attrValueList.length-1].focus())
    },
    //添加属性事件并解决点击取消数据仍存在的问题
    addAttr(){
      this.istable=false
        //清除数据
      this.AttrInfo={
        attrName:'',
        attrValueList :[],
        //获得当前三级id
        categoryId: this.Category3id,
        categoryLevel: 3
      }
    },
    //修改属性操作
    updateAttr(row){
      this.istable=false
      //将选中的属性赋值给attrInfo
      //由于数据结构当中存在对象里面套数组，数组里面有套对象，因此需要使用深拷贝解决这类问题
      //深拷贝，浅拷贝在面试的时候出现频率很高，切记达到手写深拷贝与浅拷贝
      this.AttrInfo=cloneDeep(row)
      this.AttrInfo.attrValueList.forEach(item=>{
        //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
        //因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
        //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
        this.$set(item, "isflag", false);
      })
    },
    //设置编辑和修改模式
    Showinput(row){
      //判断是否为空为空不展示
      if (row.valueName==''){
        this.$message('输入的不能为空!')
        return;
      };
      //some会返回一个布尔值
    let isrepet=  this.AttrInfo.attrValueList.some(item=>{
        //需要将row从数组里面判断的时候去除
        //row最新新增的属性值【数组的最后一项元素】
        //判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row!==item){
          //需要有返回值 如果新增属性和前面几个属性的valename相同 则返回布尔值为真
          return row.valueName==item.valueName
        }
      })
      //如果为真则不执行
      if (isrepet)return;
      //编辑模式下isflag为false
      row.isflag=false
    },
    //自动聚焦
    isfocus(row,index){
     row.isflag=true
      //获取相应的input表单元素实现聚焦
      //获取input节点，实现自动聚焦
      //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间的
      //点击span的时候，重绘重拍一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
      //$nextTick,当节点渲染完毕了，会执行一次
      //ref是用了获取input index是区分哪个input
    this.$nextTick(()=>this.$refs[index].focus())
    },
    //气泡框点击确认删除
    deleteAttr(index){
      this.AttrInfo.attrValueList.splice(index,1)
    }
    ,
    //点击保存
    async getAddOrUpdateAttr() {
      //fifter（）将数组中满足条件的返回一个新数组中
      //整理参数:1,如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      //提交给服务器数据当中不应该出现flag字段
     this.AttrInfo.attrValueList= this.AttrInfo.attrValueList.filter(item=>{
        //过滤掉属性不为空的
        if (item!=''){
          //删除掉flag属性
          delete item.isflag
          return true
        }
      })
      try {
       //发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.AttrInfo)
        //展示 //展示平台属性的信号量进行切换
        this.istable=true
        //保存成功以后需要再次获取平台属性进行展示
        this.getAttrInfoList()
        //提示信息
        this.$message({type:'success',message:'保存成功'})
      }catch (err){
        this.$message({message:'保存失败'})
      }

    },
  }

}
</script>

<style scoped>

</style>
