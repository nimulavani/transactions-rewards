import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';


const columns = [
    { field: 'customerName', headerName: 'Customer Name', width: 250 },


    {
        field: 'transactions',
        headerName: 'Transactions',
        width: 150,
        type: 'number',
    },
    {
        field: 'totalAmount',
        headerName: 'Total Amount ($)',
        width: 200,
        valueFormatter: (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency', currency: 'USD', maximumFractionDigits: 2,
                roundingMode: 'trunc'
            }).format(value);
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
export default function totalRewards({ totalTransactionalRewards, loading }) {
    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }} >
                Total Rewards
            </Typography>
            <Typography variant="caption" sx={{ mb: 6 }}>
                Transactions and reward points by customer
            </Typography>
            <DataGrid
                rows={totalTransactionalRewards}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                sx={{ border: 0 }}
                getRowId={(row) => row.id}
                loading={loading}
                pageSizeOptions={[5, 10, 20]}
            />
        </Box>
    );
}

totalRewards.propTypes = {
    totalTransactionalRewards: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        customerName: PropTypes.string,
        transactions: PropTypes.number,
        totalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        rewardPoints: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })),
    loading: PropTypes.bool,
}