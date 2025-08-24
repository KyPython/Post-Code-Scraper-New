import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
  Box,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setScrapingFormOpen, 
  useStartScrapingJobMutation,
  addNotification,
  RootState 
} from '../../store/store';
import { ScrapingFormData } from '../../types/schema';
import { ExportFormat } from '../../types/enums';
import { formatExportFormat } from '../../utils/formatters';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    maxWidth: 600,
    width: '100%'
  }
}));

const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2)
}));

const ScrapingForm: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.app.isScrapingFormOpen);
  const [startScrapingJob, { isLoading }] = useStartScrapingJobMutation();

  const [formData, setFormData] = useState<ScrapingFormData>({
    countryCode: 'GB',
    batchSize: 100,
    delayBetweenRequests: 1000,
    maxRetries: 3,
    validateData: true,
    exportFormat: ExportFormat.CSV
  });

  const [errors, setErrors] = useState<Partial<ScrapingFormData>>({});

  const handleClose = () => {
    dispatch(setScrapingFormOpen(false));
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ScrapingFormData> = {};

    if (!formData.countryCode.trim()) {
      newErrors.countryCode = 'Country code is required';
    } else if (formData.countryCode.length !== 2) {
      newErrors.countryCode = 'Country code must be 2 characters';
    }

    if (formData.batchSize < 1 || formData.batchSize > 1000) {
      newErrors.batchSize = 'Batch size must be between 1 and 1000';
    }

    if (formData.delayBetweenRequests < 100 || formData.delayBetweenRequests > 10000) {
      newErrors.delayBetweenRequests = 'Delay must be between 100ms and 10000ms';
    }

    if (formData.maxRetries < 0 || formData.maxRetries > 10) {
      newErrors.maxRetries = 'Max retries must be between 0 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await startScrapingJob(formData).unwrap();
      
      dispatch(addNotification({
        message: result.message || 'Scraping job started successfully',
        type: 'success'
      }));
      
      handleClose();
    } catch (error: any) {
      console.error('Error starting scraping job:', error);
      dispatch(addNotification({
        message: error?.data?.message || error?.message || 'Failed to start scraping job. Please check if the backend server is running.',
        type: 'error'
      }));
    }
  };

  const handleInputChange = (field: keyof ScrapingFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'validateData' ? event.target.checked : 
               ['batchSize', 'delayBetweenRequests', 'maxRetries'].includes(field) ? 
               Number(value) : value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSliderChange = (field: keyof ScrapingFormData) => (
    event: Event,
    value: number | number[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value as number
    }));
  };

  const countryOptions = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' }
  ];

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <PlayArrowIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Start New Scraping Job
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Basic Configuration */}
          <FormSection>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SettingsIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Basic Configuration
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <FormControl fullWidth error={!!errors.countryCode}>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={formData.countryCode}
                    onChange={handleInputChange('countryCode')}
                    label="Country"
                  >
                    {countryOptions.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.code} - {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.countryCode && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.countryCode}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Export Format</InputLabel>
                  <Select
                    value={formData.exportFormat}
                    onChange={handleInputChange('exportFormat')}
                    label="Export Format"
                  >
                    {Object.values(ExportFormat).map((format) => (
                      <MenuItem key={format} value={format}>
                        {formatExportFormat(format)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.validateData}
                    onChange={handleInputChange('validateData')}
                    color="primary"
                  />
                }
                label="Enable data validation"
              />
            </Stack>
          </FormSection>

          {/* Advanced Settings */}
          <FormSection>
            <Stack spacing={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Advanced Settings
              </Typography>

              <Stack spacing={3}>
                {/* Batch Size */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Batch Size: {formData.batchSize} records
                  </Typography>
                  <SliderContainer>
                    <Slider
                      value={formData.batchSize}
                      onChange={handleSliderChange('batchSize')}
                      min={1}
                      max={1000}
                      step={10}
                      marks={[
                        { value: 1, label: '1' },
                        { value: 250, label: '250' },
                        { value: 500, label: '500' },
                        { value: 750, label: '750' },
                        { value: 1000, label: '1000' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </SliderContainer>
                  <Typography variant="caption" color="text.secondary">
                    Number of records to process in each batch
                  </Typography>
                </Box>

                {/* Delay Between Requests */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Request Delay: {formData.delayBetweenRequests}ms
                  </Typography>
                  <SliderContainer>
                    <Slider
                      value={formData.delayBetweenRequests}
                      onChange={handleSliderChange('delayBetweenRequests')}
                      min={100}
                      max={10000}
                      step={100}
                      marks={[
                        { value: 100, label: '100ms' },
                        { value: 2500, label: '2.5s' },
                        { value: 5000, label: '5s' },
                        { value: 7500, label: '7.5s' },
                        { value: 10000, label: '10s' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </SliderContainer>
                  <Typography variant="caption" color="text.secondary">
                    Delay between API requests to avoid rate limiting
                  </Typography>
                </Box>

                {/* Max Retries */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Max Retries: {formData.maxRetries}
                  </Typography>
                  <SliderContainer>
                    <Slider
                      value={formData.maxRetries}
                      onChange={handleSliderChange('maxRetries')}
                      min={0}
                      max={10}
                      step={1}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 3, label: '3' },
                        { value: 5, label: '5' },
                        { value: 10, label: '10' }
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </SliderContainer>
                  <Typography variant="caption" color="text.secondary">
                    Maximum number of retry attempts for failed requests
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </FormSection>

          {/* Warning */}
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> Large batch sizes and low delays may result in rate limiting. 
              Adjust settings based on the API provider's limitations.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={isLoading}
          startIcon={<PlayArrowIcon />}
          sx={{ minWidth: 120 }}
        >
          {isLoading ? 'Starting...' : 'Start Job'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ScrapingForm;