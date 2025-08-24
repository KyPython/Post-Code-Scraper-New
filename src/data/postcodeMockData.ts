import { PostcodeData, ScrapingJob, DatabaseStats } from '../types/schema';
import { ScrapingStatus, JobType, DataSource, ExportFormat } from '../types/enums';

export const mockPostcodeData: PostcodeData[] = [
  {
    id: '1',
    postcode: 'SW1A 1AA',
    latitude: 51.5014,
    longitude: -0.1419,
    placeName: 'London',
    adminName1: 'England',
    adminName2: 'Greater London',
    countryCode: 'GB',
    accuracy: 95,
    source: DataSource.GEONAMES,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    postcode: 'M1 1AA',
    latitude: 53.4808,
    longitude: -2.2426,
    placeName: 'Manchester',
    adminName1: 'England',
    adminName2: 'Greater Manchester',
    countryCode: 'GB',
    accuracy: 92,
    source: DataSource.GEONAMES,
    createdAt: '2024-01-15T10:31:00Z',
    updatedAt: '2024-01-15T10:31:00Z'
  },
  {
    id: '3',
    postcode: 'EH1 1YZ',
    latitude: 55.9533,
    longitude: -3.1883,
    placeName: 'Edinburgh',
    adminName1: 'Scotland',
    adminName2: 'City of Edinburgh',
    countryCode: 'GB',
    accuracy: 98,
    source: DataSource.POSTCODE_API,
    createdAt: '2024-01-15T10:32:00Z',
    updatedAt: '2024-01-15T10:32:00Z'
  },
  {
    id: '4',
    postcode: 'CF10 1BH',
    latitude: 51.4816,
    longitude: -3.1791,
    placeName: 'Cardiff',
    adminName1: 'Wales',
    adminName2: 'Cardiff',
    countryCode: 'GB',
    accuracy: 94,
    source: DataSource.GEONAMES,
    createdAt: '2024-01-15T10:33:00Z',
    updatedAt: '2024-01-15T10:33:00Z'
  },
  {
    id: '5',
    postcode: 'BT1 1HL',
    latitude: 54.5973,
    longitude: -5.9301,
    placeName: 'Belfast',
    adminName1: 'Northern Ireland',
    adminName2: 'Belfast',
    countryCode: 'GB',
    accuracy: 96,
    source: DataSource.POSTCODE_API,
    createdAt: '2024-01-15T10:34:00Z',
    updatedAt: '2024-01-15T10:34:00Z'
  }
];

export const mockScrapingJobs: ScrapingJob[] = [
  {
    id: 'job-1',
    type: JobType.POSTCODE_SCRAPING,
    status: ScrapingStatus.RUNNING,
    progress: 65,
    totalRecords: 10000,
    processedRecords: 6500,
    errorCount: 12,
    startTime: '2024-01-15T09:00:00Z',
    estimatedTimeRemaining: 1800000,
    configuration: {
      countryCode: 'GB',
      batchSize: 100,
      delayBetweenRequests: 1000,
      maxRetries: 3,
      validateData: true,
      exportFormat: ExportFormat.CSV
    }
  },
  {
    id: 'job-2',
    type: JobType.DATA_VALIDATION,
    status: ScrapingStatus.COMPLETED,
    progress: 100,
    totalRecords: 5000,
    processedRecords: 5000,
    errorCount: 3,
    startTime: '2024-01-14T14:30:00Z',
    endTime: '2024-01-14T15:45:00Z',
    configuration: {
      countryCode: 'US',
      batchSize: 50,
      delayBetweenRequests: 500,
      maxRetries: 2,
      validateData: true,
      exportFormat: ExportFormat.JSON
    }
  },
  {
    id: 'job-3',
    type: JobType.EXPORT,
    status: ScrapingStatus.ERROR,
    progress: 25,
    totalRecords: 2000,
    processedRecords: 500,
    errorCount: 45,
    startTime: '2024-01-15T11:00:00Z',
    configuration: {
      countryCode: 'CA',
      batchSize: 25,
      delayBetweenRequests: 2000,
      maxRetries: 5,
      validateData: false,
      exportFormat: ExportFormat.XLSX,
      outputPath: '/exports/canada_postcodes.xlsx'
    }
  }
];

export const mockDatabaseStats: DatabaseStats = {
  totalRecords: 125847,
  recordsByCountry: {
    'GB': 65432,
    'US': 45123,
    'CA': 12456,
    'AU': 2836
  },
  lastUpdated: '2024-01-15T12:30:00Z',
  dataQuality: {
    validRecords: 123456,
    invalidRecords: 1234,
    duplicateRecords: 1157
  }
};