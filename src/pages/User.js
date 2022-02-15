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
  IconButton,
  Popover
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
import { UsersContext } from 'contexts/UsersContext';
import { useToggleInput } from 'hooks';
import UserDetails from './UserDetails';
import { Icon } from '@iconify/react';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import ConfirmDelete from 'components/dialogs/ConfirmDelete';
import UsersFilters from './UserFilters';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'links', label: 'Social', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const filterPopoverId = 'UserfilterPopOver';

export default function User() {
  const { users, loading, deleteUser } = useContext(UsersContext);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [isDetailsOpen, toggleDetails] = useToggleInput(false);
  const [detailsUser, setDetailsUser] = useState();

  const [isDeleteOpen, toggleDeleteOpen] = useToggleInput(false);
  const [currentDeleteId, setCurrentDeleteId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const isFilterOpen = Boolean(anchorEl);

  const handleDeleteButton = (e) => {
    e.stopPropagation();
    const { id } = e.currentTarget.dataset;
    console.log('id', id);
    setCurrentDeleteId(id);
    toggleDeleteOpen();
  };

  const handleDeleteUser = () => {
    deleteUser(currentDeleteId);
    toggleDeleteOpen();
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  useEffect(() => {
    console.log('hereeeeeee1');
    console.log(`loading`, loading);
    console.log(`users`, users);
    if (loading || !users) return;
    console.log('hereeeeeee');

    let newUsers = applySortFilter(users, getComparator(order, orderBy), filterName);
    setFilteredUsers(newUsers);
  }, [users, loading, order, orderBy, filterName, getComparator]);

  const isUserNotFound = filteredUsers.length === 0;

  const handleClick = (event) => {
    console.log(`event`, event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApplyFilter = (val) => {
    console.log('val', val);
    if (val === 'all') setFilteredUsers(users);
    else if (val === 'verified') setFilteredUsers(users?.filter((el) => el.status === 'verified'));
    else setFilteredUsers(users.filter((el) => el.status !== 'verified'));
  };

  return (
    <Page title="User | Auction-App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={0}
            filterName={filterName}
            onFilterName={handleFilterByName}
            searchSlug="Search Users"
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
                width: 200
              }
            }}
          >
            <UsersFilters applyFilter={handleApplyFilter} />
          </Popover>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  numSelected={0}
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
                    : filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const {
                            _id,
                            name,
                            email,
                            photo,
                            isVerified,
                            twitterProfile,
                            instagramProfile
                          } = row;

                          return (
                            <TableRow
                              onClick={() => {
                                console.log('hasda');
                                setDetailsUser(row);
                                toggleDetails();
                              }}
                              hover
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
                              <TableCell padding="checkbox">
                                {/* <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, name)}
                            /> */}
                              </TableCell>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar alt={name} src={photo} />
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{email}</TableCell>
                              {/* <TableCell align="left">{role}</TableCell> */}
                              <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>
                              {/* <TableCell align="left">
                                <Label
                                  variant="ghost"
                                  color={(status === 'banned' && 'error') || 'success'}
                                >
                                  {sentenceCase(status)}
                                </Label>
                              </TableCell> */}
                              <TableCell>
                                {twitterProfile && (
                                  <TwitterIcon
                                    style={{ cursor: 'pointer' }}
                                    color="secondary"
                                    onClick={() => {
                                      window.open(
                                        `http://www.twitter.com/${twitterProfile.username}`
                                      );
                                    }}
                                  />
                                )}
                                {instagramProfile && (
                                  <InstagramIcon
                                    style={{ cursor: 'pointer' }}
                                    color="secondary"
                                    onClick={() => {
                                      window.open(instagramProfile);
                                    }}
                                  />
                                )}
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
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <UserDetails open={isDetailsOpen} toggleDialog={toggleDetails} user={detailsUser} />
          <ConfirmDelete
            open={isDeleteOpen}
            toggleDialog={toggleDeleteOpen}
            title="Delete This User"
            handleSuccess={handleDeleteUser}
          />
        </Card>
      </Container>
    </Page>
  );
}
