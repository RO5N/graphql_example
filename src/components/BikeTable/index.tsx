import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { bikeSVC } from '@services';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },

  button: {
    height: 30,
    width: 30,
  },

  appBar: {
    position: 'relative',
  },
  order: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginBottom: 25,
    marginRight: 50,
  },
  searchTypo: {
    marginRight: 20,
  },
  container: {
    marginTop: 20,
  },
  searchButton: { height: 35, width: 35, border: '1px solid' },
});

export default function BikeList(): JSX.Element {
  //const [data, setData] = React.useState<any>(undefined);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('id');
  const [data, setData] = React.useState<any>([]);
  const [searchValue, setSearchValue] = React.useState<string>('');

  const classes = useRowStyles();

  React.useEffect(() => {
    getBikeData();
  }, []);

  const getBikeData = () => {
    bikeSVC
      .getBikes()
      .then((res: any) => {
        //setData(res.data.data.bikes);
        setData(res.data.data.bikes);
      })
      .catch((error: any) => {
        console.log('error: ', error);
      });
  };

  function Row(props: { row: any }) {
    const { row } = props;

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell component="th" scope="row">
            {row.bike_id}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.lat}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.lon}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.vehicle_type}
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };

  const handleSearch = (key: string) => {
    bikeSVC
      .getBike(key)
      .then((res: any) => {
        //setData(res.data.data.bikes);
        setData(res.data.data.bikes);
      })
      .catch((error: any) => {
        console.log('error: ', error);
      });
  };

  const onSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container className={classes.container}>
      <TableContainer component={Paper}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <div className={classes.actions}>
            <Typography className={classes.searchTypo}>{'Search: '}</Typography>
            <TextField placeholder="Bike ID" value={searchValue} onChange={onSearchTextChange} />
            <IconButton
              color="default"
              aria-label="upload picture"
              component="span"
              className={classes.searchButton}
              onClick={() => {
                handleSearch(searchValue);
              }}
            >
              <SearchIcon />
            </IconButton>
          </div>
        </div>

        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'bike_id'}
                  direction={orderBy === 'bike_id' ? order : 'asc'}
                  onClick={createSortHandler('bike_id')}
                >
                  {'Bike ID'}
                  {orderBy === 'bike_id' ? (
                    <span className={classes.order}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'vehicle_type'}
                  direction={orderBy === 'vehicle_type' ? order : 'asc'}
                  onClick={createSortHandler('vehicle_type')}
                >
                  {'Vehicle Type'}
                  {orderBy === 'vehicle_type' ? (
                    <span className={classes.order}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: any) => <Row key={index} row={row} />)}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Container>
  );
}
