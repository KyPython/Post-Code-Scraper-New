import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useGetDatabaseStatsQuery } from '../../store/store';
import { formatNumber, formatDateTime } from '../../utils/formatters';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PublicIcon from '@mui/icons-material/Public';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 0)
}));

const CountryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiChip-label': {
    fontWeight: 500
  }
}));

const DatabaseStatsCard: React.FC = () => {
  const { data: stats, isLoading, error } = useGetDatabaseStatsQuery();

  if (isLoading) {
    return (
      <StyledCard>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DnsOutlinedIcon color="primary" />
              <Typography variant="h6">Database Statistics</Typography>
            </Stack>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary">
              Loading database statistics...
            </Typography>
          </Stack>
        </CardContent>
      </StyledCard>
    );
  }

  if (error || !stats) {
    return (
      <StyledCard>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ErrorIcon color="error" />
              <Typography variant="h6">Database Statistics</Typography>
            </Stack>
            <Typography variant="body2" color="error">
              Failed to load database statistics
            </Typography>
          </Stack>
        </CardContent>
      </StyledCard>
    );
  }

  const qualityPercentage = (stats.dataQuality.validRecords / stats.totalRecords) * 100;

  return (
    <StyledCard>
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <DnsOutlinedIcon color="primary" sx={{ fontSize: 28 }} />
              <Stack>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Database Statistics
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {formatDateTime(stats.lastUpdated)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Total Records */}
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {formatNumber(stats.totalRecords)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total postcode records
            </Typography>
          </Box>

          <Divider />

          {/* Data Quality */}
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Data Quality
            </Typography>
            
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2">Overall Quality</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {qualityPercentage.toFixed(1)}%
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={qualityPercentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: qualityPercentage > 90 ? 'success.main' : 
                                   qualityPercentage > 70 ? 'warning.main' : 'error.main'
                  }
                }} 
              />
            </Box>

            <Stack spacing={1}>
              <StatItem>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="body2">Valid Records</Typography>
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatNumber(stats.dataQuality.validRecords)}
                </Typography>
              </StatItem>

              <StatItem>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
                  <Typography variant="body2">Invalid Records</Typography>
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatNumber(stats.dataQuality.invalidRecords)}
                </Typography>
              </StatItem>

              <StatItem>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ContentCopyIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                  <Typography variant="body2">Duplicate Records</Typography>
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatNumber(stats.dataQuality.duplicateRecords)}
                </Typography>
              </StatItem>
            </Stack>
          </Stack>

          <Divider />

          {/* Records by Country */}
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PublicIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Records by Country
              </Typography>
            </Stack>
            
            <Stack spacing={1}>
              {Object.entries(stats.recordsByCountry)
                .sort(([,a], [,b]) => b - a)
                .map(([country, count]) => (
                  <StatItem key={country}>
                    <CountryChip 
                      label={country} 
                      size="small" 
                      variant="outlined"
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatNumber(count)}
                    </Typography>
                  </StatItem>
                ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

export default DatabaseStatsCard;