import { Base64Unpacker, Chain, load, AsyncTask, MaterialType } from '../../lib'

it('unpacks assets from json bundles', async function(){
    const unpacker = Base64Unpacker(material => /bundle/.test(material.path) && material.data)
    const mockModule = jest.fn(material => material)

    await expect(load(
        Chain([
            unpacker,
            mockModule
        ]),
        [{
            type: MaterialType.JSON,
            path: 'bundle.json',
            data: {
                text: 'Some text',
                json: { width: 1024, height: 2048 },
                audio: 'data:audio/mpeg;base64,audiodata',
                image: 'data:image/png;base64,imagedata',
                xml: 'data:text/html;charset=UTF-8,htmldata'
            }
        }]
    )).resolves.toEqual([{
        type: 'json',
        path: 'bundle.json',
        data: [
            { type: 'text', path: 'text', data: 'Some text' },
            { type: 'json', path: 'json', data: { width: 1024, height: 2048 } },
            { type: 'audio', path: 'audio', data: 'data:audio/mpeg;base64,audiodata' },
            { type: 'image', path: 'image', data: 'data:image/png;base64,imagedata' },
            { type: 'xml', path: 'xml', data: 'htmldata' }
        ]
    }])

    expect(mockModule).toHaveBeenCalledTimes(6)
    expect(mockModule).toHaveBeenNthCalledWith(1, { type: 'text', path: 'text', data: 'Some text' })
    expect(mockModule).toHaveBeenNthCalledWith(2, { type: 'json', path: 'json', data: { width: 1024, height: 2048 } })
    expect(mockModule).toHaveBeenNthCalledWith(3, { type: 'audio', path: 'audio', data: 'data:audio/mpeg;base64,audiodata' })
    expect(mockModule).toHaveBeenNthCalledWith(4, { type: 'image', path: 'image', data: 'data:image/png;base64,imagedata' })
    expect(mockModule).toHaveBeenNthCalledWith(5, { type: 'xml', path: 'xml', data: 'htmldata' })
})