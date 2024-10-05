import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { auth } from "../../src/firebaseConfig";
import DietaryManagement  from "../../src/components/Dietary Management/DietaryPreferencesHandler";
import React from "react";
import type { User } from 'firebase/auth';
import '@testing-library/jest-dom';

describe("DietaryManagement", () => {
    it("renders the DietaryManagement component with the correct components", () => {
        render(<DietaryManagement />);
        screen.debug();

        expect(screen.getByText(/choose a preference/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter allergies, separated by commas/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter any special notes or description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add preference/i })).toBeInTheDocument();
        expect(screen.getByText(/no dietary preferences found/i)).toBeInTheDocument();
    });

    it("adds a new dietary preference", async () => {

    });

});