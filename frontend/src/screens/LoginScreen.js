import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'captain'
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const endpoint = role === 'user' ? '/user/login' : '/captain/login';
      const response = await api.post(endpoint, { email, password });
      
      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', role); // Save role to determine dashboard on app reload
        navigation.replace(role === 'user' ? 'UserDashboard' : 'CaptainDashboard');
      } else {
        Alert.alert('Error', 'No token received from server');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      Alert.alert('Login Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>

      <SegmentedButtons
        value={role}
        onValueChange={setRole}
        buttons={[
          { value: 'user', label: 'Rider (User)' },
          { value: 'captain', label: 'Driver (Captain)' },
        ]}
        style={styles.segmented}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
        Login
      </Button>

      <View style={styles.footer}>
        <Text variant="bodyMedium">Don't have an account?</Text>
        <Button mode="text" onPress={() => navigation.navigate('RegisterUser')}>Register as User</Button>
        <Button mode="text" onPress={() => navigation.navigate('RegisterCaptain')}>Register as Captain</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  segmented: { marginBottom: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingVertical: 5 },
  footer: { marginTop: 30, alignItems: 'center' },
});
