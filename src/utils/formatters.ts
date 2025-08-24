import { JobStatus } from '../types/enums';

export const formatJobStatus = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.PENDING:
      return 'Pending';
    case JobStatus.RUNNING:
      return 'Processing...';
    case JobStatus.COMPLETED:
      return 'Completed';
    case JobStatus.FAILED:
      return 'Failed';
    default:
      return 'Unknown';
  }
};

export const formatResultsCount = (count: number): string => {
  if (count === 0) return 'No results';
  if (count === 1) return '1 postcode';
  return `${count.toLocaleString()} postcodes`;
};

export const formatJobMessage = (jobId: string, status: JobStatus, count?: number): string => {
  switch (status) {
    case JobStatus.PENDING:
      return `Job ${jobId} is queued for processing`;
    case JobStatus.RUNNING:
      return `Job ${jobId} is currently running...`;
    case JobStatus.COMPLETED:
      return count && count > 0 
        ? `Job ${jobId} completed! Found ${formatResultsCount(count)}.`
        : `Job ${jobId} completed! No postcodes found for the selected criteria.`;
    case JobStatus.FAILED:
      return `Job ${jobId} failed to complete`;
    default:
      return `Job ${jobId} status unknown`;
  }
};