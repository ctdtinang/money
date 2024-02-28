/////////////
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EDE0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#7D5A50',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: '100%',
    backgroundColor: '#7D5A50',
  },
});

const AddSpentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    const newSpentItem = {
      id: Math.random().toString(),
      name,
      amount: parseFloat(amount),
      description,
    };

    try {
      const savedData = await AsyncStorage.getItem('spent'); 
      let data = [];
      if (savedData !== null) {
        data = JSON.parse(savedData);
      }
      data.push(newSpentItem);
      await AsyncStorage.setItem('spent', JSON.stringify(data)); 
      navigation.navigate('Home', { newSpentItem });
    } catch (error) {
      console.error('Error saving data: ', error);
    }

    setName('');
    setAmount('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Spent Money</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={(text) => setAmount(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Button
        title="Add"
        onPress={handleAdd}
        color="#7D5A50"
      />
    </View>
  );
};

export default AddSpentScreen;
