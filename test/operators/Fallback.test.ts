import { Fallback, Chain, load, AsyncTask } from '../../lib'
import { MockModule } from '../Loader.test'

it('loads fallback in case of failure', async function(){
    const mockLoader = jest.fn()
    .mockReturnValueOnce(new AsyncTask().reject('error'))
    .mockResolvedValueOnce({ path: 'loaded', data: 'content' })
    .mockImplementation(material => material)

    const result = await load(Chain([
        Fallback(),
        mockLoader
    ]), [
        ['original', 'fallback']
    ])

    expect(mockLoader).toHaveBeenCalledTimes(3)
    expect(mockLoader).toHaveBeenNthCalledWith(1, { path: 'original' })
    expect(mockLoader).toHaveBeenNthCalledWith(2, { path: 'fallback' })
    expect(mockLoader).toHaveBeenNthCalledWith(3, { path: 'loaded', data: 'content' })
    
    expect(result).toEqual([
        { path: 'loaded', data: 'content' }
    ])
})

it('Cancels loading', async function(){
    const mockParser = MockModule()

    const loading = load(Chain([
        Fallback(),
        mockParser as any
    ]), [
        ['original', 'fallback']
    ])

    expect(mockParser).toHaveBeenCalledWith({ path: 'original' })
    loading.reject('cancel')
    await expect(loading).rejects.toEqual('cancel')
    expect(mockParser.queue.length).toBe(1)
    await expect(mockParser.queue[0]).rejects.toEqual('cancel')
    expect(mockParser).toHaveBeenCalledTimes(1)
})