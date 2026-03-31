import React from 'react';
import { Box, Typography, Stack, Container, CircularProgress, Alert, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HistoryIcon from '@mui/icons-material/History';
import StatsPanel from './StatsPanel';
import HistoryFilterBar from './HistoryFilterBar';
import HistoryTable from './HistoryTable';
import { useHistoryFilters } from '../../hooks/useHistoryFilters';

export default function HistoryDashboard() {
  const { t } = useTranslation();
  const {
    records,
    total,
    page,
    stats,
    filters,
    loading,
    error,
    setFilters,
    setPage,
    refresh,
  } = useHistoryFilters();

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack spacing={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <HistoryIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {t('history.title')}
          </Typography>
        </Box>

        <StatsPanel stats={stats} loading={loading} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Past Transfers
          </Typography>
          <HistoryFilterBar filters={filters} setFilters={setFilters} />
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <HistoryTable
            records={records}
            total={total}
            page={page}
            perPage={25}
            setPage={setPage}
            refresh={refresh}
            loading={loading}
          />
        </Box>
      </Stack>
    </Box>
  );
}
