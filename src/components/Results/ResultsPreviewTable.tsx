import React, { useState } from 'react';
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
  TablePagination,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Box,
  TextField,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useGetPostcodeDataQuery } from '../../store/store';
import { PostcodeData } from '../../types/schema';
import { formatDataSource, formatDateTime } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden'
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 600,
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.grey[50],
    fontWeight: 600,
    borderBottom: `2px solid ${theme.palette.divider}`
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const AccuracyChip = styled(Chip)<{ accuracy: number }>(({ theme, accuracy }) => ({
  backgroundColor: accuracy >= 95 ? theme.palette.success.light :
                   accuracy >= 85 ? theme.palette.warning.light :
                   theme.palette.error.light,
  color: accuracy >= 95 ? theme.palette.success.dark :
         accuracy >= 85 ? theme.palette.warning.dark :
         theme.palette.error.dark,
  fontWeight: 500,
  minWidth: 60
}));

const CoordinateText = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary
}));

const ResultsPreviewTable: React.FC = () => {
  const { data: postcodeData = [], isLoading, error, refetch } = useGetPostcodeDataQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = postcodeData.filter((item: PostcodeData) =>
    item.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.placeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.adminName1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.countryCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export data:', filteredData);
  };

  if (error) {
    return (
      <StyledCard>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6" color="error">
              Failed to load postcode data
            </Typography>
            <IconButton onClick={() => refetch()} color="primary">
              <RefreshIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <CardContent sx={{ pb: 0 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Postcode Data Preview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredData.length} records found
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={1}>
              <Tooltip title="Refresh Data">
                <IconButton onClick={() => refetch()} disabled={isLoading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export Data">
                <IconButton onClick={handleExport}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Search */}
          <TextField
            placeholder="Search postcodes, places, or countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Stack>
      </CardContent>

      {/* Table */}
      <StyledTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Postcode</TableCell>
              <TableCell>Place</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Coordinates</TableCell>
              <TableCell>Accuracy</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Box
                        sx={{
                          height: 20,
                          backgroundColor: 'grey.200',
                          borderRadius: 1,
                          animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              paginatedData.map((row: PostcodeData) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {row.postcode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {row.placeName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {row.adminName1}
                      {row.adminName2 && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {row.adminName2}
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.countryCode} 
                      size="small" 
                      variant="outlined"
                      sx={{ minWidth: 50 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <CoordinateText>
                        {row.latitude.toFixed(4)}°N
                      </CoordinateText>
                      <CoordinateText>
                        {row.longitude.toFixed(4)}°E
                      </CoordinateText>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <AccuracyChip 
                      accuracy={row.accuracy}
                      label={`${row.accuracy}%`}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={formatDataSource(row.source)} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(row.updatedAt).split(' ')[0]}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{ borderTop: 1, borderColor: 'divider' }}
      />
    </StyledCard>
  );
};

export default ResultsPreviewTable;