<template>
  <div>
    <el-card style="margin-top: 20px" v-show="!visible">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="$emit('showUpdateList', { category3Id: category.category3Id })"
        >添加SPU</el-button
      >
      <el-table
        :data="spuList"
        v-loading="loading"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="$emit('showSpuList', { ...row, ...category })"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="$emit('showUpdateList', row)"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="showSkuList(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定删除${row.spuName}吗?`"
              @onConfirm="deleteSpu(row.id)"
            >
              <el-button
                type="primary"
                slot="reference"
                icon="el-icon-delete"
                size="mini"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="trademark-pagination"
        @size-change="getPageList(page, $event)"
        @current-change="getPageList($event, limit)"
        :page-sizes="[3, 6, 9]"
        :page-size.sync="limit"
        :current-page="page"
        layout="prev, pager, next, jumper, sizes, total"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog :title="`${spu.spuName} => SKU列表`" :visible.sync="visible">
      <el-table :data="skuList" v-loading="loading">
        <el-table-column prop="skuName" label="名称"></el-table-column>
        <el-table-column property="price" label="价格(元)"></el-table-column>
        <el-table-column property="weight" label="重量(KG)"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'SpuShowList',
  data() {
    return {
      page: 1,
      total: 0,
      limit: 3,
      spuList: [],
      /*   category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      }, */
      loading: false,
      //重新定义数据为了后来操作使用
      spu: {},
      //是否显示弹框
      visible: false,
      skuList: [],
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  //当有了3级分类id时可以通过watch监视属性监视数据的变化,不仅可以监视对象,还可以监视对象的属性
  watch: {
    'category.category3Id': {
      handler(category3Id) {
        if (!category3Id) return;
        this.getPageList(this.page, this.limit);
      },
      //一上来就立即调用
      immediate: true,
    },
    'category.category1Id'() {
      //调用清空数据的方法
      this.clearList();
    },
    'category.category2Id'() {
      //调用清空数据的方法
      this.clearList();
    },
  },
  methods: {
    //获取分页列表数据
    async getPageList(page, limit) {
      this.loading = true;
      //获取3Id
      const { category3Id } = this.category;
      //发送请求
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      //console.log(result);
      if (result.code === 200) {
        this.$message.success('请求SPU分页列表成功');
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    //选中三级分类时把传递过去,并调用函数
    /*    handleCategoryChange(category) {
      this.category = category;
      this.getPageList(this.page, this.limit);
    }, */
    //选中1级分类和2级分类数据时需要清空数据
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.total = 0;
      this.limit = 3;
      /*  this.category.category3Id = ''; */
    },
    //删除整行的spu数据
    async deleteSpu(spuId) {
      const result = await this.$API.spu.deleteSpu(spuId);
      this.$message.success(result.message || '删除成功');
      this.getPageList(this.page, this.limit);
    },
    //展示sku数据
    async showSkuList(spu) {
      // 更新一个数据
      this.visible = true;
      this.spu = spu;
      this.skuList = []; // 重置一下前面显示的列表数据
      this.loading = true; // 显示loading

      // 发送请求获取sku列表数据
      const result = await this.$API.sku.getSkuFindBySpuId(spu.id);
     // console.log(result);
      this.loading = false; // 隐藏loading
      const skuList = result.data;
      this.skuList = skuList;
    },
  },
  mounted() {
    //全局事件总线绑定事件
    // this.$bus.$on('change', this.handleCategoryChange);
    // this.$bus.$on('clearList', this.clearList);
  },
  //清空全局事件绑定的事件
  // this.$bus.$off('change', this.handleCategoryChange);
  //this.$bus.$off('clearList', this.clearList);
};
</script>

<style lang="less" scoped>
</style>
