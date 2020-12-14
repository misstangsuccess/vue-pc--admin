<template>
  <div>
    <Category />
    <!--三级分类数据展示及对应的属性值展示 -->
    <SpuShowList v-show="!isShowList" />
    <!-- 对相应属性值进行修改删除操作 -->
    <SpuUpdateList v-show="isShowList" />
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
      isShowList: 'false',
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
