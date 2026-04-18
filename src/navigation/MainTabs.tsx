import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { NlqScreen } from '../screens/NlqScreen';
import { OntologyScreen } from '../screens/OntologyScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { MainTabParamList } from '../types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Memos" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="note-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="NLQ" 
        component={NlqScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chat-question" color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Ontology" 
        component={OntologyScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="graph" color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
