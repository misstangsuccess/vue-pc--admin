<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu" ref="spuForm" :rules="rules">
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
      <el-form-item label="SPU图片" prop="imageList">
        <el-upload
          accept="image/*"
          class="avatar-uploader"
          list-type="picture-card"
          :file-list="formatImageList"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <el-form-item label="销售属性" prop="sale">
        <!-- <el-form-item label="销售属性" prop="saleAttrId"> -->
        <!-- <el-select
          :placeholder="`还剩${filterSaleAttrList.length}个未选`"
          v-model="spu.saleAttrId"
        > -->
        <el-select
          :placeholder="`还剩${filterSaleAttrList.length}个未选`"
          v-model="spu.sale"
        >
          <!-- prop将来用来作表单校验 -->
          <!-- <el-option
            v-for="sale in filterSaleAttrList"
            :key="sale.id"
            :label="sale.name"
            :value="sale.id"
          ></el-option> -->
          <el-option
            v-for="sale in filterSaleAttrList"
            :key="sale.id"
            :label="sale.name"
            :value="`${sale.id}-${sale.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!spu.sale"
          @click="addSpuSaleAttr"
          >添加销售属性</el-button
        >
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
              <!-- closable关闭按钮 -->
              <el-tag
                @close="delTag(i, row)"
                closable
                style="margin-right: 5px"
                v-for="(attrVal, i) in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
              <el-input
                v-if="row.edit"
                size="mini"
                style="width: 100px"
                autofocus
                ref="input"
                v-model="saleAttrValueText"
                @blur="editCompleted(row)"
                @keyup.enter.native="editCompleted(row)"
              ></el-input>
              <el-button
                v-else
                size="mini"
                icon="el-icon-plus"
                @click="edit(row)"
              >
                添加
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                @onConfirm="delSpuSaleAttr($index)"
                :title="`您确定删除${row.saleAttrName}吗?`"
              >
                <el-button
                  type="primary"
                  slot="reference"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('showList', spu.category3Id)">取消</el-button>
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
      saleAttrValueText: '',
      //表单校验规则:
      rules: {
        spuName: [{ required: true, message: '请输入SPU名称' }],
        tmId: [{ required: true, message: '请选择品牌' }],
        description: [{ required: true, message: '请输入SPu描述' }],
        imageList: [{ required: true, validator: this.imageListValidator }],
        sale: [{ required: true, validator: this.saleValidator }],
      },
    };
  },
  computed: {
    //处理图片数据格式
    formatImageList() {
      return this.imageList.map((img) => {
        return {
          //图片的标识
          uid: img.uid || img.id,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
    //过滤所有销售属性列表显示的数量
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        /* indexOf只用于数组的基本数据类型
        find用于数组中的引用类型
        找到了就返回{},布尔值为true,没有找到就是undefined布尔值是false
         */
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
    },
  },
  methods: {
    //校验图片
    imageListValidator(rule, value, callback) {
      if (this.imageList.length > 0) {
        //校验通过
        callback();
        return;
      }
      //校验失败
      callback(new Error('请至少上传一张图片'));
    },
    //销售属性选择校验
    saleValidator(rule, value, callback) {
      //判断销售属性
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error('请选择至少一个销售属性~'));
        return;
      }
      //判断销售属性的每项值
      const bad = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      );
      if (bad) {
        callback(new Error('销售属性至少添加一个销售属性值~'));
        return;
      }
      callback();
    },
    //进行保存时并校验表单
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          console.log('校验通过');
        }
        //收集数据
        const spu = {
          ...this.spu, //展开数据
          spuImageList: this.imageList,
          spuSaleAttrList: this.spuSaleAttrList,
        };
        //发送请求
        const result = await this.$API.spu.updateSpu(spu);
        if (result.code === 200) {
          //触发事件跳转到showlist页面
          this.$emit('showList', this.spu.category3Id);
          //showlist页面展示updatelist的数据(方法一,也可以在父组件触发)
          /*   this.$nextTick(() => {
            this.$bus.$emit('change', { category3Id: this.spu.category3Id });
          }); */
          this.$message.success('更新SPU数据成功~');
        } else {
          this.$message.error(result.message);
        }
      });
    },
    //删除整行的销售属性
    delSpuSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    //删除单个销售属性
    delTag(index, row) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //编辑添加按钮
    edit(row) {
      this.$set(row, 'edit', true);
      //表单绑定聚焦事件
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //添加销售属性值
    editCompleted(row) {
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          spuId: row.spuId,
          saleAttrValueName: this.saleAttrValueText,
        });
        ///清空选中的属性值
        this.saleAttrValueText = '';
      }
      row.edit = false;
    },
    //添加属性列表
    //(方法一数据未展示出)
    // addSpuSaleAttr() {
    //   //选中id
    //   const { saleAttrId, id } = this.spu;
    //   //找到某一个销售属性
    //   const sale = this.saleAttrList.find((sale) => sale.id === saleAttrId);
    //   //将spu销售属性添加到商品中
    //   this.spuSaleAttrList.push({
    //     baseSaleAttrId: sale.id,
    //     saleAttrName: sale.name,
    //     spuId: id,
    //     spuSaleAttrValueList: [],
    //   });
    //   //清空选中的属性值
    //   this.spu.saleAttrId = '';
    // },
    //(方法二)
    //添加属性
    addSpuSaleAttr() {
      //选中id
      const { sale, id } = this.spu;
      // console.log(spu);
      //获取到的数据是字符串格式
      const [baseSaleAttrId, saleAttrName] = sale.split('-');
      //将spu销售属性添加到商品中
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: id,
        spuSaleAttrValueList: [],
      });
      //清空选中的属性值
      this.spu.sale = '';
    },
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
    //文件上传成功的回调函数
    handleAvatarSuccess(res, file) {
      // console.log(res);
      this.imageList.push({
        uid: file.uid,
        imgName: file.name, //图片名称
        imgUrl: res.data, //图片地址
        spuId: this.spu.id, //图片Id
      });
    },
    //文件上传之前的回调函数
    beforeAvatarUpload(file) {
      //声明图片格式
      const imgTypes = ['image/jpg', 'image/png', 'image/jpeg'];
      //判断图片格式
      const isValidTypes = imgTypes.indexOf(file.type) > -1;
      //检测文件大小
      const isLt = file.seze > 1024 < 50;
      //判断是否上传成功
      if (!isValidTypes) {
        this.$message.error('只能上传jpg/png文件格式');
      }
      if (!isLt) {
        this.$message.error('文件大小不超过50kb');
      }
      //返回结果
      return isValidTypes && isLt;
    },
    //获取所有图片列表
    async getSpuImageList() {
      //从spu中获取id
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success('请求所有图片成功~');
        //处理数据格式
        /*  this.imageList = result.data.map((img) => {
          return {
            id: img.id,
            name: img.imgName,
            url: img.imgUrl,
          };
        }); */
        this.imageList = result.data;
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
      // console.log(file, fileList);
      /* this.imageList = this.imageList.filter((img) => img.id == file.id); */
      this.imageList = this.imageList.filter((img) => img.imgUrl !== file.url);
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
