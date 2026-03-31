import React from 'react';
import { Paper, Typography, Box, Button, LinearProgress, Stack, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HistoryIcon from '@mui/icons-material/History';

export default function BatchSummary({ files }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const total = files.length;
  const succeeded = files.filter((f) => f.status === 'success').length;
  const failed = files.filter((f) => f.status === 'failed').length;
  const progress = total > 0 ? ((succeeded + failed) / total) * 100 : 0;

  return (
    <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DoneAllIcon color="primary" fontSize="medium" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('batch.summary')}
          </Typography>
        </Box>
        <Divider />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {t('batch.summaryStats', { success: succeeded, failed: failed })}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/history')}
          >
            {t('batch.viewHistory')}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
