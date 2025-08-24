import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { store } from './store/store';
import theme from './theme/theme';
import Header from './components/Header/Header';
import DatabaseStatsCard from './components/DatabaseStats/DatabaseStatsCard';
import JobStatusCard from './components/JobStatus/JobStatusCard';
import ResultsPreviewTable from './components/Results/ResultsPreviewTable';
import ScrapingForm from './components/ScrapingForm/ScrapingForm';
import ContactSection from './components/Contact/ContactSection';
import ConnectionStatus from './components/common/ConnectionStatus';
import { useGetScrapingJobsQuery } from './store/store';

const AppContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default
}));

const MainContent = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3)
}));

const AppContent: React.FC = () => {
  const { data: jobs = [] } = useGetScrapingJobsQuery();

  return (
    <AppContainer>
      <Header />
      
      <MainContent maxWidth="xl">
        <Stack spacing={4}>
          {/* Top Section - Stats and Active Jobs */}
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
            {/* Left Column - Database Stats */}
            <Box sx={{ flex: 1, maxWidth: { lg: 400 } }}>
              <Stack spacing={3}>
                <DatabaseStatsCard />
                <ContactSection />
              </Stack>
            </Box>

            {/* Right Column - Active Jobs */}
            <Box sx={{ flex: 2 }}>
              <Stack spacing={3}>
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobStatusCard key={job.id} job={job} />
                  ))
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      border: 2,
                      borderStyle: 'dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      color: 'text.secondary'
                    }}
                  >
                    No active scraping jobs. Click "Start Scraping" to begin.
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Bottom Section - Results Table */}
          <ResultsPreviewTable />
        </Stack>
      </MainContent>

      {/* Dialogs */}
      <ScrapingForm />
      
      {/* Connection Status */}
      <ConnectionStatus />
    </AppContainer>
  );
};

const PostcodeScraperApp: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default PostcodeScraperApp;