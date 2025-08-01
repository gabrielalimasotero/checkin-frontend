# Conversão MainNavigation para React Native

Este documento explica a conversão do componente `MainNavigation` de React Web para React Native usando Expo.

## 📱 Principais Mudanças

### 1. **Navegação**
```tsx
// Web (React Router)
import { useNavigate, useLocation } from "react-router-dom";
const navigate = useNavigate();
const location = useLocation();

// React Native (React Navigation)
import { useNavigation, useRoute } from '@react-navigation/native';
const navigation = useNavigation();
const route = useRoute();
```

### 2. **Componentes HTML → React Native**
```tsx
// Web
<div className="fixed bottom-0 bg-white">
  <Button onClick={() => navigate('/home')}>
    <Home className="w-5 h-5" />
  </Button>
</div>

// React Native
<View style={styles.container}>
  <TouchableOpacity onPress={() => navigation.navigate('Home')}>
    <Ionicons name="home-outline" size={20} color="#6B7280" />
  </TouchableOpacity>
</View>
```

### 3. **Ícones**
```tsx
// Web (Lucide React)
import { Home, Users, MapPin, User, Plus } from "lucide-react";
<Home className="w-5 h-5" />

// React Native (Expo Vector Icons)
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="home-outline" size={20} color="#6B7280" />
```

### 4. **Estilos**
```tsx
// Web (Tailwind CSS)
className="fixed bottom-0 bg-white border-t border-border"

// React Native (StyleSheet)
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  }
});

// React Native (NativeWind)
className="absolute bottom-0 bg-white border-t border-gray-200"
```

## 🚀 Configuração do Projeto

### 1. **Instalar dependências**
```bash
npx create-expo-app@latest checkin-app --template
npm install @react-navigation/native @react-navigation/stack
npm install nativewind tailwindcss
npm install @expo/vector-icons
```

### 2. **Configurar NativeWind (opcional)**
```javascript
// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. **Configurar navegação**
```tsx
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CheckIn" component={CheckInScreen} />
        <Stack.Screen name="Social" component={SocialScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 📁 Arquivos Criados

1. **`MainNavigation.tsx`** - Versão com StyleSheet
2. **`MainNavigationNativeWind.tsx`** - Versão com NativeWind
3. **`package.json-expo-example`** - Exemplo de dependências
4. **`README-React-Native-Conversion.md`** - Este arquivo

## 🎨 Vantagens da Conversão

### **StyleSheet**
- ✅ Performance otimizada
- ✅ Validação de estilos em tempo de compilação
- ✅ Melhor suporte do TypeScript
- ✅ Menor bundle size

### **NativeWind**
- ✅ Sintaxe familiar do Tailwind CSS
- ✅ Desenvolvimento mais rápido
- ✅ Consistência com o projeto web
- ✅ Menos código boilerplate

## 🔧 Próximos Passos

1. **Converter outros componentes**:
   - `CheckInDialog` → Modal do React Native
   - `TopHeader` → Header nativo
   - `HomeSubTabs` → Tab Navigator

2. **Implementar funcionalidades mobile**:
   - Geolocalização nativa
   - Câmera para fotos
   - Push notifications
   - Compartilhamento nativo

3. **Otimizações**:
   - Lazy loading de telas
   - Cache de imagens
   - Animações nativas

## 📱 Testando

```bash
# Iniciar o projeto
npm start

# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web (para desenvolvimento)
npm run web
```

## 🐛 Problemas Comuns

### **Safe Area**
```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
<View style={{ paddingBottom: insets.bottom }}>
  <MainNavigation />
</View>
```

### **Status Bar**
```tsx
import { StatusBar } from 'expo-status-bar';

<StatusBar style="auto" />
```

### **Orientação**
```tsx
import * as ScreenOrientation from 'expo-screen-orientation';

// Forçar portrait
await ScreenOrientation.lockAsync(
  ScreenOrientation.OrientationLock.PORTRAIT_UP
);
``` 