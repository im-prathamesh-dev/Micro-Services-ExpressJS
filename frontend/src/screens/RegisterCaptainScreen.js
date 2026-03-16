import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

export default function RegisterCaptainScreen({ navigation }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Vehicle details
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState('1');
  const [vehicleType, setVehicleType] = useState('motorcycle');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstname || !email || !password || !color || !plate || !vehicleType) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        fullname: { firstname, lastname },
        email,
        password,
        vehicle: {
          color,
          plate,
          capacity: parseInt(capacity) || 1,
          vehicleType
        }
      };
      
      const response = await api.post('/captain/register', payload);
      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', 'captain');
        navigation.replace('CaptainDashboard');
      } else {
        Alert.alert('Success', 'Registered! Please login.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Register as Captain</Text>

      <Text variant="titleMedium" style={styles.sectionTitle}>Personal Details</Text>
      <TextInput label="First Name" value={firstname} onChangeText={setFirstname} style={styles.input} mode="outlined" />
      <TextInput label="Last Name" value={lastname} onChangeText={setLastname} style={styles.input} mode="outlined" />
      <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} mode="outlined" />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} mode="outlined" />

      <Text variant="titleMedium" style={styles.sectionTitle}>Vehicle Details</Text>
      <TextInput label="Vehicle Color" value={color} onChangeText={setColor} style={styles.input} mode="outlined" />
      <TextInput label="License Plate" value={plate} onChangeText={setPlate} style={styles.input} mode="outlined" />
      <TextInput label="Capacity (Seats)" value={capacity} onChangeText={setCapacity} keyboardType="numeric" style={styles.input} mode="outlined" />
      <TextInput label="Vehicle Type (e.g. car, motorcycle, auto)" value={vehicleType} onChangeText={setVehicleType} style={styles.input} mode="outlined" autoCapitalize="none" />

      <Button mode="contained" onPress={handleRegister} loading={loading} style={styles.button}>
        Register
      </Button>

      <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton}>
        Back to Login
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  sectionTitle: { marginTop: 10, marginBottom: 10, fontWeight: 'bold', color: '#6200ee' },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingVertical: 5 },
  backButton: { marginTop: 15 },
});
