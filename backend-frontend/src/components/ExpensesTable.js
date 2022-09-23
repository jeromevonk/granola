import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import FilterAlt from '@mui/icons-material/FilterAlt';
import FilterAltOff from '@mui/icons-material/FilterAltOff';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import { visuallyHidden } from '@mui/utils';
import { AppContext } from 'src/pages/_app';
import { getCategoryTitles, customlocaleString, getParentCategoryId, sortTitleAlphabetically, getComparator } from 'src/helpers'
import theme from 'src/theme';

const getTotalString = (expensesSum, largeScreen, numSelected) => {
  let totalStr = '';
  if (largeScreen.width) {
    totalStr = numSelected > 0 ? `Selected total: $ ${expensesSum}` : `Total: $ ${expensesSum}`;
  } else {
    totalStr = `Total: ${expensesSum}`
  }

  return totalStr;
}

function ExpensesTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    largeScreen } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: 'date',
      numeric: false,
      disablePadding: true,
      label: 'Date',
    },
    {
      id: 'description',
      numeric: false,
      disablePadding: true,
      label: 'Description',
    },
    {
      id: 'categoryText',
      numeric: false,
      disablePadding: true,
      label: 'Category',
      onlyLargeScreen: true
    },
    {
      id: 'spent',
      numeric: true,
      disablePadding: false,
      label: 'Spent',
    },
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => {
          if (!largeScreen.width && headCell.onlyLargeScreen) return;

          return (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'center'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id && (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                )}
              </TableSortLabel>
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  );
}

ExpensesTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  largeScreen: PropTypes.object.isRequired
};

const ExpensesTableToolbar = (props) => {
  const { selected, title, setSelected, filter, setFilter, handleAction, expensesSum, filterable, largeScreen } = props;
  const numSelected = selected.length;

  // ----------------------------------------------------
  // Filters
  // ----------------------------------------------------
  let availableCategories = [];
  let availableSubCategories = [];
  for (let [key, value] of Object.entries(filterable)) {
    // The key represents the main category
    const [cat, catTitle] = key.split('-');
    availableCategories.push({
      id: cat,
      title: catTitle
    });

    // If mainCategory filter is not selected
    // or if it is selected, but this is the selected category
    // then add the subCategories to the list
    if (cat == 0 || cat == filter.mainCategory) {
      // The value (array) represents the subcategories
      for (const item of value) {
        availableSubCategories.push({
          id: item.id,
          title: item.title
        });
      }
    }
  }

  // Sort
  availableCategories = availableCategories.sort(sortTitleAlphabetically);
  availableSubCategories = availableSubCategories.sort(sortTitleAlphabetically);


  const getFilterIcon = () => {
    return filter.mainCategory == 0 && filter.subCategory == 0 ? <FilterAlt /> : <FilterAltOff htmlColor="#04d164" />
  }

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    if (name === 'mainCategory') {
      setFilter({ mainCategory: value, subCategory: 0 });
    } else {
      setFilter(prevFilter => ({
        ...prevFilter,
        [name]: value
      }));
    }
  }

  const resetFilter = () => {
    setFilter({ mainCategory: 0, subCategory: 0 });
  }

  // -----------------------------------
  // States for the Popovers
  // -----------------------------------
  const [filterPopoverAnchor, setFilterPopoverAnchor] = React.useState(null);
  const filterPopoverOpen = Boolean(filterPopoverAnchor);

  const handleCloseFilterPopover = () => {
    setFilterPopoverAnchor(null);
  };

  const [copyPopoverAnchor, setCopyPopoverAnchor] = React.useState(null);
  const copyPopoverOpen = Boolean(copyPopoverAnchor);

  const handleCloseCopyPopover = () => {
    setCopyPopoverAnchor(null);
  };

  const [radioAmount, setRadioAmount] = React.useState('1');

  // Tooltips
  const duplicateTooltip = numSelected > 1 ? "Can't duplicate multiple at once" : "Duplicate";
  const editTooltip = numSelected > 1 ? "Can't edit multiple at once" : "Edit";

  // Sum total
  const totalStr = getTotalString(expensesSum, largeScreen, numSelected);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (appTheme) =>
            alpha(appTheme.palette.primary.main, appTheme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 40%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 40%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}
      <Typography
        sx={{ flex: '1 1 40%', color: theme.palette.primary.main }}
        variant="subtitle1"
        id="tableTitle"
        component="div"
      >
        {totalStr}
      </Typography>

      <Box sx={{ width: 120 }}>
        {numSelected > 0 ? (
          <Stack direction="row">
            <Tooltip title={duplicateTooltip}>
              <span>
                <IconButton
                  onClick={() => {
                    handleAction('duplicate', selected)
                  }}
                  disabled={numSelected > 1}
                >
                  <ContentCopyIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={editTooltip}>
              <span>
                <IconButton
                  onClick={() => {
                    handleAction('edit', selected)
                  }}
                  disabled={numSelected > 1}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => {
                  handleAction('delete', selected);

                  // After the action, clear the selected array
                  setSelected([]);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <Tooltip title="Copy recurring expenses to next month">
              <IconButton
                sx={{ alignContent: "right" }}
                onClick={(event) => setCopyPopoverAnchor(event.currentTarget)}
              >
                <DoubleArrowIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter expenses per category">
              <IconButton
                sx={{ alignContent: "right" }}
                onClick={(event) => setFilterPopoverAnchor(event.currentTarget)}
              >
                {
                  getFilterIcon()
                }
              </IconButton>
            </Tooltip>
            <Popover
              elevation={10}
              open={filterPopoverOpen}
              anchorEl={filterPopoverAnchor}
              onClose={handleCloseFilterPopover}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <IconButton
                aria-label="Close"
                onClick={handleCloseFilterPopover}
                style={{ position: 'absolute', right: '4px', top: '4px', zIndex: '1000' }}>
                <CloseIcon />
              </IconButton>
              <Stack direction="row" spacing={5} alignItems="center" justifyContent="flex-start">
                <Typography sx={{ p: 2 }}>Filter</Typography>
                <Button
                  color="error"
                  tabIndex={0}
                  aria-label={'Reset filter'}
                  onClick={resetFilter}>
                  RESET
                </Button>
              </Stack>
              <FormControl variant="standard" sx={{ m: 1, minWidth: '150px' }}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="mainCategory"
                  name="mainCategory"
                  label="Category"
                  value={filter.mainCategory}
                  onChange={handleFilterChange}
                >
                  <MenuItem key={'category-all'} value='0'>All</MenuItem>
                  {
                    availableCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 1, minWidth: '150px' }}>
                <InputLabel id="subCategory-select-label">Sub-category</InputLabel>
                <Select
                  labelId="subCategory-label"
                  id="subCategory"
                  name="subCategory"
                  label="Sub-category"
                  value={filter.subCategory}
                  onChange={handleFilterChange}
                >
                  <MenuItem key={'subcategory-all'} value='0'>All</MenuItem>
                  {
                    availableSubCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Popover>
            <Popover
              elevation={10}
              open={copyPopoverOpen}
              anchorEl={copyPopoverAnchor}
              onClose={handleCloseCopyPopover}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Box sx={{ m: 2, p: 1 }}>
                <IconButton
                  aria-label="Close"
                  onClick={handleCloseCopyPopover}
                  style={{ position: 'absolute', right: '4px', top: '4px', zIndex: '1000' }}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" gutterBottom>Copy to next month</Typography>
                <Typography variant="body1" gutterBottom>This will copy <strong>recurring expenses</strong> from <br />this month to next month.</Typography>
                <Typography variant="body1" gutterBottom>You can choose whether to fully copy or to <br />set the spent as zero and edit later.</Typography>
                <FormControl sx={{ py: 1 }}>
                  <FormLabel id="radio-label" sx={{ textAlign: "left" }}>Amount spent</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={radioAmount}
                    onChange={(event) => setRadioAmount(event.target.value)}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="Keep amounts" />
                    <FormControlLabel value="0" control={<Radio />} label="Clear amounts" />
                  </RadioGroup>
                </FormControl>
                <Stack direction='row' justifyContent='space-around'>
                  <Button
                    color="primary"
                    tabIndex={0}
                    aria-label='Copy'
                    onClick={() => {
                      handleAction('copy', [], { keepAmounts: !!Number(radioAmount) });
                      handleCloseCopyPopover();
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    color="error"
                    tabIndex={0}
                    aria-label='Cancel'
                    onClick={handleCloseCopyPopover}>
                    CANCEL
                  </Button>
                </Stack>
              </Box>
            </Popover>
          </Stack>
        )}
      </Box>
    </Toolbar>
  );
};

ExpensesTableToolbar.propTypes = {
  selected: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  handleAction: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  expensesSum: PropTypes.string.isRequired,
  filterable: PropTypes.object.isRequired,
};

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 160,
  },
});

export default function ExpensesTable(props) {
  // Context
  const context = React.useContext(AppContext);
  const largeScreen = context?.largeScreen;
  const categories = context?.categories.all;
  const [visibility] = context?.visibility;

  // States
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('date');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(largeScreen.height ? 20 : 8);
  const [filter, setFilter] = React.useState({
    mainCategory: props.filter?.mainCategory || 0,
    subCategory: props.filter?.subCategory || 0
  });

  React.useEffect(() => {
    // If screen orientation has changed, set number of rows per page
    setRowsPerPage(largeScreen.height ? 20 : 8)
  }, [largeScreen.height]);

  React.useEffect(() => {
    // If filter was changed, go back to page 0
    setPage(0);
  }, [filter]);

  React.useEffect(() => {
    // If month or year has hanged, clear selected array and go back to page 0
    setSelected([]);
    setPage(0);
  }, [props.title]);

  const rows = props.expenses || [];

  const StyledTableRow = styled(TableRow)(({ theme: appTheme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: appTheme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // ----------------------------------------
  // Filterable
  // Get categories and sub-categories 
  // from the rows
  // ----------------------------------------
  const getFilterableCategories = (data) => {
    return data.reduce((prev, current) => {
      const sub = current.category;
      const cat = getParentCategoryId(categories, sub);
      const titles = getCategoryTitles(categories, sub);

      const key = `${cat}-${titles.parentCategoryTitle}`
      if (!(key in prev)) {
        // Add category with an empty array
        prev[key] = [];
      }

      // Add the sub-category, if not there already
      if (!prev[key].find(item => item.id === sub)) {
        prev[key].push({
          id: sub,
          title: titles.categoryTitle
        });
      }

      return prev;
    }, {});
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // Filter the rows
  const filteredRows = rows.slice().filter(item => {
    if (filter.subCategory > 0) {
      return item.category == filter.subCategory;
    } else if (filter.mainCategory > 0) {
      return getParentCategoryId(categories, item.category) == filter.mainCategory;
    } else {
      return true;
    }
  });

  // -------------------------------------------------------
  // Sum expenses
  // If none is selected, sum them all
  // If there is at least one selection, sum the selected
  // -------------------------------------------------------
  let expensesSum = filteredRows.reduce((prev, current) => {
    let sum = prev;

    if (selected.length === 0 || isSelected(current.id)) {
      sum += Number(current.spent);
    }

    return sum;
  }, 0);

  expensesSum = customlocaleString(expensesSum);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <ExpensesTableToolbar
          selected={selected}
          setSelected={setSelected}
          setFilter={setFilter}
          filter={filter}
          expensesSum={expensesSum}
          handleAction={props.handleAction}
          title={props.title}
          filterable={getFilterableCategories(rows)}
          largeScreen={largeScreen}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 250 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <ExpensesTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              largeScreen={largeScreen}
            />
            <TableBody>
              {filteredRows
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {

                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <StyledTableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      {
                        // Date - might be a day (in month view) or a full date (in search view)
                      }
                      <TableCell align="center">{row.date || '-'}</TableCell>
                      {
                        // Description
                      }
                      <CustomWidthTooltip title={`Category:${row.mainCategoryText} Subcategory:${row.subCategoryText} ${row.recurring ? 'Recurring' : ''}`}>
                        <TableCell
                          align="left"
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            fontWeight: row.recurring ? "bold" : "normal"
                          }}>{row.description} {'\n'} {row.details && `(${row.details})`}
                        </TableCell>
                      </CustomWidthTooltip>
                      {
                        // Category
                      }
                      {
                        // Only show this column if screen is large enough
                        largeScreen.width && <TableCell align="center">{row.categoryText}</TableCell>
                      }
                      {
                        // Spent
                      }
                      <Tooltip align="right" title={visibility ? `Paid: ${row.amountPaid}, Reimbursed: ${row.amountReimbursed}` : ''}>
                        <TableCell
                          align="right"
                          sx={{}}
                        >{visibility ? customlocaleString(row.spent) : '••••••••'}</TableCell>
                      </Tooltip>
                    </StyledTableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 20, 50]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

ExpensesTable.propTypes = {
  handleAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  expenses: PropTypes.array,
  filter: PropTypes.object,
};