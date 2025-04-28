import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserListScreen from '../screens/UserListScreen';
import AddEditUserScreen from '../screens/AddEditUserScreen';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const navigation = useNavigation<any>();

  return (
    <Stack.Navigator >
      <Stack.Screen 
        name="UserList" 
        component={UserListScreen} 
        options={{
          title: 'User List',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AddEditUser')}>
              <Text style={{ color: 'blue', marginRight: 10 }}>Add User</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen 
        name="AddEditUser" 
        component={AddEditUserScreen} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
