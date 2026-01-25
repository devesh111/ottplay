"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * AppContext - Global state management for authentication and language
 * Provides auth state, user data, and language preferences across the application
 * @type {React.Context}
 */
const AppContext = createContext();

/**
 * AppProvider component - Wraps the application to provide global state
 * Manages authentication state, user data, and language preferences
 * Persists state to localStorage for persistence across sessions
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export function AppProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [language, setLanguage] = useState("en");
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Initialize app state from localStorage on mount
     */
    useEffect(() => {
        const initializeApp = () => {
            try {
                // Load authentication state
                const authToken = localStorage.getItem("authToken");
                const userData = localStorage.getItem("user");
                const savedLanguage = localStorage.getItem("language") || "en";

                if (authToken && userData) {
                    setIsAuthenticated(true);
                    setUser(JSON.parse(userData));
                }

                setLanguage(savedLanguage);
            } catch (error) {
                console.error("Error initializing app state:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    /**
     * Login user - sets authentication state and persists to localStorage
     * @param {Object} userData - User data object
     * @param {string} token - Authentication token
     */
    const login = (userData, token) => {
        try {
            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    /**
     * Logout user - clears authentication state and localStorage
     */
    const logout = () => {
        try {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    /**
     * Change application language
     * @param {string} newLanguage - Language code (e.g., 'en', 'hi', 'es')
     */
    const changeLanguage = (newLanguage) => {
        try {
            localStorage.setItem("language", newLanguage);
            setLanguage(newLanguage);
        } catch (error) {
            console.error("Error changing language:", error);
        }
    };

    /**
     * Update user profile data
     * @param {Object} updatedUserData - Updated user data
     */
    const updateUser = (updatedUserData) => {
        try {
            const newUserData = { ...user, ...updatedUserData };
            localStorage.setItem("user", JSON.stringify(newUserData));
            setUser(newUserData);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const value = {
        isAuthenticated,
        user,
        language,
        isLoading,
        login,
        logout,
        changeLanguage,
        updateUser,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Custom hook to use AppContext
 * Must be used within AppProvider
 * 
 * @returns {Object} App context value with auth and language state
 * @throws {Error} If used outside of AppProvider
 */
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within AppProvider");
    }
    return context;
}
