import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Tipos para navegação
type RootStackParamList = {
  Home: undefined;
  CheckIn: undefined;
  Social: undefined;
  Profile: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
};

type RouteProp = {
  name: string;
};

const MainNavigation = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);

  const navItems = [
    { 
      id: "home", 
      label: "Home", 
      icon: "home-outline" as const, 
      activeIcon: "home" as const,
      screen: "Home" as keyof RootStackParamList 
    },
    { 
      id: "checkin", 
      label: "Check In", 
      icon: "location-outline" as const, 
      activeIcon: "location" as const,
      screen: "CheckIn" as keyof RootStackParamList 
    },
    { 
      id: "plus", 
      label: "", 
      icon: "add" as const, 
      isSpecial: true 
    },
    { 
      id: "social", 
      label: "Explorar", 
      icon: "people-outline" as const, 
      activeIcon: "people" as const,
      screen: "Social" as keyof RootStackParamList 
    },
    { 
      id: "profile", 
      label: "Perfil", 
      icon: "person-outline" as const, 
      activeIcon: "person" as const,
      screen: "Profile" as keyof RootStackParamList 
    },
  ];

  const getCurrentTab = () => {
    const routeName = route.name.toLowerCase();
    if (routeName.includes('home')) return 'home';
    if (routeName.includes('social')) return 'social';
    if (routeName.includes('checkin')) return 'checkin';
    if (routeName.includes('profile')) return 'profile';
    return '';
  };

  const currentTab = getCurrentTab();

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.isSpecial) {
      setShowCheckInDialog(true);
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <>
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 max-w-sm mx-auto w-full">
        <View className="flex-row justify-around items-center">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const iconName = isActive && item.activeIcon ? item.activeIcon : item.icon;
            
            if (item.isSpecial) {
              return (
                <TouchableOpacity
                  key={item.id}
                  className="w-12 h-12 rounded-full bg-blue-800 justify-center items-center shadow-lg"
                  onPress={() => handleNavigation(item)}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={iconName} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                </TouchableOpacity>
              );
            }
            
            return (
              <TouchableOpacity
                key={item.id}
                className={`flex-col items-center justify-center h-14 py-2 px-3 min-w-0 flex-1 ${
                  isActive 
                    ? 'bg-blue-800/10' 
                    : ''
                }`}
                onPress={() => handleNavigation(item)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={iconName} 
                  size={20} 
                  color={isActive ? '#135E75' : '#6B7280'} 
                />
                <Text className={`text-xs font-medium mt-1 ${
                  isActive ? 'text-blue-800' : 'text-gray-500'
                }`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* CheckInDialog seria convertido separadamente */}
      {/* <CheckInDialog 
        visible={showCheckInDialog} 
        onClose={() => setShowCheckInDialog(false)} 
      /> */}
    </>
  );
};

export default MainNavigation; 