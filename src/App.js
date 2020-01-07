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

// interface Bill {
//     openDate: string,
//     closeDate: string,
//     persons: number,
//     discountPercent: number,
//     discountAmount: number
// }

class SimpleTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 10,
            orderDir: 'asc',
            orderBy: 'closeDate',
            items: [],
            count: 0
        };
    }

    jsonParams = {page: 0,
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

        const {page, size, orderBy, orderDir, items, count} = this.state;
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                key='openDate'
                                sortDirection={orderBy === 'openDate' ? orderDir : false}>
                                <TableSortLabel
                                    key='openDate'
                                    active={orderBy === 'openDate'}
                                    direction={orderBy === 'openDate' ? orderDir : "asc"}
                                    onClick={() => {this.createSortHandler('openDate')}}>
                                    openDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                key='closeDate'
                                align="right"
                                sortDirection={orderBy === 'closeDate' ? orderDir : false}>
                                <TableSortLabel
                                    active={orderBy === 'closeDate'}
                                    direction={orderBy === 'closeDate' ? orderDir : "asc"}
                                    onClick={() => {this.createSortHandler('closeDate')}}>
                                    closeDate
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                key='persons'
                                align="right"
                                sortDirection={orderBy === 'persons' ? orderDir : false}>
                                <TableSortLabel
                                    active={orderBy === 'persons'}
                                    direction={orderBy === 'persons' ? orderDir : "asc"}
                                    onClick={() => {this.createSortHandler('persons')}}>
                                    persons
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                key='discountPercent'
                                align="right"
                                sortDirection={orderBy === 'discountPercent' ? orderDir : false}>
                                <TableSortLabel
                                    active={orderBy === 'discountPercent'}
                                    direction={orderBy === 'discountPercent' ? orderDir : "asc"}
                                    onClick={() => {this.createSortHandler('discountPercent')}}>
                                    discountPercent
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                key='discountAmount'
                                align="right"
                                sortDirection={orderBy === 'discountAmount' ? orderDir : false}>
                                <TableSortLabel
                                    active={orderBy === 'discountAmount'}
                                    direction={orderBy === 'discountAmount' ? orderDir : "asc"}
                                    onClick={() => {this.createSortHandler('discountAmount')}}>
                                    discountAmount
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(row => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.openDate}
                                </TableCell>
                                <TableCell align="right">{row.closeDate}</TableCell>
                                <TableCell align="right">{row.persons}</TableCell>
                                <TableCell align="right">{row.discountPercent}</TableCell>
                                <TableCell align="right">{row.discountAmount}</TableCell>
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
