import { apiHandler, categoryRepo } from 'src/helpers/api';

export default apiHandler({
  get: getCategories,
  post: postCategories
});

async function getCategories(req, res) {
  // return categories
  const response = await categoryRepo.getCategories(req.auth.sub);
  return res.status(200).json(response);
}

async function postCategories(req, res) {
  const { parentId, title } = req.body;

  if (parentId !== null) {
    if (!parentId || parentId < 1) return res.status(400).json({ message: "Invalid 'parentId'. Must be null (for main category) or integer > 0 (for sub-category)" });
  }
  if (!title || typeof (title) != 'string' || title.length < 2 || title.length > 25) return res.status(400).json({ message: "Invalid 'title'. Must be string, 1 < len <= 25" });


  // create a new category
  try {
    const response = await categoryRepo.createCategory(req.auth.sub, parentId, title);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}