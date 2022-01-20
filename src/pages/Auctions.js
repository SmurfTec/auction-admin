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
  Skeleton,
  Popover,
  IconButton
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import { AuctionsContext } from 'contexts/AuctionsContext';
import { Link, useNavigate } from 'react-router-dom';
import AuctionsFilters from './AuctionsFilters';
import { Icon } from '@iconify/react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import ConfirmDelete from 'components/dialogs/ConfirmDelete';
import { useToggleInput } from 'hooks';
//
const filterPopoverId = 'filterPopOver';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'startingPrice', label: 'Starting Price', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'Actions', label: 'Actions', alignRight: false }
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
  const { auctions, loading, deleteAuction } = useContext(AuctionsContext);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isFilterOpen = Boolean(anchorEl);

  const [isDeleteOpen, toggleDeleteOpen] = useToggleInput(false);
  const [currentDeleteId, setCurrentDeleteId] = useState();

  const navigate = useNavigate();

  const handleDeleteButton = (e) => {
    e.stopPropagation();
    const { id } = e.currentTarget.dataset;
    console.log('id', id);
    setCurrentDeleteId(id);
    toggleDeleteOpen();
  };

  const handleDeleteAuction = () => {
    deleteAuction(currentDeleteId);
    toggleDeleteOpen();
  };

  const handleClick = (event) => {
    console.log(`event`, event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const applyCategoryFilter = (e) => {
    const { catid } = e.currentTarget.dataset;

    console.log(`catid`, catid);
    setFilteredAuctions(
      auctions?.filter((el) => el.categories.find((st) => st._id.includes(catid)))
    );
  };
  const applyPriceFilter = (pricesLevels) => {
    // * level 1 => 5k +
    // let auctions = user?.role === 'buyer' ? usersRequests : devRequests;

    console.log(`auctions`, auctions);
    let updatedData = [];
    console.log(`pricesLevels`, pricesLevels);

    if (!pricesLevels.length) updatedData = auctions;
    else
      pricesLevels.forEach((el) => {
        switch (el) {
          case 'level1':
            updatedData = auctions.filter((el) => el.startingPrice >= 1000);
            break;

          case 'level2':
            updatedData = auctions.filter(
              (el) => el.startingPrice >= 500 && el.startingPrice < 1000
            );

            break;

          case 'level3':
            updatedData = auctions.filter(
              (el) => el.startingPrice >= 100 && el.startingPrice < 500
            );
            break;

          case 'level4':
            updatedData = auctions.filter((el) => el.startingPrice >= 50 && el.startingPrice < 100);
            break;

          case 'level5': {
            updatedData = auctions.filter((el) => el.startingPrice < 50);
            break;
          }
        }
      });

    updatedData = [...new Set(updatedData)];
    console.log(
      `updatedData.map()`,
      updatedData.map((el) => el.startingPrice)
    );

    setFilteredAuctions(updatedData);
  };

  const applyStatusFilter = (daysLevels) => {
    // * level 1 => Claimed
    let updatedData = [];

    if (!daysLevels.length) updatedData = auctions;
    else
      daysLevels.forEach((el) => {
        updatedData = auctions.filter((st) => st.status === el);
      });

    updatedData = [...new Set(updatedData)];
    console.log(
      `updatedData.map()`,
      updatedData.map((el) => el.expectedDays)
    );

    setFilteredAuctions(updatedData);
  };
  const applyTypeFilters = (filter) => {
    console.log(`filter`, filter);
    // * level 1 => Claimed
    let updatedData = [];

    if (!filter.length) updatedData = auctions;
    else
      filter.forEach((el) => {
        updatedData = auctions.filter((st) => st.type === el);
      });

    updatedData = [...new Set(updatedData)];
    console.log(
      `updatedData.map()`,
      updatedData.map((el) => el.expectedDays)
    );

    setFilteredAuctions(updatedData);
  };

  const handleRowClick = (e) => {
    const { id } = e.currentTarget.dataset;
    console.log('id', id);
    navigate(id);
  };

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
            filterPopoverId={filterPopoverId}
            handleClick={handleClick}
            handleClose={handleClose}
          />
          <Popover
            id={filterPopoverId}
            open={isFilterOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            PaperProps={{
              style: {
                width: 600
              }
            }}
          >
            <AuctionsFilters
              applyPriceFilter={applyPriceFilter}
              applyCategoryFilter={applyCategoryFilter}
              applyStatusFilter={applyStatusFilter}
              applyTypeFilters={applyTypeFilters}
            />
          </Popover>

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
                              data-id={_id}
                              // component={Link}
                              // to={_id}
                              onClick={handleRowClick}
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
                              <TableCell align="left">
                                {/* <UserMoreMenu /> */}
                                <IconButton
                                  color="error"
                                  onClick={handleDeleteButton}
                                  data-id={row._id}
                                >
                                  <Icon icon={trash2Outline} width={24} height={24} />
                                </IconButton>
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
          <ConfirmDelete
            open={isDeleteOpen}
            toggleDialog={toggleDeleteOpen}
            title="Delete This Auction"
            handleSuccess={handleDeleteAuction}
          />
        </Card>
      </Container>
    </Page>
  );
}
