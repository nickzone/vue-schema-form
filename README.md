# vue-scheme-form vue 配置化表单

## Features 特征

- 内置仅包含文本一个输入框类型，支持 `v-model` 字段扩展。
- 通过编写 `json` 完成一般移动端表单开发任务。
- 支持表单字段分组布局，支持行内标签和单行标签两种布局。
- 支持字段远程选项数据配置。
- 和element-ui、antd相同的开源的字段验证方案。

## Samples 栗子

### base 基本

```js
<template>
  <v-form
    :schema="schema"
    :model="model"
    @change="onChange",
    @submit="onSubmit"
    @validate="onValidate"
  ></v-form>
</template>

<script>
import vForm from "v-form";

export default {
  data() {
    return {
      schema: {
        groups: [{
          name: "groupKey",
          title: "group one",
          descript: "some descript text"
        }],
        fields: [{
          type: "input",
          name: "fieldKey",
          label: "name",
          layout: "vertical",
          props: {
            placeholder: "please input"
          },
          group: "groupKey1"
        }]
      }
    };
  },
  methods: {
      onSubmit(err, model) {
        if(!err) {
          ajax.post(url, model);
        }
      },
      onChange(changedFields) {
        console.log(changedFields)
      },
      onValidate(err) {
        console.log(err);
      }
  },
  components: {
    vForm: vForm
  }
}
</script>
<style></style>
```

### linkage 联动

```js
props = {
  schema: {
    groups: [
      ...
    ],
    fields: [
      {
        type: "input",
        name: "level_1",
        label: "level_1"
      },
      {
        type: "input",
        name: "level_2",
        label: "level_2",
        depends: {
          target: "level_1",
        }
      },
    ],
  },
};
```

### rules 校验规则

```js
props = {
 schema: {
    groups: [{
        ...
    }],
    fields: [{
        ...
        relus: [{required: true}]
    }]
 }
}
```

### remote options 加载异步选项

```js
props = {
  schema: {
    groups: [
      ...
    ],
    fields: [
      {
        ...
        remoteOptions: {
          url: "getOptions?field2=${fieldKey1}&ucid=$${userInfo.id}",
        }
      },
    ],
  },
  context: {
    userInfo: {
      id: 1003213,
    },
  },
  ajax: (url) => Promise.resolve([{label: "label", value: 'value1'}])
};
```

### submit  提交按钮

```js
props = {
  schema: {
    groups: [],
    fields: [],
    submit: {
      validateAll: true, 
      label: "submit",
    },
  },
  submitted: true
};
```

## extensibility 字段类型扩展

```js

// registry 注册
import { addField } form "v-form";
import customInput from "custom-input"; // 支持 v-model 的第三方控件

addField("custom-input", customInput, { defaultValue: "" }); // <-- 注册该控件并制定默认值

// use 使用
props = {
    schema: {
        fields: [{
            type: "custom-input"
        }]
    }
}

```

## API

### props配置

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| model | `必填`表单值对象，必传，同步表单值，可设置初始值 | object | - |
| schema | `必填`表单配置对象,具有 groups 和 fiedls 配置属性，详见下文 | object | - |
| submit | 自带提交按钮配置，不配置不显示 | object | - |
| submit.label | 配置提交按钮显示文案 | string | "提 交" |
| submit.validateAll | 配置是否当所有验证都通过时，提交按钮才可用 | boolean | false |
| ajax | 内部组件加载数据用到的ajax函数,适配如下语法: ajax(url).then(data) | function | - |

#### props.schema.groups[i]

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| name | `必填` 分组key | string | - |
| title | 分组标题 | string | '' |
| descript | 分组描述 | string | '' |

#### props.schema.fields[i]

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| group | `必填` 分组key，当配置了分组时适用，表明字段所在分组 | string | - |
| type | `必填` 控件类型，对于外部扩展控件,需支持v-model协议，详见下文 | string | 'input' | 
| name | `必填` 字段键值 | string | - | 
| label | 字段label | string | '' |
| visible | 字段控件可见性 | boolean | true |
| props | 控件支持的 props 配置 | object | {} | 
| rules | 控件验证规则,同 [async-validator](https://github.com/yiminghe/async-validator) | object | - |
| defaultValue | 控件默认空值, 权重高于扩展字段时option.defaultValue | "" |
| events | 控件支持的事件类型回调函数配置, 传递给字段v-on属性 | object | - |
| depends | 联动配置，数组类型，会从左到右依次触发，而实现复杂的联动效果 | array | - |
| remoteOptions | 加载选项数据,需要返回 [{key: code, value: "name"}] 数据结构 | object | - |
| remoteOptions.url | 选项数据地址，支持模版字符串, 形如 "/getOptions?a=${a}&b=$${b}", ${a}表示从 props.model.a, $${b.bb} 表示 props.context.b.bb| string | "" |
| depends[i].target | `必填` 联动目标字段name，当该联动目标发生值变化时重置当前字段值为默认值，并重置选项 | string | - |
| depends[i].type | 联动目标字段事件类型，目前只支持 `change` | string | 'change' |
| depends[i].data | 仅当联动目标字段等于该字段值时才触发联动| any |  |
| depends[i].handle | 联动执行类型：'reset'（重置值为默认值，重置选项列表（如果有），执行控件reset方法（如果有））,'visible' / 'hide'(显示隐藏联动), 'disabled' / 'enable' (可编辑/不可编辑联动） | string | 'reset' |

## events 事件

| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| submit | 提交事件 | err: 校验结果，data: 表单值 |
| validate | 校验事件 | err: 校验结果 |
| change | 表单值更改 | {changedFieldName: changedFieldValue}|

## methods 实例方法

| 方法名 | 说明 | 
| ---- | ---- |
| submit | 触发表单提交 |
| validate | 触发表单验证 |
| setFieldsValue({name: value}) | 更新表单值 |
| getFieldSchema(name) | 获取name字段配置对象 |
| setFieldsSchema({name: schemaObj}) | 更新表单字段配置 |
| getFieldInstance(name) | 获取字段控件实例引用 |

## field extend 字段扩展（插件）

### addField(type, component, option?) 字段类型扩展

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| type | 扩展控件类型 | string | - |
| component | 控件组件，需支持 v-model 数据双向绑定接口属性 | string | - | 
| option | 可选参数 | string | - | 
| option.defaultValue | 配置控件默认空值 | string | '' |
| option.stringifyModel | 配置 model 序列化方式 | (value) => {} | - |
