import { Chain, load } from '../../lib'
import { MockModule } from '../Loader.test'

it('Calls modules in order with provided asset to parse/load', async function(){
    const mockModuleA = jest.fn(material => material)
    const mockModuleB = MockModule()
    const mockModuleC = jest.fn(material => material)

    const loadingTask = load(Chain([
        mockModuleA,
        mockModuleB as any,
        mockModuleC
    ]), [
        'itemA', 'itemB'
    ])

    expect(mockModuleA).toHaveBeenCalledTimes(2)
    expect(mockModuleA).toHaveBeenNthCalledWith(1, expect.objectContaining({ path: 'itemA' }))
    expect(mockModuleA).toHaveBeenNthCalledWith(2, expect.objectContaining({ path: 'itemB' }))

    expect(mockModuleC).not.toHaveBeenCalled()
    mockModuleB.queue[1].resolve()
    expect(mockModuleC).toHaveBeenCalledTimes(1)
    expect(mockModuleC).toHaveBeenNthCalledWith(1, expect.objectContaining({ path: 'itemB' }))
    mockModuleB.queue[0].resolve()

    await expect(loadingTask).resolves.toEqual([
        expect.objectContaining({ path: 'itemA' }),
        expect.objectContaining({ path: 'itemB' })
    ])
})

it('Rejects all in case of a failure', async function(){
    const mockModuleB = MockModule()
    const mockModuleC = MockModule()

    const loadingTask = load(Chain([
        mockModuleB as any,
        mockModuleC as any
    ]), [
        'itemA', 'itemB'
    ])

    expect(mockModuleC).not.toHaveBeenCalled()
    mockModuleB.queue[0].resolve()
    expect(mockModuleC).toHaveBeenCalledTimes(1)
    expect(mockModuleC).toHaveBeenNthCalledWith(1, expect.objectContaining({ path: 'itemA' }))
    mockModuleC.queue[0].reject('error')

    await expect(loadingTask).rejects.toEqual('error')

    await expect(mockModuleB.queue[1]).rejects.toEqual('error')
    expect(mockModuleC).toHaveBeenCalledTimes(1)
})