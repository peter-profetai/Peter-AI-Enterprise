import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Portal } from './pages/Portal';
import { AIStudio } from './pages/AIStudio';
import { AILM } from './pages/AILM';
import { AutoML } from './pages/AutoML';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LayoutProvider } from './contexts/LayoutContext';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <LayoutProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Portal />} />
              <Route path="/studio/*" element={<AIStudio />} />
              <Route path="/ailm/*" element={<AILM />} />
              <Route path="/automl/*" element={<AutoML />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </LayoutProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;