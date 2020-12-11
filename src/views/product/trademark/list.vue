<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="visible = true"
      >添加</el-button
    >
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="logoUrl" class="trademark-img" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
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
    <el-dialog title="添加品牌" :visible.sync="visible" width="50%">
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!--
            前提允许跨域
              action="http://182.92.128.115/admin/product/fileUpload"
              目标服务器地址: 代理配置中 (vue.config.js)

            不允许跨域，就使用proxy
              action="/dev-api/admin/product/fileUpload"
              /dev-api -> request.js 代理
             在main.js中定义 Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API
           -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      trademarkList: [],
      total: 0,
      page: 1,
      limit: 3,
      visible: false, //对话框隐藏
      trademarkForm: {
        tmName: '',
        logoUrl: '',
      },
      //表单校验规则
      rules: {
        tmName: [
          {
            required: true,
            message: '请输入品牌名称',
            trigger: 'blur',
          },
        ],
        logoUrl: [
          {
            required: true,
            message: '请上传品牌LOGO',
          },
        ],
      },
    };
  },
  methods: {
    //获取动态数据展示,并操作分页器
    async getPageList(page, limit) {
      //由于在main.js中把所有api中的请求都引入过去了,并重命为API,
      //而且还在Vue的原型上定义了$APIP这个方法,所以组件中可以使用了
      try {
        const result = await this.$API.trademark.getPageList(page, limit);
        console.log(result);
        if (result.code === 200) {
          this.$message.success('获取品牌分布列表成功');
          //获取数据
          this.page = result.data.current; //当前页码
          this.limit = result.data.size; //每页条数
          this.total = result.data.total; //总页数
          this.trademarkList = result.data.records; //品牌列表
        } else {
          this.$message.error('获取品牌列表失败');
        }
      } catch (e) {
        console.log(e);
        this.$message.error('获取品牌列表失败');
      }
    },
    //提交表单
    submitForm(form) {
      //进行表单验证
      this.$refs[form].validate(async (valid) => {
        //若检验成功则发送请求
        if (valid) {
          const result = await this.$API.trademark.addTradeMark(
            this.trademarkForm
          );
          //判断是否请求成功
          if (result.code === 200) {
            this.$message.success('添加品牌数据成功');
            //隐藏对话框
            this.visible = false;
            //更新数据
            this.getPageList(this.page, this.limit);
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    //文件上传成功的回调函数
    handleAvatarSuccess(res) {
      console.log(res);
      this.trademarkForm.logoUrl = res.data;
    },
    //文件上传之前的回调函数
    beforeAvatarUpload(file) {
      //声明图片格式
      const imgTypes = ['image/jpg', 'image/png', 'image/jpeg'];
      //判断图片格式
      const isValidTypes = imgTypes.indexOf(file.type) > -1;
      //检测文件大小
      const isLt = file.seze > 1025 < 50;
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
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
};
</script>

<style lang="sass" scoped>
.trademark-img
  width: 100px
.trademark-pagination
  text-align: right
>>>.el-pagination__sizes
  margin-left: 250px

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
