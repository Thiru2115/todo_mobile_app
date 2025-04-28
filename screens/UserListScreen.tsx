import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
};

const STORAGE_KEY = 'USER_LIST';

const UserListScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation<any>();
console.log(users, "usersd")
  const loadUsers = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) setUsers(JSON.parse(data));
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, []),
  );

  const deleteUser = async (id: string) => {
    const filtered = users.filter(u => u.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    setUsers(filtered);
  };

  const renderItem = ({item}: {item: User}) => (
    <View style={styles.item}>
      <Text style={styles.name}>
        {item.firstName} {item.lastName}
      </Text>
      <Text>{item.email}</Text>
      <Text>{item.description}</Text>
      <View style={styles.row}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('AddEditUser', {user: item})}
        />
        <Button
          title="Delete"
          color="red"
          onPress={() => deleteUser(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <Text style={styles.noData}>No Users Found</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={u => u.id}
          renderItem={renderItem}
        />
      )}
      <View style={styles.footer}>
        <Button title="Refresh" onPress={loadUsers} />
      </View>
    </View>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: 'white'},
  item: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {fontSize: 16, fontWeight: 'bold'},
  row: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 8},
  noData: {textAlign: 'center', marginTop: 20, fontSize: 16},
  footer: {marginTop: 20},
});
