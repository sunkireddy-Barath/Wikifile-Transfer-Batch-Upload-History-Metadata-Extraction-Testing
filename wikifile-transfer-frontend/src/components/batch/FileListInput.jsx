import React from 'react';
import { Box, TextField, IconButton, Typography, Button, Paper, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FileListInput({ files, setFiles }) {
  const { t } = useTranslation();

  const handleAddFile = () => {
    if (files.length < 50) {
      setFiles([...files, '']);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleFileChange = (index, value) => {
    const newFiles = [...files];
    newFiles[index] = value;
    setFiles(newFiles);
  };

  return (
    <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t('batch.fileListTitle')} ({files.length}/50)
      </Typography>
      <Stack spacing={1}>
        {files.map((file, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t('batch.filePlaceholder')}
              value={file}
              onChange={(e) => handleFileChange(index, e.target.value)}
              InputProps={{
                sx: { fontFamily: 'fontFamilyMono' },
              }}
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveFile(index)}
              disabled={files.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <Button
        startIcon={<AddCircleIcon />}
        onClick={handleAddFile}
        sx={{ mt: 2 }}
        disabled={files.length >= 50}
      >
        {t('batch.addFile')}
      </Button>
    </Paper>
  );
}
