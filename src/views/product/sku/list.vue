<template>
  <!-- stripe是否为斑马纹 table -->
  <el-card class="sku-list">
    <el-table
      :data="skuList"
      stripe
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
        row-key="id"
      >
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="180">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column label="默认图片" width="150" align="center">
        <template slot-scope="{ row }">
          <div class="info">
            <div class="pic">
              <img
                :src="row.skuDefaultImg"
                :alt="row.skuDefaultImg"
                style="width: 80px"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)"> </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template v-slot="{ row }">
          <el-button
            v-if="row.isSale == 0"
            type="info"
            icon="el-icon-top"
            size="mini"
            title="上架"
            @click="onSale(row.id)"
          ></el-button>
          <el-button
            v-else-if="row.isSale == 1"
            type="success"
            icon="el-icon-bottom"
            size="mini"
            title="下架"
            @click="cancelSale(row.id)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改"
            @click="updateSku(row.id)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            title="查看详情"
            @click="showSkuInfo(row.id)"
          ></el-button>
          <el-popconfirm
            :title="`您确定删除${row.skuName}吗?`"
            @onConfirm="deleteSku(row.id)"
          >
            <el-button
              type="danger"
              slot="reference"
              icon="el-icon-delete"
              size="mini"
              title="删除"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      style="padding: 20px 0; text-align: center"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="changeSize"
    />

    <el-drawer :visible.sync="isShowSkuInfo" :with-header="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18"
          ><el-tag
            type="success"
            style="margin-right: 5px"
            v-for="value in skuInfo.skuAttrValueList"
            :key="value.id"
            >{{ value.attrId + '-' + value.valueId }}</el-tag
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="18"
          ><el-tag
            type="success"
            style="margin-right: 5px"
            v-for="value in skuInfo.skuSaleAttrValueList"
            :key="value.id"
            >{{ value.id + '-' + value.saleAttrValueId }}</el-tag
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16"
          ><el-carousel class="sku-carousel" height="400px" trigger="click">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: 'SKuList',
  data() {
    return {
      skuList: [], //sku列表
      loading: false, //懒加载
      total: 0, //总条数
      page: 1, //页码
      limit: 10, //每页显示的条数
      skuInfo: {}, //skuinfo数据
      isShowSkuInfo: false, //不展示skuinfo数据
    };
  },
  mounted() {
    //调用函数
    this.getSkuList();
  },
  methods: {
    //获取sku分页列表数据
    async getSkuList(page = 1) {
      this.page = page;
      this.loading = true;
      //发送请求
      const result = await this.$API.sku.getList(this.page, this.limit);
      this.skuList = result.data.records;
      this.total = result.data.total;
      this.loading = false;
    },
    //页面发生变化
    changeSize(size) {
      this.limit = size;
      this.getSkuList();
    },
    //上架
    onSale(skuId) {
      //发送请求获取id
      const result = this.$API.sku.onSale(skuId);
      if (result.code === 200) {
        this.$message.success('上架成功~');
      }
      //更新页面数据
      this.getSkuList(this.page);
    },
    //下架
    cancelSale(skuId) {
      //发送请求获取id
      const result = this.$API.sku.cancelSale(skuId);
      if (result.code === 200) {
        this.$message.success('下架成功~');
      }
      //更新页面数据
      this.getSkuList(this.page);
    },
    //删除sku
    async deleteSku(skuId) {
      try {
        const result = await this.$API.sku.deleteSku(skuId);
        if (result.code === 200) {
          this.$message.success('删除sku成功~');
        }
        //更新页面数据
        this.getSkuList(1);
      } catch (error) {
        this.$message.error(result.message);
      }
    },
    //修改
    updateSku() {
      this.$message.info('正在开发中......');
    },
    //展示详情
    async showSkuInfo(id) {
      this.isShowSkuInfo = true;
      const result = await this.$API.sku.getSkuById(id);
      this.skuInfo = result.data;
    },
  },
};
</script>
<style lang="sass" scoped>
.sku-list
  .el-row
    height: 40px
    .el-col
      line-height: 40px
      &.el-col-5
        font-size: 18px
        font-weight: bold
        text-align: right
        margin-right: 20px

    .sku-carousel
      width: 400px
      border: 1px solid #ccc
      img
        width: 400px
        height: 400px

      /deep/ .el-carousel__indicator
        button
          background-color: hotpink

        &.is-active
          button
            background-color: green
</style>
