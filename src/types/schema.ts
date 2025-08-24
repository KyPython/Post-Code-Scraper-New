import { JobStatus, RequestStatus } from './enums';

// Props types (data passed to components)
export interface PostcodeEntry {
  'Post-Code': string;
  'City/Town': string;
}

export interface DatabaseStats {
  totalPostcodes: number;
  recentEntries: PostcodeEntry[];
  regionCounts: Record<string, number>;
}

export interface JobData {
  jobId: string;
  status: JobStatus;
  state: string;
  city?: string;
  preview?: PostcodeEntry[];
  resultsCount: number;
  dbEntries?: number;
  message?: string;
  errorDetails?: string;
}

export interface AppProps {
  initialDatabaseStats?: DatabaseStats;
}

// Store types (global state data)
export interface AppState {
  currentJob: JobData | null;
  databaseStats: DatabaseStats;
  requestStatus: RequestStatus;
  states: string[];
}

// Query types (API response data)
export interface ScrapeResponse {
  status: string;
  job_id?: string;
  message?: string;
}

export interface JobStatusResponse {
  status: JobStatus;
  preview?: PostcodeEntry[];
  results_count?: number;
  db_entries?: number;
  message?: string;
  error_details?: string;
  db_stats?: DatabaseStats;
}

export interface DatabaseStatsResponse {
  total_postcodes: number;
  recent_entries: PostcodeEntry[];
  region_counts: Record<string, number>;
}

export interface InfoRequestResponse {
  status: string;
  message: string;
}

// Root component props interface
export interface PostcodeScraperAppProps {
  // Optional initial database stats to display before first API call
  initialDatabaseStats?: DatabaseStats;
  
  // Configuration options
  config?: {
    pollingInterval?: number; // How often to poll job status (default: 5000ms)
    maxRetries?: number; // Max retries for failed requests (default: 3)
    enableDebugMode?: boolean; // Enable debug logging (default: false)
  };
  
  // Theme and styling options
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
  };
  
  // API endpoints configuration (if different from defaults)
  apiEndpoints?: {
    scrapeUrl?: string;
    jobStatusUrl?: string;
    databaseStatsUrl?: string;
    requestInfoUrl?: string;
    downloadUrl?: string;
  };
}