import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import React from 'react';

const ConfirmDelete = ({ open, toggleDialog, title = 'Confirm Delete', handleSuccess }) => {
  return (
    <Dialog open={open} onClose={toggleDialog}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this item ?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button sx={{ color: '#fff' }} variant="contained" color="success" onClick={handleSuccess}>
          Delete
        </Button>
        <Button variant="contained" color="error" onClick={toggleDialog}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;
