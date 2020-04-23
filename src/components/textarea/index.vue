<template>
  <field 
    v-bind="$attrs"
    v-on="$listeners"/>
</template>

<script>
import { Textarea } from 'cube-ui';
import mixIn from '../mixin';

export default {
  name: 'kk-textarea',
  mixins: [mixIn()],
  methods: {
    onChange(value){
      this.$emit('input', value);
    }
  },
  components: {
    'field': Textarea
  }
};
</script>

<style></style>
