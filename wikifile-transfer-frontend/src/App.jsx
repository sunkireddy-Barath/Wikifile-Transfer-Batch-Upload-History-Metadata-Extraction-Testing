import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import AppShell from './components/layout/AppShell';
import BatchUploadPanel from './components/batch/BatchUploadPanel';
import HistoryDashboard from './components/history/HistoryDashboard';
import { BatchProvider } from './context/BatchContext';
import { HistoryProvider } from './context/HistoryContext';
import './i18n';

// Preserved placeholder for existing Single Transfer tool
const Home = () => (
    <Container sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Single Transfer Page</Typography>
        <Typography variant="body1">
            This page represents the original, existing tool. Preserved as a reference.
            Use the sidebar to explore <strong>Batch Upload</strong> and <strong>History Dashboard</strong>.
        </Typography>
    </Container>
);

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
                <Route path="/history" element={<HistoryDashboard />} />
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
