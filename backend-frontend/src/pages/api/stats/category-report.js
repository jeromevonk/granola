import { apiHandler, statsRepo, validateCategoryReport } from 'src/helpers/api';

export default apiHandler({
  get: getCategoryReportByYear,
});

async function getCategoryReportByYear(req, res) {
  // Validate
  const params = req.query;
  const { isValid, msg } = validateCategoryReport(params);
  if (!isValid) {
    return res.status(400).json({ message: msg });
  }

  const response = await statsRepo.getCategoryReportByYear(
    req.auth.sub,
    params.startYear,
    params.endYear,
    params.reportType
  );

  return res.status(200).json(response);
}
