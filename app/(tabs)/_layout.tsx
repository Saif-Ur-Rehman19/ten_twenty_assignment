import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView style={{flex: 1}}>
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: 'blue',
       // headerShown: false,
        tabBarStyle: {
            backgroundColor: '#2E2739',
            height: 84,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30
        }
        }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
         
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='play-circle' color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />,
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}
