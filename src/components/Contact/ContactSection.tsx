import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRequestInfoMutation } from '../../store/store';
import { RequestStatus } from '../../types/enums';

// Icons
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.secondary.main}30`,
  background: `linear-gradient(135deg, ${theme.palette.secondary.main}08 0%, ${theme.palette.primary.main}05 100%)`,
}));

const ContactButton = styled(Button)(({ theme }) => ({
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

export const ContactSection: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(RequestStatus.IDLE);
  const [requestInfo, { isLoading }] = useRequestInfoMutation();

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setRequestStatus(RequestStatus.IDLE);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({ name: '', email: '', message: '' });
    setRequestStatus(RequestStatus.IDLE);
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setRequestStatus(RequestStatus.LOADING);
      const result = await requestInfo(formData).unwrap();
      
      if (result.status === 'success') {
        setRequestStatus(RequestStatus.SUCCESS);
        setTimeout(() => {
          handleCloseDialog();
        }, 2000);
      } else {
        setRequestStatus(RequestStatus.ERROR);
      }
    } catch (err) {
      console.error('Failed to send request:', err);
      setRequestStatus(RequestStatus.ERROR);
    }
  };

  const handleQuickRequest = async () => {
    try {
      const result = await requestInfo({}).unwrap();
      
      if (result.status === 'success') {
        setRequestStatus(RequestStatus.SUCCESS);
      } else {
        setRequestStatus(RequestStatus.ERROR);
      }
    } catch (err) {
      console.error('Failed to send request:', err);
      setRequestStatus(RequestStatus.ERROR);
    }
  };

  return (
    <>
      <StyledCard>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <InfoOutlinedIcon 
                sx={{ 
                  fontSize: 32, 
                  color: 'secondary.main',
                }} 
              />
              <Typography variant="h4" component="h2" color="secondary.main">
                Need More Information?
              </Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary">
              Interested in the full dataset, custom scraping features, or API access? 
              Get in touch to learn more about our premium offerings.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <ContactButton
                variant="contained"
                color="secondary"
                startIcon={<EmailOutlinedIcon />}
                onClick={handleOpenDialog}
                fullWidth
              >
                Send Detailed Request
              </ContactButton>
              
              <ContactButton
                variant="outlined"
                color="secondary"
                onClick={handleQuickRequest}
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? 'Sending...' : 'Quick Contact'}
              </ContactButton>
            </Stack>

            {requestStatus === RequestStatus.SUCCESS && (
              <Alert severity="success">
                Request sent successfully! We'll contact you soon.
              </Alert>
            )}

            {requestStatus === RequestStatus.ERROR && (
              <Alert severity="error">
                Failed to send request. Please try again.
              </Alert>
            )}
          </Stack>
        </CardContent>
      </StyledCard>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            Contact Us for More Information
          </DialogTitle>
          
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                fullWidth
                variant="outlined"
              />
              
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                fullWidth
                variant="outlined"
              />
              
              <TextField
                label="Message"
                value={formData.message}
                onChange={handleInputChange('message')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Tell us about your specific needs..."
              />

              {requestStatus === RequestStatus.SUCCESS && (
                <Alert severity="success">
                  Request sent successfully! We'll contact you soon.
                </Alert>
              )}

              {requestStatus === RequestStatus.ERROR && (
                <Alert severity="error">
                  Failed to send request. Please try again.
                </Alert>
              )}
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isLoading || requestStatus === RequestStatus.SUCCESS}
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};