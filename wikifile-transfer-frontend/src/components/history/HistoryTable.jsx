import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TablePagination, Stack, Chip, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';
import BatchStatusBadge from '../batch/BatchStatusBadge';
import { retryTransfer } from '../../api/historyApi';

export default function HistoryTable({ records, total, page, perPage, setPage, refresh, loading }) {
  const { t } = useTranslation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1); // MUI is 0-indexed, our state is 1-indexed
  };

  const handleRetry = async (id) => {
    try {
      await retryTransfer(id);
      refresh();
    } catch (err) {
      console.error('Retry failed', err);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small" aria-label="history table">
          <TableHead>
            <TableRow sx={{ '& th': { bgcolor: 'background.default', fontWeight: 700 } }}>
              <TableCell>{t('history.fileTitle')}</TableCell>
              <TableCell>{t('history.sourceWiki')}</TableCell>
              <TableCell>{t('history.targetWiki')}</TableCell>
              <TableCell align="center">{t('history.status')}</TableCell>
              <TableCell>{t('history.timestamp')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'fontFamilyMono', fontWeight: 500 }}>
                    {row.file_title}
                  </Typography>
                  {row.error_message && (
                    <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                      {t('history.errorMessage', { message: row.error_message })}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip label={row.source_wiki} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                </TableCell>
                <TableCell>
                  <Chip label={row.target_wiki} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.75rem' }} />
                </TableCell>
                <TableCell align="center">
                  <BatchStatusBadge status={row.status} />
                </TableCell>
                <TableCell sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                  {new Date(row.created_at).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  {row.status === 'failed' && (
                    <Button
                      size="small"
                      startIcon={<ReplayIcon />}
                      onClick={() => handleRetry(row.id)}
                      color="primary"
                      variant="outlined"
                      sx={{ py: 0, textTransform: 'none' }}
                    >
                      {t('common.retry')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!loading && records.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {t('history.noRecords')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25]}
        component="div"
        count={total}
        rowsPerPage={perPage}
        page={page - 1} // MUI is 0-indexed
        onPageChange={handleChangePage}
      />
    </Paper>
  );
}
