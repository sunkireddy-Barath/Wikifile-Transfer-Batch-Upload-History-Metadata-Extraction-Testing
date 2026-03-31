import React from 'react';
import { Paper, Tabs, Tab, Box, TextField, MenuItem, Stack, Grid, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';

export default function HistoryFilterBar({ filters, setFilters }) {
  const { t } = useTranslation();

  const handleStatusChange = (event, newValue) => {
    setFilters({ status: newValue });
  };

  const handleFilterChange = (field, value) => {
    setFilters({ [field]: value });
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      sourceWiki: '',
      targetWiki: '',
      startDate: '',
      endDate: '',
    });
  };

  const statusOptions = [
    { value: 'all', label: t('history.all') },
    { value: 'success', label: t('common.success') },
    { value: 'failed', label: t('common.failed') },
    { value: 'pending', label: t('common.queued') },
  ];

  const wikiOptions = [
    { value: '', label: 'Any Wiki' },
    { value: 'en.wikipedia.org', label: 'English (en.wikipedia)' },
    { value: 'es.wikipedia.org', label: 'Spanish (es.wikipedia)' },
    { value: 'fr.wikipedia.org', label: 'French (fr.wikipedia)' },
    { value: 'de.wikipedia.org', label: 'German (de.wikipedia)' },
    { value: 'ja.wikipedia.org', label: 'Japanese (ja.wikipedia)' },
    { value: 'zh.wikipedia.org', label: 'Chinese (zh.wikipedia)' },
    { value: 'ru.wikipedia.org', label: 'Russian (ru.wikipedia)' },
    { value: 'it.wikipedia.org', label: 'Italian (it.wikipedia)' },
  ];

  return (
    <Paper sx={{ mb: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
        <Tabs value={filters.status} onChange={handleStatusChange} aria-label="history status tabs">
          {statusOptions.map((opt) => (
            <Tab key={opt.value} value={opt.value} label={opt.label} sx={{ textTransform: 'none', fontWeight: 600 }} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              size="small"
              label={t('history.sourceWiki')}
              value={filters.sourceWiki}
              onChange={(e) => handleFilterChange('sourceWiki', e.target.value)}
            >
              {wikiOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              size="small"
              label={t('history.targetWiki')}
              value={filters.targetWiki}
              onChange={(e) => handleFilterChange('targetWiki', e.target.value)}
            >
              {wikiOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="Clear filters">
              <IconButton onClick={handleClearFilters}>
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
