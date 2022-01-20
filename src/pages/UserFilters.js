import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Accordion,
  AccordionSummary,
  Box,
  AccordionDetails,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio
} from '@mui/material';
import { useUpdateEffect } from 'hooks';

const PREFIX = 'UsersFilters';

const classes = {
  filter: `${PREFIX}-filter`,
  CategoriesList: `${PREFIX}-CategoriesList`,
  priceFilters: `${PREFIX}-priceFilters`
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.filter}`]: {
    marginTop: theme.spacing(3),

    display: 'flex',
    // [theme.breakpoints.down('md')]: {
    //   flexDirection: 'row',
    // },
    // [theme.breakpoints.up('md')]: {
    //   flexDirection: 'column',
    //   flexWrap: 'nowrap',
    // },
    '& .MuiPaper-root': {
      boxShadow: 'none',
      borderRight: '1px solid #ccc',
      borderRadius: 0,
      width: 200
    },
    '& .MuiAccordion-root': {
      marginTop: 0
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
      minHeight: 'unset',
      height: 40
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: 0
    },
    '& .MuiAccordionDetails-root': {
      paddingInline: 10,
      paddingTop: 0,
      flexGrow: 1
    }
  },

  [`& .${classes.CategoriesList}`]: {
    '&.MuiList-root': {
      paddingInline: '0',
      width: '100%',
      '& .MuiListItem-root': {
        padding: 0,
        cursor: 'pointer',
        textAlign: 'center',
        '&:hover': {
          backgroundColor: theme.palette.primary.main,
          color: '#fff'
        }
      }
    }
  },

  [`& .${classes.priceFilters}`]: {
    '& .MuiTypography-root': { fontSize: 14 }
  }
}));

const UsersFilters = ({ applyFilter }) => {
  const [filter, setFilter] = useState('all');

  useUpdateEffect(() => {
    console.log('filter', filter);
    applyFilter(filter);
  }, [filter]);

  const handleChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <StyledBox>
      {/* <Typography variant='h5'>Filter By</Typography> */}
      <div className={classes.filter}>
        <Accordion expanded>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="subtitle2" className={classes.heading}>
              Type
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="gender"
                name="controlled-radio-buttons-group"
                value={filter}
                onChange={handleChange}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="verified" control={<Radio />} label="Verified" />
                <FormControlLabel value="notVerified" control={<Radio />} label="Not Verified" />
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </div>
    </StyledBox>
  );
};

export default UsersFilters;
