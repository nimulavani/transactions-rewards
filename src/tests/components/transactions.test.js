import { render, screen } from '@testing-library/react'
import Transactions from '../../components/transactions'

jest.mock('@mui/x-data-grid', () => ({
	DataGrid: ({ rows = [], columns = [], loading = false, initialState = {}, getRowId, pageSizeOptions = [] }) => {
		const firstRow = rows[0] || {}
		const dateColumn = columns[2] || {}
		const priceColumn = columns[4] || {}
		const rewardColumn = columns[5] || {}

		const dateValue = firstRow.purchaseDate ? dateColumn.valueGetter(firstRow.purchaseDate) : ''
		const dateFormatter = dateValue ? dateColumn.valueFormatter(dateValue) : ''
		const priceFormatter = firstRow.price !== undefined ? priceColumn.valueFormatter(firstRow.price, firstRow) : ''
		const rewardFormatter = firstRow.rewardPoints !== undefined ? rewardColumn.valueFormatter(firstRow.rewardPoints, firstRow) : ''
		const priceCellClassName = priceColumn.cellClassName ? priceColumn.cellClassName({ value: firstRow.price, row: firstRow }) : ''
		const rewardCellClassName = rewardColumn.cellClassName ? rewardColumn.cellClassName({ value: firstRow.rewardPoints, row: firstRow }) : ''
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
				<span data-testid="purchase-date-value">{dateValue ? dateValue.toISOString() : ''}</span>
				<span data-testid="purchase-date-formatter">{dateFormatter}</span>
				<span data-testid="price-formatter">{priceFormatter}</span>
				<span data-testid="reward-formatter">{rewardFormatter}</span>
				<span data-testid="price-cell-classname">{priceCellClassName}</span>
				<span data-testid="reward-cell-classname">{rewardCellClassName}</span>
			</div>
		)
	},
}))

describe('Transactions', () => {
	const transactions = [
		{
			transactionId: 1,
			customerName: 'John Doe',
			purchaseDate: '10-01-2026',
			productPurchased: 'Phone',
			price: 120.5,
			rewardPoints: 91,
		},
		{
			transactionId: 2,
			customerName: 'Jane Smith',
			purchaseDate: '12-01-2026',
			productPurchased: 'Tablet',
			price: 55,
			rewardPoints: 5,
		},
	]

	test('renders the section title and subtitle', () => {
		render(<Transactions transactions={transactions} loading={false} />)

		expect(screen.getByText('Transactions')).toBeInTheDocument()
		expect(screen.getByText('All transactions with reward points')).toBeInTheDocument()
	})

	test('passes rows, columns, and loading state to DataGrid', () => {
		render(<Transactions transactions={transactions} loading />)

		expect(screen.getByTestId('data-grid')).toBeInTheDocument()
		expect(screen.getByTestId('row-count')).toHaveTextContent('2')
		expect(screen.getByTestId('column-count')).toHaveTextContent('6')
		expect(screen.getByTestId('loading-state')).toHaveTextContent('loading')
	})

	test('defines the expected column headers', () => {
		render(<Transactions transactions={transactions} loading={false} />)

		expect(screen.getByTestId('column-headers')).toHaveTextContent(
			'Transaction ID|Customer Name|Purchase Date|Product Purchased|Price ($)|Reward Points'
		)
	})

	test('passes initial state, row id, and page options to DataGrid', () => {
		render(<Transactions transactions={[transactions[0]]} loading={false} />)

		expect(screen.getByTestId('get-row-id')).toHaveTextContent('1')
		expect(screen.getByTestId('page-size-options')).toHaveTextContent('10')
	})

	test('formats purchase date values using column getters and formatters', () => {
		render(<Transactions transactions={[transactions[0]]} loading={false} />)

		expect(screen.getByTestId('purchase-date-formatter')).toHaveTextContent('10-01-2026')
	})

	test('marks invalid price rows and formats invalid values', () => {
		const invalidTransactions = [
			{
				transactionId: 3,
				customerName: 'Invalid Customer',
				purchaseDate: '15-02-2026',
				productPurchased: 'Gadget',
				price: -10,
				rewardPoints: 15,
			},
		]

		render(<Transactions transactions={invalidTransactions} loading={false} />)

		expect(screen.getByTestId('price-formatter')).toHaveTextContent('Invalid price')
		expect(screen.getByTestId('reward-formatter')).toHaveTextContent('N/A')
		expect(screen.getByTestId('price-cell-classname')).toHaveTextContent('invalid')
		expect(screen.getByTestId('reward-cell-classname')).toHaveTextContent('invalid')
	})
})
