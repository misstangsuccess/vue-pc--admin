<template>
  <div>
    <p>{{ count }}</p>
    <!-- <button @click="add">按钮</button> -->
    <button @click="$listeners['update:count'](count + 1)">按钮</button>
  </div>
</template>

<script>
export default {
  name: 'Test',
  /* props: ['count', 'add'], */
  props: ['count'],
  mounted() {
    //console.log(this);
  },
};
</script>

<style lang="less" scoped>
</style>
