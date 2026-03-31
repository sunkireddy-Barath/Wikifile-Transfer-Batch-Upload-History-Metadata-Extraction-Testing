import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress, Typography, Box, Link, Chip, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BatchStatusBadge from './BatchStatusBadge';
import TranslateIcon from '@mui/icons-material/Translate';

export default function BatchProgressTable({ files }) {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="batch progress table">
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>{t('history.fileTitle')}</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>{t('history.status')}</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, index) => (
            <TableRow
              key={`${file.title}-${index}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography variant="body2" sx={{ fontFamily: 'fontFamilyMono', fontWeight: 500 }}>
                  {file.title}
                </Typography>
                {file.status === 'processing' && (
                  <LinearProgress sx={{ mt: 1, height: 4, borderRadius: 2 }} />
                )}
              </TableCell>
              <TableCell align="center">
                <BatchStatusBadge status={file.status} />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {file.target_url && (
                    <Link
                      href={file.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}
                    >
                      {t('common.success')} <OpenInNewIcon fontSize="inherit" />
                    </Link>
                  )}
                  {file.categories_localized && file.categories_localized.length > 0 && (
                    <Tooltip title={`${t('batch.categoriesLocalized')}: ${file.categories_localized.join(', ')}`}>
                      <Chip
                        icon={<TranslateIcon sx={{ fontSize: '1rem !important' }} />}
                        label={t('batch.categoriesLocalized')}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem', height: 20 }}
                      />
                    </Tooltip>
                  )}
                  {file.error && (
                    <Typography variant="caption" color="error">
                      {file.error}
                    </Typography>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
