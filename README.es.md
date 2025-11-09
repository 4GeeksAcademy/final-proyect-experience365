# 🌍 Experience365

**Experience365** es una plataforma web que conecta a viajeros y locales con anfitriones que ofrecen experiencias auténticas, diseñadas para promover la conexión humana más allá del turismo tradicional.  
Nuestro objetivo es que viajar vuelva a ser una experiencia humana, no un producto turístico. ✨  

---

## 🚀 Características principales

- 🔍 Filtros por **ciudad**, **duración** y **precio**.  
- 👥 Roles diferenciados de **usuario** y **anfitrión**.  
- 📸 Subida y gestión de imágenes mediante **Cloudinary**.  
- 💬 Sistema de reservas en tiempo real.  
- 💳 Integración con **Stripe** para pagos seguros.  
- 🔔 Notificaciones automáticas a través de **Firebase**.  

---

## 🛠️ Tecnologías utilizadas

**Frontend:** React, Bootstrap, Cloudinary API  
**Backend:** Flask, SQLAlchemy, Python  
**Base de datos:** PostgreSQL  
**Servicios externos:** Firebase (notificaciones), Google Places API (geolocalización), Stripe (pagos)  
**Despliegue:** Render  

---

## ⚙️ Instalación y ejecución

1. **Clonar el repositorio:**
   git clone https://github.com/4GeeksAcademy/final-proyect-experience365.git
   cd final-proyect-experience365

2. **Instalar dependencias del backend:**
   pipenv install
   pipenv shell

3. **Instalar dependencias del frontend:**
   npm install

4. **Configurar las variables de entorno** en un archivo `.env`:
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_bd
   CLOUDINARY_URL=tu_api_key
   STRIPE_SECRET_KEY=tu_clave_secreta
   FIREBASE_CONFIG=tu_config

5. **Ejecutar el proyecto:**
   Backend → pipenv run start
   Frontend → npm run start

---

## 💻 Demo

🔗 Repositorio en GitHub: https://github.com/4GeeksAcademy/final-proyect-experience365  
📸 *(Puedes añadir aquí un enlace o imagen del despliegue si lo tienen online)*  

---

## 👩‍💻 Equipo de desarrollo

- Melanie Medigovich → https://github.com/medigovichmelanie  
- David Querol Pallarés → https://github.com/davidqueroldev  
- Sergio García → https://github.com/SergioGarcia95  

---

## 🔮 Futuras mejoras

- 📱 App móvil para iOS y Android.  
- 🤖 IA para recomendaciones personalizadas.  
- 🎯 Sistema de recompensas y referidos.  
- 📊 Dashboard con métricas de uso y rendimiento.  

---

## 🏫 Créditos

Proyecto desarrollado como parte del **Bootcamp Full Stack Developer** de 4Geeks Academy (https://4geeksacademy.com/).  
“Experience365 no es solo una app de ocio: es una herramienta para reconectar con lo humano en un mundo saturado de escaparates turísticos.” 🌱  
