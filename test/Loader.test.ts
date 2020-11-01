import { load, AsyncTask, ILoaderModule } from '../lib'

export const MockModule = (): jest.Mock<ILoaderModule> & { queue: AsyncTask<void>[] } => {
    const queue: AsyncTask<void>[] = []
    return Object.assign(jest.fn(material => {
        const task = new AsyncTask<void>()
        queue.push(task)
        return task.then(() => material)
    }), { queue }) as any
}

it('runs loader module on all requested assets', async function(){
    const mockModule = jest.fn(material => ({ ...material, flag: true }))
    await expect(load(mockModule, [
        'a', 'b', 'c'
    ])).resolves.toEqual([
        { path: 'a', flag: true },
        { path: 'b', flag: true },
        { path: 'c', flag: true }
    ])

    expect(mockModule).toHaveBeenCalledTimes(3)
    expect(mockModule).toHaveBeenNthCalledWith(1, { path: 'a' })
    expect(mockModule).toHaveBeenNthCalledWith(2, { path: 'b' })
    expect(mockModule).toHaveBeenNthCalledWith(3, { path: 'c' })
})