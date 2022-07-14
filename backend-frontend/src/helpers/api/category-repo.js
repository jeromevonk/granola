import { postgresqlRepo } from 'src/helpers/api';

export const categoryRepo = {
  getCategories,
  createCategory,
};

async function getCategories() {
  const result = await postgresqlRepo.getCategories();

  // Shape the categories into a tree
  const categoryTree = {};

  // Divide between root nodes and child nodes
  const rootNodes = result.filter(item => item.parent_id === null);
  const childNodes = result.filter(item => item.parent_id !== null);
  
  // First, add the root nodes
  for (const item of rootNodes) {
    categoryTree[item.title] = {
      id: item.id,
      subCategories: {}
    }
  }

  // Then, add the children
  for (const item of childNodes) {
    if ( false == item.parent_title in categoryTree) {
      console.log(`Odd. No ${item.parent_title} found on root`);
    } else {
      categoryTree[item.parent_title].subCategories[item.title] = {
        id: item.id
      }
    }
  }
  
  return categoryTree;
}

async function createCategory(parentId, title) {
  return postgresqlRepo.createCategory(parentId, title);
}