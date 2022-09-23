import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
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
import { visuallyHidden } from '@mui/utils';
import { AppContext } from 'src/pages/_app';
import { getCustomMonthInitials, customlocaleString, getComparator } from 'src/helpers'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function ReportTableHead(props) {
  const { order, orderBy, onRequestSort, numMonths } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  function createHeadCells() {
    const cells = [
      {
        id: 'categoryText',
        disablePadding: true,
        label: 'Category',
      }
    ];

    for (let i = 1; i <= numMonths; i++) {
      const month = getCustomMonthInitials(i, true);
      cells.push({
        id: i.toString(),
        disablePadding: true,
        label: month,
      });
    }
  
    cells.push(
      {
        id: 'year',
        disablePadding: false,
        label: 'Year',
      });
  
    return cells;
  }
  
  const headCells = createHeadCells();

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => {
          return (
            <StyledTableCell
              key={`head-${headCell.id}`}
              align={'center'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              style={headCell.style}
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
            </StyledTableCell>
          )})}
      </TableRow>
    </TableHead>
  );
}

ReportTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  numMonths: PropTypes.number.isRequired,
};


export default function ReportTable(props) {
  // Context
  const context = React.useContext(AppContext);
  const largeScreen = context?.largeScreen;
  const [visibility] = context?.visibility;

  // States
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('year');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(largeScreen.height? 20 : 8);

  React.useEffect(() => {
    setRowsPerPage(largeScreen.height? 20 : 8)
  }, [largeScreen.height]);

  const rows = props.data || [];
  const numMonths = props.numMonths;

  if (rows.length === 0) {
    return (
      <Box sx={{
        p: 20,
        border: '2px dashed #008080'
      }}>
        <Typography variant="h5" component="h1" align="center">
          No data!
        </Typography>
      </Box>
    )
  }

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCellsForOneRow = (row) => {
    // Start with 'category'
    const cells = [
      (<StyledTableCell 
        align="center"
        key={`${row.categoryText}`}
      >{row.categoryText}
      </StyledTableCell>)];

    // Then, add months
    for (let i = 1; i <= numMonths; i++) {
      const value = getCellValue(row[i]);
      cells.push((<StyledTableCell 
        align={getCellAlignment(value)}
        key={`${row.categoryText}-${i}`}
      >{value}
      </StyledTableCell>))
    }

    // Lastly, add 'year'
    cells.push((<StyledTableCell 
      align="right"
      key={`${row.category}-year`}
    >{getCellValue(row.year)}
    </StyledTableCell>))

    return cells;
  }

  const getCellValue = (value) => {
    let toReturn = '••••••••';
    if (visibility){
      toReturn = Number(value) === 0 ? '-' : customlocaleString(value);
    }

    return toReturn;
  }

  const getCellAlignment= (value) => {
    return value == '-' ? "center" : "right";
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 }
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="subtitle1"
            id="tableTitle"
            component="div"
          >
            {props.title}
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{ minWidth: 250 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <ReportTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              numMonths={numMonths}
            />
            <TableBody>
              {rows.slice().sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <StyledTableRow
                      hover
                      tabIndex={-1}
                      key={`row-${row.category}`}
                    >
                      {
                      // Every item in the array on it's cell
                        getCellsForOneRow(row)
                      }
                    
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
          rowsPerPageOptions={[8, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

ReportTable.propTypes = {
  title: PropTypes.any.isRequired,
  data: PropTypes.array.isRequired,
  numMonths: PropTypes.number.isRequired,
};