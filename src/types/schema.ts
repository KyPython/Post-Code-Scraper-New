import { ScrapingStatus, JobType, DataSource, ExportFormat } from './enums';

export interface PostcodeData {
  id: string;
  postcode: string;
  latitude: number;
  longitude: number;
  placeName: string;
  adminName1: string;
  adminName2?: string;
  countryCode: string;
  accuracy: number;
  source: DataSource;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapingJob {
  id: string;
  type: JobType;
  status: ScrapingStatus;
  progress: number;
  totalRecords: number;
  processedRecords: number;
  errorCount: number;
  startTime: string;
  endTime?: string;
  estimatedTimeRemaining?: number;
  configuration: ScrapingConfiguration;
}

export interface ScrapingConfiguration {
  countryCode: string;
  batchSize: number;
  delayBetweenRequests: number;
  maxRetries: number;
  validateData: boolean;
  exportFormat: ExportFormat;
  outputPath?: string;
}

export interface DatabaseStats {
  totalRecords: number;
  recordsByCountry: Record<string, number>;
  lastUpdated: string;
  dataQuality: {
    validRecords: number;
    invalidRecords: number;
    duplicateRecords: number;
  };
}

export interface ScrapingFormData {
  countryCode: string;
  batchSize: number;
  delayBetweenRequests: number;
  maxRetries: number;
  validateData: boolean;
  exportFormat: ExportFormat;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}