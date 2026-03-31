import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

export default function FileOverrideRow({ fileTitle, override, setOverride }) {
  const { t } = useTranslation();

  const handleOverrideChange = (field, value) => {
    setOverride({ ...override, [field]: value });
  };

  if (!fileTitle) return null;

  return (
    <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body2" sx={{ fontFamily: 'fontFamilyMono', fontWeight: 500 }}>
          {fileTitle}
        </Typography>
        {Object.keys(override).length > 0 && (
          <Typography variant="caption" color="primary" sx={{ ml: 2 }}>
            (Overrides set)
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: 'background.default' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label={t('batch.description')}
              value={override.description || ''}
              onChange={(e) => handleOverrideChange('description', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label={t('batch.licensingTemplate')}
              value={override.licensing_template || ''}
              onChange={(e) => handleOverrideChange('licensing_template', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label={t('batch.author')}
              value={override.author || ''}
              onChange={(e) => handleOverrideChange('author', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t('batch.date')}
              value={override.date || ''}
              onChange={(e) => handleOverrideChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
