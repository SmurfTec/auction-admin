import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useState } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Skeleton
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import { AuctionsContext } from 'contexts/AuctionsContext';
import { Link } from 'react-router-dom';
//
// import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'startingPrice', label: 'Starting Price', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Auction() {
  const { auctions, loading } = useContext(AuctionsContext);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredAuctions, setFilteredAuctions] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - auctions.length) : 0;

  useEffect(() => {
    console.log('hereeeeeee1');
    console.log(`loading`, loading);
    console.log(`auctions`, auctions);
    if (loading || !auctions) return;
    console.log('hereeeeeee');

    let newAuctions = applySortFilter(auctions, getComparator(order, orderBy), filterName);
    setFilteredAuctions(newAuctions);
  }, [auctions, loading, order, orderBy, filterName, getComparator]);

  const isUserNotFound = filteredAuctions.length === 0;

  return (
    <Page title="Auction | Auction-App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Auctions
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            searchSlug="Search Auctions"
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={auctions.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {loading
                    ? Array(5)
                        .fill()
                        .map((_, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Skeleton variant="circular" />
                            </TableCell>
                            {Array(4)
                              .fill()
                              .map((_, idx) => (
                                <TableCell key={idx * 2}>
                                  <Skeleton />
                                </TableCell>
                              ))}
                          </TableRow>
                        ))
                    : filteredAuctions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { _id, images, location, title, startingPrice, type, status } = row;

                          return (
                            <TableRow
                              hover
                              component={Link}
                              to={_id}
                              key={_id}
                              tabIndex={-1}
                              role="checkbox"
                              sx={(theme) => ({
                                '&.MuiTableRow-root': {
                                  cursor: 'pointer',
                                  textDecoration: 'none'
                                }
                              })}
                            >
                              <TableCell padding="checkbox" />
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar alt={title} src={images?.[0]} />
                                  <Typography variant="subtitle2" noWrap>
                                    {title}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{location}</TableCell>
                              {/* <TableCell align="left">{role}</TableCell> */}
                              <TableCell align="left">${startingPrice}</TableCell>
                              <TableCell align="left">{type}</TableCell>
                              <TableCell align="left">
                                <Label
                                  variant="ghost"
                                  color={
                                    status === 'published'
                                      ? 'primary'
                                      : status === 'archieved'
                                      ? 'error'
                                      : status === 'unPublished'
                                      ? 'warning'
                                      : 'success'
                                  }
                                >
                                  {status}
                                  {/* {sentenceCase(status)} */}
                                </Label>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={auctions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
