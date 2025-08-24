import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Alert,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { PostcodeEntry } from '../../types/schema';
import { formatResultsCount } from '../../utils/formatters';

// Icons
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  maxHeight: 400,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.grey[50],
  borderBottom: `2px solid ${theme.palette.divider}`,
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

interface ResultsPreviewTableProps {
  preview: PostcodeEntry[];
  totalResults: number;
  jobId: string;
  onDownload: (jobId: string) => void;
}

export const ResultsPreviewTable: React.FC<ResultsPreviewTableProps> = ({
  preview,
  totalResults,
  jobId,
  onDownload,
}) => {
  if (!preview || preview.length === 0) {
    return (
      <StyledCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Results Preview
          </Typography>
          <Alert severity="info">
            No postcodes found for the selected criteria.
          </Alert>
        </CardContent>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h3">
              Results Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing first {Math.min(preview.length, 5)} of {formatResultsCount(totalResults)}
            </Typography>
          </Stack>

          <StyledTableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Post-Code</StyledTableCell>
                  <StyledTableCell>City/Town</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preview.slice(0, 5).map((entry, index) => (
                  <TableRow 
                    key={index}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {entry['Post-Code'] || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {entry['City/Town'] || 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>

          {totalResults > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <DownloadButton
                variant="contained"
                color="secondary"
                startIcon={<SaveAltOutlinedIcon />}
                onClick={() => onDownload(jobId)}
              >
                Download Full CSV ({formatResultsCount(totalResults)})
              </DownloadButton>
            </Box>
          )}
        </Stack>
      </CardContent>
    </StyledCard>
  );
};