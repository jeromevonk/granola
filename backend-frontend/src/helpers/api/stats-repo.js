import { postgresqlRepo } from 'src/helpers/api';

export const statsRepo = {
  getEvolutionPerYear,
  getEvolutionPerMonth,
  getCategoryReportByYear,
};


async function getEvolutionPerYear(user, mainCategory, category, startYear, endYear) {
  return postgresqlRepo.getEvolutionPerYear(user, mainCategory, category, startYear, endYear);
}

async function getEvolutionPerMonth(user, mainCategory, category, startYear, endYear) {
  return postgresqlRepo.getEvolutionPerMonth(user, mainCategory, category, startYear, endYear);
}

async function getCategoryReportByYear(user, startYear, endYear, reportType = 'mainCategory') {
  if (reportType === 'mainCategory') {
    return postgresqlRepo.getMainCategoryReportByYear(user, startYear, endYear);
  } else if (reportType === 'subCategory') {
    return postgresqlRepo.getSubCategoryReportByYear(user, startYear, endYear);
  } else {
    return postgresqlRepo.getSubCategoryReportByYear(user, startYear, endYear, reportType);
  }
}