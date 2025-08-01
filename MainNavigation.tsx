import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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
      <View style={styles.container}>
        <View style={styles.navigationBar}>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const iconName = isActive && item.activeIcon ? item.activeIcon : item.icon;
            
            if (item.isSpecial) {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.specialButton}
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
                style={[
                  styles.navButton,
                  isActive && styles.activeNavButton
                ]}
                onPress={() => handleNavigation(item)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={iconName} 
                  size={20} 
                  color={isActive ? '#135E75' : '#6B7280'} 
                />
                <Text style={[
                  styles.navLabel,
                  isActive && styles.activeNavLabel
                ]}>
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 8,
    zIndex: 50,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 0,
    flex: 1,
  },
  activeNavButton: {
    backgroundColor: 'rgba(19, 94, 117, 0.1)',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#135E75',
  },
  specialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#135E75',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MainNavigation; 