<template>
  <div>
    <Category />
    <!--三级分类数据展示及对应的属性值展示 -->
    <!-- v-show组件虽然是隐藏但是会加载 -->
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />
    <!-- 对相应属性值进行修改删除操作 -->
    <SpuUpdateList v-else :item="item" />
  </div>
</template>

<script>
import Category from '@/components/Category';
import SpuShowList from './spuShowList';
import SpuUpdateList from './spuUpdateList';
export default {
  name: 'SpuList',
  data() {
    return {
      isShowList: true,
      //定义数据是为了给子组件传递数据使用
      item: {},
    };
  },
  methods: {
    //数据传给SpuUpdateList组件,方法传给SpuShowList
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
