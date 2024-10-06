import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { it, expect, describe } from 'vitest';
import GlutenFreeMenu from '../../src/components/Menu Access/GlutenFreeMenu'; // Adjust the path to your Dashboard

describe('GlutenFreeMenu', () => {
    it('renders the GlutenFreeMenu with the correct components', async () => {
        // Render the Dashboard wrapped with MemoryRouter
        render(
            <MemoryRouter>
                <GlutenFreeMenu />
            </MemoryRouter>
        );

        await new Promise((r) => setTimeout(r, 3000));
        screen.debug();

        const breakfastItems = screen.getAllByText(/Breakfast/i);
        
        // Check that there are the expected number of "Breakfast" elements
        expect(breakfastItems.length).toBeGreaterThan(0); 


        // Optionally, you can assert on individual elements if needed
        breakfastItems.forEach(item => {
            expect(item).toBeInTheDocument(); // This checks each item is rendered
        });
        expect(screen.getByText(/Today's Menu/i)).toBeInTheDocument();
        
    });
});