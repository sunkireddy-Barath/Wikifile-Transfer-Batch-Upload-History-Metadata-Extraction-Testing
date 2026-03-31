import React from 'react';
import { Chip, CircularProgress, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

/**
 * Reusable Status Badge for file transfer status
 * @param {Object} props
 * @param {'queued'|'processing'|'success'|'failed'} props.status
 */
export default function BatchStatusBadge({ status }) {
  const { t } = useTranslation();

  const getStatusConfig = () => {
    switch (status) {
      case 'queued':
        return {
          label: t('common.queued'),
          color: 'default',
          icon: <ScheduleIcon fontSize="small" />,
        };
      case 'processing':
        return {
          label: t('common.processing'),
          color: 'warning',
          icon: <CircularProgress size={16} color="inherit" />,
        };
      case 'success':
        return {
          label: t('common.success'),
          color: 'success',
          icon: <CheckCircleIcon fontSize="small" />,
        };
      case 'failed':
        return {
          label: t('common.failed'),
          color: 'error',
          icon: <ErrorIcon fontSize="small" />,
        };
      default:
        return {
          label: status,
          color: 'default',
        };
    }
  };

  const { label, color, icon } = getStatusConfig();

  return (
    <Chip
      label={label}
      color={color}
      icon={icon}
      size="small"
      variant="filled"
      aria-label={`Status: ${label}`}
      sx={{ minWidth: 100, fontWeight: 600 }}
    />
  );
}
