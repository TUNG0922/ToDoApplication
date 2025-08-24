import Vue from 'vue';
import 'vuetify/dist/vuetify.min.css'; // <- important: styles
import App from './App.vue';
import vuetify from './plugins/vuetify'; // <- must exist
import router from './router';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
