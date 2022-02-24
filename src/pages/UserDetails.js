import { Cancel, CheckBox } from '@mui/icons-material';
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { UsersContext } from 'contexts/UsersContext';
import React, { useContext } from 'react';

const UserDetailsDialog = ({ user = {}, open, toggleDialog }) => {
  const { updateAUser } = useContext(UsersContext);

  const verifyUser = () => {
    updateAUser(user._id, {
      isVerified: true
    });
  };

  const unVerifyUser = () => {
    updateAUser(user._id, {
      isVerified: false
    });
  };

  return (
    <Dialog
      open={open}
      onClose={toggleDialog}
      sx={{
        '& .MuiPaper-root': {
          width: 450
        }
      }}
    >
      <DialogTitle>
        <Avatar
          src={
            user.photo ||
            `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.name}`
          }
          style={{ float: 'left', marginRight: '1rem', marginBottom: '1rem' }}
          alt="user photo"
        />
        {user.name}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        style={{ paddingTop: '1rem' }}
      >
        <Box>
          <Typography variant="subtitle2">Status</Typography>
          <Typography variant="body2" col>
            {user.isVerified ? 'Verified' : 'Not-Verified'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Manage Verfication</Typography>
          Verify
          <IconButton color="success" onClick={verifyUser} data-status="true">
            <CheckBox />
          </IconButton>
          Not Verify
          <IconButton color="error" onClick={unVerifyUser} data-status="false">
            <Cancel />
          </IconButton>
        </Box>
        <TextField
          id="outlined-read-only-input"
          label="Name"
          defaultValue={user.name}
          InputProps={{
            readOnly: true
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Email"
          defaultValue={user.email}
          InputProps={{
            readOnly: true
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="About"
          defaultValue={user.about}
          InputProps={{
            readOnly: true
          }}
        />
        <TextField
          id="outlined-read-only-input"
          label="Phone"
          defaultValue={user.phoneNumber}
          InputProps={{
            readOnly: true
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
