import getConfig from 'next/config';
import { fetchWrapper, getMainCategories } from 'src/helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/categories`;

export const categoryService = {
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
  removeFromLocalStorage,
  addCategoryToState,
  renameCategoryInState,
  refetchCategories,
};

async function getCategories(force = false) {
  // Do we already have the categories on local storage?
  const cat = JSON.parse(localStorage.getItem('categories')) || [];
  if (cat.length > 0 && !force) {
    return cat;
  }

  const response = await fetchWrapper.get(baseUrl);
  addToLocalStorage(response);

  return response;
}

function createCategory(category) {
  return fetchWrapper.post(baseUrl, category);
}

function editCategory(categoryId, title) {
  return fetchWrapper.patch(`${baseUrl}/${categoryId}`, { title });
}

function deleteCategory(categoryId) {
  return fetchWrapper.delete(`${baseUrl}/${categoryId}`);
}

function removeFromLocalStorage() {
  localStorage.removeItem('categories');
}

function addToLocalStorage(categories) {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function addCategoryToState(newCategory, setCategories) {
  removeFromLocalStorage();
  setCategories(prev => {
    const cat = [
      ...prev.all,
      newCategory
    ];

    addToLocalStorage(cat);

    return {
      all: cat,
      mainCategories: getMainCategories(cat)
    }
  });
}

function renameCategoryInState(renamedCategory, setCategories) {
  removeFromLocalStorage();
  setCategories(prev => {
    const cat = prev['all'].map((cat => {
      if (cat.id !== renamedCategory.id) {
        return cat;
      }
      else {
        cat.title = renamedCategory.title
      }

      return cat;
    }));

    addToLocalStorage(cat);

    return {
      all: cat,
      mainCategories: getMainCategories(cat)
    }
  });
}

async function refetchCategories(setCategories) {
  removeFromLocalStorage();
  const cat = await getCategories(true);

  setCategories({
    all: cat,
    mainCategories: getMainCategories(cat)
  });
}
