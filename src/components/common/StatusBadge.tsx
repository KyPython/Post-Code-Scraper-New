import React from 'react';
import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ScrapingStatus } from '../../types/enums';
import { formatStatus } from '../../utils/formatters';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PauseIcon from '@mui/icons-material/Pause';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const StyledChip = styled(Chip)<{ status: ScrapingStatus }>(({ theme, status }) => {
  const getStatusColors = () => {
    switch (status) {
      case ScrapingStatus.COMPLETED:
        return {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.dark,
          borderColor: theme.palette.success.main
        };
      case ScrapingStatus.ERROR:
        return {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.dark,
          borderColor: theme.palette.error.main
        };
      case ScrapingStatus.RUNNING:
        return {
          backgroundColor: theme.palette.info.light,
          color: theme.palette.info.dark,
          borderColor: theme.palette.info.main
        };
      case ScrapingStatus.PAUSED:
        return {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.dark,
          borderColor: theme.palette.warning.main
        };
      case ScrapingStatus.IDLE:
      default:
        return {
          backgroundColor: theme.palette.grey[100],
          color: theme.palette.grey[700],
          borderColor: theme.palette.grey[300]
        };
    }
  };

  const colors = getStatusColors();

  return {
    backgroundColor: colors.backgroundColor,
    color: colors.color,
    border: `1px solid ${colors.borderColor}`,
    fontWeight: 500,
    '& .MuiChip-icon': {
      color: colors.color
    }
  };
});

interface StatusBadgeProps {
  status: ScrapingStatus;
  size?: 'small' | 'medium';
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'small', 
  showIcon = true 
}) => {
  const getStatusIcon = () => {
    if (!showIcon) return undefined;

    switch (status) {
      case ScrapingStatus.COMPLETED:
        return <CheckOutlinedIcon />;
      case ScrapingStatus.ERROR:
        return <ErrorOutlineIcon />;
      case ScrapingStatus.RUNNING:
        return <HourglassTopOutlinedIcon />;
      case ScrapingStatus.PAUSED:
        return <PauseIcon />;
      case ScrapingStatus.IDLE:
      default:
        return <FiberManualRecordIcon />;
    }
  };

  return (
    <StyledChip
      status={status}
      label={formatStatus(status)}
      size={size}
      icon={getStatusIcon()}
      variant="outlined"
    />
  );
};

export default StatusBadge;