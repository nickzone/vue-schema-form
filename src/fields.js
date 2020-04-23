// field from cubeui
import {
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Checker,
  Switch,
  Rate,
  Upload
} from 'cube-ui';

// field from fields file
import Text from './components/text/index.vue';
import Input from './components/input/index.vue';
import Textarea from './components/textarea/index.vue';
import Select from './components/select/index.vue';
// initalvalue for normalize
Input.initialValue = '';
Checkbox.initialValue = '';
CheckboxGroup.initialValue = [];
RadioGroup.initialValue = '';
Checker.initialValue = [];
Textarea.initialValue = '';
Select.initialValue = '';
Switch.initialValue = false;
Rate.initialValue = 0;
Upload.initialValue = [];
Text.initialValue = '';

// all components
const components = [
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Checker,
  Switch,
  Rate,
  Upload,
  Text,
  Input,
  Textarea,
  Select
];

// normalize components
const componentsMap = {};

components.forEach(component => {
  let name = component.name;
  if (name.indexOf('cube-') > -1 || name.indexOf('kk-') > -1) {
    name = name
      .split('-')
      .slice(1)
      .join('-');
  }
  extend(name, component);
});

function stringifyModel(model) {
  let result = model;

  if (['string', 'number'].indexOf(typeof model) !== -1) {
    result = model;
  } else if (model === undefined || model === null) {
    result = '';
  } else if (Array.isArray(model)) {
    result = model.join(',');
  } else if (typeof model === 'object' && model.key !== undefined) {
    result = stringifyModel(model.key);
  }

  return result;
}

export default componentsMap;

export function extend(type, Component, options) {
  let name = 'kk-' + type;

  if (name && !componentsMap[name]) {
    if (options && options.initialValue !== undefined) {
      Component.initialValue = options.initialValue;
    }

    if (Component.initialValue === undefined) {
      Component.initialValue = '';
    }

    Component.stringifyModel = (options && options.stringifyModel) || stringifyModel;
    componentsMap[name] = Component;
  }
}