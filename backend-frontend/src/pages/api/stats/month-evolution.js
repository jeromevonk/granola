import { apiHandler, statsRepo } from 'src/helpers/api';

export default apiHandler({
  get: getEvolutionPerMonth,
});

async function getEvolutionPerMonth(req, res) {
  let { parentCategory, category, startYear, endYear } = req.query;

  // Validate 
  if (parentCategory) {
    parentCategory = Number(parentCategory);
    if ( false == Number.isInteger(parentCategory) || parentCategory < 1) return res.status(400).json({error: 'Invalid parentCategory'});
  }

  if (category) {
    category = Number(category);
    if ( false == Number.isInteger(category) || category < 2) return res.status(400).json({error: 'Invalid category'});
  }

  if (parentCategory && category) return res.status(400).json({error: 'parentCategory and category are mutually exclusive'});

  if (startYear) {
    startYear = Number(startYear);
    if ( false == Number.isInteger(startYear) || startYear < 2012) return res.status(400).json({error: 'Invalid startYear'});
  }

  if (endYear) {
    endYear = Number(endYear);
    if ( false == Number.isInteger(endYear) || endYear > 2050) return res.status(400).json({error: 'Invalid endYear'});
  }

  const response = await statsRepo.getEvolutionPerMonth(req.auth.sub, parentCategory, category, startYear, endYear);
  return res.status(200).json(response);
}
