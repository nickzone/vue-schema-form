<template>
  <field 
    v-bind="$attrs"
    :options="_options"
    v-on="$listeners"/>
</template>

<script>
import { select } from 'cube-ui';
import mixIn from '../mixin';

export default {
  name: 'kk-select',
  mixins: [mixIn({valueToString: {type: 'select'}})],
  props: {
    options: {
      type: Array,
      default: ()=> []
    }
  },
  computed: {
    _options() {
      return  this.options.map((item) => {
        return {
          text: item.label,
          value: item.value
        };
      });
    }
  },
  methods: {
    onChange(value){
      this.$emit('input', value);
    }
  },
  components: {
    'field': select
  }
};
</script>

<style></style>
