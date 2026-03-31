import React from 'react';
import { Paper, Typography, Grid, TextField, MenuItem, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function SharedMetadataForm({ metadata, setMetadata }) {
  const { t } = useTranslation();

  const wikis = [
    { value: 'hi.wikipedia.org', label: 'Hindi (hi.wikipedia)' },
    { value: 'te.wikipedia.org', label: 'Telugu (te.wikipedia)' },
    { value: 'ta.wikipedia.org', label: 'Tamil (ta.wikipedia)' },
    { value: 'bn.wikipedia.org', label: 'Bengali (bn.wikipedia)' },
    { value: 'en.wikipedia.org', label: 'English (en.wikipedia)' },
  ];

  const handleMetadataChange = (field, value) => {
    setMetadata({ ...metadata, [field]: value });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t('batch.sharedMetadata')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label={t('batch.targetWiki')}
            value={metadata.target_wiki}
            onChange={(e) => handleMetadataChange('target_wiki', e.target.value)}
            size="small"
          >
            {wikis.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label={t('batch.licensingTemplate')}
            value={metadata.licensing_template}
            onChange={(e) => handleMetadataChange('licensing_template', e.target.value)}
            placeholder="{{Fair use}}"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={2}
            label={t('batch.description')}
            value={metadata.description}
            onChange={(e) => handleMetadataChange('description', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label={t('batch.author')}
            value={metadata.author}
            onChange={(e) => handleMetadataChange('author', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label={t('batch.date')}
            value={metadata.date}
            onChange={(e) => handleMetadataChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
