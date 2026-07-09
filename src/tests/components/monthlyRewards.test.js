import { render, screen } from '@testing-library/react'
import MonthlyRewards from '../../components/monthlyRewards'

jest.mock('@mui/x-data-grid', () => ({
	DataGrid: ({ rows = [], columns = [], loading = false }) => (
		<div data-testid="data-grid">
			<span data-testid="row-count">{rows.length}</span>
			<span data-testid="column-count">{columns.length}</span>
			<span data-testid="loading-state">{loading ? 'loading' : 'idle'}</span>
			<span data-testid="column-headers">{columns.map((column) => column.headerName).join('|')}</span>
		</div>
	),
}))

describe('MonthlyRewards', () => {
	const monthlyTransactionalRewards = [
		{
			id: '1-01-2026',
			customerName: 'John Doe',
			month: '01-2026',
			transactions: 2,
			totalAmount: 175.5,
			rewardPoints: 100,
		},
		{
			id: '2-01-2026',
			customerName: 'Jane Smith',
			month: '01-2026',
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

	test('passes rows, columns, and loading state to DataGrid', () => {
		render(<MonthlyRewards monthlyTransactionalRewards={monthlyTransactionalRewards} loading />)

		expect(screen.getByTestId('data-grid')).toBeInTheDocument()
		expect(screen.getByTestId('row-count')).toHaveTextContent('2')
		expect(screen.getByTestId('column-count')).toHaveTextContent('7')
		expect(screen.getByTestId('loading-state')).toHaveTextContent('loading')
	})

	test('defines the expected column headers', () => {
		render(<MonthlyRewards monthlyTransactionalRewards={monthlyTransactionalRewards} loading={false} />)

		expect(screen.getByTestId('column-headers')).toHaveTextContent(
			'Customer ID|Customer Name|Month|Year|Transactions|Total Amount ($)|Reward Points'
		)
	})
})
