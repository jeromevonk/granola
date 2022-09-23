import React from "react";
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import RenameIcon from '@mui/icons-material/DriveFileRenameOutline';


export default function CategoryListActions(props) {
  const { type, handleRename, handleDelete } = props;

  return (
    <Stack direction='row' justifyContent="space-around">
      <Button
        variant="text"
        size="small"
        startIcon={<RenameIcon />}
        onClick={() => handleRename(type)}
      >Rename</Button>
      <Button
        variant="text"
        size="small"
        startIcon={<DeleteIcon />}
        onClick={() => handleDelete(type)}
      >Delete</Button>
    </Stack>
  );
}

CategoryListActions.propTypes = {
  type: PropTypes.string.isRequired,
  handleRename: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
