import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CategoryRenameDialog(props) {
  // State
  const [newTitle, setNewTitle] = React.useState('');

  // Props
  const { open, category, handleClose, handleSubmit } = props;

  // If not open, return early
  if (!open) return null;
  if (!category) return null;

  // ----------------------------------------------------
  // Submit
  // ----------------------------------------------------
  const onSubmit = () => {
    // Submit
    handleSubmit(category, newTitle);

    // Reset
    setNewTitle('');
  }

  // ----------------------------------------------------
  // Close
  // ----------------------------------------------------
  const onClose = () => {
    // Reset
    setNewTitle('');

    // Close
    handleClose();
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <form onSubmit={onSubmit}>
          <DialogTitle>Rename category</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>Rename <i>{category.title}</i>:</span>
            </DialogContentText>
            <TextField
              variant="standard"
              margin="dense"
              autoFocus
              fullWidth
              id="title"
              label="Title"
              inputProps={{ maxLength: 25 }}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button color='secondary' onClick={onClose}>Cancel</Button>
            <Button color='primary' onClick={onSubmit}>Rename</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

CategoryRenameDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};