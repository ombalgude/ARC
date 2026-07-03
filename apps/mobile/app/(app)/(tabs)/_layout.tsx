import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Home, Dumbbell, CheckCircle2, Apple, User } from 'lucide-react-native';
import { useAppTheme } from '../../../lib/themeStore';

function TabIcon({ Icon, focused, C }: { Icon: any; focused: boolean; C: any }) {
  return (
    <View style={[tabIconStyles.container, focused && tabIconStyles.focused]}>
      <Icon size={22} color={focused ? C.brand : C.textTertiary} strokeWidth={focused ? 2.5 : 2} />
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  container: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  focused: {
    backgroundColor: 'rgba(143, 111, 255, 0.15)',
  },
});

export default function TabsLayout(): React.JSX.Element {
  const C = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.card,
          borderTopColor: C.border,
          borderTopWidth: 1,
          paddingTop: 8,
        },
        tabBarActiveTintColor: C.brand,
        tabBarInactiveTintColor: C.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} C={C} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Dumbbell} focused={focused} C={C} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ focused }) => <TabIcon Icon={CheckCircle2} focused={focused} C={C} />,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Apple} focused={focused} C={C} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} C={C} />,
        }}
      />
    </Tabs>
  );
}
