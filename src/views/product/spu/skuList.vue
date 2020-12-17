<template>
  <e-card style="margin-top: 20px">
    <el-form ref="skuForm" label-width="100px" :rules="rules" :model="sku">
      <el-form-item label="spu名称" prop="spuName">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="sku名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="请选择SKU价格"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number
          controls-position="right"
          :min="0"
          placeholder="请选择SKU重量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="请输入SKU描述"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <div class="skulist-select" v-for="attr in attrList" :key="attr.id">
          <span>{{ attr.attrName }}</span>
          <el-select placeholder="请选择" v-model="spu.attrId">
            <el-option
              :label="value.valueName"
              :value="value.id"
              v-for="value in attr.attrValueList"
              :key="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div
          class="skulist-select"
          v-for="sale in spuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-select placeholder="请选择">
            <el-option
              v-for="value in sale.spuSaleAttrValueList"
              :key="value.id"
              :label="value.saleAttrValueName"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片">
        <el-table
          border
          ref="multipleTable"
          :data="imageList"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" prop="isChecked">
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" :alt="scope.row.imgUrl" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip>
            <template
              ><el-button type="primary" size="mini"
                >设置为默认</el-button
              ></template
            >
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </e-card>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'SkuList',
  props: {
    spuItem: Object,
  },
  data() {
    return {
      //重新定义数据
      spu: this.spuItem,
      //定义校验规则
      rules: {},
      attrList: [], //平台属性
      imageList: [], //图片列表
      spuSaleAttrList: [], //spu销售属性列表
      sku: {}, //sku数据
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    //获取平台属性
    async getAttrList() {
      /*   const result = await this.$API.attrs.getAttrList({
        category1Id: this.spu.category1Id,
        category2Id: this.spu.category2Id,
        category3Id: this.spu.category3Id,
      }); */
      const result = await this.$API.attrs.getAttrList(this.category);
      if (result.code === 200) {
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取spu销售列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success('获取spu销列表数据成功~');
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取所有图片列表
    async getSpuImageList() {
      //从spu中获取id
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success('请求所有图片成功~');
        this.imageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getAttrList();
    this.getSpuSaleAttrList();
    this.getSpuImageList();
  },
};
</script>

<style lang="sass" scoped>
.skulist-select
  display: inline-block
  margin-left: 20px
>>>.el-input-number .el-input__inner
  text-align: left
</style>
