<template>
  <div>
    <SkuList v-if="isShowSkuList" :spuItem="spuItem" />
    <div v-else>
      <Category :disabled="!isShowList" />
      <!--三级分类数据展示及对应的属性值展示 -->
      <!-- v-show组件虽然是隐藏但是会加载 -->
      <SpuShowList
        v-if="isShowList"
        @showUpdateList="showUpdateList"
        @showSpuList="showSpuList"
      />
      <!-- 对相应属性值进行修改删除操作 -->
      <SpuUpdateList v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
import Category from '@/components/Category';
import SpuShowList from './spuShowList';
import SpuUpdateList from './spuUpdateList';
import SkuList from './skuList';
import { category } from '@/api';
export default {
  name: 'SpuList',
  data() {
    return {
      isShowList: true,
      isShowSkuList: false,
      //定义数据是为了给子组件传递数据使用
      item: {},
      //定义sku的列表数据
      spuItem: {},
    };
  },
  methods: {
    //把spu页面中的数据在sku中展示
    showSpuList(row) {
      this.isShowSkuList = true;
      this.spuItem = { ...row };
    },
    //数据传给SpuUpdateList组件,方法传给SpuShowList
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
    showList(category) {
      this.isShowList = true;
      //通知showlistx组件重新发请求

      //等showlist组件加载完后再触发事件(方法二,也可以在子组件中触发)
      // this.$nextTick(() => {
      // //  console.log(111);
      //   this.$bus.$emit('change', { category3Id });
      // });
    },
  },
  //切换组件时清空数据
  beforeDestory() {
    this.$store.commit('category/RESET_CATEGORY_ID');
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
};
</script>
