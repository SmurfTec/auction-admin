import { Container, Grid } from '@mui/material';
import { Skeleton } from '@mui/lab';
import React from 'react';

const LoadingDetails = () => {
  return (
    <Container>
      <Skeleton
        variant="text"
        width="50px"
        style={{
          width: 200,
          height: 40,
          margin: 'auto'
        }}
      />
      <Skeleton
        variant="rect"
        width="80%"
        style={{
          width: '80%',
          height: 286,
          margin: 'auto',
          marginBottom: '2rem'
        }}
      />

      <Grid container>
        <Grid item xs={12} sm={6}>
          <Skeleton
            variant="rect"
            width="80%"
            style={{
              width: '80%',
              margin: 'auto',
              height: 400
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Skeleton
            variant="rect"
            width="80%"
            style={{
              width: '80%',
              height: 200,
              margin: 'auto'
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoadingDetails;
