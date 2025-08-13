# Encuentro Frontend

Frontend moderno para la aplicación de gestión de eventos "Encuentro" desarrollado con React, TypeScript y Material-UI.

## 🚀 Características

- **Interfaz moderna y responsiva** con Material-UI
- **Autenticación completa** con gestión de sesiones
- **Gestión de eventos** (crear, editar, ver, eliminar)
- **Sistema de zonas** con precios y capacidades
- **Búsqueda y filtros** avanzados
- **Formularios validados** con React Hook Form
- **Estado global** con Zustand
- **Gestión de datos** con React Query
- **Notificaciones** con React Hot Toast
- **Diseño responsive** para móviles y desktop

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Material-UI (MUI)** - Componentes de UI
- **React Router** - Navegación
- **React Query** - Gestión de estado del servidor
- **Zustand** - Gestión de estado global
- **React Hook Form** - Formularios
- **Date-fns** - Manipulación de fechas
- **Axios** - Cliente HTTP

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── Layout.tsx      # Layout principal con navegación
├── pages/              # Páginas de la aplicación
│   ├── Home.tsx        # Página de inicio
│   ├── Events.tsx      # Listado de eventos
│   ├── EventDetail.tsx # Detalle de evento
│   ├── CreateEvent.tsx # Crear evento
│   ├── Login.tsx       # Iniciar sesión
│   ├── Register.tsx    # Registrarse
│   └── Profile.tsx     # Perfil de usuario
├── services/           # Servicios de API
│   ├── api.ts          # Configuración de Axios
│   ├── authService.ts  # Servicios de autenticación
│   └── eventService.ts # Servicios de eventos
├── stores/             # Estado global
│   └── authStore.ts    # Store de autenticación
├── types/              # Tipos TypeScript
│   └── index.ts        # Definiciones de tipos
├── App.tsx             # Componente principal
└── index.tsx           # Punto de entrada
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd encuentro-frontend-main
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm start
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## 📱 Funcionalidades Principales

### 🔐 Autenticación
- Registro de usuarios con diferentes roles
- Inicio de sesión con validación
- Gestión de sesiones persistentes
- Protección de rutas

### 📅 Gestión de Eventos
- **Crear eventos** con información completa
- **Configurar zonas** con precios y capacidades
- **Editar eventos** existentes
- **Eliminar eventos** (solo organizadores)
- **Ver detalles** completos de eventos

### 🔍 Búsqueda y Filtros
- Búsqueda por título, descripción y ubicación
- Filtrado por categorías
- Ordenamiento por fecha
- Vista de eventos propios

### 👤 Perfil de Usuario
- Ver información personal
- Editar datos del perfil
- Ver eventos creados
- Gestión de cuenta

## 🎨 Diseño y UX

### Características de Diseño
- **Material Design** implementado con MUI
- **Diseño responsivo** para todos los dispositivos
- **Temas personalizables** con paletas de colores
- **Iconografía consistente** con Material Icons
- **Animaciones suaves** y transiciones

### Experiencia de Usuario
- **Navegación intuitiva** con breadcrumbs
- **Formularios validados** en tiempo real
- **Notificaciones contextuales** para feedback
- **Estados de carga** con spinners
- **Manejo de errores** elegante

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# URL de la API backend
REACT_APP_API_URL=http://localhost:3000

# Configuración de desarrollo
REACT_APP_ENV=development
```

### Personalización de Temas
El tema de Material-UI se puede personalizar en `src/index.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});
```

## 📊 Estado de la Aplicación

### Zustand Store (Autenticación)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}
```

### React Query
- **Caché inteligente** de datos del servidor
- **Sincronización automática** en segundo plano
- **Gestión de estados** de carga y error
- **Invalidación de caché** automática

## 🧪 Testing

### Ejecutar tests
```bash
npm test
```

### Tests de cobertura
```bash
npm test -- --coverage
```

## 📦 Scripts Disponibles

- `npm start` - Ejecutar en modo desarrollo
- `npm build` - Construir para producción
- `npm test` - Ejecutar tests
- `npm eject` - Eyectar configuración (irreversible)

## 🌐 Despliegue

### Netlify
1. Conectar repositorio a Netlify
2. Configurar build command: `npm run build`
3. Configurar publish directory: `build`
4. Configurar variables de entorno

### Vercel
1. Conectar repositorio a Vercel
2. Configurar framework preset: Create React App
3. Configurar variables de entorno
4. Desplegar automáticamente

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Diego Casignia** - *Desarrollo Frontend*
- **Richard Gualotuña** - *Desarrollo Frontend*

## 🙏 Agradecimientos

- Material-UI por los componentes de UI
- React Query por la gestión de estado del servidor
- Zustand por la gestión de estado global
- La comunidad de React por las herramientas y recursos

