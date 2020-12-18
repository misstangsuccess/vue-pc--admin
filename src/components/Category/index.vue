<template>
  <div>
    <el-card>
      <el-form inline :model="category">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="handleSelectChange1"
            :disabled="disabled"
          >
            <el-option
              v-for="cate1 in category1List"
              :key="cate1.id"
              :label="cate1.name"
              :value="cate1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="handleSelectChange2"
            :disabled="disabled"
          >
            <el-option
              v-for="cate2 in category2List"
              :key="cate2.id"
              :label="cate2.name"
              :value="cate2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            placeholder="请选择"
            @change="handleSelectChange3"
            :disabled="disabled"
          >
            <el-option
              v-for="cate3 in category3List"
              :key="cate3.id"
              :label="cate3.name"
              :value="cate3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
  name: 'Category',
  //当禁用表单进是否要显示
  props: ['disabled'],
  data() {
    const { category } = this.$store.state.category;
    console.log(category, '1111');
    return {
      //定义分类id
      category: {
        /* category1Id: '',
        category2Id: '',
        category3Id: '', */
        category1Id: category.category1Id,
        category2Id: category.category2Id,
        category3Id: category.category3Id,
      },
      //定义分类列表数据
      /*  category1List: [],
      category2List: [],
      category3List: [], */
    };
  },
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
    }),
  },
  //发送请求获取1级分类数据,然后再遍历展示
  async mounted() {
    this['category/getcategory1List']();

    /*  const result = await this.$API.attrs.getCategorys1();
    // console.log(result.data);
    if (result.code === 200) {
      this.category1List = result.data;
    } else {
      this.$message.error(result.message);
    } */
  },
  methods: {
    //调用vuex中的actions和mutations函数,并且用了命名空间的方式
    //那在书写方式上需要携带上文件路径名,才能起作用
    ...mapActions([
      'category/getcategory1List',
      'category/getcategory2List',
      'category/getcategory3List',
    ]),
    ...mapMutations(['category/SET_CATEGORY3_ID']),
    //当点击1级分类列表时发送请求获取二级分类数据
    async handleSelectChange1(category1Id) {
      //当再次选择数据时,二级分类和三级分类的数据应该清空
      /*   this.category2List = [];
      this.category3List = []; */
      this.category.category2Id = '';
      this.category.category3Id = '';
      //调用vuex中的actions函数去发请求
      this['category/getcategory2List'](category1Id);
      /*   const result = await this.$API.attrs.getCategorys2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      } else {
        this.$message.error(result.message);
      } */
      //this.$bus.$emit('clearList');
    },
    //当点击2级分类列表时发送请求获取三级分类数据
    async handleSelectChange2(category2Id) {
      //当再次选择数据时,三级分类的数据应该清空
      /* this.category3List = []; */
      this.category.category3Id = '';
      /*    const result = await this.$API.attrs.getCategorys3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      } else {
        this.$message.error(result.message);
      } */
      this['category/getcategory3List'](category2Id);
      // this.$bus.$emit('clearList');
    },
    //当点击3级分类列表时发送请求获取分类列表对应的属性
    async handleSelectChange3(category3Id) {
      this['category/SET_CATEGORY3_ID'](category3Id);
      /*  const category = {
        ...this.category,
        category3Id,
      }; */
      //触发自定义事件
      //  this.$bus.$emit('change', category);
      /*  const result = await this.$API.attrs.getAttrList(category);
      if (result.code === 200) {
        // console.log(result.data);
      } else {
        this.$message.error(result.message);
      } */
    },
  },
};
</script>

<style lang="less" scoped>
</style>

