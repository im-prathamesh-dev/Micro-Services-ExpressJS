import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

export default function RegisterUserScreen({ navigation }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstname || !email || !password) {
      Alert.alert('Error', 'First name, email, and password are required');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/user/register', {
        fullname: { firstname, lastname },
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', 'user');
        navigation.replace('UserDashboard');
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
      <Text variant="headlineMedium" style={styles.title}>Register as User</Text>

      <TextInput label="First Name" value={firstname} onChangeText={setFirstname} style={styles.input} mode="outlined" />
      <TextInput label="Last Name" value={lastname} onChangeText={setLastname} style={styles.input} mode="outlined" />
      <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} mode="outlined" />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} mode="outlined" />

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
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingVertical: 5 },
  backButton: { marginTop: 15 },
});
