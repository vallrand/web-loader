import { Catch, load, AsyncTask } from '../../lib'

it('handles error thrown from provided module', async function(){
    const mockParser = jest.fn()
    .mockImplementationOnce(function(){ throw 'error' })
    .mockReturnValueOnce(new AsyncTask().reject('exception'))
    .mockImplementation(material => material)

    const errorHandler = jest.fn((error, material) => material)

    await expect(load(
        Catch(mockParser as any, errorHandler),
        ['fileA', 'fileB', 'fileC']
    )).resolves.toEqual([
        { path: 'fileA' },
        { path: 'fileB' },
        { path: 'fileC' }
    ])

    expect(mockParser).toHaveBeenCalledTimes(3)
    expect(mockParser).toHaveBeenNthCalledWith(1, { path: 'fileA' })
    expect(mockParser).toHaveBeenNthCalledWith(2, { path: 'fileB' })
    expect(mockParser).toHaveBeenNthCalledWith(3, { path: 'fileC' })

    expect(errorHandler).toHaveBeenCalledTimes(2)
    expect(errorHandler).toHaveBeenNthCalledWith(1, 'error', { path: 'fileA' })
    expect(errorHandler).toHaveBeenNthCalledWith(2, 'exception', { path: 'fileB' })
})