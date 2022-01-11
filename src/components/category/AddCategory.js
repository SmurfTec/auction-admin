import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import { useTextInput } from 'hooks';
import React, { useEffect } from 'react';

const ManageCategory = ({
  open,
  toggleDialog,
  title = 'Confirm Category',
  handleSuccess,
  isUpdate,
  editItem
}) => {
  const [name, handleChange, reset, setName] = useTextInput('');

  useEffect(() => {
    if (!isUpdate || !editItem) return reset();
    setName(editItem.name);
  }, [isUpdate, editItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`name`, name);
    handleSuccess(name);
    reset();
  };

  return (
    <Dialog
      sx={(theme) => ({
        '& .MuiPaper-root': {
          width: 450
          // * we can use theme like this
          // backgroundColor: theme ? theme.palette.primary.main : 'red'
        }
      })}
      open={open}
      onClose={toggleDialog}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="form">
          <TextField
            type="text"
            required
            value={name}
            onChange={handleChange}
            variant="outlined"
            name="name"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          form="form"
          sx={{ color: '#fff' }}
          variant="contained"
          color="success"
        >
          {isUpdate ? 'Update' : 'Create'}
        </Button>
        <Button variant="contained" color="error" onClick={toggleDialog}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageCategory;
