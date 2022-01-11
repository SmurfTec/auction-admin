import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Avatar
} from '@mui/material';

const BidTable = ({ classes, bids }) => {
  return (
    <Box mt={2} sx={{ maxHeight: 550, overflowY: 'auto' }}>
      <TableContainer className={`${classes.tableContainer}`}>
        <Table stickyHeader>
          <TableHead className={classes.tableCont}>
            <TableRow>
              <TableCell style={{ minWidth: 300 }}>User</TableCell>
              <TableCell align="right">Bid</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids?.map((bid, ind) => (
              <TableRow hover key={bid._id} className={classes.hoverRow}>
                <TableCell component="th" scope="row" style={{ minWidth: 300 }}>
                  <div className={`${classes.flexAlignDisp} ${classes.aucItem}`}>
                    <Typography variant="subtitle2">{ind + 1}</Typography>
                    <Avatar
                      src={bid.user.avatarUrl}
                      alt={bid.user.name}
                      // className={classes.large}
                    />
                    <Typography variant="subtitle2">{bid.user.name}</Typography>
                  </div>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="body2">{bid.biddingPrice}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Box mt={2}>
                    <Pagination
                      color='secondary'
                      count={Math.ceil(auctions.length / rowsPerPage)}
                      page={page}
                      onChange={handleChangePage}
                      className={classes.pagination}
                    />
                  </Box> */}
    </Box>
  );
};

export default BidTable;
