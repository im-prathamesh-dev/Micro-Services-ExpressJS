import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

export default function CaptainDashboardScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [rideId, setRideId] = useState('');
  const [acceptedRide, setAcceptedRide] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/captain/profile');
      setProfile(response.data.captain);
      setIsAvailable(response.data.captain.isAvailable);
    } catch (error) {
      console.log('Error fetching captain profile', error);
    }
  };

  const toggleAvailability = async () => {
    try {
      const response = await api.patch('/captain/toggle-availability');
      setIsAvailable(response.data.isAvailable);
    } catch (error) {
      Alert.alert('Error', 'Could not toggle availability');
    }
  };

  const acceptRide = async () => {
    if (!rideId) {
      Alert.alert('Error', 'Please enter a valid Ride ID');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/ride/accept', { rideId });
      setAcceptedRide(response.data.ride);
      Alert.alert('Success', 'Ride accepted successfully!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to accept ride';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/captain/logout'); // Optional
    } catch (e) {} // ignore
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Hello, Capt. {profile?.fullname?.firstname || ''}!</Text>
        <Button mode="text" onPress={handleLogout}>Logout</Button>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Status & Settings" />
        <Card.Content style={styles.row}>
          <Text variant="bodyLarge">Available for Rides?</Text>
          <Switch value={isAvailable} onValueChange={toggleAvailability} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Accept a Ride" />
        <Card.Content>
          <Text variant="bodySmall" style={{marginBottom: 10}}>
            Enter the Ride ID to accept a passenger's ride manually.
          </Text>
          <TextInput
            label="Ride ID"
            value={rideId}
            onChangeText={setRideId}
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
          />
          <Button mode="contained" onPress={acceptRide} loading={loading} style={styles.button}>
            Accept Ride
          </Button>
        </Card.Content>
      </Card>

      {acceptedRide && (
        <Card style={styles.card}>
          <Card.Title title="Active Ride" />
          <Card.Content>
            <Text variant="bodyMedium">Pickup: {acceptedRide.pickup}</Text>
            <Text variant="bodyMedium">Destination: {acceptedRide.destination}</Text>
            <Text variant="bodyMedium">Status: {acceptedRide.status}</Text>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
});
