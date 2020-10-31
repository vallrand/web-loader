import { AsyncTask, Chain, load } from '../../lib'

it('Calls modules in order with provided asset to parse/load', async function(){
    const mockModuleA = jest.fn(material => material)
    const queueB: AsyncTask<void>[] = []
    const mockModuleB = jest.fn(material => {
        const task = new AsyncTask<void>()
        queueB.push(task)
        return task.then(() => material)
    })
    const mockModuleC = jest.fn(material => material)

    const loadingTask = load(Chain([
        mockModuleA,
        mockModuleB,
        mockModuleC
    ]), [
        'itemA', 'itemB'
    ])

    expect(mockModuleA).toHaveBeenCalledTimes(2)
    expect(mockModuleA).toHaveBeenNthCalledWith(1, expect.objectContaining({ path: 'itemA' }))
    expect(mockModuleA).toHaveBeenNthCalledWith(2, expect.objectContaining({ path: 'itemB' }))

    expect(mockModuleC).not.toHaveBeenCalled()
    queueB[1].resolve()
    expect(mockModuleC).toHaveBeenCalledTimes(1)
    expect(mockModuleC).toHaveBeenNthCalledWith(1, expect.objectContaining({ path: 'itemB' }))
    queueB[0].resolve()

    await expect(loadingTask).resolves.toEqual([
        expect.objectContaining({ path: 'itemA' }),
        expect.objectContaining({ path: 'itemB' })
    ])
})

it('Rejects all in case of a failure', async function(){
    const queueB: AsyncTask<void>[] = []
    const mockModuleB = jest.fn(material => {
        const task = new AsyncTask<void>()
        queueB.push(task)
        return task.then(() => material)
    })
    const queueC: AsyncTask<void>[] = []
    const mockModuleC = jest.fn(material => {
        const task = new AsyncTask<void>()
        queueC.push(task)
        return task.then(() => material)
    })

    const loadingTask = load(Chain([
        mockModuleB,
        mockModuleC
    ]), [
        'itemA', 'itemB'
    ])

    expect(mockModuleC).not.toHaveBeenCalled()
    queueB[0].resolve()
    expect(mockModuleC).toHaveBeenCalledTimes(1)
    expect(mockModuleC).toHaveBeenNthCalledWith(1, expect.objectContaining({ path: 'itemA' }))
    queueC[0].reject('error')

    await expect(loadingTask).rejects.toEqual('error')

    await expect(queueB[1]).rejects.toEqual('error')
    expect(mockModuleC).toHaveBeenCalledTimes(1)
})