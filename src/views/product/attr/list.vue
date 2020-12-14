<template>
  <div>
    <Category
      @change="getAttrList"
      @clearList="clearList"
      :disabled="!isShowList"
    />
    <!--三级分类数据展示及对应的属性值展示 -->
    <el-card v-show="isShowList" style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="add"
        :disabled="!category.category3Id"
        >添加属性</el-button
      >

      <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>

        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrVal in row.attrValueList"
              :key="attrVal.id"
              >{{ attrVal.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 对相应属性值进行修改删除操作 -->
    <el-card v-show="!isShowList" style="margin-top: 20px">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
        >添加属性</el-button
      >

      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>

        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <!-- keyup.enter.native给组件绑定事件使用,会给组件中的
            第一个标签绑定相应原生DOM事件
             -->
            <el-input
              size="mini"
              v-if="row.edit"
              v-model="row.valueName"
              autofocus
              ref="input"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
            ></el-input>
            <!-- $set方法给对象添加的新属性可以是响应式数据 -->
            <span
              style="display: block; width: 100%"
              v-else
              @click="edit(row)"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`您确定删除${row.valueName}吗?`"
              @onConfirm="delAttrValue($index)"
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
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from '@/components/Category';
export default {
  name: 'AttrList',
  data() {
    return {
      attrList: [],
      isShowList: true,
      /* 对相应属性值进行操作的数据*/
      attr: {
        attrName: '',
        attrValueList: [],
      },
      category: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    };
  },
  /*  数据结构
   attrList:Array[1]
      categoryId:62
      categoryLevel:3
      attrName:"属性"
      id:3414
      attrValueList:Array[4]
        attrId:136
        id:16163
        valueName:"RTX2080"

 */
  methods: {
    /* 定义自定义方法接收子组件传递过来的数据,
    并发送请求获取分类列表对应的属性值 */
    async getAttrList(category) {
      this.category = category;
      const result = await this.$API.attrs.getAttrList(category);
      if (result.code === 200) {
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    /* 更新数据 */
    update(attr) {
      //为了修改当前的attr时会修改原数据,但是这个是浅度克隆,还是会影响原数据
      /*  this.attr = {
        ...attr,
      }; */
      //深度克隆,防止对象中的对象还存在引用关系
      this.attr = JSON.parse(JSON.stringify(attr));
      this.isShowList = false;
    },
    //编辑表单
    edit(row) {
      this.$set(row, 'edit', true);
      //表单绑定聚焦事件
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //添加属性值
    addAttrValue() {
      //添加编辑表单
      this.attr.attrValueList.push({
        edit: true,
      });
      //表单聚焦事件
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //删除属性值
    delAttrValue(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    //保存数据
    async save() {
      //判断是否要添加
      const isAdd = !this.attr.id;
      const data = this.attr;
      if (isAdd) {
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }
      const result = await this.$API.attrs.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success('更新属性成功');
        //调用获取分类列表对应属性的列表的方法
        this.getAttrList(this.category);
        this.isShowList = true;
      } else {
        this.$message.error(result.message);
      }
    },
    //表单失去焦点事件验证表单是否有值
    editCompleted(row, index) {
      if (!row.valueName) {
        //删除表单中的数据
        this.attr.attrValueList.splice(index, 1);
        // this.$message.warning('请输入属性名称');
        return;
      }
    },
    //添加属性
    add() {
      this.isShowList = false;
      this.attr.attrName = '';
      this.attr.attrValueList = [];
    },
    //清空数据
    clearList() {
      //清空数据
      this.attrList = [];
      //禁用按钮
      this.category.category3Id = '';
    },
  },
  mounted() {
    //全局事件总线绑定事件
    this.$bus.$on('change', this.getAttrList);
    this.$bus.$on('clearList', this.clearList);
  },
  beforeDestroy() {
    //清空全局事件绑定的事件
    this.$bus.$off('change', this.getAttrList);
    this.$bus.$off('clearList', this.clearList);
  },
  components: {
    Category,
  },
};
</script>
