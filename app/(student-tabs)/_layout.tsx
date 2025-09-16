import React from 'react';
import { View } from 'react-native';
import { theme } from '@/theme';
import { Tabs } from 'expo-router';
import { Home, FileText, Award, User, BookOpen } from 'lucide-react-native';

export default function StudentTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 12,
          height: 85,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textPrimary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: 'Subjects',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <BookOpen size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="assignments"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <FileText size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ca-results"
        options={{
          title: 'Results',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <Award size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              borderRadius: 12,
              padding: 8,
            }}>
              <User size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}