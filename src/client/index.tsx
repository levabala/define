import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import { useEffect } from 'react';
import { Login } from './pages/Login/index';
import { Main } from './pages/Main/index';
import { NotFound } from './pages/_404';
import './style.css';
import { ThemeProvider } from './theme-provider';
import { trpc } from './trpc/client';

export function App() {
    useEffect(() => {
        trpc.ping.mutate();
    }, []);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <main className="h-[100vh] pl-[calc(0.5rem+env(safe-area-inset-left))] pr-[calc(0.5rem+env(safe-area-inset-right))] pt-[calc(0.5rem+env(safe-area-inset-top))] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
                    <Routes>
                        <Route index element={<Main />} />
                        <Route path="login" element={<Login />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </ThemeProvider>
    );
}

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
