import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { isPriceValid } from '../util/util';

const columns = [
    { field: 'transactionId', headerName: 'Transaction ID', width: 120 },

    {
        field: 'customerName',
        headerName: 'Customer Name',
        width: 200
    },
    {
        field: 'purchaseDate',
        headerName: 'Purchase Date',
        width: 150,
        type: 'date',
        valueGetter: (value) => {
            const [dd, mm, yyyy] = value.split('-');
            return new Date(yyyy, mm - 1, dd); // month is 0-indexed in JS Date
        },
        valueFormatter: (value) => {
            if (!value) return '';
            const dd = String(value.getDate()).padStart(2, '0');
            const mm = String(value.getMonth() + 1).padStart(2, '0');
            const yyyy = value.getFullYear();
            return `${dd}-${mm}-${yyyy}`;
        },
    },
    { field: 'productPurchased', headerName: 'Product Purchased', width: 220 },
    {
        field: 'price',
        headerName: 'Price ($)',
        width: 120,
        valueGetter: (value) => {
            return isPriceValid(value) ? value : null;
        },
        valueFormatter: (value) => {
            return isPriceValid(value) ? new Intl.NumberFormat('en-US', {
                style: 'currency', currency: 'USD', maximumFractionDigits: 2,
                roundingMode: 'trunc'
            }).format(value) : "Invalid price";
        },
        cellClassName: (params) => !isPriceValid(params.value) && 'invalid',
        type: 'number',
    },
    {
        field: 'rewardPoints',
        headerName: 'Reward Points',
        width: 120,
        type: 'number',
        valueGetter: (value, row) => {
            return isPriceValid(row.price) ? value : null;
        },
        valueFormatter: (value, row) => {
            return isPriceValid(row.price) ? value : "N/A";
        },
        cellClassName: (params) => !isPriceValid(params.row.price) && 'invalid',
    }
];
const paginationModel = { page: 0, pageSize: 10 };

export default function Transactions({ transactions, loading }) {
    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Transactions
            </Typography>
            <Typography variant="caption" sx={{ mb: 6 }}>
                All transactions with reward points
            </Typography>
            <DataGrid
                rows={transactions}
                columns={columns}
                initialState={{
                    pagination: { paginationModel }, sorting: {
                        sortModel: [{ field: 'purchaseDate', sort: 'desc' }],
                    },
                }}
                sx={{ border: 0 }}
                getRowId={(row) => row.transactionId}
                loading={loading}
                pageSizeOptions={[10, 50, 100]}
            />
        </Box>
    )
}

Transactions.propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape({
        transactionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        customerName: PropTypes.string,
        purchaseDate: PropTypes.string,
        productPurchased: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        rewardPoints: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })),
    loading: PropTypes.bool,
}