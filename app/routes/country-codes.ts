// src/routes/api/country-codes.ts
import { json } from '@remix-run/node';
import countryCodes from './api/country-codes.json';  // Assuming you created this JSON file

export const loader = () => {
  return json(countryCodes);
};
