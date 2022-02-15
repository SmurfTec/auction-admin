import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Accordion,
  AccordionSummary,
  Box,
  AccordionDetails,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { CategoriesContext } from 'contexts/CategoriesContext';

const PREFIX = 'AuctionsFilters';

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
      width: 500
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

const AuctionsFilters = ({
  applyTypeFilters,
  applyPriceFilter,
  applyCategoryFilter,
  applyStatusFilter
}) => {
  const { categories, loading } = useContext(CategoriesContext);
  const [priceFilters, setPriceFilter] = useState({
    level1: false,
    level2: false,
    level3: false,
    level4: false,
    level5: false
  });

  const [statusFilters, setStatusFiler] = useState({
    claimed: false,
    claimAble: false,
    unClaimed: false,
    inProgress: false,
    published: false
  });

  const [typeFilters, setTypeFilter] = useState({
    specific: false,
    openEnded: false
  });

  useEffect(() => {
    //  * Get all True Values
    let pricesLevels = [];

    for (const [key, value] of Object.entries(priceFilters)) {
      console.log(`${key}: ${value}`);
      if (value === true) pricesLevels.push(key);
    }
    applyPriceFilter(pricesLevels);
  }, [priceFilters]);

  useEffect(() => {
    //  * Get all True Values
    let daysLevels = [];

    for (const [key, value] of Object.entries(statusFilters)) {
      console.log(`${key}: ${value}`);
      if (value === true) daysLevels.push(key);
    }
    applyStatusFilter(daysLevels);
  }, [statusFilters]);

  useEffect(() => {
    //  * Get all True Values
    console.log('chanig');
    let daysLevels = [];

    for (const [key, value] of Object.entries(typeFilters)) {
      console.log(`${key}: ${value}`);
      if (value === true) daysLevels.push(key);
    }
    applyTypeFilters(daysLevels);
  }, [typeFilters]);

  const handlePriceChange = (e) => {
    setPriceFilter((st) => ({ ...st, [e.target.name]: e.target.checked }));
  };

  const handleDaysChange = (e) => {
    setStatusFiler((st) => ({ ...st, [e.target.name]: e.target.checked }));
  };
  const handleTypeChange = (e) => {
    setTypeFilter((st) => ({ ...st, [e.target.name]: e.target.checked }));
  };

  return (
    <StyledBox>
      {/* <Typography variant='h5'>Filter By</Typography> */}
      <div className={classes.filter}>
        <Accordion expanded>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="subtitle2" className={classes.heading}>
              Price
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormGroup className={classes.priceFilters}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={priceFilters.level1}
                      onChange={handlePriceChange}
                      name="level1"
                    />
                  }
                  label="$1k +"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={priceFilters.level2}
                      onChange={handlePriceChange}
                      name="level2"
                    />
                  }
                  label="$500 - $1k"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={priceFilters.level3}
                      onChange={handlePriceChange}
                      name="level3"
                    />
                  }
                  label="$100 - $500"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={priceFilters.level4}
                      onChange={handlePriceChange}
                      name="level4"
                    />
                  }
                  label="$50 - $100"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={priceFilters.level5}
                      onChange={handlePriceChange}
                      name="level5"
                    />
                  }
                  label="Less than $50"
                />
              </FormGroup>
              {/* <FormHelperText>Be careful</FormHelperText> */}
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="subtitle2" className={classes.heading}>
              Categories
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List className={classes.CategoriesList}>
              <ListItem>
                <ListItemText data-catid={''} primary={'All'} onClick={applyCategoryFilter} />
              </ListItem>
              <Divider />
              {categories?.map((cat) => (
                <React.Fragment key={cat._id}>
                  <ListItem>
                    <ListItemText
                      data-catid={cat._id}
                      primary={cat.name}
                      onClick={applyCategoryFilter}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
          {/* <MenuList> */}

          {/* </MenuList> */}
        </Accordion>

        <Accordion expanded>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="subtitle2" className={classes.heading}>
              Type
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormGroup className={classes.priceFilters}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={typeFilters.level1}
                      onChange={handleTypeChange}
                      name="specific"
                    />
                  }
                  label="Specific"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={typeFilters.level2}
                      onChange={handleTypeChange}
                      name="openEnded"
                    />
                  }
                  label="Open Ended"
                />
              </FormGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="subtitle2" className={classes.heading}>
              Status
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormGroup className={classes.priceFilters}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={statusFilters.claimed}
                      onChange={handleDaysChange}
                      name="claimed"
                    />
                  }
                  label="Claimed"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={statusFilters.unClaimed}
                      onChange={handleDaysChange}
                      name="unClaimed"
                    />
                  }
                  label="UnClaimed"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={statusFilters.archived}
                      onChange={handleDaysChange}
                      name="archived"
                    />
                  }
                  label="Claimable"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={statusFilters.inProgress}
                      onChange={handleDaysChange}
                      name="inProgress"
                    />
                  }
                  label="unPublished"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={statusFilters.published}
                      onChange={handleDaysChange}
                      name="published"
                    />
                  }
                  label="Published"
                />
              </FormGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </div>
    </StyledBox>
  );
};

export default AuctionsFilters;
