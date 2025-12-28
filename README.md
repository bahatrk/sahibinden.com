# React Native Expo App

A mobile application built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version): [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/)
- **Expo Go App** (for testing on physical devices):
  - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS App Store](https://apps.apple.com/us/app/expo-go/id982107779)

## 🚀 Installation & Setup

Follow these steps to get the project running locally.

### 1. Clone the repository

Open your terminal and run:

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. Install dependencies
Install the necessary packages using npm or yarn:

```bash
npm install
# OR
yarn install
```

### 📱 Running the Application

Make sure The Backend ıs up and runnıng 
After backend make sure devıce and backend uses same netweok connectıon such assame WIFI
## Environment Variables

Create a `.env` file in the project root :

Check the Wireless LAN adapter Wi-Fi: `ipconfig`

`IPv4 Address. . . . . . . . . . . : Your Backend Connectıon`

```bash
EXPO_PUBLIC_BACKEND_API_URL=http://{IPv4 Address}
```

### Start the server

Run the following command to start the Metro Bundler:

```bash
npm run prebuild
npm run android
```

### Open on your device

Once the server is running, you will see a QR code in the terminal.

Physical Device:

Android: Open the Expo Go app and scan the QR code.

iOS: Open the standard Camera app, scan the code, and tap the notification.

Note: Ensure your phone and computer are on the same Wi-Fi network.

Emulators/Simulators:

Press `a` to run on Android Emulator.

Press `i` to run on iOS Simulator (macOS only).

Press `w` to run in a Web Browser.


### 📂 Project Structure
``` bash
/
├── assets/          # Images, fonts, and static files
├── components/      # Reusable UI components
├── constant/        # App contants and confıgs
├── lib/             # App backend Connectıvty servıce
├── screens/         # Main application screens
├── navigation/      # Navigation configuration
├── App.js           # Entry point
├── app.json         # Expo config
└── package.json     # Dependencies and scripts
```

