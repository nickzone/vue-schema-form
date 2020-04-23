<template>
  <form ref="formRef" class="kk-form">
    <div class="kk-form-group" v-for="(group, i) in groups" :key="i">
      <div class="kk-form-group-title" v-if="group.title">{{ group.title }}</div>
      <div class="kk-form-group-descript" v-if="group.descript">{{ group.descript }}</div>
      <div class="kk-form-group-content">
        <template v-for="(field, j) in group.fields">
          <div
            class="kk-form-item"
            :class="_getFieldItemClass(field)"
            :key="j"
            v-if="field.visible"
          >
            <Validator class="kk-form-item-validator" :validate="_getFieldValidate(field.name)">
              <template v-slot="props">
              <div class="kk-form-label">{{ field.label }}</div>
              <div class="kk-form-field-wrapper">
                <div class="kk-form-field">
                  <component
                    ref="fields"
                    :is="_getFieldComponent(field.type)"
                    v-bind="{
                      'kk-config': field,
                      'kk-context': context,
                      'kk-model': model,
                      ...field.props
                    }"
                    v-on="field.events"
                    @input="value => _fieldChange(field.name, value, true)"
                    :value="model[field.name]"
                  ></component>
                </div>
              </div>
              <span
                v-if="props.message && props.dirty"
                class="kk-form-msg"
                @click="_showError(props.message)"
              >!</span>
              </template>
            </validator>
          </div>
        </template>
      </div>
    </div>
    <div
      class="kk-form-submit"
      v-if="schema.submit"
      :class="_getSubmitClass()"
      @click="_handelSubmit"
    >
      <div>{{ schema.submit.label || "提 交" }}</div>
    </div>
  </form>
</template>

<script>
import Vue from 'vue';
import schema from 'async-validator';
import { Toast } from 'cube-ui';
import fieldsMap from './fields';
import { transformOptions, getValByPath, isEqualModel } from './helper';
import Validator from './validator.vue';

Vue.use(Toast);

const EVENT_SUBMIT = 'submit';
const EVENT_CHANGE = 'change';
const EVENT_VALIDATE = 'validate';

export default {
  name: 'kk-form',
  components: {
    ...fieldsMap,
    Validator
  },
  props: {
    model: {
      type: Object,
      default() {
        return {};
      }
    },
    schema: {
      type: Object,
      default() {
        return {};
      }
    },
    context: {
      type: Object,
      default() {
        return {};
      }
    },
    submitted: {
      type: Boolean,
      default() {
        return false;
      }
    },
    ajax: {
      type: Function
    }
  },
  data() {
    const fields = this.schema.fields || [];
    const validates = fields.reduce((pre, current) => {
      pre[current.name] = {
        $dirty: false,
        $errors: null
      };
      return pre;
    }, {});

    return {
      validates: validates
    };
  },
  computed: {
    groups() {
      const groups = this.schema.groups || [];
      const fields = this.schema.fields || [];
      if (groups.length === 0) {
        groups.unshift({
          fields: fields
        });
      } else {
        groups.forEach(group => {
          const name = group.name;
          group.fields = [];
          fields.forEach(field => {
            if (field.group === name) {
              group.fields.push(field);
            }
          });
        });
      }
      return groups;
    },
    fields() {
      return this.schema.fields || [];
    },
    rules() {
      let rules = {};

      this.fields.forEach(field => {
        rules[field.name] = field.rules || {
          type: 'any'
        };
      });

      return rules;
    },
    allValid() {
      for(let prop in this.validates) {
        if(this.validates[prop].$errors) {
          return false;
        }
      }
      return true;
    }
  },
  watch: {
    submitted : {
      handler: function(val) {
        this.schema.fields.forEach(v => {
          v.props.disabled = val;
        });
      }
    }
  },
  created() {
    this._normalizeModel();
    this._normalizeSchema();
    this._initValidation();
    this._initRemoteOptions();
    this._initDepends();
  },
  methods: {
    submit(callback) {
      this.validate(errors => {
        this.$emit(EVENT_SUBMIT, errors, this.model);
        callback && callback(errors, this.model);
      });
    },
    validate(callback) {
      this._validate(callback, true);
    },
    getFieldSchema(name) {
      const fields = this.schema.fields || [];
      return fields.find(item => item.name === name);
    },
    setFieldsValue(fields){
      for (const key in fields) {
        const value = fields[key];
        this._fieldChange(key, value);
      }
    },
    // 修改field-schema
    setFieldsSchema(fields){
      const immutableProps = ['group', 'type', 'name', 'depends'];
      this.schema.fields.forEach((field) => {
        const newField = fields[field.name];

        if (newField) {
          for (const prop in newField) {
            if (immutableProps.indexOf(prop) === -1) {
              field[prop] = typeof newField[prop] === 'function' ?
                newField[prop](field[prop]) : newField[prop];
            }
          }
        }
      });
    },
    getFieldInstance(name) {
      const instance = this.$refs.fields.find((field) => {
        return field.$attrs['kk-config'].name === name;
      });

      if(instance && instance.$refs.fieldComponent) {
        return instance.$refs.fieldComponent;
      }
      return instance;
    },
    _validate(callback, validateAll) {
      this.validator.validate(this.model, (errors, fieldsErrors) => {
        let hasError = false;

        this.fields.forEach(field => {
          let $errors = null;
          const { name, visible } = field;
          if(!visible) {
            this.validates[name] = {
              $dirty: false,
              $errors: null
            };
          } else {
            if(fieldsErrors && fieldsErrors[name]) {
              hasError = true;
              $errors = fieldsErrors[name];
            }
            this.validates[name].$errors = $errors;
            if(validateAll) {
              this.validates[name].$dirty = true;
            }
          }
        });

        callback && callback(hasError ? this.validates : null);
        this.$emit(EVENT_VALIDATE, hasError ? this.validates : null);
      });
    },
    _handelSubmit() {
      let canSubmit = false;

      if (
        this.schema.submit &&
        this.schema.submit.validateAll &&
        this.allValid &&
        !this.submitted
      ) {
        canSubmit = true;
      }

      if (this.schema.submit && !this.schema.submit.validateAll && !this.submitted) {
        canSubmit = true;
      }

      canSubmit && this.submit();
    },
    _fieldChange(name, value, dirty) {
      this.model[name] = value;
      this.$emit(EVENT_CHANGE, { [name]: value }, this.model);
      if(dirty) {
        this.validates[name].$dirty = dirty;
      }
      this._validate();
    },
    _normalizeModel() {
      this.fields.forEach(field => {
        const fieldVal = this.model[field.name];
        let initialVal = 
          'initialValue' in field ? field.initialValue : this._getFieldComponent(field.type).initialValue;
        
        if(fieldVal === undefined) {
          this.$set(
            this.model, field.name, initialVal !== undefined ? initialVal : ''
          );
        }
      });
    },
    _normalizeSchema() {
      const fields = this.fields;
      const submitted = this.submitted;
      fields.forEach(field => {
        if(!field.props) {
          this.$set(field, 'props', {
            disabled: submitted
          });
        } else {
          this.$set(
            field.props, 'disabled', 
            'disabled' in field.props ? 
              field.props.disabled : submitted
          );
        }
        if(!('visible' in field)) {
          this.$set(field, 'visible', true);
        }
      });
    },
    _initValidation() {
      schema.warning = function(){};
      this.validator = new schema(this.rules);
      this._validate();
    },
    _getFieldComponent(type) {
      return fieldsMap['kk-' + type];
    },
    _getFieldItemClass({ layout, name, rules }) {
      let layoutClass = '';
      let requiredClass = '';
      let fieldClass = 'kk-form-item-' + name;
      if (layout === 'vertical') {
        layoutClass = 'kk-form-item__vertical';
      }

      let required = false;
      if(!rules){
        required = false;
      } else if(Array.isArray(rules)) {
        required = rules.some(rule => rule.required);
      } else {
        required = !!rules.required;
      }
      requiredClass = required && 'kk-form-item__required';

      return [layoutClass, fieldClass, requiredClass];
    },
    _getFieldValidate(name) {
      return this.validates[name];
    },
    _initRemoteOptions() {
      const { fields = [] } = this.schema;
      const useAjax = fields.some(field => !!field.remoteOptions);

      if (!this.ajax && useAjax) {
        // eslint-disable-next-line
        console.error(
          '[kk-form] ',
          '存在字段依赖远程数据，请配置 ajax 数据加载器'
        );
        return;
      }

      fields.forEach(field => {
        this._loadFieldOptions(field);
      });
    },
    _initDepends() {
      const { fields = [] } = this.schema;
      fields.forEach(field => {
        const { depends } = field;
        if (depends) {
          depends.forEach(depend => {
            const { target } = depend;
            this.$on(EVENT_CHANGE, values => {
              if (values[target] !== undefined) {
                this._runDepend(depend, field, true);
              }
            });
            this._runDepend(depend, field);
          });
        }
      });
    },
    // 执行联动
    // depend: 依赖项
    // field: 当前字段配置
    _runDepend(depend, field, reset){
      const value = this.model[depend.target];
      const { type = 'change', data, handle = 'reset' } = depend;
      const fieldType = field.type;
      const name = field.name;
      // 判断是否满足联动条件
      if ('data' in depend && !isEqualModel(data, value)) { return; }
      if (type !== 'change') { return; }
      
      switch(handle) {
      case 'reset': {
        if(reset) {
          this._fieldChange(
            name,
            this._getFieldComponent(fieldType).initialValue
          );
          this._loadFieldOptions(field);
        }
        break;
      }
      case 'show': {
        this._loadFieldOptions(field);
        this.setFieldsSchema({
          [name]: {
            visible: true
          }
        });
        break;
      }
      case 'hide': {
        if(reset) {
          this._fieldChange(
            name,
            this._getFieldComponent(fieldType).initialValue
          );
        }
        this.setFieldsSchema({
          [name]: {
            visible: false
          }
        });
        break;
      }
      default: {
        break;
      }
      }
    },
    _loadFieldOptions(field) {
      const { remoteOptions } = field;

      if (remoteOptions) {
        const { url } = remoteOptions;
        const parsedUrl = this._getParsedUrl(url);
        this.$set(field.props, 'options', []); // 先清空选项
        this.ajax(parsedUrl)
          .then(data => {
            this.$set(field.props, 'options', transformOptions(data));
          })
          .catch(() => {
            console.error(
              '[kk-form] ',
              `字段 '${field.label}（${field.name}）' remoteOption 数据依赖加载失败`
            );
          });
      }
    },
    _getParsedUrl(url) {
      let parsedUrl = url;
      parsedUrl = url
        .replace(/=\${(.+?)}/g, ($0, $1) => {
          const fieldConfig = this._getFieldConfigByModelName($1);
          const { stringifyModel } = this._getFieldComponent(fieldConfig.type);
          const query = stringifyModel(this.model[$1]);
          return `=${query}`;
        })
        .replace(/=\$\${(.+?)}/g, ($0, $1) => {
          return `=${getValByPath($1, this.context)}`;
        });
      return parsedUrl;
    },
    _getFieldConfigByModelName(name) {
      return this.fields.find(field => field.name === name);
    },
    _getSubmitClass() {
      const ACTIVE_CLASS = 'kk-form-submit__active';
      let canSubmit = false;

      if (
        this.schema.submit &&
        this.schema.submit.validateAll &&
        this.allValid && 
        !this.submitted
      ) {
        canSubmit =  true;
      }

      if (this.schema.submit && !this.schema.submit.validateAll && !this.submitted) {
        canSubmit = true;
      }

      return {[ACTIVE_CLASS]: canSubmit};
    },
    _showError(message) {
      const toast = Toast.$create({
        time: 2000,
        txt: message,
        type: 'txt'
      });
      toast.show();
    }
  }
};
</script>

<style lang="scss">
  @import "./style.scss";
</style>
