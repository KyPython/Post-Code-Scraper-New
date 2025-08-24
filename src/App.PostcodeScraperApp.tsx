import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Container, Stack, Box } from '@mui/material';
import { store, useGetJobStatusQuery, useGetDatabaseStatsQuery } from './store/store';
import theme from './theme/theme';
import { JobStatus } from './types/enums';
import { JobData, DatabaseStats } from './types/schema';
import { mockStore, mockQuery } from './data/postcodeMockData';

// Components
import { Header } from './components/Header/Header';
import { ScrapingForm } from './components/ScrapingForm/ScrapingForm';
import { JobStatusCard } from './components/JobStatus/JobStatusCard';
import { ResultsPreviewTable } from './components/Results/ResultsPreviewTable';
import { DatabaseStatsCard } from './components/DatabaseStats/DatabaseStatsCard';
import { ContactSection } from './components/Contact/ContactSection';

const AppContent: React.FC = () => {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<JobData | null>(null);

  // Use mock data for database stats initially
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats>(mockStore.databaseStats);

  // Query hooks
  const { 
    data: jobStatusData, 
    isLoading: isJobLoading,
    error: jobError 
  } = useGetJobStatusQuery(currentJobId || '', {
    pollingInterval: currentJobId && currentJob?.status === JobStatus.RUNNING ? 5000 : 0,
    skip: !currentJobId,
  });

  const { 
    data: dbStatsData, 
    isLoading: isDbStatsLoading 
  } = useGetDatabaseStatsQuery();

  // Update job data when query returns
  useEffect(() => {
    if (jobStatusData && currentJobId) {
      const updatedJob: JobData = {
        jobId: currentJobId,
        status: jobStatusData.status,
        state: currentJob?.state || '',
        city: currentJob?.city,
        preview: jobStatusData.preview,
        resultsCount: jobStatusData.results_count || 0,
        dbEntries: jobStatusData.db_entries,
        message: jobStatusData.message,
        errorDetails: jobStatusData.error_details,
      };
      
      setCurrentJob(updatedJob);

      // Update database stats if provided
      if (jobStatusData.db_stats) {
        setDatabaseStats({
          totalPostcodes: jobStatusData.db_stats.total_postcodes,
          recentEntries: jobStatusData.db_stats.recent_entries,
          regionCounts: jobStatusData.db_stats.region_counts,
        });
      }
    }
  }, [jobStatusData, currentJobId, currentJob?.state, currentJob?.city]);

  // Update database stats when query returns
  useEffect(() => {
    if (dbStatsData) {
      setDatabaseStats({
        totalPostcodes: dbStatsData.total_postcodes,
        recentEntries: dbStatsData.recent_entries,
        regionCounts: dbStatsData.region_counts,
      });
    }
  }, [dbStatsData]);

  const handleJobStarted = (jobId: string) => {
    setCurrentJobId(jobId);
    // Initialize job with pending status
    setCurrentJob({
      jobId,
      status: JobStatus.PENDING,
      state: '', // Will be updated when job status is fetched
      resultsCount: 0,
    });
  };

  const handleDownload = (jobId: string) => {
    // Create download link
    const downloadUrl = `/download/${jobId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `postcodes_${currentJob?.state?.toLowerCase().replace(' ', '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showResults = currentJob?.status === JobStatus.COMPLETED && 
                     currentJob.preview && 
                     currentJob.preview.length > 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <Header />
          
          <ScrapingForm onJobStarted={handleJobStarted} />
          
          {(currentJob || isJobLoading) && (
            <JobStatusCard job={currentJob} isLoading={isJobLoading} />
          )}
          
          {showResults && (
            <ResultsPreviewTable
              preview={currentJob.preview!}
              totalResults={currentJob.resultsCount}
              jobId={currentJob.jobId}
              onDownload={handleDownload}
            />
          )}
          
          <DatabaseStatsCard 
            stats={databaseStats} 
            isLoading={isDbStatsLoading} 
          />
          
          <ContactSection />
        </Stack>
      </Container>
    </Box>
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