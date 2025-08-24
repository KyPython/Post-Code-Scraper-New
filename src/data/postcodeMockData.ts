import { JobStatus, RequestStatus } from '../types/enums';

// Mock data for the postcode scraper application

// Data for global state store  
export const mockStore = {
  currentJob: {
    jobId: 'job-123e4567-e89b-12d3-a456-426614174000',
    status: 'completed' as const,
    state: 'California',
    city: 'Los Angeles',
    resultsCount: 1247,
    message: 'Job completed successfully'
  },
  databaseStats: {
    totalPostcodes: 45678,
    recentEntries: [
      { 'Post-Code': '90210', 'City/Town': 'Beverly Hills' },
      { 'Post-Code': '10001', 'City/Town': 'New York' },
      { 'Post-Code': '60601', 'City/Town': 'Chicago' },
      { 'Post-Code': '33101', 'City/Town': 'Miami' },
      { 'Post-Code': '94102', 'City/Town': 'San Francisco' }
    ],
    regionCounts: {
      'California': 8934,
      'New York': 6721,
      'Texas': 5432,
      'Florida': 4567,
      'Illinois': 3456
    }
  }
};

// Data returned by API queries
export const mockQuery = {
  jobStatus: {
    jobId: 'job-123e4567-e89b-12d3-a456-426614174000',
    status: 'completed' as const,
    preview: [
      { 'Post-Code': '90210', 'City/Town': 'Beverly Hills' },
      { 'Post-Code': '90211', 'City/Town': 'Beverly Hills' },
      { 'Post-Code': '90212', 'City/Town': 'Beverly Hills' },
      { 'Post-Code': '90213', 'City/Town': 'Beverly Hills' },
      { 'Post-Code': '90214', 'City/Town': 'Beverly Hills' }
    ],
    resultsCount: 1247,
    dbEntries: 45678,
    message: 'Found 1247 postcodes for California (Los Angeles)'
  },
  states: [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
    'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]
};

// Data passed as props to the root component
export const mockRootProps = {
  initialDatabaseStats: {
    totalPostcodes: 45678,
    recentEntries: [
      { 'Post-Code': '90210', 'City/Town': 'Beverly Hills' },
      { 'Post-Code': '10001', 'City/Town': 'New York' },
      { 'Post-Code': '60601', 'City/Town': 'Chicago' }
    ],
    regionCounts: {
      'California': 8934,
      'New York': 6721,
      'Texas': 5432
    }
  }
};