// material
import { Box, Grid, Container, Typography } from '@mui/material';
import faker from 'faker';
// components
import Page from '../components/Page';
import {
  AppNewAuctions,
  AppAuctionsPieChart,
  AppWebsiteVisits,
  AppCard
} from '../components/_dashboard/app';
import userIcon from '@iconify/icons-ant-design/user';
import checkIcon from '@iconify/icons-ant-design/check-circle-fill';
import publishedIcon from '@iconify/icons-ant-design/android-filled';
import archievedIcon from '@iconify/icons-ant-design/bug-fill';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Dashboard | Auction-App">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppCard num={faker.datatype.number} icon={userIcon} title="New Users" color="info" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              num={faker.datatype.number}
              icon={checkIcon}
              title="Completed Auctions"
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              num={faker.datatype.number}
              icon={publishedIcon}
              title="Published Auctions"
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              num={faker.datatype.number}
              icon={archievedIcon}
              title="Archieved Auctions"
              color="error"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppAuctionsPieChart />
          </Grid>

          <Grid item xs={12}>
            <AppNewAuctions />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
