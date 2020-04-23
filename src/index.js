import 'cube-ui/style/style.css';
import KkFrom from './form.vue';

KkFrom.install = function(Vue) {
  Vue.component('kkForm', KkFrom);
};

export default KkFrom;
export { extend as addField } from './fields';