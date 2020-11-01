import { Store, Chain, load } from '../../lib'
import { MockModule } from '../Loader.test'

it('caches assets and resolves on duplicate requests', async function(){
    const store = Store(false)
    const mockParser = jest.fn(material => ({ ...material, data: true }))

    await expect(load(
        Chain([ store, mockParser ]),
        ['assets/textures/image.png']
    )).resolves.toEqual([
        { path: 'assets/textures/image.png', data: true }
    ])

    await expect(load(
        Chain([ store, mockParser ]),
        ['assets/textures/image.png']
    )).resolves.toEqual([
        { path: 'assets/textures/image.png', data: true }
    ])

    expect(mockParser).toHaveBeenCalledTimes(2)
    expect(mockParser).toHaveBeenNthCalledWith(1, { path: 'assets/textures/image.png' })
    expect(mockParser).toHaveBeenNthCalledWith(2, { path: 'assets/textures/image.png', data: true })
})

it('resolves internal requests', async function(){
    const store = Store(true)
    const mockParser = jest.fn(material => ({ ...material, data: true }))

    const internalLoading = load(
        Chain([ store, mockParser ]),
        [{ path: 'fileA', consumer: 'fileB', data: null }]
    )

    expect(mockParser).not.toHaveBeenCalled()

    await expect(load(
        Chain([ store, mockParser ]),
        ['fileA']
    )).resolves.toEqual([
        { path: 'fileA', data: true }
    ])

    await expect(internalLoading).resolves.toEqual([
        { path: 'fileA', data: true }
    ])
})