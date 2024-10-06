// BalanceTab.test.tsx
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, beforeEach, it, vi, expect } from 'vitest';
import BalanceTab from '../../src/components/meal credits/Balance';
import { auth } from '../../src/firebaseConfig';
import {
  fetchData,
  postData,
  updateData,
  deleteData,
} from '../../src/API/MealCredits';

// Define types for your data
interface Account {
  accountName: string;
  balance: number;
  isDefault: boolean;
}

interface ApiResponse {
  accounts: Account[];
}

// Mock the API module
vi.mock('../../src/API/MealCredits', () => ({
  fetchData: vi.fn(),
  postData: vi.fn(),
  updateData: vi.fn(),
  deleteData: vi.fn(),
}));

// Mock Firebase auth
vi.mock('../../src/firebaseConfig', () => ({
  auth: {
    onAuthStateChanged: vi.fn((callback) => {
      callback({ email: 'test3@example.com' });
      return vi.fn(); // unsubscribe function
    }),
  },
}));

describe('BalanceTab Component', () => {
  // Type the mocked functions
  const mockFetchData = vi.mocked(fetchData);
  const mockPostData = vi.mocked(postData);
  const mockUpdateData = vi.mocked(updateData);
  const mockDeleteData = vi.mocked(deleteData);

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up mock implementations
    mockFetchData.mockResolvedValue({
      accounts: [
        { accountName: 'Account1', balance: 100, isDefault: false },
        { accountName: 'Account2', balance: 200, isDefault: true },
      ],
    });

    mockPostData.mockResolvedValue({ success: true });
    mockUpdateData.mockResolvedValue({ success: true });
    mockDeleteData.mockResolvedValue({ success: true });
  });

  // Example of testing account creation
  it('creates new account successfully', async () => {
    const newAccount = {
      accountName: 'New Account',
      balance: 50,
      isDefault: false,
    };

    mockPostData.mockResolvedValueOnce({ success: true, account: newAccount });
    
    render(<BalanceTab />);

    // Add your test implementation here
    // You might need to trigger some user events to create an account
    // Then verify the results
  });

  // Example of testing account updates
  it('updates account successfully', async () => {
    const updatedAccount = {
      accountName: 'Updated Account',
      balance: 150,
      isDefault: true,
    };

    mockUpdateData.mockResolvedValueOnce({ success: true, account: updatedAccount });
    
    render(<BalanceTab />);

    // Add your test implementation here
    // You might need to trigger some user events to update an account
    // Then verify the results
  });

  // Example of testing account deletion
  it('deletes account successfully', async () => {
    mockDeleteData.mockResolvedValueOnce({ success: true });
    
    render(<BalanceTab />);

    // Add your test implementation here
    // You might need to trigger some user events to delete an account
    // Then verify the results
  });
});