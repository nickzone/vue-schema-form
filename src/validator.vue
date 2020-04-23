<template>
  <div>
    <slot :message="message" :dirty="dirty"></slot>
  </div>
</template>

<script>
export default {
  props: {
    validate: {
      type: Object,
      default(){
        return {
          $dirty: false,
          $errors: null
        };
      }
    }
  },
  computed: {
    message(){
      const $errors = this.validate.$errors;
      if($errors && $errors.length > 0) {
        return $errors[0].message;
      }
      return '';
    },
    dirty(){
      return this.validate.$dirty;
    }
  }
};
</script>

<style>

</style>