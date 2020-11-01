import { JSONParser, load, MaterialType } from '../../lib'

it('parses json data', async function(){
    await expect(load(
        JSONParser,
        [
            { path: 'fromString', type: MaterialType.JSON, data: '{"name":"PI","value":3.1416}' },
            { path: 'fromJSON',  type: MaterialType.JSON, data: { name: 'TAU', value: 6.283 } },
            //{ path: 'fromBase64', type: MaterialType.JSON, data: 'data:application/json;base64,eyJuYW1lIjoiRSIsInZhbHVlIjoyLjcxOH0=' }
        ]
    )).resolves.toEqual([
        { path: 'fromString', type: 'json', data: { name: 'PI', value: 3.1416 } },
        { path: 'fromJSON', type: 'json', data: { name: 'TAU', value: 6.283 } },
        //{ path: 'fromBase64', type: 'json', data: { name: 'E', value: 2.718 } }
    ])
})