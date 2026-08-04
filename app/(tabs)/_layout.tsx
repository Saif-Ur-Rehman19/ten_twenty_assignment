import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
const TAB_BAR_COLOR = '#2E2739';

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: TAB_BAR_COLOR }} edges={['bottom']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#827D88',
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: -40
          },
          tabBarStyle: {
            backgroundColor: TAB_BAR_COLOR,
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
            paddingTop: 16,
            height: 75,
            position: 'absolute',
            bottom: 0,
            borderTopWidth: 0,
            overflow: 'hidden',
            elevation: 0,    
            shadowOpacity: 0,    
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title:'Watch',
            headerShown: false,
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="play-box" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color }) => <Image source={require('@/assets/library.png')} style={{ width: 20, height: 20, tintColor: color }} resizeMode='contain' />,
          }}
        />
         <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color}/>,
          }}
        />
      </Tabs>

    </SafeAreaView>
  );
}