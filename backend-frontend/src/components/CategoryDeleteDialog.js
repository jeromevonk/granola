import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CategoryDeleteDialog(props) {
  // Props
  const { open, category, handleClose, handleSubmit } = props;

  // If not open, return early
  if (!open) return null;
  if (!category) return null;

  // ----------------------------------------------------
  // Submit
  // ----------------------------------------------------
  const onSubmit = () => {
    handleSubmit(category);
  }

  // ----------------------------------------------------
  // Close
  // ----------------------------------------------------
  const onClose = () => {
    handleClose();
  }

  const getWarning = () => {
    if (!category.parentId) {
      return (
        <span>
          <b>Warning</b>: This will delete the main category,
          <br />
          its sub-categories <u>and any related expenses.</u>
        </span>
      )
    } else {
      return (
        <span>
          <b>Warning</b>: This will delete the sub-category
          <br />
          <u>and any related expenses.</u>
        </span>
      )
    }
  }

  const getContent = () => {
    if (!category.parentId) {
      return <span>Delete main category <i>{category.title}</i> ? </span>
    } else {
      return <span>Delete sub-category <i>{category.title}</i> ? </span>
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Delete category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getContent()}
            <br />
            <br />
            {getWarning()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            onClick={onClose}
          >Cancel</Button>
          <Button
            variant="outlined"
            color='error'
            startIcon={<DeleteIcon />}
            onClick={onSubmit}
          >Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CategoryDeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};