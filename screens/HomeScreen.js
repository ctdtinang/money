import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EDE0',
    paddingTop: 100,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#7D5A50',
    fontWeight: 'bold',
  },
  totalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 20,
  },
  total: {
    fontSize: 18,
    color: '#7D5A50',
  },
  savingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7D5A50',
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  trashIcon: {
    backgroundColor: '#F5EDE0',
    borderRadius: 20,
    padding: 10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#7D5A50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    color: '#7D5A50',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#7D5A50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

const currencySymbols = {
    USD: '$',
    KRW: '₩',
    JPY: '¥',
    GBP: '£',
    EUR: '€',
    PHP: '₱',
  };
  
  const HomeScreen = ({ navigation, route }) => {
    const [spent, setSpent] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [currency, setCurrency] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
  
    useEffect(() => {
      loadData();
      loadCurrency();
      // Listen for changes in currency parameter
      if (route.params && route.params.currency) {
        setCurrency(route.params.currency);
      }
    }, [route.params]);
  
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('spent');
        if (savedData !== null) {
          const parsedData = JSON.parse(savedData);
          setSpent(parsedData);
          calculateTotal(parsedData);
        }
      } catch (error) {
        console.error('Error loading data: ', error);
      }
    };
  
    const loadCurrency = async () => {
      try {
        const savedCurrency = await AsyncStorage.getItem('currency');
        if (savedCurrency !== null) {
          setCurrency(savedCurrency);
        }
      } catch (error) {
        console.error('Error loading currency: ', error);
      }
    };
  
    const calculateTotal = (data) => {
      const total = data.reduce((acc, curr) => acc + curr.amount, 0);
      setTotalSpent(total);
    };
  

  const handleDelete = async (id) => {
    const updatedSpent = spent.filter((item) => item.id !== id);
    try {
      await AsyncStorage.setItem('spent', JSON.stringify(updatedSpent));
      setSpent(updatedSpent);
      calculateTotal(updatedSpent);
    } catch (error) {
      console.error('Error deleting data: ', error);
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setModalVisible(false);
    handleDelete(selectedItem.id);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Money Spent Tracker</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.total}>Total Money Spent: {currencySymbols[currency]}{totalSpent}</Text>
        </View>
      </View>
      <FlatList
        data={spent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.savingsItem}
            onPress={() => handleItemPress(item)}
          >
            <View>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>{item.name}</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{currencySymbols[currency]}{item.amount}</Text>
            </View>
            <FontAwesome name="trash" size={24} color="#7D5A50" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('AddSpent')}
        >
          <Text style={styles.navButtonText}>Add Spent</Text>
        </TouchableOpacity>
      </View>
      {selectedItem && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Name: {selectedItem.name}</Text>
              <Text style={styles.modalText}>Amount: {currencySymbols[currency]}{selectedItem.amount}</Text>
              <Text style={styles.modalText}>Description: {selectedItem.description}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleConfirmDelete}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleCancelDelete}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default HomeScreen;
