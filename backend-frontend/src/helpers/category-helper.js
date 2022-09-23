import { sortTitleAlphabetically } from 'src/helpers'

export {
  getCategoryTitles,
  getParentCategoryId,
  getMainCategories,
  getSubCategories,
};

function getCategoryTitles(categories, categoryId) {
  const cat = categories.find(item => item.id === categoryId);
  const parentCat = categories.find(item => item.id === cat?.parentId);

  return {
    parentCategoryTitle: parentCat?.title,
    categoryTitle: cat?.title
  }
}

function getParentCategoryId(categories, subCategoryId) {
  const subCat = categories.find(item => item.id === subCategoryId);
  const mainCat = categories.find(item => item.id === subCat?.parentId);

  return mainCat?.id;
}

function getMainCategories(categories) {
  const mainCategories = []
  for (const item of categories) {
    if (item.parentId === null) {
      mainCategories.push({
        title: item.title,
        id: item.id
      });
    }
  }

  return mainCategories.sort(sortTitleAlphabetically);
}

function getSubCategories(categories, mainCategoryId) {
  const subCategories = [];

  for (const item of categories) {
    if (item.parentId === mainCategoryId) {
      subCategories.push({
        title: item.title,
        id: item.id
      });
    }
  }

  return subCategories.sort(sortTitleAlphabetically);
}