import mockRquest from '@/utils/mockRquest'

const state={
 list:{}
}
const mutations = {
  GETDATA(state,list){
    state.list=list
  }
}
const actions = {
  //mock数据
  async getData({commit}){
    let result=await mockRquest.get('/home/list')
    if (result.code==20000){
      commit("GETDATA",result.data)
    }
  }
}
const getter={

}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
