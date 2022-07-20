import { resetWarningCache } from 'prop-types';
import { postgresqlRepo } from 'src/helpers/api';

export const categoryRepo = {
  getCategories,
  createCategory,
};

async function getCategories() {
  const result = await postgresqlRepo.getCategories();

  // Convert to camel Case
  return result.map(item => {
    item.parentId = item['parent_id'];
    delete item['parent_id'];
    
    return item;
  });
}

async function createCategory(parentId, title) {
  return postgresqlRepo.createCategory(parentId, title);
}