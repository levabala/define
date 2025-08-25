import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Main } from './pages/Main/index.js';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import { Login } from './pages/Login/index.js';

export function App() {
    return (
        <LocationProvider>
            <main>
                <Router>
                    <Route path="/" component={Main} />
                    <Route path="/login" component={Login} />
                    <Route default component={NotFound} />
                </Router>
            </main>
        </LocationProvider>
    );
}

render(<App />, document.getElementById('app')!);
