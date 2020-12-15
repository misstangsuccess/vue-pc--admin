<template>
  <div>
    <Category :disabled="!isShowList" />
    <!--三级分类数据展示及对应的属性值展示 -->
    <!-- v-show组件虽然是隐藏但是会加载 -->
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList" />
    <!-- 对相应属性值进行修改删除操作 -->
    <SpuUpdateList v-else :item="item" @showList="showList" />
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
    showList(category3Id) {
      this.isShowList = true;
      //等showlist组件加载完后再触发事件(方法二,也可以在子组件中触发)
      this.$nextTick(() => {
        console.log(111);
        this.$bus.$emit('change', { category3Id });
      });
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
