import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function CustomizedTables({ content }) {
    return (

        <TableContainer style={{ height: "90vh" }} component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Candidate ID</StyledTableCell>
                        <StyledTableCell align='right'>FIO</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {content && content.map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell style={{ fontSize: "1.5rem", fontStyle: "italic" }} component="th" scope="row">
                                {row.id}
                            </StyledTableCell>
                            <StyledTableCell align='right' component="th" scope="row">
                                {row.candidate}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}