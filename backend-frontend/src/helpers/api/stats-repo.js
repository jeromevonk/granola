import { postgresqlRepo } from 'src/helpers/api';

export const statsRepo = {
  getEvolutionPerYear,
  getEvolutionPerMonth,
};


async function getEvolutionPerYear(user, parentCategory, category, startYear, endYear) {
  return postgresqlRepo.getEvolutionPerYear(user, parentCategory, category, startYear, endYear);
}

async function getEvolutionPerMonth(user, parentCategory, category, startYear, endYear) {
  return postgresqlRepo.getEvolutionPerMonth(user, parentCategory, category, startYear, endYear);
}