<template>
  <div class="auth-wrapper">
    <div class="card auth-card" style="text-align:center; padding: 3rem 2rem;">
      <div style="font-size:4rem; margin-bottom:1rem;">📖</div>
      <h1 style="font-size:2rem; font-weight:800; margin-bottom:.5rem;">Agenda de Contactos</h1>
      <p style="color:var(--text-muted); margin-bottom:2rem;">
        Organiza y gestiona tus contactos de forma segura.
      </p>
      <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
        <RouterLink to="/login" class="btn btn-primary">Iniciar Sesión</RouterLink>
        <RouterLink to="/registro" class="btn btn-outline">Registrarse</RouterLink>
      </div>
    </div>
  </div>
</template>
