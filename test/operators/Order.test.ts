import { Order, Chain, load } from '../../lib'
import { MockModule } from '../Loader.test'

it('provies materials in the correct order', async function(){
    const mockLoader = MockModule()
    const mockParser = MockModule()

    const loading = load(Chain([
        mockLoader as any,
        Order(mockParser as any)
    ]), [
        '1', '2', '3'
    ])

    expect(mockParser).not.toHaveBeenCalled()
    expect(mockLoader.queue.length).toBe(3)

    mockLoader.queue[1].resolve()
    expect(mockParser).not.toHaveBeenCalled()

    mockLoader.queue[0].resolve()
    expect(mockParser).toHaveBeenCalledTimes(1)
    mockParser.queue[0].resolve()
    mockLoader.queue[2].resolve()
    expect(mockParser).toHaveBeenCalledTimes(2)
    mockParser.queue[1].resolve()
    mockParser.queue[2].resolve()

    await expect(loading).resolves.toEqual([
        { path: '1' },
        { path: '2' },
        { path: '3' }
    ])

    expect(mockParser).toHaveBeenCalledTimes(3)
    expect(mockParser).toHaveBeenNthCalledWith(1, { path: '1' })
    expect(mockParser).toHaveBeenNthCalledWith(2, { path: '2' })
    expect(mockParser).toHaveBeenNthCalledWith(3, { path: '3' })
})