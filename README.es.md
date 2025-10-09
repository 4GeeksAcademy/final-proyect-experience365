# 🌐 Experience 365
**Plataforma interactiva de experiencias gastronómicas y de ocio que conecta usuarios con actividades personalizadas.**  
Desarrollada con **React.js** para el frontend y **Flask (Python)** para el backend, con **SQLAlchemy** como capa de abstracción de base de datos.

Este proyecto combina un stack moderno, despliegue ágil y una arquitectura pensada para escalar funcionalidades de forma rápida y eficiente.

---

## 🚀 Tecnologías utilizadas

- **Frontend:** React.js  
- **Backend:** Python + Flask  
- **Base de datos:** SQLAlchemy + PostgreSQL (compatible con SQLite y MySQL)  
- **Gestor de paquetes:** Pipenv (para Python) y NPM (para JS)  
- **Entorno recomendado:** GitHub Codespaces o entorno local con Python 3.10 y Node 20+

---

## 📦 Características principales

- 📚 Arquitectura modular lista para escalar nuevas funcionalidades.  
- 🧰 Configuración con `.env` para separar credenciales y variables sensibles.  
- 🛠️ Integración completa con SQLAlchemy para manejar modelos y migraciones fácilmente.  
- 🌍 Preparado para desplegar en **Render** o **Heroku** en cuestión de minutos.  
- 🧪 Scripts para generar datos de prueba rápidamente.

---

## 🛠️ Instalación del Backend

> Asegúrate de tener **Python 3.10**, **Pipenv** y un motor de base de datos instalado (se recomienda PostgreSQL).

1. Instalar dependencias de Python:  
   ```bash
   pipenv install
   ```

2. Crear archivo `.env` a partir del ejemplo:  
   ```bash
   cp .env.example .env
   ```

3. Configurar la variable `DATABASE_URL` con tus credenciales:

| Motor      | Ejemplo de DATABASE_URL                                   |
|-----------|------------------------------------------------------------|
| SQLite    | sqlite:////test.db                                        |
| MySQL     | mysql://user:password@localhost:3306/example               |
| Postgres  | postgres://user:password@localhost:5432/example            |

4. Migrar la base de datos:  
   ```bash
   pipenv run migrate
   pipenv run upgrade
   ```

5. Iniciar el servidor backend:  
   ```bash
   pipenv run start
   ```

---

## 🔄 Deshacer una migración

Si necesitas revertir una migración:

```bash
pipenv run downgrade
```

---

## 👤 Poblar la base de datos con usuarios de prueba

Puedes insertar usuarios de prueba con:

```bash
flask insert-test-users 5
```

Esto generará automáticamente varios registros en tu base de datos para desarrollo.

---

## 💻 Instalación del Frontend

> Asegúrate de tener **Node.js versión 20** instalada y el backend funcionando correctamente.

1. Instalar dependencias de Node:  
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo de React:  
   ```bash
   npm run start
   ```

---

## 🌍 Despliegue

Experience 365 está lista para desplegarse en **Render** o **Heroku** rápidamente.  
Consulta la documentación de Render para ver los pasos específicos.

---

## 👥 Créditos y agradecimientos

Este proyecto se inspira en la plantilla original de 4Geeks Academy y su comunidad de contribuidores, adaptada para **Experience 365**.

