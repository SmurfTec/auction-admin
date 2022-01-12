import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, Skeleton } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';
import { useContext, useEffect, useState } from 'react';
import { AuctionsContext } from 'contexts/AuctionsContext';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

export default function AppAuctionsPieChart() {
  const { auctions, loading } = useContext(AuctionsContext);
  const theme = useTheme();

  const [auctionsStats, setAuctionsStats] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (loading || !auctions) return;

    let unPublishedAuctions = 0;
    let publishedAuctions = 0;
    let claimedAuctions = 0;
    let archievedAuctions = 0;

    auctions.forEach((auction) => {
      switch (auction.status) {
        case 'inProgress':
          unPublishedAuctions++;

          break;
        case 'published':
          publishedAuctions++;

          break;
        case 'claimed':
          claimedAuctions++;

          break;
        case 'archived':
          archievedAuctions++;

          break;

        default:
          break;
      }
    });

    setAuctionsStats([unPublishedAuctions, publishedAuctions, claimedAuctions, archievedAuctions]);
  }, [auctions, loading]);

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.warning.main,
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.error.main
    ],
    labels: ['UnPublished', 'Published', 'Claimed', 'Archieved'],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <Card>
      <CardHeader title="All Auctions" />
      {loading ? (
        <Skeleton
          variant="circular"
          sx={{ margin: 'auto', marginBottom: '2rem' }}
          height={230}
          width={225}
        />
      ) : (
        <ChartWrapperStyle dir="ltr">
          <ReactApexChart type="pie" series={auctionsStats} options={chartOptions} height={280} />
        </ChartWrapperStyle>
      )}
    </Card>
  );
}
