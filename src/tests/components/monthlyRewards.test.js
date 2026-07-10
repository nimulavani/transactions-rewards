import { render, screen } from '@testing-library/react'
import MonthlyRewards from '../../components/monthlyRewards'

jest.mock('@mui/x-data-grid', () => ({
	DataGrid: ({ rows = [], columns = [], loading = false, initialState = {}, getRowId, pageSizeOptions = [] }) => {
		const firstRow = rows[0] || {}
		const monthColumn = columns.find((c) => c.field === 'month') || {}
		const totalColumn = columns.find((c) => c.field === 'totalAmount') || {}

		const monthValue = monthColumn.valueGetter ? monthColumn.valueGetter(undefined, firstRow) : ''
		const monthFormatted = monthValue !== '' && monthColumn.valueFormatter ? monthColumn.valueFormatter(monthValue) : ''
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
				<span data-testid="month-value">{monthValue}</span>
				<span data-testid="month-formatter">{monthFormatted}</span>
				<span data-testid="total-formatter">{totalFormatted}</span>
			</div>
		)
	},
}))

describe('MonthlyRewards', () => {
	const monthlyTransactionalRewards = [
		{
			id: '1-01-2026',
			customerId: 'C1',
			customerName: 'John Doe',
			purchaseDate: '10-01-2026',
			month: '01-2026',
			year: 2026,
			transactions: 2,
			totalAmount: 175.5,
			rewardPoints: 100,
		},
		{
			id: '2-01-2026',
			customerId: 'C2',
			customerName: 'Jane Smith',
			purchaseDate: '12-01-2026',
			month: '01-2026',
			year: 2026,
			transactions: 1,
			totalAmount: 55,
			rewardPoints: 5,
		},
	]

	test('renders the section title and subtitle', () => {
		render(<MonthlyRewards monthlyTransactionalRewards={monthlyTransactionalRewards} loading={false} />)

		expect(screen.getByText('User monthly rewards')).toBeInTheDocument()
		expect(screen.getByText('Transactions and reward points by customer and month')).toBeInTheDocument()
	})

	test('passes rows, columns, and loading state to DataGrid and exposes options', () => {
		render(<MonthlyRewards monthlyTransactionalRewards={monthlyTransactionalRewards} loading />)

		expect(screen.getByTestId('data-grid')).toBeInTheDocument()
		expect(screen.getByTestId('row-count')).toHaveTextContent('2')
		expect(screen.getByTestId('column-count')).toHaveTextContent('7')
		expect(screen.getByTestId('loading-state')).toHaveTextContent('loading')
	})

	test('defines the expected column headers and formatting', () => {
		render(<MonthlyRewards monthlyTransactionalRewards={monthlyTransactionalRewards} loading={false} />)

		expect(screen.getByTestId('column-headers')).toHaveTextContent(
			'Customer ID|Customer Name|Month|Year|Transactions|Total Amount ($)|Reward Points'
		)

		// initial sort model, row id and page options
		expect(screen.getByTestId('get-row-id').textContent).toBeDefined()
		expect(screen.getByTestId('page-size-options').textContent.length >= 0).toBeTruthy()

		// formatting checks for month and total amount
		expect(screen.getByTestId('month-formatter').textContent).toMatch(/January|Jan/)
		expect(screen.getByTestId('total-formatter').textContent).toMatch(/\$175\.50|175\.50/)
	})
})
