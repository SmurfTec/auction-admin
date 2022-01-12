import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, Skeleton } from '@mui/material';
//
import { BaseOptionChart } from '../../charts';
import { useContext, useEffect, useState } from 'react';
import { AuctionsContext } from 'contexts/AuctionsContext';
import { daysBetween } from 'utils/dateFunctions';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    name: 'Completed Auctions',
    type: 'column',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
  },
  {
    name: 'Archieved Auctions',
    type: 'area',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
  }
];

export default function AppWebsiteVisits() {
  const { auctions, loading } = useContext(AuctionsContext);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (loading || !auctions) return;

    let completedAuctions = auctions.filter(
      (el) => el.status === 'claimed' && daysBetween(new Date(el.publishDate), new Date() <= 4 * 30)
    );
    let dataCompletedAuctions = [];
    dataCompletedAuctions[0] = completedAuctions.filter((el) =>
      daysBetween(new Date(el.publishDate) <= 30)
    ).length;
    dataCompletedAuctions[1] = completedAuctions.filter(
      (el) =>
        daysBetween(new Date(el.publishDate) <= 60) && daysBetween(new Date(el.publishDate) > 30)
    ).length;
    dataCompletedAuctions[2] = completedAuctions.filter(
      (el) =>
        daysBetween(new Date(el.publishDate) <= 90) && daysBetween(new Date(el.publishDate) > 60)
    ).length;
    dataCompletedAuctions[3] = completedAuctions.filter(
      (el) =>
        daysBetween(new Date(el.publishDate) <= 120) && daysBetween(new Date(el.publishDate) > 90)
    ).length;

    let archievedAuctions = auctions.filter(
      (el) => el.status === 'claimed' && daysBetween(new Date(el.publishDate), new Date() <= 4 * 30)
    );
    let dataArchievedAuctions = [];
    dataArchievedAuctions[0] = archievedAuctions.filter((el) =>
      daysBetween(new Date(el.publishDate) <= 30)
    ).length;
    dataArchievedAuctions[1] = archievedAuctions.filter(
      (el) =>
        daysBetween(new Date(el.publishDate) <= 60) && daysBetween(new Date(el.publishDate) > 30)
    ).length;
    dataArchievedAuctions[2] = archievedAuctions.filter(
      (el) =>
        daysBetween(new Date(el.publishDate) <= 90) && daysBetween(new Date(el.publishDate) > 60)
    ).length;
    dataArchievedAuctions[3] = archievedAuctions.filter(
      (el) =>
        daysBetween(new Date(el.publishDate) <= 120) && daysBetween(new Date(el.publishDate) > 90)
    ).length;

    setChartData([
      {
        name: 'Completed Auctions',
        type: 'column',
        data: dataCompletedAuctions
      },
      {
        name: 'Archieved Auctions',
        type: 'area',
        data: dataArchievedAuctions
      }
    ]);
  }, [auctions, loading]);

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [2, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: [
      '01/01/2003',
      '02/01/2003',
      '03/01/2003',
      '04/01/2003',
      '05/01/2003',
      '06/01/2003',
      '07/01/2003',
      '08/01/2003',
      '09/01/2003',
      '10/01/2003',
      '11/01/2003'
    ],
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Auctions" subheader="Since Last 4 months" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {loading && !chartData ? (
          <Skeleton variant="rectangular" />
        ) : (
          <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
        )}
      </Box>
    </Card>
  );
}
