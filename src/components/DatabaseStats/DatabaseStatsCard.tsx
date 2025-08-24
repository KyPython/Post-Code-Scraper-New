import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatabaseStats } from '../../types/schema';

// Icons
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  border: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
}));

const StatsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.primary.main + '10',
  border: `1px solid ${theme.palette.primary.main}20`,
  textAlign: 'center',
}));

const RegionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  maxHeight: 300,
}));

interface DatabaseStatsCardProps {
  stats: DatabaseStats;
  isLoading?: boolean;
}

export const DatabaseStatsCard: React.FC<DatabaseStatsCardProps> = ({ 
  stats, 
  isLoading = false 
}) => {
  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <StyledCard>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <DnsOutlinedIcon 
              sx={{ 
                fontSize: 32, 
                color: 'primary.main',
              }} 
            />
            <Typography variant="h4" component="h2" color="primary.main">
              Database Statistics
            </Typography>
          </Stack>

          <StatsBox>
            <Typography variant="h3" component="div" color="primary.main" fontWeight="bold">
              {isLoading ? '...' : formatNumber(stats.totalPostcodes)}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Total Postcodes
            </Typography>
          </StatsBox>

          <Divider />

          {stats.regionCounts && Object.keys(stats.regionCounts).length > 0 && (
            <Stack spacing={2}>
              <Typography variant="h6" component="h3">
                Postcodes by Region
              </Typography>
              <Box>
                {Object.entries(stats.regionCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([region, count]) => (
                    <RegionChip
                      key={region}
                      label={`${region}: ${formatNumber(count)}`}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))}
              </Box>
            </Stack>
          )}

          <Divider />

          <Stack spacing={2}>
            <Typography variant="h6" component="h3">
              Recent Database Entries
            </Typography>
            
            {stats.recentEntries && stats.recentEntries.length > 0 ? (
              <StyledTableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Post-Code</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>City/Town</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentEntries.map((entry, index) => (
                      <TableRow 
                        key={index}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent entries found.
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};