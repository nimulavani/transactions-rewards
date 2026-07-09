import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import fetchTransactions from '../api/transactionAPI'

jest.mock('../api/transactionAPI')

jest.mock('../components/transactions', () => ({
	__esModule: true,
	default: ({ transactions = [], loading }) => (
		<div data-testid="transactions-view">
			<span data-testid="transactions-loading">{loading ? 'loading' : 'idle'}</span>
			<span data-testid="transactions-count">{transactions.length}</span>
			<span data-testid="transactions-first-name">{transactions[0]?.customerName || ''}</span>
			<span data-testid="transactions-first-reward">{transactions[0]?.rewardPoints ?? ''}</span>
		</div>
	),
}))

jest.mock('../components/monthlyRewards', () => ({
	__esModule: true,
	default: ({ monthlyTransactionalRewards = [], loading }) => (
		<div data-testid="monthly-view">
			<span data-testid="monthly-loading">{loading ? 'loading' : 'idle'}</span>
			<span data-testid="monthly-count">{monthlyTransactionalRewards.length}</span>
			<span data-testid="monthly-total">{monthlyTransactionalRewards[0]?.totalAmount ?? ''}</span>
		</div>
	),
}))

jest.mock('../components/totalRewards', () => ({
	__esModule: true,
	default: ({ totalTransactionalRewards = [], loading }) => (
		<div data-testid="total-view">
			<span data-testid="total-loading">{loading ? 'loading' : 'idle'}</span>
			<span data-testid="total-count">{totalTransactionalRewards.length}</span>
			<span data-testid="total-reward">{totalTransactionalRewards[0]?.rewardPoints ?? ''}</span>
		</div>
	),
}))

describe('App', () => {
	const transactions = [
		{
			transactionId: 1,
			customerId: 101,
			firstName: 'John',
			lastName: 'Doe',
			purchaseDate: '10-01-2026',
			productPurchased: 'Phone',
			price: 120.5,
		},
		{
			transactionId: 2,
			customerId: 101,
			firstName: 'John',
			lastName: 'Doe',
			purchaseDate: '15-01-2026',
			productPurchased: 'Tablet',
			price: 55,
		},
	]

	beforeEach(() => {
		fetchTransactions.mockResolvedValue(transactions)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	test('renders the app shell and loads transactions on mount', async () => {
		render(<App />)

		expect(screen.getByText('Customer Transactions and Rewards')).toBeInTheDocument()
		expect(screen.getByText('Transactions')).toBeInTheDocument()
		expect(screen.getByText('User monthly rewards')).toBeInTheDocument()
		expect(screen.getByText('Total Rewards')).toBeInTheDocument()

		await waitFor(() => expect(fetchTransactions).toHaveBeenCalledTimes(1))
		await waitFor(() => expect(screen.getByTestId('transactions-loading')).toHaveTextContent('idle'))

		expect(screen.getByTestId('transactions-view')).toBeInTheDocument()
		expect(screen.getByTestId('transactions-count')).toHaveTextContent('2')
		expect(screen.getByTestId('transactions-first-name')).toHaveTextContent('John Doe')
		expect(screen.getByTestId('transactions-first-reward')).toHaveTextContent('90')
	})

	test('switches between monthly and total views and passes derived data', async () => {
		render(<App />)

		await waitFor(() => expect(fetchTransactions).toHaveBeenCalledTimes(1))

		fireEvent.click(screen.getByText('User monthly rewards'))
		expect(screen.getByTestId('monthly-view')).toBeInTheDocument()
		expect(screen.getByTestId('monthly-loading')).toHaveTextContent('idle')
		expect(screen.getByTestId('monthly-count')).toHaveTextContent('1')
		expect(screen.getByTestId('monthly-total')).toHaveTextContent('175')

		fireEvent.click(screen.getByText('Total Rewards'))
		expect(screen.getByTestId('total-view')).toBeInTheDocument()
		expect(screen.getByTestId('total-loading')).toHaveTextContent('idle')
		expect(screen.getByTestId('total-count')).toHaveTextContent('1')
		expect(screen.getByTestId('total-reward')).toHaveTextContent('95')
	})
})
