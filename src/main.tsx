import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const Main = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <div className={`ds-message ds-message-${theme}`}>
      <App theme={theme} setTheme={setTheme} />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
