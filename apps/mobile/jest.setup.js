import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';

// Mock fetch
global.fetch = jest.fn();

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
  clear: jest.fn()
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  create: jest.fn().mockReturnThis(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  }
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn()
  })
}));

// Mock biometrics
jest.mock('react-native-biometrics', () => ({
  ReactNativeBiometrics: jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest.fn().mockResolvedValue({ available: true, biometryType: 'TouchID' }),
    simplePrompt: jest.fn().mockResolvedValue({ success: true })
  }))
}));

// Silence specific warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0].includes('Please update the following components:')) return;
  originalWarn.apply(console, args);
};

// Mock dimensions
import { Dimensions } from 'react-native';
jest.spyOn(Dimensions, 'get').mockReturnValue({
  width: 375,
  height: 812,
  scale: 1,
  fontScale: 1
}); 