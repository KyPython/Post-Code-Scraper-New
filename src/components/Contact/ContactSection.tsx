import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Box,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import BugReportIcon from '@mui/icons-material/BugReport';
import HelpIcon from '@mui/icons-material/Help';

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2)
}));

const ContactButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const ContactSection: React.FC = () => {
  const contactOptions = [
    {
      icon: <EmailIcon />,
      title: 'Email Support',
      description: 'Get help with technical issues',
      action: 'mailto:support@postcodescraper.com',
      label: 'Send Email'
    },
    {
      icon: <GitHubIcon />,
      title: 'GitHub Repository',
      description: 'View source code and contribute',
      action: 'https://github.com/postcode-scraper',
      label: 'View on GitHub'
    },
    {
      icon: <BugReportIcon />,
      title: 'Report Bug',
      description: 'Found an issue? Let us know',
      action: 'https://github.com/postcode-scraper/issues',
      label: 'Report Issue'
    },
    {
      icon: <HelpIcon />,
      title: 'Documentation',
      description: 'Learn how to use the scraper',
      action: 'https://docs.postcodescraper.com',
      label: 'View Docs'
    }
  ];

  return (
    <StyledCard>
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get support, report issues, or contribute to the project
            </Typography>
          </Stack>

          <Stack spacing={1}>
            {contactOptions.map((option, index) => (
              <ContactButton
                key={index}
                startIcon={option.icon}
                component={Link}
                href={option.action}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                <Stack sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {option.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Stack>
              </ContactButton>
            ))}
          </Stack>

          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              Postcode Scraper v1.0.0 • Built with ❤️ for data enthusiasts
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

export default ContactSection;