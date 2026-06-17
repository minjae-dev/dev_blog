import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeCtx {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ isDark: false, toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = useState<boolean>(() => {
        try {
            return localStorage.getItem("cs_blog_theme") === "dark";
        } catch {
            return false;
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
        localStorage.setItem("cs_blog_theme", isDark ? "dark" : "light");
    }, [isDark]);

    const toggleTheme = () => setIsDark((d) => !d);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
