import React from 'react';
import { Typography, Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const HeaderContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6, 4),
  borderRadius: theme.spacing(3),
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  },
}));

const ContentContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  alignItems: 'center',
  textAlign: 'center',
  maxWidth: 800,
  margin: '0 auto',
}));

const IconContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.contrastText + '20',
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <ContentContainer spacing={2}>
        <IconContainer>
          <LocationOnOutlinedIcon 
            sx={{ 
              fontSize: 48, 
              color: 'primary.contrastText',
            }} 
          />
        </IconContainer>
        
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            mb: 1,
          }}
        >
          Post-Code Scraper
        </Typography>
        
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 400,
            opacity: 0.9,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            mb: 2,
          }}
        >
          Modern Postcode Data Collection
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.1rem',
            opacity: 0.8,
            lineHeight: 1.6,
            maxWidth: 600,
          }}
        >
          Scrape and collect postal codes from GeoNames database with advanced filtering options. 
          Get real-time updates and download results in CSV format.
        </Typography>
      </ContentContainer>
    </HeaderContainer>
  );
};