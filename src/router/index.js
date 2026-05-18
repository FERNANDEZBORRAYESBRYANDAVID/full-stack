// src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

import HomeView     from '@/views/HomeView.vue'
import LoginView    from '@/views/LoginView.vue'
import RegistroView from '@/views/RegistroView.vue'
import AgendaView   from '@/views/AgendaView.vue'
import CrearView    from '@/views/CrearContactoView.vue'
import EditarView   from '@/views/EditarContactoView.vue'
import PerfilView   from '@/views/PerfilView.vue'

const routes = [
  { path: '/',              name: 'home',    component: HomeView },
  { path: '/login',         name: 'login',   component: LoginView },
  { path: '/registro',      name: 'registro', component: RegistroView },
  { path: '/agenda',        name: 'agenda',  component: AgendaView,  meta: { requiereAuth: true } },
  { path: '/agenda/crear',  name: 'crear',   component: CrearView,   meta: { requiereAuth: true } },
  { path: '/agenda/:id',    name: 'editar',  component: EditarView,  meta: { requiereAuth: true } },
  { path: '/perfil',        name: 'perfil',  component: PerfilView,  meta: { requiereAuth: true } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guard de navegación: rutas protegidas
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiereAuth && !auth.estaAutenticado) {
    return { name: 'login' }
  }
  if ((to.name === 'login' || to.name === 'registro') && auth.estaAutenticado) {
    return { name: 'agenda' }
  }
})

export default router
