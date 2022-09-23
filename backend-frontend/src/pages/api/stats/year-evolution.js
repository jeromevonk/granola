import { apiHandler, statsRepo, validateEvolution } from 'src/helpers/api';

export default apiHandler({
  get: getEvolutionPerYear,
});

async function getEvolutionPerYear(req, res) {
  // Validate
  const params = req.query;
  const { isValid, msg } = validateEvolution(params);
  if (!isValid) {
    return res.status(400).json({ message: msg });
  }

  const response = await statsRepo.getEvolutionPerYear(
    req.auth.sub,
    params.mainCategory,
    params.subCategory,
    params.startYear,
    params.endYear
  );

  return res.status(200).json(response);
}
