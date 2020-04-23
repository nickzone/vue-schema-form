<template>
  <span v-bind="$attrs" class="kk-form-text">{{ value }}</span>
</template>

<script>
export default {
  name: 'kk-text',
  props: ['value']
};
</script>

<style>
  .kk-form-text {
    word-break: break-all;
    background-color: white;
    line-height: 1.5;
  }
</style>
