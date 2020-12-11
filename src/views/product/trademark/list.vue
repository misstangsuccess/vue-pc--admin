<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="tableData" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="id" label="序号" width="80" align="center"> </el-table-column>
      <el-table-column prop="name" label="品牌名称">
      </el-table-column>
      <el-table-column label="品牌logo">
        <template slot-scope="scope">
          <img :src="scope.row.logo" alt="logo" class="trademark-img" />
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
      :page-sizes="[3, 6, 9]"
      :page-size="3"
      layout="prev, pager, next, jumper, sizes, total"
      :total="50"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TrademarkList',
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: 'huawei',
          logo:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607670646160&di=706bf00ca04675f5f90c56c4a6739b92&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F17%2F09%2F03%2F5095b5884be9f3b8dd2ca53de5a4e785.jpg%2521%2Ffwfh%2F804x669%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue',
        },
      ],
    };
  },
};
</script>

<style lang="sass">
.trademark-img
  width: 100px
.trademark-pagination
  text-align: right
.el-pagination__sizes
  margin-left: 250px
</style>
