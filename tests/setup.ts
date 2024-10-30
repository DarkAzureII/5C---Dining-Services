// tests/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase Auth functions
vi.mock('firebase/auth', () => ({
  ...vi.importActual('firebase/auth'),
  onAuthStateChanged: vi.fn(),
}));

// Mock firebaseConfig
vi.mock('../src/firebaseConfig', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
  },
  db: {},
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Export mockNavigate for use in tests if needed
export { mockNavigate };
