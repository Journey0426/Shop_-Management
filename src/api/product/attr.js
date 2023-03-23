import request from '@/utils/request'
//一级分类接口
export const  reqCategory=()=>request({url:'/admin/product/getCategory1',method:'get'})
//二级分类接口
export const reqCategory2=(category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})
//三级分类接口
export const reqCategory3=(category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})
//商品信息
export const reqAttrInfoList=(category1Id,category2Id,category3Id)=>
  request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
//添加属性与属性值接口
///admin/product/saveAttrInfo  post
export const reqAddOrUpdateAttr = (data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data});
/*
{
  "attrName": "",      属性名
  "attrValueList": [   属性名中属性值，因为属性值可以是多个，因此需要的是数组
    {
      "attrId": 0,          属性的id
      "valueName": "string"  属性值
    }
  ],
  "categoryId": 0,    category3Id
  "categoryLevel":3,
}
*/

