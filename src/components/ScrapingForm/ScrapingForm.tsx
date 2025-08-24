import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useStartScrapingMutation } from '../../store/store';
import { mockQuery } from '../../data/postcodeMockData';

// Icons
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}05 100%)`,
  border: `1px solid ${theme.palette.primary.main}20`,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

interface ScrapingFormProps {
  onJobStarted: (jobId: string) => void;
}

export const ScrapingForm: React.FC<ScrapingFormProps> = ({ onJobStarted }) => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [startScraping, { isLoading, error }] = useStartScrapingMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedState) return;

    try {
      const result = await startScraping({
        state: selectedState,
        city: city || undefined,
      }).unwrap();

      if (result.status === 'started' && result.job_id) {
        onJobStarted(result.job_id);
      }
    } catch (err) {
      console.error('Failed to start scraping:', err);
    }
  };

  const isFormValid = selectedState.trim() !== '';

  return (
    <StyledCard>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <LocationOnOutlinedIcon 
              sx={{ 
                fontSize: 32, 
                color: 'primary.main',
              }} 
            />
            <Typography variant="h4" component="h2" color="primary.main">
              Start Scraping
            </Typography>
          </Stack>

          <Typography variant="body1" color="text.secondary">
            Select a state and optionally filter by city to begin collecting postcode data.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Autocomplete
                options={mockQuery.states}
                value={selectedState}
                onChange={(_, newValue) => setSelectedState(newValue || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select State"
                    placeholder="Search for a state..."
                    required
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <ManageSearchOutlinedIcon 
                          sx={{ 
                            color: 'text.secondary', 
                            mr: 1,
                            fontSize: 20 
                          }} 
                        />
                      ),
                    }}
                  />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                noOptionsText="No states found"
                clearOnEscape
                selectOnFocus
                handleHomeEndKeys
              />

              <TextField
                label="Filter by City (Optional)"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                variant="outlined"
                fullWidth
              />

              {error && (
                <Alert severity="error">
                  Failed to start scraping. Please try again.
                </Alert>
              )}

              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!isFormValid || isLoading}
                fullWidth
              >
                {isLoading ? 'Starting...' : 'Start Scraping'}
              </StyledButton>
            </Stack>
          </form>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};