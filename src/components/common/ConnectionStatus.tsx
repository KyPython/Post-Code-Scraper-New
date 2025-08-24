import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  AlertTitle, 
  Button, 
  Stack, 
  Typography,
  Collapse,
  Box,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  useGetDatabaseStatsQuery, 
  useGetScrapingJobsQuery,
  useGetPostcodeDataQuery 
} from '../../store/store';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

const StatusContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: theme.zIndex.snackbar,
  maxWidth: 400
}));

const ConnectionStatus: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const { 
    error: statsError, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useGetDatabaseStatsQuery(undefined, { 
    skip: false,
    pollingInterval: 30000 // Poll every 30 seconds
  });

  const { 
    error: jobsError, 
    isLoading: jobsLoading, 
    refetch: refetchJobs 
  } = useGetScrapingJobsQuery(undefined, { 
    skip: false,
    pollingInterval: 5000 // Poll every 5 seconds for jobs
  });

  const { 
    error: dataError, 
    isLoading: dataLoading, 
    refetch: refetchData 
  } = useGetPostcodeDataQuery(undefined, { 
    skip: false
  });

  useEffect(() => {
    const hasErrors = statsError || jobsError || dataError;
    const isLoading = statsLoading || jobsLoading || dataLoading;
    
    if (isLoading) {
      setBackendStatus('checking');
    } else if (hasErrors) {
      setBackendStatus('disconnected');
    } else {
      setBackendStatus('connected');
    }
  }, [statsError, jobsError, dataError, statsLoading, jobsLoading, dataLoading]);

  const handleRefreshAll = () => {
    refetchStats();
    refetchJobs();
    refetchData();
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected':
        return 'success';
      case 'disconnected':
        return 'error';
      case 'checking':
      default:
        return 'warning';
    }
  };

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'connected':
        return <CheckCircleIcon />;
      case 'disconnected':
        return <ErrorIcon />;
      case 'checking':
      default:
        return <WarningIcon />;
    }
  };

  const getStatusMessage = () => {
    switch (backendStatus) {
      case 'connected':
        return 'Backend Connected';
      case 'disconnected':
        return 'Backend Disconnected';
      case 'checking':
      default:
        return 'Checking Connection...';
    }
  };

  if (backendStatus === 'connected') {
    return null; // Hide when everything is working
  }

  return (
    <StatusContainer>
      <Alert 
        severity={getStatusColor()} 
        icon={getStatusIcon()}
        action={
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              onClick={() => setShowDetails(!showDetails)}
              sx={{ textTransform: 'none' }}
            >
              {showDetails ? 'Hide' : 'Details'}
            </Button>
            <Button 
              size="small" 
              onClick={handleRefreshAll}
              startIcon={<RefreshIcon />}
              sx={{ textTransform: 'none' }}
            >
              Retry
            </Button>
          </Stack>
        }
      >
        <AlertTitle>{getStatusMessage()}</AlertTitle>
        {backendStatus === 'disconnected' && (
          <Typography variant="body2">
            Unable to connect to the backend server. Please ensure your Flask app is running.
          </Typography>
        )}
        
        <Collapse in={showDetails}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              API Endpoint Status:
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip 
                  label="/api/database-stats" 
                  size="small" 
                  color={statsError ? 'error' : 'success'}
                  variant="outlined"
                />
                {statsError && (
                  <Typography variant="caption" color="error">
                    {(statsError as any)?.status || 'Failed'}
                  </Typography>
                )}
              </Stack>
              
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip 
                  label="/api/scraping-jobs" 
                  size="small" 
                  color={jobsError ? 'error' : 'success'}
                  variant="outlined"
                />
                {jobsError && (
                  <Typography variant="caption" color="error">
                    {(jobsError as any)?.status || 'Failed'}
                  </Typography>
                )}
              </Stack>
              
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip 
                  label="/api/postcode-data" 
                  size="small" 
                  color={dataError ? 'error' : 'success'}
                  variant="outlined"
                />
                {dataError && (
                  <Typography variant="caption" color="error">
                    {(dataError as any)?.status || 'Failed'}
                  </Typography>
                )}
              </Stack>
            </Stack>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Expected backend URL: {window.location.origin}/api/
            </Typography>
          </Box>
        </Collapse>
      </Alert>
    </StatusContainer>
  );
};

export default ConnectionStatus;