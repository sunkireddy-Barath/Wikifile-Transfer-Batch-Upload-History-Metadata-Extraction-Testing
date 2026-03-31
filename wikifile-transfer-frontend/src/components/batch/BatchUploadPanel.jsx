import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Stack, Alert, LinearProgress, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileListInput from './FileListInput';
import SharedMetadataForm from './SharedMetadataForm';
import FileOverrideRow from './FileOverrideRow';
import BatchProgressTable from './BatchProgressTable';
import BatchSummary from './BatchSummary';
import { startBatchUpload } from '../../api/batchApi';
import { useBatch } from '../../context/BatchContext';
import { useBatchPolling } from '../../hooks/useBatchPolling';

export default function BatchUploadPanel() {
  const { t } = useTranslation();
  const { state, dispatch } = useBatch();
  const [files, setFiles] = useState(['']);
  const [metadata, setMetadata] = useState({
    target_wiki: 'hi.wikipedia.org',
    licensing_template: '{{Fair use}}',
    description: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [overrides, setOverrides] = useState({}); // { index: { ...fields } }
  const [submitting, setSubmitting] = useState(false);

  const { files: pollingFiles, isComplete, error: pollingError } = useBatchPolling(state.batchId);

  const handleTransferAll = async () => {
    const validFiles = files.filter(f => f.trim() !== '');
    if (validFiles.length === 0) return;

    setSubmitting(true);
    try {
      // Format overrides for API
      const formattedOverrides = Object.keys(overrides).map(index => ({
        file: files[index],
        ...overrides[index]
      }));

      const payload = {
        files: validFiles,
        target_wiki: metadata.target_wiki,
        metadata: {
          licensing_template: metadata.licensing_template,
          description: metadata.description,
          author: metadata.author,
          date: metadata.date,
        },
        overrides: formattedOverrides,
      };

      const response = await startBatchUpload(payload);
      
      dispatch({ 
        type: 'START_BATCH', 
        payload: { batchId: response.batch_id, files: validFiles } 
      });
      
    } catch (err) {
      console.error('Batch upload failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
    setFiles(['']);
    setOverrides({});
  };

  const handleOverrideChange = (index, value) => {
    setOverrides(prev => ({ ...prev, [index]: value }));
  };

  if (state.batchId) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
        <Stack spacing={4}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {t('batch.progressPanel')}
          </Typography>
          
          <BatchProgressTable files={pollingFiles} />
          
          {isComplete && (
            <Box sx={{ mt: 4, animation: 'fadeIn 0.5s ease-in' }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                  <BatchSummary files={pollingFiles} />
                </Grid>
                <Grid item xs={12} md={5}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    size="large" 
                    onClick={handleReset}
                    sx={{ height: '100%', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                  >
                    Start New Batch
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {pollingError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {pollingError}
            </Alert>
          )}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <CloudUploadIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {t('batch.panelTitle')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <FileListInput files={files} setFiles={setFiles} />
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <SharedMetadataForm metadata={metadata} setMetadata={setMetadata} />
              
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {t('batch.perFileOverrides')}
                </Typography>
                <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 0.5 }}>
                  {files.filter(f => f.trim() !== '').map((file, index) => (
                    <FileOverrideRow 
                      key={index} 
                      fileTitle={file} 
                      override={overrides[index] || {}} 
                      setOverride={(val) => handleOverrideChange(index, val)}
                    />
                  ))}
                  {files.filter(f => f.trim() !== '').length === 0 && (
                    <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center', py: 2 }}>
                      Add file titles to see override options
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            startIcon={submitting ? null : <CloudUploadIcon />}
            onClick={handleTransferAll}
            disabled={submitting || files.every(f => f.trim() === '')}
            sx={{ px: 6, py: 1.5, fontWeight: 700, borderRadius: 2 }}
          >
            {submitting ? 'Submitting...' : t('batch.transferAll')}
          </Button>
        </Box>

        {submitting && <LinearProgress sx={{ mt: 2 }} />}
      </Stack>
    </Box>
  );
}
