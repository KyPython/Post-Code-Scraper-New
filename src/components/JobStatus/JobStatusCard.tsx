import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  LinearProgress,
  IconButton,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ScrapingJob } from '../../types/schema';
import { ScrapingStatus } from '../../types/enums';
import { 
  formatNumber, 
  formatPercentage, 
  formatDuration, 
  formatDateTime,
  formatJobType,
  formatExportFormat
} from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { 
  usePauseScrapingJobMutation,
  useResumeScrapingJobMutation,
  useCancelScrapingJobMutation
} from '../../store/store';

const StyledCard = styled(Card)<{ status: ScrapingStatus }>(({ theme, status }) => {
  const getBorderColor = () => {
    switch (status) {
      case ScrapingStatus.RUNNING:
        return theme.palette.info.main;
      case ScrapingStatus.COMPLETED:
        return theme.palette.success.main;
      case ScrapingStatus.ERROR:
        return theme.palette.error.main;
      case ScrapingStatus.PAUSED:
        return theme.palette.warning.main;
      default:
        return theme.palette.divider;
    }
  };

  return {
    border: `2px solid ${getBorderColor()}`,
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4]
    }
  };
});

const ProgressSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`
}));

const StatChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiChip-label': {
    fontWeight: 500,
    fontSize: '0.75rem'
  }
}));

interface JobStatusCardProps {
  job: ScrapingJob;
}

const JobStatusCard: React.FC<JobStatusCardProps> = ({ job }) => {
  const [pauseJob] = usePauseScrapingJobMutation();
  const [resumeJob] = useResumeScrapingJobMutation();
  const [cancelJob] = useCancelScrapingJobMutation();

  const handlePause = async () => {
    try {
      await pauseJob(job.id).unwrap();
      console.log('Job paused successfully');
    } catch (error: any) {
      console.error('Failed to pause job:', error);
      // Could add notification here if needed
    }
  };

  const handleResume = async () => {
    try {
      await resumeJob(job.id).unwrap();
      console.log('Job resumed successfully');
    } catch (error: any) {
      console.error('Failed to resume job:', error);
      // Could add notification here if needed
    }
  };

  const handleCancel = async () => {
    try {
      await cancelJob(job.id).unwrap();
      console.log('Job cancelled successfully');
    } catch (error: any) {
      console.error('Failed to cancel job:', error);
      // Could add notification here if needed
    }
  };

  const getActionButtons = () => {
    switch (job.status) {
      case ScrapingStatus.RUNNING:
        return (
          <>
            <Tooltip title="Pause Job">
              <IconButton onClick={handlePause} size="small">
                <PauseIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel Job">
              <IconButton onClick={handleCancel} size="small" color="error">
                <StopIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      case ScrapingStatus.PAUSED:
        return (
          <>
            <Tooltip title="Resume Job">
              <IconButton onClick={handleResume} size="small" color="primary">
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel Job">
              <IconButton onClick={handleCancel} size="small" color="error">
                <StopIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <StyledCard status={job.status}>
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatJobType(job.type)}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <StatusBadge status={job.status} />
                <StatChip 
                  label={job.configuration.countryCode} 
                  size="small" 
                  variant="outlined"
                />
                <StatChip 
                  label={formatExportFormat(job.configuration.exportFormat)} 
                  size="small" 
                  variant="outlined"
                />
              </Stack>
            </Stack>
            
            <Stack direction="row" alignItems="center">
              {getActionButtons()}
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Progress Section */}
          <ProgressSection>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Progress
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatPercentage(job.progress)}
                </Typography>
              </Stack>
              
              <LinearProgress 
                variant="determinate" 
                value={job.progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4
                  }
                }} 
              />
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                  {formatNumber(job.processedRecords)} / {formatNumber(job.totalRecords)} records
                </Typography>
                {job.estimatedTimeRemaining && (
                  <Typography variant="caption" color="text.secondary">
                    ~{formatDuration(job.estimatedTimeRemaining)} remaining
                  </Typography>
                )}
              </Stack>
            </Stack>
          </ProgressSection>

          {/* Statistics */}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Stack alignItems="center" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <TrendingUpIcon sx={{ fontSize: 16, color: 'info.main' }} />
                <Typography variant="caption" color="text.secondary">
                  Processed
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatNumber(job.processedRecords)}
              </Typography>
            </Stack>

            <Stack alignItems="center" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <ErrorOutlineIcon sx={{ fontSize: 16, color: 'error.main' }} />
                <Typography variant="caption" color="text.secondary">
                  Errors
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600, color: job.errorCount > 0 ? 'error.main' : 'inherit' }}>
                {formatNumber(job.errorCount)}
              </Typography>
            </Stack>

            <Stack alignItems="center" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Started
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatDateTime(job.startTime).split(' ')[1]}
              </Typography>
            </Stack>
          </Stack>

          {/* Configuration Details */}
          <Divider />
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Configuration
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <StatChip 
                label={`Batch: ${job.configuration.batchSize}`} 
                size="small" 
                variant="outlined"
              />
              <StatChip 
                label={`Delay: ${job.configuration.delayBetweenRequests}ms`} 
                size="small" 
                variant="outlined"
              />
              <StatChip 
                label={`Retries: ${job.configuration.maxRetries}`} 
                size="small" 
                variant="outlined"
              />
              {job.configuration.validateData && (
                <StatChip 
                  label="Validation ON" 
                  size="small" 
                  variant="outlined"
                  sx={{ color: 'success.main', borderColor: 'success.main' }}
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

export default JobStatusCard;