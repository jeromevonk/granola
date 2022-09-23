import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CategoryCreateDialog(props) {
  const [newCategoryTitle, setNewCategoryTitle] = React.useState('');

  // Props
  const { open, categoryType, handleClose, handleSubmit, parentCategory } = props;

  // If not open, return early
  if (!open) return null;

  // ----------------------------------------------------
  // Figure out title and content based on category type
  // ----------------------------------------------------
  let title = ''
  let content = '';

  if (categoryType === 'mainCategory') {
    title = 'New main category';
    content = 'Enter title for the new category';
  } else if (categoryType === 'subCategory') {
    title = 'New sub-category';
    content = <span>Enter title for a new sub-category<br /> inside category <b>{parentCategory.title}</b></span>
  }

  // ----------------------------------------------------
  // Submit
  // ----------------------------------------------------
  const onSubmit = () => {
    const newCategory = {
      parentId: categoryType === 'mainCategory' ? null : parentCategory.id,
      title: newCategoryTitle
    }

    // Submit
    handleSubmit(newCategory);

    // Reset
    setNewCategoryTitle('');
  }

  // ----------------------------------------------------
  // Close
  // ----------------------------------------------------
  const onClose = () => {
    // Reset
    setNewCategoryTitle('');

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
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {content}
            </DialogContentText>
            <TextField
              variant="standard"
              margin="dense"
              autoFocus
              fullWidth
              id="title"
              label="Title"
              inputProps={{ maxLength: 25 }}
              value={newCategoryTitle}
              onChange={event => setNewCategoryTitle(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button color='secondary' onClick={onClose}>Cancel</Button>
            <Button color='primary' onClick={onSubmit}>Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

CategoryCreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  categoryType: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  parentCategory: PropTypes.string,
};