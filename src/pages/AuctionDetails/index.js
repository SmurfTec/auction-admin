import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/material/styles';
import React, { useContext, useMemo } from 'react';
import AuctionStepper from './DetailsAucStepper';
// import AuctionStepper from '../AuctionStepperM';
import Card from './DetailCard';
import { useParams } from 'react-router';

import { useFetch, useToggleInput } from 'hooks';
import { toast } from 'react-toastify';
import Loading from './LoadingDetails';
import { API_BASE_URL, handleCatch, makeReq } from 'utils/makeReq';
import { AuthContext } from 'contexts/AuthContext';
import { AuctionsContext } from 'contexts/AuctionsContext';
import { Navigate } from 'react-router-dom';
import BidTable from './BidTable';
import Page from 'components/Page';

const PREFIX = 'AuctionDetails';

const classes = {
  contentCont: `${PREFIX}-contentCont`,
  histCard: `${PREFIX}-histCard`,
  containerMargin: `${PREFIX}-containerMargin`,
  flexJustDisp: `${PREFIX}-flexJustDisp`,
  customStyledBox: `${PREFIX}-customStyledBox`,
  content: `${PREFIX}-content`
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.contentCont}`]: {
    boxShadow: 'rgb(4 17 29 / 25%) 0px 0px 10px 0px',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#fff',
    height: 'fit-content'
  },

  [`& .${classes.histCard}`]: {
    display: 'flex',
    justifyContent: 'flex-start',
    columnGap: '2em',

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      rowGap: '2em'
    }
  },

  [`& .${classes.containerMargin}`]: {
    marginBlock: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      marginBlock: theme.spacing(2)
    }
  },

  // ^ Custom box having box shadow and border
  [`& .${classes.flexJustDisp}`]: {
    display: 'flex',
    justifyContent: 'center'
  },

  // ^ Image Carousel Styles
  [`& .${classes.customStyledBox}`]: {
    boxShadow: 'rgb(4 17 29 / 25%) 0px 0px 10px 0px',
    // rgb(4 17 29 / 25%) 0px 0px 8px 0px
    // #04111d40
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',

    '& .MuiPaper-rounded': {
      height: '100%',
      borderRadius: 0
    },

    // '& .MuiPaper-elevation1': {
    //   boxShadow: 'none',
    // },
    '&:hover': {
      boxShadow: `${theme.palette.primary.main}73 0px 0px 10px 0px`
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },

  [`& .${classes.content}`]: {
    width: '100%',
    // maxWidth: 620,
    display: 'flex',
    // flex: 3,
    flexBasis: '65%',
    flexDirection: 'column',
    flexGrow: 1,
    rowGap: 10,
    '& hr:last-child': {
      display: 'none'
    },

    '& .MuiFormControlLabel-root': {
      marginLeft: 0
    },

    '& .MuiCardContent-root:last-child': {
      paddingBottom: 12
    }
  }
}));

const AuctionDetails = () => {
  const { token } = useContext(AuthContext);
  const { addToWatchlist } = useContext(AuctionsContext);

  const { id } = useParams();

  let {
    value: auction,
    loading,
    error,
    setValue: setAuction
  } = useFetch(
    `${API_BASE_URL}/auctions/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    },
    [id],
    'auction'
  );

  // * Fetch Bid from api
  const [isMakingBid, toggleMakingBid] = useToggleInput(false);

  // * Bid
  const createBid = async (amount, auctionId, callBack) => {
    toggleMakingBid();

    try {
      const resData = await makeReq(
        `/auctions/${auctionId}/bid`,
        {
          body: { biddingPrice: amount }
        },
        'PATCH'
      );
      // console.log(`resData`, resData);

      setAuction(resData.auction);
      toast.success('Success');
      callBack?.();
    } catch (err) {
      handleCatch(err);
    } finally {
      toggleMakingBid();
    }
  };

  const handleBookmark = async (e) => {
    addToWatchlist(id);
  };

  const minBidAmount = useMemo(() => {
    if (!auction) return 0;

    // * for 1st bid , min amount is auction's startingPricce
    if (!auction.bids.length) return auction.startingPrice + 1;

    // * as bids are sorted as latest first, so first bid's value should be highest
    return auction.bids[0].biddingPrice + 1;
  }, [auction]);

  // * Sometimes loading becomes false , but auction is still undefined
  // * for small amount of time , so in that case !auction is put here
  if (loading || !auction) return <Loading />;

  if (error) return <Navigate to="/" />;

  return (
    <Page title="Auction Details">
      <Root>
        <Container>
          <section className={classes.containerMargin}>
            <Typography variant="h4" align="center" fullWidth>
              Auction Details
            </Typography>
          </section>
          {auction ? (
            <section className={classes.containerMargin}>
              <div className={`${classes.flexJustDisp}`}>
                <div className={`${classes.customStyledBox} ${classes.flexJustDisp}`}>
                  <AuctionStepper auction={auction} />
                  <div className={classes.content}>
                    <Card auction={auction} handleBookmark={handleBookmark} />
                  </div>
                </div>
              </div>
              {/* <div className={`${custom.auctDetailCont}`}>
              <AuctionStepper auction={auction} />
              <div className={classes.content}>
                <Card auction={auction} />
              </div>
            </div> */}

              <Box mt={5} className={`${classes.histCard}`}>
                <Box sx={{ flexBasis: '60%' }} className={`${classes.contentCont}`}>
                  <Typography variant="h5">Bidding Info</Typography>

                  <BidTable classes={classes} bids={auction.bids} />
                </Box>
              </Box>
            </section>
          ) : (
            <Typography variant="subtitle1">Auction Not Found</Typography>
          )}
        </Container>
      </Root>
    </Page>
  );
};

export default AuctionDetails;
