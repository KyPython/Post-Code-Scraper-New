import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Stack, 
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setScrapingFormOpen, clearNotifications } from '../../store/store';
import { RootState } from '../../store/store';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const LogoSection = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(1),
  flexGrow: 1
}));

const NotificationMenuItem = styled(MenuItem)(({ theme }) => ({
  maxWidth: 300,
  whiteSpace: 'normal',
  '& .MuiListItemText-secondary': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary
  }
}));

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.app.notifications);
  const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null);

  const handleStartScraping = () => {
    dispatch(setScrapingFormOpen(true));
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleClearNotifications = () => {
    dispatch(clearNotifications());
    setNotificationAnchor(null);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'error':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'warning':
        return <WarningIcon color="warning" fontSize="small" />;
      case 'info':
      default:
        return <InfoIcon color="info" fontSize="small" />;
    }
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <LogoSection direction="row">
          <DnsOutlinedIcon 
            sx={{ 
              fontSize: 32, 
              color: 'primary.main' 
            }} 
          />
          <Stack>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Postcode Scraper
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
              {process.env.NODE_ENV === 'development' ? 'Development Mode' : 'Advanced Data Collection Tool'}
            </Typography>
          </Stack>
        </LogoSection>

        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={{ color: 'text.primary' }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleStartScraping}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Start Scraping
          </Button>
        </Stack>

        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { mt: 1, maxHeight: 400, width: 350 }
          }}
        >
          {notifications.length === 0 ? (
            <MenuItem disabled>
              <ListItemText primary="No notifications" />
            </MenuItem>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationMenuItem key={notification.id}>
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={new Date(notification.timestamp).toLocaleTimeString()}
                  />
                </NotificationMenuItem>
              ))}
              <MenuItem onClick={handleClearNotifications}>
                <ListItemIcon>
                  <ClearAllIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Clear all" />
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;