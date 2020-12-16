<template>
  <e-card style="margin-top: 20px">
    <el-form ref="skuForm" label-width="100px" :rules="rules" :model="sku">
      <el-form-item label="spu名称">
        <span>haha</span>
      </el-form-item>
      <el-form-item label="sku名称">
        <el-input placeholder="请输入SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
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
        <div class="skulist-select">
          <span>111</span>
          <el-select placeholder="请选择">
            <el-option label="区域一" value="shanghai">1</el-option>
            <el-option label="区域二" value="beijing">2</el-option>
          </el-select>
        </div>
        <div class="skulist-select">
          <span>222</span>
          <el-select placeholder="请选择">
            <el-option label="区域一" value="shanghai">3</el-option>
            <el-option label="区域二" value="beijing">4</el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="销售属性">
        <div class="skulist-select">
          <span>111</span>
          <el-select placeholder="请选择">
            <el-option label="区域一" value="shanghai">1</el-option>
            <el-option label="区域二" value="beijing">2</el-option>
          </el-select>
        </div>
        <div class="skulist-select">
          <span>222</span>
          <el-select placeholder="请选择">
            <el-option label="区域一" value="shanghai">3</el-option>
            <el-option label="区域二" value="beijing">4</el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片">
        <el-table
          ref="multipleTable"
          :data="[]"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片" width="120">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" alt="" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" width="120">
          </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
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
export default {
  name: 'SkuList',
  props: {
    skuItem: Object,
  },
  data() {
    return {
      //重新定义数据
      sku: this.skuItem,
      //定义校验规则
      rules: {},
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      attrList: [],
    };
  },
  methods: {
    //获取平台属性
    async getAttrList(category) {
      this.category = category;
      const result = await this.$API.attrs.getAttrList(category);
      if (result.code === 200) {
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {},
};
</script>

<style lang="sass" scoped>
.skulist-select
  display: inline-block
  margin-left: 20px
>>>.el-input-number .el-input__inner
  text-align: left
</style>
