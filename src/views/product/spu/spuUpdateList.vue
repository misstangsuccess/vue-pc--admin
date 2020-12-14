<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
          <!-- label是显示的内容,value是值-->
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          placeholder="请输入SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :file-list="imageList"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <el-form-item label="销售属性" prop="saleAttrId">
        <el-select
          :placeholder="`还剩${filterSaleAttrList.length}个未选`"
          v-model="spu.saleAttrId"
        >
          <!-- prop将来用来作表单校验 -->
          <el-option
            v-for="sale in filterSaleAttrList"
            :key="sale.id"
            :label="sale.name"
            :value="sale.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table
          :data="spuSaleAttrList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名称" width="150">
          </el-table-column>

          <el-table-column label="属性值列表">
            <template v-slot="{ row }">
              <el-tag
                style="margin-right: 5px"
                v-for="attrVal in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="previewImgUrl" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'SpuUpdateList',
  //接收父组件传递过来的数据,由于是只读不能修改所以需要定义一个数据
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      trademarkList: [], //所有品牌数据
      imageList: [], //图片列表
      previewImgUrl: '', //图片地址
      visible: false, //图片显示隐藏
      saleAttrList: [], //所有销售属性列表数据
      spuSaleAttrList: [], //spu销售属性列表数据
    };
  },
  computed: {
    //过滤所有销售属性列表显示的数量
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        /* indexOf只用于数组的基本数据类型
        finde用于数组中的引用类型
        找到了就返回{},布尔值为true,没有找到就是undefined布尔值是false
         */
        return this.spuSaleAttrList.find((spuSale) => {
          spuSale.baseSaleAttrId === sale.id;
        });
      });
    },
  },
  methods: {
    //获取所有的品牌数据,封装起来为了后面复用
    async getTrademarkList() {
      //请求所有的品牌数据列表
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success('请求所有品牌数据成功~');
        this.trademarkList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取所有图片列表
    async getSpuImageList(spuId) {
      //从spu中获取id
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success('请求所有图片成功~');
        //处理数据格式
        this.imageList = result.data.map((img) => {
          return {
            id: img.id,
            name: img.imgName,
            url: img.imgUrl,
          };
        });
      } else {
        this.$message.error(result.message);
      }
    },
    //图片预览
    handlePreview(file) {
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    //删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.imageList = this.imageList.filter((img) => img.id !== file.id);
    },
    //获取所有销售列表
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.$message.success('获取所有销列表数据成功~');
        this.saleAttrList = result.data;
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
  },
  async mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSaleAttrList();
    this.getSpuSaleAttrList();
  },
};
</script>

<style lang="sass" scoped>
</style>
