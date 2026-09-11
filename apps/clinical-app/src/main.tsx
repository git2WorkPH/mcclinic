import { MvpApp } from './mvp/MvpApp';
import { createRoot } from 'react-dom/client';
import { App } from './App';
const root = document.getElementById('root');
if (!root) throw new Error('Missing application root');
if (window.location.pathname.startsWith('/clinic')) {
  createRoot(root).render(<MvpApp />);
} else {
createRoot(root).render(<App />);
}

