import { apiHandler, categoryRepo } from 'src/helpers/api';

export default apiHandler({
  patch: patchCategory,
  delete: deleteCategory,
});

async function patchCategory(req, res) {
  const { params } = req.query;

  // Validate category id - mandatory
  const categoryId = params[0];
  if (isNaN(categoryId) || categoryId <= 0) return res.status(400).json({ message: "Invalid 'category id'. Must be a positive integer or null" });

  // Validate title - mandatory
  const { title } = req.body;
  if (!title || typeof (title) != 'string' || title.length < 2 || title.length > 25) return res.status(400).json({ message: "Invalid 'title'. Must be string, 1 < len <= 25" });

  const updated = await categoryRepo.patchCategory(req.auth.sub, categoryId, title);

  // If no category was updated, return 404
  if (updated.length === 0) return res.status(404).json({ message: `No category found for this user with id=${categoryId}` });

  return res.status(200).json(updated);
}


async function deleteCategory(req, res) {
  const { params } = req.query;

  // Validate category id - mandatory
  const categoryId = params[0];
  if (isNaN(categoryId) || categoryId <= 0) return res.status(400).json({ message: "Invalid 'category id'. Must be a positive integer or null" });

  const response = await categoryRepo.deleteCategory(req.auth.sub, categoryId);

  // If no expense was deleted, return 404
  if (response === 0) return res.status(404).json({ message: `No category found for this user with id=${categoryId}` });

  return res.status(200).json(response);
}