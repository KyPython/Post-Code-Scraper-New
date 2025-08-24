import { ScrapingStatus, JobType, DataSource, ExportFormat } from '../types/enums';

export const formatStatus = (status: ScrapingStatus): string => {
  switch (status) {
    case ScrapingStatus.IDLE:
      return 'Idle';
    case ScrapingStatus.RUNNING:
      return 'Running';
    case ScrapingStatus.COMPLETED:
      return 'Completed';
    case ScrapingStatus.ERROR:
      return 'Error';
    case ScrapingStatus.PAUSED:
      return 'Paused';
    default:
      return 'Unknown';
  }
};

export const formatJobType = (type: JobType): string => {
  switch (type) {
    case JobType.POSTCODE_SCRAPING:
      return 'Postcode Scraping';
    case JobType.DATA_VALIDATION:
      return 'Data Validation';
    case JobType.EXPORT:
      return 'Export';
    default:
      return 'Unknown';
  }
};

export const formatDataSource = (source: DataSource): string => {
  switch (source) {
    case DataSource.GEONAMES:
      return 'GeoNames';
    case DataSource.POSTCODE_API:
      return 'Postcode API';
    case DataSource.MANUAL:
      return 'Manual';
    default:
      return 'Unknown';
  }
};

export const formatExportFormat = (format: ExportFormat): string => {
  switch (format) {
    case ExportFormat.CSV:
      return 'CSV';
    case ExportFormat.JSON:
      return 'JSON';
    case ExportFormat.XLSX:
      return 'Excel';
    default:
      return 'Unknown';
  }
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString();
};