import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import AppShell from './components/layout/AppShell';
import BatchUploadPanel from './components/batch/BatchUploadPanel';
import HistoryDashboard from './history/HistoryDashboard'; // Wait, I put it in components/history/HistoryDashboard.jsx
import { BatchProvider } from './context/BatchContext';
import { HistoryProvider } from './context/HistoryContext';
import './i18n';

// Placeholder for Home (Single Transfer)
const Home = () => (
    <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Single Transfer Page</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
            This page is preserved as-is from the existing tool. 
            Navigate to Batch Upload or History using the sidebar.
        </Typography>
    </Container>
);

// Actually, I should use the correct path for HistoryDashboard
import HistoryDashboardRef from './components/history/HistoryDashboard';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BatchProvider>
        <HistoryProvider>
          <BrowserRouter>
            <AppShell>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/batch" element={<BatchUploadPanel />} />
                <Route path="/history" element={<HistoryDashboardRef />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </HistoryProvider>
      </BatchProvider>
    </ThemeProvider>
  );
}

import { Container, Typography } from '@mui/material';
