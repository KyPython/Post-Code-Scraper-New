import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Alert,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { JobStatus } from '../../types/enums';
import { JobData } from '../../types/schema';
import { StatusBadge } from '../common/StatusBadge';
import { formatJobMessage, formatResultsCount } from '../../utils/formatters';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.divider}`,
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

interface JobStatusCardProps {
  job: JobData | null;
  isLoading?: boolean;
}

export const JobStatusCard: React.FC<JobStatusCardProps> = ({ job, isLoading = false }) => {
  if (!job && !isLoading) {
    return null;
  }

  const renderProgress = () => {
    if (isLoading || job?.status === JobStatus.RUNNING) {
      return (
        <ProgressContainer>
          <LinearProgress color="primary" />
        </ProgressContainer>
      );
    }
    return null;
  };

  const renderMessage = () => {
    if (!job) return null;

    const message = job.message || formatJobMessage(job.jobId, job.status, job.resultsCount);
    
    if (job.status === JobStatus.FAILED) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {message}
        </Alert>
      );
    }

    if (job.status === JobStatus.COMPLETED) {
      return (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      );
    }

    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {message}
      </Typography>
    );
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h3">
              Job Status
            </Typography>
            {job && <StatusBadge status={job.status} />}
          </Stack>

          {job && (
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>Job ID:</strong> {job.jobId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>State:</strong> {job.state}
                {job.city && (
                  <>
                    {' • '}
                    <strong>City:</strong> {job.city}
                  </>
                )}
              </Typography>
              {job.status === JobStatus.COMPLETED && job.resultsCount > 0 && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Results:</strong> {formatResultsCount(job.resultsCount)}
                </Typography>
              )}
            </Stack>
          )}

          {renderProgress()}
          {renderMessage()}

          {isLoading && !job && (
            <Typography variant="body2" color="text.secondary">
              Initializing job...
            </Typography>
          )}
        </Stack>
      </CardContent>
    </StyledCard>
  );
};