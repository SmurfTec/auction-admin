import React from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import { MobileStepper, Paper, Button, Box } from '@mui/material';

import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    height: 200,
    backgroundColor: '#fff',
    borderRight: '1px solid rgb(229, 232, 235)',
    [theme.breakpoints.up('md')]: {
      // maxWidth: 350,
    }
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default
  },
  VideoBox: {
    height: 170,
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 200
    }
  },
  img: {
    width: '100%',
    height: 170,
    flexGrow: 1,
    display: 'block',
    overflow: 'hidden',
    objectFit: 'contain',
    [theme.breakpoints.down('sm')]: {
      height: 200
    }
  },
  mobileStepper: {
    background: '#fff',
    minHeight: 70,
    [theme.breakpoints.down('sm')]: {
      minHeight: 50
    }
  },
  imgCont: {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: 300,

    [theme.breakpoints.up('md')]: {
      flex: 2
    }
  }
}));

const DetailsAucStepper = ({ auction }) => {
  const classes = useStyles();

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [carousel, setCarousel] = React.useState(null);
  //   const maxSteps = carousel.length;

  React.useEffect(() => {
    if (!auction) return;
    const arr = [];

    if (auction) {
      arr.push({ type: 'video', url: auction['video'] });
      auction?.images.map((i) => arr.push({ type: 'img', url: i }));
      setCarousel(arr);
    } else return;
  }, [auction]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      {carousel && (
        <Paper className={`${classes.root}`}>
          {carousel?.[activeStep].type === 'video' ? (
            <Box className={classes.VideoBox}>
              <video width="100%" height="100%" controls>
                <source src={auction.video} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            </Box>
          ) : (
            // <div className={classes.imgDiv}>
            <img
              className={classes.img}
              src={carousel[activeStep].url}
              alt={carousel[activeStep].label}
            />
            //   <img
            //   className={classes.img}
            //   src={carousel[activeStep].url}
            //   alt={carousel[activeStep].label}
            // />
            // </Box>
            // </div>
          )}
          <MobileStepper
            steps={carousel.length}
            position="static"
            variant="dots"
            activeStep={activeStep}
            className={classes.mobileStepper}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === carousel.length - 1}
              >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              </Button>
            }
          />
        </Paper>
      )}
    </>
  );
};

export default DetailsAucStepper;
