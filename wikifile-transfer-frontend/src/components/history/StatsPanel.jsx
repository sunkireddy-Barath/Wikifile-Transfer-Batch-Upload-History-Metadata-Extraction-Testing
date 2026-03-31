import React from 'react';
import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';

const StatCard = ({ title, value, icon, loading }) => (
  <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        bgcolor: 'primary.light',
        color: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
        {title}
      </Typography>
      {loading ? (
        <Skeleton width={80} height={32} />
      ) : (
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      )}
    </Box>
  </Paper>
);

export default function StatsPanel({ stats, loading }) {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={4}>
        <StatCard
          title={t('history.total')}
          value={stats.total_transfers}
          icon={<HistoryIcon />}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard
          title={t('history.successRate')}
          value={`${stats.success_rate}%`}
          icon={<CheckCircleIcon />}
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatCard
          title={t('history.topTarget')}
          value={stats.top_target_wiki}
          icon={<PublicIcon />}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}
