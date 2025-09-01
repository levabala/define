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

    useEffect(() => {
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);

        return () => {
            window.removeEventListener('resize', setVH);
            window.removeEventListener('orientationchange', setVH);
        };
    }, []);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <main
                    className="h-[100dvh] p-2"
                    style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
                >
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
