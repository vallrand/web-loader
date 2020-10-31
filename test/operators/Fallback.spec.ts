import { AsyncTask } from '../../lib'
import { Fallback, Chain, load } from '../../lib'

it('loads fallback in case of failure', async function(){
    const fallbackModule = Fallback()
    const mockLoader = jest.fn()
    .mockReturnValueOnce(new AsyncTask().reject('error'))
    .mockResolvedValueOnce({ path: 'loaded', data: 'content' })
    .mockImplementation(material => material)

    const result = await load(Chain([
        fallbackModule,
        mockLoader
    ]), [
        ['original', 'fallback']
    ])

    expect(mockLoader).toHaveBeenCalledTimes(3)
    expect(mockLoader).toHaveBeenNthCalledWith(1, expect.objectContaining({ path: 'original' }))
    expect(mockLoader).toHaveBeenNthCalledWith(2, expect.objectContaining({ path: 'fallback' }))
    expect(mockLoader).toHaveBeenNthCalledWith(3, expect.objectContaining({ path: 'loaded', data: 'content' }))
    
    expect(result).toEqual([
        expect.objectContaining({ path: 'loaded', data: 'content' })
    ])
})