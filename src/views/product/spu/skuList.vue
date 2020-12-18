<template>
  <el-card style="margin-top: 20px">
    <el-form ref="skuForm" label-width="100px" :rules="rules" :model="sku">
      <el-form-item label="spu名称" prop="spuName">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="sku名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          v-model="sku.price"
          controls-position="right"
          align="left"
          style="width: 300px"
          :min="0"
          :max="300000"
          placeholder="请输入SKU价格"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          style="width: 300px"
          controls-position="right"
          v-model="sku.weight"
          :min="0"
          :max="30000000"
          placeholder="请输入SKU重量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          type="textarea"
          placeholder="请输入SKU描述"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div
          v-for="(attr, index) in attrList"
          :key="attr.id"
          class="skulist-select"
        >
          <!-- <span>{{ attr.attrName }}</span> -->
          <el-form-item style="display: inline-block" :label="attr.attrName">
            <el-select
              placeholder="请选择"
              v-model="sku.skuAttrValueList[index]"
              @click="clearValidate('skuAttrValueList')"
            >
              <el-option
                :label="value.valueName"
                :value="`${attr.id}-${value.id}`"
                v-for="value in attr.attrValueList"
                :key="value.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <div
          class="skulist-select"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <!--  <span>{{ sale.saleAttrName }}</span> -->
          <el-form-item
            style="display: inline-block"
            :label="sale.saleAttrName"
          >
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrValueList[index]"
              @click="clearValidate('skuSaleAttrValueList')"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="`${sale.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="图片" prop="skuImageList">
        <el-table
          border
          ref="multipleTable"
          :data="imageList"
          tooltip-effect="dark"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <el-table-column type="selection" width="55" reserve-selection>
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <img
                style="display: inline-block; width: 100%; height: 100px"
                :src="scope.row.imgUrl"
                :alt="scope.row.imgUrl"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作" show-overflow-tooltip>
            <template v-slot="{ row, $index }"
              ><el-button
                v-if="!row.isDefault"
                type="primary"
                size="mini"
                @click="setDefault($index)"
                >设置为默认</el-button
              ><el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
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
      attrList: [], //平台属性
      imageList: [], //图片列表
      spuSaleAttrList: [], //spu销售属性列表
      sku: {
        //sku数据
        skuAttrValueList: [], //平台属性
        skuSaleAttrValueList: [], //销售属性
        skuImageList: [], //图片
      },
      //定义校验规则
      rules: {
        skuName: [
          { required: true, message: '请输入sku名称', trigger: 'change' },
        ],
        price: [
          { required: true, message: '请输入sku价格', trigger: 'change' },
        ],
        weight: [
          { required: true, message: '请输入sku重量', trigger: 'change' },
        ],
        skuDesc: [
          { required: true, message: '请输入sku描述', trigger: 'change' },
        ],
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
        skuSaleAttrValueList: [
          { required: true, validator: this.skuSaleAttrValueListValidator },
        ],
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
      },
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
        this.$message.success('获取所有平台属性成功~');
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
        this.imageList = result.data.map((img) => {
          return {
            ...img,
            isCheck: true,
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },
    //设置默认图片
    setDefault(i) {
      this.clearValidate('skuImageList');
      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: i === index ? true : false,
        };
      });
    },
    //自定义校验平台属性
    skuAttrValueListValidator(rule, value, callback) {
      const {
        attrList,
        sku: { skuAttrValueList },
      } = this;
      console.log(111);
      if (
        skuAttrValueList.length !== attrList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback(new Error('请对所有平台属性进行选择~'));
        return;
      }
      callback();
    },
    //自定义校验销售属性
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      console.log(2222);
      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback(new Error('请对所有属性销售进行选择~'));
        return;
      }
      callback();
    },
    //自定义校验图片
    skuImageListValidator(rule, value, callback) {
      const {
        sku: { skuImageList },
      } = this;
      console.log(333);
      if (skuImageList.length === 0) {
        callback(new Error('请至少选择一张图片~'));
        return;
      }
      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error('请设置一张默认图片~'));
        return;
      }
      callback();
    },
    //选择操作
    handleSelectionChange(skuImageList) {
      this.spu.skuImageList = skuImageList;
    },
    //清空表单校验
    clearValidate(prop) {
      this.$refs.skuForm.clearValidate(prop);
    },
    //保存
    save() {
      this.$refs.skuForm.validate((valid) => {
        if (valid) {
          console.log('校验通过');
        }
      });
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
  width: 30%
>>>.el-input-number .el-input__inner
  text-align: left
</style>
