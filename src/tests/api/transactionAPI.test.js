import fetchTransactions from '../../api/transactionAPI'

describe('fetchTransactions', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    test('returns transactions when the request succeeds with an array payload', async () => {
        const transactions = [
            {
                "transactionId": "TXN002",
                "customerId": "CUST013",
                "firstName": "Karthik",
                "lastName": "Pillai",
                "productPurchased": "Monitor Arm",
                "purchaseDate": "01-04-2026",
                "price": 75
            },
            {
                "transactionId": "TXN003",
                "customerId": "CUST012",
                "firstName": "Pooja",
                "lastName": "Gupta",
                "productPurchased": "Webcam",
                "purchaseDate": "01-04-2026",
                "price": 200.43
            }
        ]

        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(transactions),
        })

        await expect(fetchTransactions()).resolves.toEqual(transactions)
        expect(global.fetch).toHaveBeenCalledWith('/transactions.json')
    })

    test('throws a wrapped error when the response is not ok', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: jest.fn(),
        })

        await expect(fetchTransactions()).rejects.toThrow(
            'Unable to load transactions: transactions.json request failed with HTTP 500'
        )
    })

    test('throws a wrapped error when the payload is not an array', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({ message: 'invalid data' }),
        })

        await expect(fetchTransactions()).rejects.toThrow(
            'Unable to load transactions: transactions.json must contain an array of transactions'
        )
    })

    test('throws a wrapped error when fetch rejects', async () => {
        global.fetch.mockRejectedValue(new Error('Network failure'))

        await expect(fetchTransactions()).rejects.toThrow(
            'Unable to load transactions: Network failure'
        )
    })

    test('throws an unknown error wrapper for non-Error throws', async () => {
        global.fetch.mockImplementation(() => {
            throw 'boom'
        })

        await expect(fetchTransactions()).rejects.toThrow(
            'Unable to load transactions: unknown error'
        )
    })
})