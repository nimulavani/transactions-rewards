import { calculateTransactionRewards } from '../../util/rewardCalculation'

describe('calculateTransactionRewards', () => {
	test('returns null for invalid prices', () => {
		expect(calculateTransactionRewards(null)).toBeNull()
		expect(calculateTransactionRewards(undefined)).toBeNull()
		expect(calculateTransactionRewards(NaN)).toBeNull()
		expect(calculateTransactionRewards('100')).toBeNull()
		expect(calculateTransactionRewards(-10)).toBeNull()
	})

	test('returns 0 for prices at or below 50', () => {
		expect(calculateTransactionRewards(0)).toBe(0)
		expect(calculateTransactionRewards(25)).toBe(0)
		expect(calculateTransactionRewards(50)).toBe(0)
	})

	test('returns one point per rupee above 50 up to 100', () => {
		expect(calculateTransactionRewards(51)).toBe(1)
		expect(calculateTransactionRewards(75)).toBe(25)
		expect(calculateTransactionRewards(100)).toBe(50)
	})

	test('returns 50 points plus two points per rupee above 100', () => {
		expect(calculateTransactionRewards(101)).toBe(52)
		expect(calculateTransactionRewards(120)).toBe(90)
		expect(calculateTransactionRewards(150)).toBe(150)
	})

	test('truncates decimal prices before calculating rewards', () => {
		expect(calculateTransactionRewards(50.9)).toBe(0)
		expect(calculateTransactionRewards(75.9)).toBe(25)
		expect(calculateTransactionRewards(120.9)).toBe(90)
	})
})
