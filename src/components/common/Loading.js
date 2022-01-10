import React from 'react';
import { PointSpreadLoading } from 'react-loadingg';
import { Box, Typography, useTheme } from '@mui/material';

const Loading = ({ noTitle }) => {
  const theme = useTheme();

  return (
    <Box>
      <Box
        className="cPhARM"
        style={{
          margin: 'auto',
          position: 'absolute',
          inset: 0,
          minWidth: 'fit-content',
          transform: 'translateY(-40px)'
        }}
      >
        {!noTitle && (
          <Typography variant="h3" color="primary">
            Auction Admin
          </Typography>
        )}
      </Box>
      <PointSpreadLoading color={theme.palette.primary.main} />
    </Box>
  );
};

export default Loading;
