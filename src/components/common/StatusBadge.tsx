import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { JobStatus } from '../../types/enums';
import { formatJobStatus } from '../../utils/formatters';

// Icons
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';

interface StatusBadgeProps extends Omit<ChipProps, 'color' | 'variant'> {
  status: JobStatus;
}

const StyledChip = styled(Chip)<{ status: JobStatus }>(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case JobStatus.PENDING:
        return {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.dark,
          borderColor: theme.palette.warning.main,
        };
      case JobStatus.RUNNING:
        return {
          backgroundColor: theme.palette.info.light,
          color: theme.palette.info.dark,
          borderColor: theme.palette.info.main,
        };
      case JobStatus.COMPLETED:
        return {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.dark,
          borderColor: theme.palette.success.main,
        };
      case JobStatus.FAILED:
        return {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.dark,
          borderColor: theme.palette.error.main,
        };
      default:
        return {
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.grey[700],
          borderColor: theme.palette.grey[300],
        };
    }
  };

  const colors = getStatusColor();
  
  return {
    ...colors,
    border: `1px solid ${colors.borderColor}`,
    fontWeight: 500,
    '& .MuiChip-icon': {
      color: colors.color,
    },
  };
});

const getStatusIcon = (status: JobStatus) => {
  switch (status) {
    case JobStatus.PENDING:
      return <ScheduleOutlinedIcon />;
    case JobStatus.RUNNING:
      return <SettingsOutlinedIcon />;
    case JobStatus.COMPLETED:
      return <CheckCircleOutlinedIcon />;
    case JobStatus.FAILED:
      return <BugReportOutlinedIcon />;
    default:
      return undefined;
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, ...props }) => {
  return (
    <StyledChip
      status={status}
      label={formatJobStatus(status)}
      icon={getStatusIcon(status)}
      variant="outlined"
      size="small"
      {...props}
    />
  );
};