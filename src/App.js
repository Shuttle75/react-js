import React from 'react';
import Axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';

class SimpleTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 10,
            orderDir: 'asc',
            orderBy: 'closeDate',
            columns: ['waiter', 'openDate', 'closeDate', 'persons', 'billAmount'],
            items: [],
            count: 0
        };

    }

    jsonParams = {
        page: 0,
        size: 10,
        sort: null
    };

    componentDidMount() {
        this.getREST(this.jsonParams);
    }

    getREST(params) {
        Axios.get("http://localhost:5000/api/bills", {params})
            .then(res => res.data)
            .then(
                (result) => {
                    this.setState({
                        items: result.content,
                        count: result.totalElements
                    });
                }
            );
    }

    createSortHandler(orderBy) {
        let orderDir = 'asc';
        if (orderBy === this.state.orderBy && this.state.orderDir === 'asc') {
            orderDir = 'desc';
        }
        this.setState({orderBy: orderBy, orderDir: orderDir});
        this.jsonParams.sort = orderBy + ',' + orderDir;
        this.getREST(this.jsonParams);
    };

    handleChangePage = (event: unknown, page: number) => {
        this.setState({page: page});
        this.jsonParams.page = page;
        this.getREST(this.jsonParams);
    };

    handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        let size = parseInt(event.target.value, 10);
        this.setState({page: 0, size: size});
        this.jsonParams.size = size;
        this.getREST(this.jsonParams);
    };

    render() {
        const {page, size, orderBy, orderDir, columns, items, count} = this.state;
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell
                                    key={column}
                                    sortDirection={orderBy === column ? orderDir : false}>
                                    <TableSortLabel
                                        active={orderBy === column}
                                        direction={orderBy === column ? orderDir : "asc"}
                                        onClick={() => {this.createSortHandler(column)}}>
                                        {column}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.waiter.firstName + ' ' + row.waiter.lastName}</TableCell>
                                <TableCell>{row.openDate}</TableCell>
                                <TableCell>{row.closeDate}</TableCell>
                                <TableCell>{row.persons}</TableCell>
                                <TableCell>{row.billAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={count}
                    rowsPerPage={size}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
            </TableContainer>
        )
    }
}

export default SimpleTable;
