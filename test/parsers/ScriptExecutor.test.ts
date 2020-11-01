import { ScriptExecutor, load, MaterialType } from '../../lib'

it('runs script in the specified context', async function(){
    const context = {}
    await expect(load(
        ScriptExecutor(context),
        [{ path: 'test', type: MaterialType.SCRIPT, data: 'this.value = 3' }]
    )).resolves.toEqual([
        expect.objectContaining({ path: 'test', type: 'script' })
    ])

    expect(context).toEqual({ value: 3 })
})