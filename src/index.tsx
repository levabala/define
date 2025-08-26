import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import { Login } from './pages/Login/index';
import { Main } from './pages/Main/index';
import { NotFound } from './pages/_404';
import './style.css';
import { ThemeProvider } from './theme-provider';

export function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <main>
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
