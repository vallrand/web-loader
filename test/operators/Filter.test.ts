import { Filter, load } from '../../lib'

it('calls provided module only if condition is met', async function(){
    const mockParser = jest.fn(material => material)

    await expect(load(
        Filter(mockParser as any, material => /pass/.test(material.path)),
        ['pass-1', 'ignore-2', 'pass-3']
    )).resolves.toEqual([
        { path: 'pass-1' },
        { path: 'ignore-2' },
        { path: 'pass-3' }
    ])

    expect(mockParser).toHaveBeenCalledTimes(2)
    expect(mockParser).toHaveBeenNthCalledWith(1, { path: 'pass-1' })
    expect(mockParser).toHaveBeenNthCalledWith(2, { path: 'pass-3' })
})