export {
  capitalizeFirstLetter,
  customlocaleString,
  sortTitleAlphabetically,
  getComparator,
};

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function customlocaleString(value) {
  if (typeof value === 'string') {
    value = Number(value);
  }

  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function sortTitleAlphabetically(a, b) {
  // See https://stackoverflow.com/a/37511463/660711
  const x = a.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const y = b.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (x > y) {
    return 1;
  }
  if (x < y) {
    return -1;
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const textHeadCells = ['date', 'description', 'categoryText', 'category'];

function descendingComparator(a, b, orderBy) {
  let x, y;

  if (textHeadCells.includes(orderBy)) {
    x = a[orderBy];
    y = b[orderBy];
  } else {
    // Must convert to a number in order to compare correctly
    x = Number(a[orderBy]);
    y = Number(b[orderBy]);
  }

  if (y < x) {
    return -1;
  }

  if (y > x) {
    return 1;
  }

  return 0;
}