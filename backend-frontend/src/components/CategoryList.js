import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AppContext } from 'src/pages/_app';
import { getSubCategories } from 'src/helpers'

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import CategoryListActions from '../components/CategoryListActions';
import CategoryCreateDialog from '../components/CategoryCreateDialog';
import CategoryRenameDialog from '../components/CategoryRenameDialog';
import CategoryDeleteDialog from '../components/CategoryDeleteDialog';

import { categoryService, alertService } from "src/services";

export default function CategoryList() {
  // Categories and sub-categories
  const context = React.useContext(AppContext);
  const categories = context?.categories.all;
  const setCategories = context?.categories.setCategories;
  const mainCategories = context?.categories.mainCategories;

  // States
  const [selected, setSelected] = React.useState({ mainCategory: 0, subCategory: null });
  const [createDialog, setCreateDialog] = React.useState({ open: false, type: '', parentCategory: '' });
  const [renameDialog, setRenameDialog] = React.useState({ open: false, category: {} });
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, category: {} });

  const handleListItemClick = (name, id) => {
    setSelected(prev => {
      const newState = {
        ...prev,
        [name]: id
      }

      if (name === 'mainCategory') {
        newState.subCategory = null;
      }

      return newState;
    });
  };

  // --------------------------------------------
  // Handlers for CategoryCreateDialog
  // --------------------------------------------
  const handleCreateDialogOpen = (type) => {
    const state = {
      open: true,
      type
    };

    if (type === 'subCategory') {
      state.parentCategory = getSelectedMainCategory();

      // If can't get the selected category, return
      if (!state.parentCategory) {
        alertService.error('Must have a main category first');
        return;
      }
    }

    setCreateDialog(state);
  };

  const handleCreateDialogClose = () => {
    setCreateDialog({ open: false, type: '', parentCategory: '' });
  };

  const handleCreateDialogSubmit = (newCategory) => {
    handleCreateDialogClose();
    categoryService.createCategory(newCategory)
      .then((response) => {
        alertService.success(`Category '${newCategory.title}' created`);
        categoryService.addCategoryToState(response[0], setCategories);
      })
      .catch((err => console.error(err)));
  }

  // --------------------------------------------
  // Handlers for CategoryRenameDialog
  // --------------------------------------------
  const handleRenameDialogOpen = (type) => {
    let categoryToRename = null;

    if (type === 'mainCategory') {
      categoryToRename = getSelectedMainCategory()
    } else {
      categoryToRename = getSelectedSubCategory();
    }

    // If can't get the selected category, return
    if (!categoryToRename) {
      alertService.error('Must select a category first');
      return;
    }

    const state = {
      open: true,
      category: categoryToRename
    };

    setRenameDialog(state);
  };

  const handleRenameDialogClose = () => {
    setRenameDialog({ open: false, category: {} });
  };

  const handleRenameDialogSubmit = (category, newTitle) => {
    handleRenameDialogClose();
    categoryService.editCategory(category.id, newTitle)
      .then((response) => {
        alertService.success(`Category '${category.title} 'renamed to '${newTitle}'`);
        categoryService.renameCategoryInState(response[0], setCategories);
      })
      .catch((err => console.error(err)));
  }

  // --------------------------------------------
  // Handlers for CategoryDeleteDialog
  // --------------------------------------------
  const handleDeleteDialogOpen = (type) => {
    let categoryToDelete = null;

    if (type === 'mainCategory') {
      categoryToDelete = getSelectedMainCategory()
    } else {
      categoryToDelete = getSelectedSubCategory();
    }

    // If can't get the selected category, return
    if (!categoryToDelete) {
      if (type === 'mainCategory') alertService.error('Must select a main category first');
      else alertService.error('Must select a sub-category first');
      return;
    }

    const state = {
      open: true,
      category: categoryToDelete
    };

    setDeleteDialog(state);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialog({ open: false, category: {} });
  };

  const handleDeleteDialogSubmit = (category) => {
    handleDeleteDialogClose();
    categoryService.deleteCategory(category.id)
      .then(() => {
        alertService.success(`Category '${category.title}' deleted`);
        categoryService.refetchCategories(setCategories);

        // Must 'unselect' if we deleted a mainCategory
        if (!category.parentId) {
          setSelected({ mainCategory: 0, subCategory: null });
        } else {
          setSelected(prev => ({ ...prev, subCategory: null }));
        }
      })
      .catch((err => console.error(err)));
  }

  // --------------------------------------------
  // Helpers
  // --------------------------------------------
  const getSelectedMainCategory = () => {
    return mainCategories.find(cat => selected.mainCategory == cat.id);
  }

  const getSelectedSubCategory = () => {
    return categories.find(cat => selected.subCategory == cat.id);
  }

  const subCategories = getSubCategories(categories, selected.mainCategory);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 2 }}>
        {`There are ${mainCategories.length} main categories and ${categories.length - mainCategories.length} sub-categories`}
      </Box>
      <Stack direction='row' justifyContent='space-evenly'>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div" align="center">
          Main categories
        </Typography>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div" align="center">
          Sub-categories
        </Typography>
      </Stack>
      <Stack direction='row'>
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          <CategoryListActions
            type='mainCategory'
            handleRename={handleRenameDialogOpen}
            handleDelete={handleDeleteDialogOpen}
          />
          <List component="nav" dense={true}>
            {
              // The main categories
              mainCategories.map((category) => (
                <ListItemButton
                  selected={selected.mainCategory === category.id}
                  onClick={() => handleListItemClick("mainCategory", category.id)}
                  key={category.id}
                >
                  <ListItemText primary={category.title} />
                </ListItemButton>
              ))
            }
            {
              // Add button
              <ListItemButton
                selected={false}
                key={'create-main-category'}
                onClick={() => handleCreateDialogOpen('mainCategory')}
              >
                <ListItemText primary={
                  <Typography
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                    component="span"
                    variant="body2"
                    color="primary"
                  >
                    + ADD
                  </Typography>
                }
                />
              </ListItemButton>
            }
          </List>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          <CategoryListActions
            type='subCategory'
            handleRename={handleRenameDialogOpen}
            handleDelete={handleDeleteDialogOpen}
          />
          <List component="nav" dense={true}>
            {
              // If a main category is not selected, show 'Select a main category'
              (selected.mainCategory === 0) ?
                // Render a helper text
                <ListItemButton
                  selected={false}
                  key={'n/a'}
                >
                  <ListItemText primary="Select a main category" />
                </ListItemButton>

                :

                // Else, render sub-categories
                subCategories.map((category) => (
                  <ListItemButton
                    selected={selected.subCategory === category.id}
                    onClick={() => handleListItemClick("subCategory", category.id)}
                    key={category.id}
                  >
                    <ListItemText primary={category.title} />
                  </ListItemButton>
                ))
            }
            {
              // If a main category is selected, show the "Add sub-category" button
              (selected.mainCategory !== 0) &&
              // Add button
              <ListItemButton
                selected={false}
                key={'create-sub-category'}
                onClick={() => handleCreateDialogOpen('subCategory')}
              >
                <ListItemText primary={
                  <Typography
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                    component="span"
                    variant="body2"
                    color="primary"
                  >
                    + ADD
                  </Typography>
                }
                />
              </ListItemButton>
            }
          </List>
        </Box>
        <CategoryCreateDialog
          open={createDialog.open}
          categoryType={createDialog.type}
          handleClose={handleCreateDialogClose}
          handleSubmit={handleCreateDialogSubmit}
          parentCategory={createDialog.parentCategory}
        />
        <CategoryRenameDialog
          open={renameDialog.open}
          category={renameDialog.category}
          handleClose={handleRenameDialogClose}
          handleSubmit={handleRenameDialogSubmit}
        />
        <CategoryDeleteDialog
          open={deleteDialog.open}
          category={deleteDialog.category}
          handleClose={handleDeleteDialogClose}
          handleSubmit={handleDeleteDialogSubmit}
        />
      </Stack>
    </Container>
  );
}