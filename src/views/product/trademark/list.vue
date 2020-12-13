<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="addBtn"
      >添加</el-button
    >
    <!--
          .sync用于父子通信(子向父)
          :count.sync="count" 给子组件传递xxx数据以及更新数据的方法update:xxx
           相当于:count="count" @update:count="xxx"
         -->
    <Test :count.sync="count" />
    <!-- <Test :count="count" :add="add" /> -->
    <!-- 商品展示列表 -->
    <el-table
      :data="trademarkList"
      v-loading="loading"
      border
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="logoUrl" class="trademark-img" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="warning" icon="el-icon-edit" @click="update(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" @click="delTrade(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
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
    <!-- 对话框 -->
    <el-dialog
      :title="`${trademarkForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
      <!-- form表单 -->
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
            # base api
            VUE_APP_BASE_API = '/dev-api'

              action="/dev-api/admin/product/fileUpload"
              /dev-api -> request.js 代理
             在main.js中定义 Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API
           -->
          <!-- 上传框 -->
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
import Test from './test';
export default {
  name: 'TrademarkList',
  data() {
    return {
      count: 0,
      trademarkList: [],
      total: 0,
      page: 1,
      limit: 3,
      visible: false, //对话框隐藏
      loading: false,
      trademarkForm: {
        tmName: '',
        logoUrl: '',
      },
      //表单校验规则
      rules: {
        tmName: [
          {
            //也可以自定义验证规则
            validator: this.validator,
            /* required: true,
            message: '请输入品牌名称', */
            trigger: 'blur',
          },
        ],
        //图片格式验证规
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
    //自定义校验规则
    validator(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入品牌名称'));
      } else if (value.length > 2 && value.length > 10) {
        callback(new Error('输入品牌名称的长度应为2-10位'));
        return;
      }
      callback();
    },
    //.sync操作
    add() {
      this.count++;
    },
    //获取动态数据展示,并操作分页器
    async getPageList(page, limit) {
      this.loading = true;
      //由于在main.js中把所有api中的请求都引入过去了,并重命为API,
      //而且还在Vue的原型上定义了$APIP这个方法,所以组件中可以使用了
      const result = await this.$API.trademark.getPageList(page, limit);
      //console.log(result);
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
      this.loading = false;
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
    //文件上传成功的回调函数
    handleAvatarSuccess(res) {
      // console.log(res);
      this.trademarkForm.logoUrl = res.data;
    },
    //添加完数据后清空数据
    addBtn() {
      //清空表单验证
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.visible = true;
      this.trademarkForm = {
        tmName: '',
        logoUrl: '',
      };
    },
    //更新数据
    update(row) {
      //清空表单验证
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.visible = true;
      //由于地址一样只要修改数据就会触发表单修改,所以复用解构对象的方法,得到一个新的对象进行操作
      this.trademarkForm = { ...row };
    },
    //提交表单
    submitForm(form) {
      //进行表单验证
      this.$refs[form].validate(async (valid) => {
        //验证是否是修改了数据
        if (valid) {
          //获取数据
          const { trademarkForm } = this;
          //!!强制转给布尔值,代表是否更新
          const isUpdate = !!trademarkForm.id;
          //若要修改数据就发送请求更新数据
          if (isUpdate) {
            //判断id是否一样
            const tm = this.trademarkList.find(
              (tm) => tm.id === trademarkForm.id
            );
            if (
              tm.tmName === trademarkForm.tmName &&
              tm.logoUrl === trademarkForm.logoUrl
            ) {
              //若表单内容和图片未进行修改则弹窗警告
              this.$message.warning('不能提交与之前一样的数据');
              return;
            }
          }
          //表单验证发送请求
          let result;
          //若修改了数据就发请求更新数据
          if (isUpdate) {
            result = await this.$API.trademark.updateTradeMark(trademarkForm);
          } else {
            //否则就是添加数据
            result = await this.$API.trademark.addTradeMark(trademarkForm);
          }
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
    //删除品牌数据
    delTrade(row) {
      this.$confirm(`你确定要删除${row.tmName}吗?`, '提示', {
        type: 'warning',
      })
        .then(async () => {
          //发送请求
          const result = await this.$API.trademark.delTradeMark(row.id);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          //更新数据并判断页面中没有数据时会自动更新页面
          this.getPageList(
            this.trademarkList.length == 1 && this.page > 1
              ? this.page - 1
              : this.page,
            this.limit
          );
        })
        .catch((error) => {
          console.log(222);
          if (error === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          }
        });
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
  components: {
    Test,
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
