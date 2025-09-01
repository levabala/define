import { createBrowserRouter } from '@datadog/browser-rum-react/react-router-v7';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { useEffect } from 'react';
import './other/datadog';
import { Login } from './pages/Login/index';
import { Main } from './pages/Main/index';
import { NotFound } from './pages/_404';
import './style.css';
import { ThemeProvider } from './theme-provider';
import { trpc } from './trpc/client';

const router = createBrowserRouter([
    {
        index: true,
        element: <Main />,
    },
    {
        path: 'login',
        element: <Login />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);

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
            <main
                className="h-[100dvh] p-2"
                style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
            >
                <RouterProvider router={router} />
            </main>
        </ThemeProvider>
    );
}

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
