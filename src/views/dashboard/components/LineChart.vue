<template>
  <div ref="LineChartContainer" class="line-chart-container"></div>
</template>

<script>
import Echarts from 'echarts';
/* 引入主题颜色包 */
import 'echarts/theme/macarons';
import resize from './mixins/resize';

export default {
  name: 'LineChart',
  mixins: [resize],
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    yTittle: {
      type: String,
      requird: true,
    },
  },
  methods: {
    //初始化echarts
    initChart() {
      this.chart = Echarts.init(this.$refs.LineChartContainer, 'macarons');
    },
    //定义option
    setOption({ expectedData, actualData }) {
      const option = {
        /*  title: {
          text: '堆叠区域图',
        }, */
        //提示十字架
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: 'skublue',
            },
          },
        },
        //代表有几种数据
        legend: {
          data: ['预期', '实际'],
        },
        /*  toolbox: {//下载
          feature: {
            saveAsImage: {},
          },
        }, */
        grid: {
          left: '1%',
          right: '1%',
          bottom: '1%',
          containLabel: true, //充满整个容器,防止溢出
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '交易金额(万元)',
          },
        ],
        //数据
        series: [
          {
            name: '预期',
            type: 'line',
            /* stack: '总量', */
            /* areaStyle: {}, */
            data: expectedData,
            smooth: true, //平滑线
            lineStyle: {
              //线条颜色
              color: 'blue',
            },
          },
          {
            name: '实际',
            type: 'line',
            /* stack: '总量', */
            areaStyle: {
              //区域颜色
              color: 'gray',
              opacity: 0.3,
            },
            data: actualData,
            smooth: true, //平滑线
            lineStyle: {
              //线条颜色
              color: 'red',
            },
          },
        ],
      };
      //调用生成图表
      this.chart.setOption(option);
    },
  },
  watch: {
    //更新图表时同时更新数据
    chartData({ expectedData, actualData }) {
      this.setOption({ expectedData, actualData });
    },
  },
  mounted() {
    //初始化调用
    this.initChart();
  },
};
</script>

<style lang="sass">
.line-chart-container
  width: 100%
  height: 400px
</style>
