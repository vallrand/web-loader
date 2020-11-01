import { Throttle, load } from '../../lib'
import { MockModule } from '../Loader.test'

it('limits parallel running task amount', async function(){
    const mockParser = MockModule()

    const loading = load(Throttle(2)(mockParser as any), [
        '1', '2', '3', '4'
    ])

    expect(mockParser).toHaveBeenCalledTimes(2)
    expect(mockParser).toHaveBeenNthCalledWith(1, { path: '1' })
    expect(mockParser).toHaveBeenNthCalledWith(2, { path: '2' })

    mockParser.queue[1].resolve()
    expect(mockParser).toHaveBeenCalledTimes(3)
    expect(mockParser).toHaveBeenNthCalledWith(3, { path: '3' })

    mockParser.queue[0].resolve()
    expect(mockParser).toHaveBeenCalledTimes(4)
    expect(mockParser).toHaveBeenNthCalledWith(4, { path: '4' })

    mockParser.queue[2].resolve()
    mockParser.queue[3].resolve()

    await expect(loading).resolves.toEqual([
        { path: '1' }, { path: '2' }, { path: '3' }, { path: '4' }
    ])
})