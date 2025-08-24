export enum ScrapingStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETED = 'completed',
  ERROR = 'error',
  PAUSED = 'paused'
}

export enum JobType {
  POSTCODE_SCRAPING = 'postcode_scraping',
  DATA_VALIDATION = 'data_validation',
  EXPORT = 'export'
}

export enum DataSource {
  GEONAMES = 'geonames',
  POSTCODE_API = 'postcode_api',
  MANUAL = 'manual'
}

export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
  XLSX = 'xlsx'
}