import { createApp } from "vue";
import supportWebp from "utils/supportWebp";
import './styles/index.scss';
import App from "./App.vue";
import router from './router/routes';

supportWebp();

const app = createApp(App)
app.use(router);
app.mount("#app");
