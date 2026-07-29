import { describe, expect, it } from 'vitest'
import { describeLineDifference } from './learningValidation'

/**
 * Reported from the app: a learner produced
 *
 *   Average: 244.28571428571428
 *
 * where the task wanted
 *
 *   Average: 244.28571428571428 seconds
 *
 * and read the feedback's two quoted strings as identical — reasonably, since they
 * differ by one word at the very end. "Expected X, got Y" only helps when X and Y look
 * different at a glance.
 */
describe('the feedback points at the difference', () => {
  it('names what is missing from the end', () => {
    const message = describeLineDifference('Average: 244.29 seconds', 'Average: 244.29', 'en')
    expect(message).toContain('missing')
    expect(message).toContain(' seconds')
  })

  it('names what is extra at the end', () => {
    const message = describeLineDifference('Total: 1710', 'Total: 1710 seconds', 'en')
    expect(message).toContain('extra')
    expect(message).toContain(' seconds')
  })

  it('shows where two lines diverge in the middle', () => {
    const message = describeLineDifference('Total: 1710 seconds', 'Total: 1700 seconds', 'en')
    expect(message).toContain('Total: 17')
    expect(message).toMatch(/expects "10/)
  })

  it('does not pretend to find a shared prefix when there is none', () => {
    const message = describeLineDifference('Fee: 1600.0', 'Nothing here', 'en')
    expect(message).toContain('Expected a line like')
  })

  it('speaks Portuguese to a Portuguese learner', () => {
    const message = describeLineDifference('Média: 244.29 segundos', 'Média: 244.29', 'pt')
    expect(message).toContain('Falta')
    expect(message).toContain(' segundos')
  })
})
