# Frontend - React Native (Expo) Client

This directory contains the React Native frontend for the microservices architecture project. It's built using [Expo](https://expo.dev) to ensure seamless development across platforms (iOS, Android, and Web). 

## Technologies Used
- **React Native & Expo**: Core framework for building the mobile app.
- **React Navigation**: For screen routing and tab navigation.
- **React Native Paper**: Material Design component UI library.
- **Axios**: HTTP client for API requests.
- **AsyncStorage**: Persistent, unencrypted, secure local storage for JWT token management.

## Project Structure
```text
frontend/
├── App.js                     # Application entry point wrapped in Providers
├── src/
│   ├── api/
│   │   └── axios.js           # Pre-configured axios instance (handles base URL, API interceptors)
│   ├── navigation/
│   │   └── AppNavigator.js    # Stack Navigator
│   └── screens/
│       ├── LoginScreen.js             # Authentication for User/Captain
│       ├── RegisterUserScreen.js      # Form to create rider account
│       ├── RegisterCaptainScreen.js   # Form to create driver account
│       ├── UserDashboardScreen.js     # User Interface (Request Rides)
│       └── CaptainDashboardScreen.js  # Captain Interface (Accept Rides)
```

## Setup & Running Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Base URL**
   The mobile app connects to the API Gateway. Open `src/api/axios.js` and set the `BASE_URL` appropriately:
   - For an **Android Emulator**: Leave it as `http://10.0.2.2:3000`
   - For a **Physical Device**, **iOS Simulator** or **Web**: Change to your machine's local IP address (e.g. `http://192.168.1.5:3000`)
   - For **Production**: Change to your deployed gateway URL.

3. **Start the App**
   Run the Expo bundler:
   ```bash
   npm start
   ```

4. **Connect Device**
   - Press `a` in the terminal to open an **Android emulator**.
   - Press `i` to open an **iOS simulator** (requires macOS).
   - Alternatively, download the **Expo Go** application on your physical device and scan the QR generated in the terminal.

## Service Flow Implemented
- **User Flow**: Register -> Login -> View Profile -> Submit a Ride Request to backend.
- **Captain Flow**: Register (with vehicle info) -> Login -> View Profile & Toggle Availability -> Enter a Ride ID manually to Accept it.
