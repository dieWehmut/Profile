import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './components/Home.vue';
import Projects from './components/Projects.vue';
import Notes from './components/Notes.vue';
import Contact from './components/Contact.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/projects', component: Projects },
  { path: '/notes', component: Notes },
  { path: '/contact', component: Contact }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    // 每次路由切换都滚动到顶部
    return { top: 0 };
  }
});

export default router;
