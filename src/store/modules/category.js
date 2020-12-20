/* import * as API from '@/api' */
import API from "@/api"
import { Message } from "element-ui"
export default {
  //命名空间方式,为了避免命名冲突
  namespaced: true,
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: "",
    },
    category1List: [],
    category2List: [],
    category3List: [],
  },
  getters: {},
  actions: {
    //获取一级分类列表
    async getcategory1List ({ commit }) {
      const result = await API.attrs.getCategorys1();
      if (result.code === 200) {
        commit('GET_CATEGORY1_LIST', result.data)
      } else {
        Message.error(result.message);
      }
    },
    //获取二级分类数据
    async getcategory2List ({ commit }, category1Id) {
      const result = await API.attrs.getCategorys2(category1Id);
      if (result.code === 200) {
        commit('GET_CATEGORY2_LIST_SUCCESS', {
          category1Id,
          category2List: result.data
        })
      } else {
        commit('GET_CATEGORY2_LIST_ERROR', category1Id)
        Message.error(result.message);
      }
    },
    //获取三级分类数据
    async getcategory3List ({ commit }, category2Id) {
      const result = await API.attrs.getCategorys3(category2Id);
      if (result.code === 200) {
        commit('GET_CATEGORY3_LIST_SUCCESS', {
          category2Id,
          category3List: result.data
        })
      } else {
        commit('GET_CATEGORY3_LIST_ERROR', category2Id)
        Message.error(result.message);
      }
    },
  },
  mutations: {
    //请求1级
    GET_CATEGORY1_LIST (state, category1List) {
      //获取1级分类列表未选择
      state.category1List = category1List
    },
    //请求2级成功时
    GET_CATEGORY2_LIST_SUCCESS (state, { category2List, category1Id }) {
      //获取2级分类列表已经选择了1级了分类
      state.category2List = category2List
      state.category.category1Id = category1Id
      //当再次选择数据时,二级分类和三级分类的数据应该清空
      state.category3List = [];
      state.category.category2Id = '';
      state.category.category3Id = '';
    },
    //请求2级失败时
    GET_CATEGORY2_LIST_ERROR (state, category1Id) {
      state.category.category1Id = category1Id
      //清空数据
      state.category2List = []
      state.category3List = [];
      state.category.category2Id = '';
      state.category.category3Id = '';
    },
    //请求3级成功时
    GET_CATEGORY3_LIST_SUCCESS (state, { category3List, category2Id }) {
      //获取3级分类列表已经选择了2级了分类
      state.category3List = category3List
      state.category.category2Id = category2Id
      //当再次选择数据时,三级分类的数据应该清空
      state.category.category3Id = '';
    },
    //请求3级失败时
    GET_CATEGORY3_LIST_ERROR (state, category2Id) {
      state.category.category2Id = category2Id
      //清空数据
      state.category3List = [];
      state.category.category3Id = '';
    },
    //当点击3级id时直接更新数据
    SET_CATEGORY3_ID (state, category3Id) {
      state.category.category3Id = category3Id
    },
    //组件切换清空数据
    RESET_CATEGORY_ID (state) {
      console.log('asdasdasdasdasdasdasd')
      state.category.category1Id = "";
      state.category.category2Id = "";
      state.category.category3Id = "";
    }

  }
}
