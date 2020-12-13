import request from '@/utils/request'

const api_name = 'admin/product/baseTrademark'

export default {
  /*
  获取订单分页列表
  */
  getPageList (page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET'
    })
  },
  //新增品牌数据
  addTradeMark (data) {
    return request({
      url: `${api_name}/save`,
      method: 'POST',
      data
    })
  },
  //修改品牌数据
  updateTradeMark (data) {
    return request({
      url: `${api_name}/update`,
      method: 'PUT',
      data
    })
  },
  //删除品牌数据
  delTradeMark (id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'DELETE',
    })
  },
}
