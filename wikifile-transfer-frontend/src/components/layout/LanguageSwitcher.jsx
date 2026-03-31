import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="language-select-label" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LanguageIcon fontSize="small" /> {t('nav.language')}
      </InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={i18n.language || 'en'}
        label={t('nav.language')}
        onChange={handleChange}
        sx={{ borderRadius: 1 }}
      >
        <MenuItem value="en">English (en)</MenuItem>
        <MenuItem value="es">Español (es)</MenuItem>
        <MenuItem value="fr">Français (fr)</MenuItem>
        <MenuItem value="de">Deutsch (de)</MenuItem>
        <MenuItem value="it">Italiano (it)</MenuItem>
      </Select>
    </FormControl>
  );
}
