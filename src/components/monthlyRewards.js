import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';


const columns = [
    { field: 'customerId', headerName: 'Customer ID', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 150 },

    {
        field: 'month',
        headerName: 'Month',
        width: 100,
        valueGetter: (value, row) => {
            const [dd, mm, yyyy] = row.purchaseDate.split('-');
            return new Date(yyyy, mm - 1, dd).getMonth();
        },
        valueFormatter: (value) => {
            return new Date(2000, value, 1).toLocaleString('en-US', { month: 'long' });
        },
    },
    {
        field: 'year',
        headerName: 'Year',
        width: 100,
        type: 'number',
    },
    {
        field: 'transactions',
        headerName: 'Transactions',
        width: 100,
        type: 'number',
    },
    {
        field: 'totalAmount',
        headerName: 'Total Amount ($)',
        width: 150,
        valueFormatter: (value) => {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        },
        type: 'number',
    },
    {
        field: 'rewardPoints',
        headerName: 'Reward Points',
        width: 200,
        align: 'right',
        headerAlign: 'right',
    }
];
const paginationModel = { page: 0, pageSize: 10 };

export default function monthlyRewards({ monthlyTransactionalRewards, loading }) {
    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }} >
                User monthly rewards
            </Typography>
            <Typography variant="caption" sx={{ mb: 6 }}>
                Transactions and reward points by customer and month
            </Typography>
            <DataGrid
                rows={monthlyTransactionalRewards}
                columns={columns}
                initialState={{
                    pagination: { paginationModel }, sorting: {
                        sortModel: [{ field: 'month', sort: 'desc' }],
                    },
                }}
                sx={{ border: 0 }}
                getRowId={(row) => row.id}
                loading={loading}
                pageSizeOptions={[5, 10, 20]}
            />
        </Box>
    );
}

monthlyRewards.propTypes = {
    monthlyTransactionalRewards: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        customerName: PropTypes.string,
        month: PropTypes.string,
        transactions: PropTypes.number,
        totalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        rewardPoints: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })),
    loading: PropTypes.bool,
}