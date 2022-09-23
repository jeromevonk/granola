import { postgresqlRepo } from 'src/helpers/api';

export const categoryRepo = {
  getCategories,
  createCategory,
  patchCategory,
  deleteCategory,
};

async function getCategories(user) {
  return postgresqlRepo.getCategories(user);
}

async function createCategory(user, parentId, title) {

  if (parentId !== null) {
    // If it's not a root category, must check if it relates to an existing category for this user
    const categories = await getCategories(user);
    const parent = categories.find(cat => cat.id === parentId && cat.parentId === null)
    if (!parent) throw new Error("'parentId' must refer to a valid main category");

  }

  return postgresqlRepo.createCategory(user, parentId, title);
}

async function patchCategory(user, categoryId, title) {
  return postgresqlRepo.editCategory(user, categoryId, title);
}

async function deleteCategory(user, categoryId) {
  return postgresqlRepo.deleteCategory(user, categoryId);
}