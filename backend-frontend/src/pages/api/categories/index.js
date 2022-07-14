import { apiHandler, categoryRepo } from 'src/helpers/api';

export default apiHandler({
  get: getCategories,
  post: postCategories
});

async function getCategories(req, res) {
  // return categories
  const response = await categoryRepo.getCategories();
  return res.status(200).json(response);
}

async function postCategories(req, res) {
  const { parentId, title } = req.body;

  if ( !parentId || parentId < 1) return res.status(400).json({error: 'Invalid parentId. Must be integer > 0'});
  if ( !title || typeof(title) != 'string' || title.length < 2) return res.status(400).json({error: 'Invalid title. Must be string, len > 1'});
    
  // create a new category
  try {
    await categoryRepo.createCategory(parentId, title);
    return res.status(200).json({});
  } catch(err) {
    return res.status(400).json({message: err.message});
  }
}