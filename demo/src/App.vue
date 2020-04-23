<template>
  <div>
    <div style="
        top: 0;
        padding: 0 10px 0 ;
        position: fixed;
        left:0;
        right:0;
        opacity: 0.8;
        z-index: 100;">
      <div>schema配置(编辑并实时生效)</div>
      <textarea 
        placeholder="请输入表单配置" v-model="schemaJson"
        style="width:100%;height: 250px"/>
    </div>

    <kk-form
      v-if="showForm"
      ref="kkForm"
      :schema="schema"
      :model="model"
      :ajax="ajax"
      :context="context"
      :submitted="submitted"
      @change="onChange"
      @submit="onSubmit"
    />

    <div v-else>{{showError ? "JSON格式错误" : "渲染中..."}}</div>
    <button @click="valueToString">文本值（valueToString）</button>
  </div>
</template>

<script>
import { Toast } from 'cube-ui';
import {schema} from './schema';
import vue from 'vue';
vue.use(Toast);

export default {
  name: 'app',
  data() {
    return {
      showForm: true,
      showError: false,
      schemaJson: JSON.stringify(schema,null, 4),
      schema: schema,
      model: this.getInitModel(schema),
      context: {
        a: 'aaa',
        b: {
          c: 'ccc'
        }
      },
      submitted: false
    };
  },
  watch: {
    schemaJson(data) {
      this.showError = false;
      this.submitted = false;
      try {
        const current = JSON.parse(data);
        clearTimeout(this.showFormDelay);
        this.showFormDelay = setTimeout(() => {
          this.showForm = false;
          this.$nextTick(()=>{
            this.schema = current;
            this.model = this.getInitModel(current);
            this.showForm = true;
          });
        }, 1000);
      } catch(e) {
        this.showForm = false;
        this.showError = true;
      }
    }
  },
  created() {},
  methods: {
    onSubmit(err, model) {
      if (err) {
        console.log('没有校验通过！');
      }
      if (!err) {
        console.log('提交表单值：', model);
        this.submitted = true;
        this.schema.submit.label = '提交中...';
        setTimeout(() => { // 模拟异步提交
          this.schema.submit.label = '已提交';
        }, 1000);
      }
    },
    valueToString() {
      const value = [];
      this.$refs.kkForm.schema.fields.forEach((item) => {
        const ins = this.$refs.kkForm.getFieldInstance(item.name);
        value.push(`${item.label}: ${ins.valueToString ? ins.valueToString() : '未定义valueToString'}`);
      });
      alert(value.join('\n'));
    },
    // eslint-disable-next-line no-unused-vars
    onChange(field, allFields) {
      console.log('更改了:', field, );
    },
    ajax(url) {
      console.log('load remoteOptions url: ', url);

      return new Promise(resolve => {
        const data = [
          {
            key: 111,
            value: 111
          }
        ];

        resolve(data);
      });
    },
    getInitModel(schema) {
      let model = {};
      
      schema.fields.forEach((field)=>{
        model[field.name] = undefined;
      });

      model.field_test = '312312313123131231231231311313131312';
      return model;
    }
  }
};
</script>

<style lang="scss">
.vue-input-tag-wrapper {
  padding: 0;
  .input-tag {
    background-color: #3072f6;
    color: #fff;
    border: 0;
    line-height: 19px;
    text-align: center;
    margin-left: 0;
    margin-right: 8px;
    padding: 4px 6px;
    .remove {
      color: #fff;
    }
  }
}
</style>
