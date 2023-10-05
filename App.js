import React, { useState, useEffect } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Appbar, Button, TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import Todo from './Todo';
import Toast from 'react-native-toast-message';

export default function App() {
  const ref = firestore().collection('todos');
  const [todo, setTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  // Toast ref
  const toastRef = React.useRef(null);

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, complete } = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });
      setTodos(list);
      if (loading) {
        setLoading(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [loading]);

  async function addTodo() {
    const trimmedTodo = todo.trim();

    if (trimmedTodo.length === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        bottomOffset: 100,
        text1: 'Error',
        text2: 'Todo cannot be empty!',
      });
      return;
    }

    try {
      await ref.add({
        title: trimmedTodo,
        complete: false,
      });

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: `${trimmedTodo} added successfully!`,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });

      setTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        bottomOffset: 100,
        text1: 'Error',
        text2: 'Failed to add todo!',
      });
    }
  }

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#eee" translucent={true} />
      <View style={{ flex: 1 }}>
        <Appbar.Header mode="center-aligned" style={{ backgroundColor: '#55c' }}>
          <Appbar.Content title={'TODOs List'} style={{ backgroundColor: '#fff', borderRadius: 20 }} />
        </Appbar.Header>
        <Text> List of TODOs! - Lê Nguyễn Minh Tuấn</Text>
        <FlatList
          style={{ flex: 1 }}
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Todo {...item} />}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ccc' }} />}
        />
        <View style={{ height: 60, flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 1 }}>
          <TextInput
            style={{ width: '80%', marginLeft: 2 }}
            mode="outlined"
            label={'New Todo'}
            value={todo}
            onChangeText={(text) => setTodo(text)}
            onSubmitEditing={addTodo}
          />
          <Button mode="text" icon="send" style={{ height: 50, alignSelf: 'flex-end' }} onPress={addTodo}>
            Add
          </Button>
        </View>
      </View>
      <Toast ref={toastRef} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
