import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User } from './UserListScreen';

const STORAGE_KEY = 'USER_LIST';

const AddEditUserScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const userToEdit: User | undefined = route.params?.user;

  const [firstName, setFirstName] = useState(userToEdit?.firstName || '');
  const [lastName, setLastName] = useState(userToEdit?.lastName || '');
  const [email, setEmail] = useState(userToEdit?.email || '');
  const [description, setDescription] = useState(userToEdit?.description || '');
  const [error, setError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: userToEdit ? 'Edit User' : 'Add User',
    });
  }, [navigation, userToEdit]);

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return regex.test(email);
  };

  const saveUser = async () => {
    if (!firstName || firstName.length < 3) {
      setError('First Name must be at least 3 characters.');
      return;
    }
    if (!email || !validateEmail(email)) {
      setError('Email must be valid (e.g., test@example.com)');
      return;
    }
    if (!description || description.length > 120) {
      setError('Description must not exceed 120 characters.');
      return;
    }

    const userListRaw = await AsyncStorage.getItem(STORAGE_KEY);
    const users: User[] = userListRaw ? JSON.parse(userListRaw) : [];

    if (userToEdit) {
      const updatedUsers = users.map(u => u.id === userToEdit.id 
        ? { ...userToEdit, firstName, lastName, email,  description } 
        : u
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    } else {
      const newUser: User = { id: Date.now().toString(), firstName, lastName, email,  description };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...users, newUser]));
    }

    navigation.navigate('UserList', { refresh: true }); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter First Name" 
        value={firstName} 
        onChangeText={setFirstName} 
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter Last Name" 
        value={lastName} 
        onChangeText={setLastName} 
      />

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        placeholder="name@123" 
        value={email} 
        keyboardType="email-address" 
        onChangeText={setEmail} 
      />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={[styles.input, { height: 80 }]} 
        placeholder="Write about yourself..." 
        value={description} 
        onChangeText={setDescription} 
        multiline 
        maxLength={120} 
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title={userToEdit ? 'Update' : 'Save'} onPress={saveUser} />
    </View>
  );
};

export default AddEditUserScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 16 },
  error: { color: 'red', marginBottom: 10 },
});
