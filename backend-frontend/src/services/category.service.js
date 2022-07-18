import getConfig from 'next/config';
import { fetchWrapper } from 'src/helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/categories`;

export const categoryService = {
  getCategories,
};

function getCategories() {
  return fetchWrapper.get(baseUrl);
}
