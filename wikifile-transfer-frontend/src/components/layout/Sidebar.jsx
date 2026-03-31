import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import HistoryIcon from '@mui/icons-material/History';
import LanguageSwitcher from './LanguageSwitcher';

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { text: t('nav.singleTransfer'), icon: <CompareArrowsIcon />, path: '/' },
    { text: t('nav.batchUpload'), icon: <BatchPredictionIcon />, path: '/batch' },
    { text: t('nav.history'), icon: <HistoryIcon />, path: '/history' },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="img"
          src="https://upload.wikimedia.org/wikipedia/commons/d/de/Wikipedia-logo-%233366CC.svg"
          sx={{ width: 32, height: 32 }}
          alt="Logo"
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: -0.5 }}>
          Wikifile
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'inherit' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <LanguageSwitcher />
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
          {t('nav.user', { user: 'GSoC Contributor' })}
        </Typography>
      </Box>
    </Box>
  );
}
