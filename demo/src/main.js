import Vue from 'vue';
import App from './App.vue';
import { Picker } from 'cube-ui';
import KkForm from '@ke/kk-form';

Vue.use(KkForm);
Vue.use(Picker);

new Vue({
  el: '#app',
  render: h => h(App)
});