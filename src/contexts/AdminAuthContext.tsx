import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/apiClient"; // adjust path if needed

interface Admin {
    id: number;
    name: string;
    email: string;
    created: string;
    updated: string;
}

interface AdminAuthContextType {
    admin: Admin | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error("useAdminAuth must be used within an AdminAuthProvider");
    }
    return context;
};

interface AdminAuthProviderProps {
    children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("dhani_finance_token");
        const storedAdmin = localStorage.getItem("dhani_finance_data");

        if (storedToken && storedAdmin) {
            setToken(storedToken);
            setAdmin(JSON.parse(storedAdmin));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const response = await api.post("/admin/login", { email, password });
            const { admin: adminData, token: authToken } = response.data.data;

            setAdmin(adminData);
            setToken(authToken);

            localStorage.setItem("dhani_finance_token", authToken);
            localStorage.setItem("dhani_finance_data", JSON.stringify(adminData));
        } catch (error: any) {
            throw error.response?.data?.message || "Login failed";
        }
    };

    const logout = async () => {
        try {
            await api.post("/admin/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setAdmin(null);
            setToken(null);
            localStorage.removeItem("dhani_finance_token");
            localStorage.removeItem("dhani_finance_data");
        }
    };

    const value: AdminAuthContextType = {
        admin,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated: !!admin && !!token,
    };

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
