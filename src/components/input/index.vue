<template>
  <field 
    v-bind="$attrs"
    v-on="$listeners"/>
</template>

<script>
import { Input } from 'cube-ui';
import mixIn from '../mixin';

export default {
  name: 'kk-input',
  mixins: [mixIn()],
  methods: {
    onChange(value){
      this.$emit('input', value);
    }
  },
  components: {
    'field': Input
  }
};
</script>

<style></style>
