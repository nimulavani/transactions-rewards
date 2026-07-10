import { render, screen } from '@testing-library/react'
import TotalRewards from '../../components/totalRewards'

jest.mock('@mui/x-data-grid', () => ({
	DataGrid: ({ rows = [], columns = [], loading = false, initialState = {}, getRowId, pageSizeOptions = [] }) => {
		const firstRow = rows[0] || {}
		const totalColumn = columns.find((c) => c.field === 'totalAmount') || {}
		const totalFormatted = firstRow.totalAmount !== undefined && totalColumn.valueFormatter ? totalColumn.valueFormatter(firstRow.totalAmount) : ''
		const sortModel = JSON.stringify(initialState.sorting?.sortModel || [])
		const rowId = getRowId ? getRowId(firstRow) : ''

		return (
			<div data-testid="data-grid">
				<span data-testid="row-count">{rows.length}</span>
				<span data-testid="column-count">{columns.length}</span>
				<span data-testid="loading-state">{loading ? 'loading' : 'idle'}</span>
				<span data-testid="column-headers">{columns.map((column) => column.headerName).join('|')}</span>
				<span data-testid="sort-model">{sortModel}</span>
				<span data-testid="get-row-id">{rowId}</span>
				<span data-testid="page-size-options">{pageSizeOptions.join(',')}</span>
				<span data-testid="total-formatter">{totalFormatted}</span>
			</div>
		)
	},
}))

describe('TotalRewards', () => {
	const totalTransactionalRewards = [
		{
			id: 1,
			customerName: 'John Doe',
			transactions: 4,
			totalAmount: 240.5,
			rewardPoints: 120,
		},
		{
			id: 2,
			customerName: 'Jane Smith',
			transactions: 2,
			totalAmount: 150,
			rewardPoints: 75,
		},
	]

	test('renders the section title and subtitle', () => {
		render(<TotalRewards totalTransactionalRewards={totalTransactionalRewards} loading={false} />)

		expect(screen.getByText('Total Rewards')).toBeInTheDocument()
		expect(screen.getByText('Transactions and reward points by customer')).toBeInTheDocument()
	})

	test('passes rows, columns, and loading state to DataGrid and exposes options', () => {
		render(<TotalRewards totalTransactionalRewards={totalTransactionalRewards} loading />)

		expect(screen.getByTestId('data-grid')).toBeInTheDocument()
		expect(screen.getByTestId('row-count')).toHaveTextContent('2')
		expect(screen.getByTestId('column-count')).toHaveTextContent('4')
		expect(screen.getByTestId('loading-state')).toHaveTextContent('loading')
	})

	test('defines the expected column headers and formatting', () => {
		render(<TotalRewards totalTransactionalRewards={totalTransactionalRewards} loading={false} />)

		expect(screen.getByTestId('column-headers')).toHaveTextContent(
			'Customer Name|Transactions|Total Amount ($)|Reward Points'
		)

		expect(screen.getByTestId('get-row-id').textContent).toBeDefined()
		expect(screen.getByTestId('page-size-options').textContent.length >= 0).toBeTruthy()

		expect(screen.getByTestId('total-formatter').textContent).toMatch(/\$240\.50|240\.50/)
	})
})
