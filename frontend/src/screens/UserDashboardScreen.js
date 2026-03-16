import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

export default function UserDashboardScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [rideStatus, setRideStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data.user);
    } catch (error) {
      console.log('Error fetching user profile', error);
    }
  };

  const requestRide = async () => {
    if (!pickup || !destination) {
      Alert.alert('Error', 'Please enter both pickup and destination');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/ride/create', { pickup, destination });
      setRideStatus(response.data.ride);
      Alert.alert('Success', 'Ride requested successfully!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to request ride';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/user/logout'); // Optional: notify backend
    } catch (e) {} // ignore
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Hello, {profile?.fullname?.firstname || 'User'}!</Text>
        <Button mode="text" onPress={handleLogout}>Logout</Button>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Request a Ride" />
        <Card.Content>
          <TextInput
            label="Pickup Location"
            value={pickup}
            onChangeText={setPickup}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Destination"
            value={destination}
            onChangeText={setDestination}
            style={styles.input}
            mode="outlined"
          />
          <Button mode="contained" onPress={requestRide} loading={loading} style={styles.button}>
            Find a Captain
          </Button>
        </Card.Content>
      </Card>

      {rideStatus && (
        <Card style={styles.card}>
          <Card.Title title="Current Ride Details" />
          <Card.Content>
            <Text variant="bodyMedium">Ride ID: {rideStatus.rideId}</Text>
            <Text variant="bodyMedium">Pickup: {rideStatus.pickup}</Text>
            <Text variant="bodyMedium">Destination: {rideStatus.destination}</Text>
            <Text variant="bodyMedium">Status: {rideStatus.status}</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 30 },
  card: { marginBottom: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
});
