import faker from 'faker';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import {
  Box,
  Stack,
  Link,
  Card,
  Button,
  Divider,
  Typography,
  CardHeader,
  Skeleton
} from '@mui/material';
// utils
import { mockImgCover } from '../../../utils/mockImages';
//
import Scrollbar from '../../Scrollbar';
import { useContext } from 'react';
import { AuctionsContext } from 'contexts/AuctionsContext';

AuctionItem.propTypes = {
  auction: PropTypes.object.isRequired
};

function AuctionItem({ auction }) {
  const { _id, images, title, description, updatedAt } = auction;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={title}
        src={images?.[0]}
        sx={{ width: 48, height: 48, borderRadius: 1.5 }}
      />
      <Box sx={{ minWidth: 240 }}>
        <Link to={`/auctions/${_id}`} color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        style={{ marginLeft: 'auto' }}
        sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}
      >
        {formatDistance(new Date(updatedAt), new Date())}
      </Typography>
    </Stack>
  );
}

export default function AppNewAuctions() {
  const { auctions, loading } = useContext(AuctionsContext);
  return (
    <Card>
      <CardHeader title="Latest Claimed Auctions" sx={{ textAlign: 'center' }} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {loading || !auctions
            ? Array(5)
                .fill()
                .map((_, idx) => <Skeleton variant="rectangular" height={50} />)
            : auctions
                .filter((el) => el.status === 'claimed')
                .slice(0, 5)
                .map((auction) => <AuctionItem key={auction._id} auction={auction} />)}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="/auctions"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Icon icon={arrowIosForwardFill} />}
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}
