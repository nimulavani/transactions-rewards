export default async function fetchTransactions() {
  try {
    const response = await fetch('/transactions.json')

    if (!response.ok) {
      throw new Error(`transactions.json request failed with HTTP ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new Error('transactions.json must contain an array of transactions')
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to load transactions: ${error.message}`)
    }

    throw new Error('Unable to load transactions: unknown error')
  }
}