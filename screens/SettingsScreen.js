// SettingsScreen.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EDE0',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  currencyButton: {
    backgroundColor: '#7D5A50',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  currencyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    backgroundColor: '#7D5A50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const currencyOptions = [
  { code: 'USD', name: 'Dollar ($)' },
  { code: 'KRW', name: 'Won (₩)' },
  { code: 'JPY', name: 'Yen (¥)' },
  { code: 'GBP', name: 'Pound (£)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'PHP', name: 'Peso (₱)' },
];

const SettingsScreen = ({ navigation }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleCurrencyChange = (currencyCode) => {
    setSelectedCurrency(currencyCode);
    setModalVisible(true);
  };

  const handleSetCurrency = async () => {
    try {
      await AsyncStorage.setItem('currency', selectedCurrency);
      navigation.navigate('Home', { currency: selectedCurrency });
    } catch (error) {
      console.error('Error saving currency: ', error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set a Currency</Text>
      {currencyOptions.map((option) => (
        <TouchableOpacity
          key={option.code}
          style={styles.currencyButton}
          onPress={() => handleCurrencyChange(option.code)}
        >
          <Text style={styles.currencyText}>{option.name}</Text>
        </TouchableOpacity>
      ))}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to set {selectedCurrency}?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSetCurrency}
              >
                <Text style={styles.modalButtonText}>Set</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;
