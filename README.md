# Control de Gastos Multiusuario

Aplicación web completa para el control y análisis de gastos personales y familiares, desarrollada con React, TypeScript y Firebase Firestore.

## 🚀 Características Principales

### 📊 Gestión de Gastos
- **Importación masiva CSV**: Sube archivos CSV con formato flexible
- **Categorización automática**: Asigna categorías basándose en palabras clave
- **Edición en tiempo real**: Modifica gastos directamente desde la interfaz
- **Asignación multiusuario**: Asigna gastos a diferentes personas

### 📈 Análisis y Reportes
- **Dashboard interactivo**: Resumen general con métricas clave
- **Gráficos avanzados**: Visualización con gráficos de torta y barras
- **Filtros inteligentes**: Por usuario, mes y categoría
- **Exportación**: Descarga datos filtrados en formato CSV

### 👥 Gestión de Usuarios
- **Usuarios independientes**: Cada persona tiene sus propios gastos
- **Perfiles personalizados**: Información detallada de cada usuario
- **Historial completo**: Seguimiento de actividad por usuario

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore
- **Gráficos**: Recharts
- **Procesamiento CSV**: PapaParse
- **Routing**: React Router
- **Icons**: Lucide React

## 📋 Formato CSV Esperado

Tu archivo CSV debe contener las siguientes columnas:

### Columnas Requeridas
- `fecha` (DD/MM/YYYY o YYYY-MM-DD)
- `importe` (número decimal, ej: 45.20)
- `descripción` (texto descriptivo del gasto)

### Columnas Opcionales
- `categoría` (se asigna automáticamente si no se proporciona)

### Ejemplo de CSV:
```csv
fecha,importe,descripcion,categoria
15/08/2025,45.20,"Cena en restaurante","Comida"
16/08/2025,12.50,"Metro al trabajo","Transporte"
17/08/2025,89.99,"Compras en supermercado",""
```

## 🎯 Categorización Automática

El sistema incluye categorización inteligente basada en palabras clave:

- **Comida**: supermercado, restaurante, comida, cena, etc.
- **Transporte**: gasolina, uber, taxi, metro, etc.
- **Entretenimiento**: cine, netflix, spotify, etc.
- **Salud**: farmacia, médico, hospital, etc.
- **Servicios**: luz, agua, internet, teléfono, etc.
- **Compras**: tienda, ropa, amazon, etc.

## 🚦 Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Configura las reglas de seguridad básicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Para desarrollo
    }
  }
}
```

4. Actualiza `src/firebase/config.ts` con tu configuración:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

## 🏗️ Estructura de Datos

### Colección `expenses`
```typescript
{
  userId: string;      // ID del usuario asignado
  date: string;        // YYYY-MM-DD
  amount: number;      // Importe en euros
  category: string;    // Categoría del gasto
  description: string; // Descripción detallada
  month: string;       // YYYY-MM para consultas
  createdAt: string;   // Timestamp de creación
  updatedAt?: string;  // Timestamp de última actualización
}
```

### Colección `users`
```typescript
{
  name: string;      // Nombre completo
  email: string;     // Email del usuario
  createdAt: string; // Timestamp de creación
}
```

## 🎨 Características de Diseño

- **Responsive Design**: Optimizado para móvil, tablet y desktop
- **Animaciones suaves**: Transiciones y micro-interacciones elegantes
- **Accesibilidad**: Contraste adecuado y navegación por teclado
- **Componentes modulares**: Arquitectura escalable y mantenible

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔮 Funcionalidades Futuras

- [ ] Autenticación con Firebase Auth
- [ ] Categorización con IA (OpenAI/Gemini)
- [ ] Notificaciones y alertas de presupuesto
- [ ] Exportación a PDF con reportes detallados
- [ ] Integración con bancos (PSD2)
- [ ] App móvil con React Native
- [ ] Compartir gastos entre usuarios
- [ ] Metas de ahorro y seguimiento

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ para una gestión inteligente de gastos personales y familiares.