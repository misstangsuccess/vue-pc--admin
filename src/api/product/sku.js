import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  保存sku数据
  */
  saveSku (sku) {
    return request({
      url: `${api_name}/saveSkuInfo`,
      method: "POST",
      data: sku
    });
  },
  //根据 spu的id查找到sku的列表
  getSkuFindBySpuId (spuId) {
    return request({
      url: `${api_name}/findBySpuId/${spuId}`,
      method: "GET",
    });
  },
  //上架
  onSale (skuId) {
    return request({
      url: `${api_name}/onSale/${skuId}`,
      method: "GET",
    });
  },
  //下架
  cancelSale (skuId) {
    return request({
      url: `${api_name}/cancelSale/${skuId}`,
      method: "GET",
    });
  },
  //删除指定id的sku
  deleteSku (skuId) {
    return request({
      url: `${api_name}/deleteSku/${skuId}`,
      method: "DELETE",
    });
  },
  //根据sku的id查询sku的详细信息
  getSkuById (skuId) {
    return request({
      url: `${api_name}/getSkuById/${skuId}`,
      method: "GET",
    });
  },
  //获取sku分布列表
  getList (page, limit) {
    return request({
      url: `${api_name}/list/${page}/${limit}`,
      method: "GET",
    });
  },
  //获取指定spu的id对应的图片列表
  getSpuImageList (spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET",
    });
  },
  //获取销售属性列表
  getSpuSaleAttrList (spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`,
      method: "GET",
    });
  },

}


