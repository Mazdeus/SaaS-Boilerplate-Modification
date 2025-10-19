module.exports = {
  '*.{js,jsx,ts,tsx,mjs,cjs}': ['eslint --fix --no-warn-ignored'],
  '**/*.ts?(x)': () => 'npm run check-types',
};
