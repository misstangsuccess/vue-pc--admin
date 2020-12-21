<template>
  <div style="width: 100%; height: 300px; overflow: hidden">
    <ve-histogram
      :data="chartData"
      :settings="chartSettings"
      :legend-visible="false"
      height="400px"
      style="margin-top: -50px"
    ></ve-histogram>
  </div>
</template>

<script>
export default {
  name: 'BarChart',
  data() {
    this.chartSettings = {
      stack: { page: ['pageA', 'pageB', 'pageC'] }, //数据会堆叠在一起
      labelMap: {}, //设置指标的别名，同时作用于提示框和图例
    };
    return {
      chartData: {
        columns: ['日期', 'pageA', 'pageB', 'pageC'],
        rows: [
          { 日期: '周一', pageA: 1393, pageB: 1093, pageC: 2623 },
          { 日期: '周二', pageA: 3530, pageB: 3230, pageC: 1093 },
          { 日期: '周三', pageA: 2923, pageB: 2623, pageC: 3530 },
          { 日期: '周四', pageA: 1723, pageB: 1423, pageC: 1093 },
          { 日期: '周五', pageA: 3792, pageB: 3492, pageC: 3792 },
          { 日期: '周六', pageA: 4593, pageB: 4293, pageC: 1423 },
          { 日期: '周日', pageA: 4593, pageB: 4293, pageC: 1093 },
        ],
      },
    };
  },
};
</script>
