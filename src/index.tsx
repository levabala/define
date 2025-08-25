import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import { Main } from './pages/Main/index.js';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import { Login } from './pages/Login/index.js';

export function App() {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    <Route index element={<Main />} />
                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
