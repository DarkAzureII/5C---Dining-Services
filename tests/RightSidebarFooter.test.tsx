// tests/RightSidebarFooter.test.tsx
/// <reference types="vitest/globals" />

// 1. Define mocks before any imports

// Mock firebaseConfig with auth containing currentUser
vi.mock('../src/firebaseConfig', () => ({
    auth: {
      currentUser: null, // Default to null; will override in tests
    },
    db: {}, // Mock db if necessary
  }));
  
  // 2. Now import modules after mocks
  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import { describe, it, expect, vi, beforeEach } from 'vitest';
  import RightSidebarFooter from '../src/components/RightSidebarFooter';
  import { auth } from '../src/firebaseConfig';
  
  describe('RightSidebarFooter', () => {
    // Mock window.location.href
    const originalLocation = window.location;
  
    beforeAll(() => {
      // @ts-ignore
      delete window.location;
      window.location = {
        href: '',
      } as any;
    });
  
    afterAll(() => {
      window.location = originalLocation;
    });
  
    // Mock window.alert
    beforeEach(() => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      // Reset auth.currentUser before each test
      auth.currentUser = null;
    });
  
    afterEach(() => {
      vi.restoreAllMocks();
    });
  
    const links = [
      { text: 'Menu Access', href: '/menu-access' },
      { text: 'Dietary Management', href: '/dietary-management' },
      { text: 'Dining Reservations', href: '/dining-reservations' },
      { text: 'Meal Credits', href: '/meal-credits' },
      { text: 'Feedback System', href: '/feedback-system' },
    ];
  
    it('renders all main elements correctly', () => {
      render(<RightSidebarFooter />);
  
      // Check for heading
      const heading = screen.getByText('Dining Services');
      expect(heading).toBeInTheDocument();
  
      // Check for description paragraph
      const description = screen.getByText(
        /Dining Services provides students with convenient access to healthy and affordable meals on campus/i
      );
      expect(description).toBeInTheDocument();
  
      // Check for separator line (assuming it's a div with border)
    //   const separator = screen.getByRole('separator');
    //   expect(separator).toBeInTheDocument();
  
      // Check for 'Components:' heading
      const componentsHeading = screen.getByText('Components:');
      expect(componentsHeading).toBeInTheDocument();
  
      // Check for all links
      links.forEach((link) => {
        const linkElement = screen.getByText(link.text);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.closest('a')).toHaveAttribute('href', link.href);
      });
    });
  
    it('handles link clicks when user is authenticated', () => {
      // Set auth.currentUser to simulate authenticated user
      auth.currentUser = {
        uid: '12345',
        email: 'testuser@example.com',
      } as any;
  
      render(<RightSidebarFooter />);
  
      links.forEach((link) => {
        const linkElement = screen.getByText(link.text);
        fireEvent.click(linkElement);
        expect(window.location.href).toBe(link.href);
      });
    });
  
    it('handles link clicks when user is not authenticated', () => {
        render(<RightSidebarFooter />);
    
        links.forEach((link) => {
          window.location.href = ''; // Reset href before each link click
          const linkElement = screen.getByText(link.text);
          fireEvent.click(linkElement);
    
          expect(window.location.href).toBe(''); // Expect href to remain unchanged
          expect(window.alert).toHaveBeenCalledWith(
            'Please log in or sign up first to access this feature.'
          );
        });
    
        expect(window.alert).toHaveBeenCalledTimes(links.length);
      });
  });
  