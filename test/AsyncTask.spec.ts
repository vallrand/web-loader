import { AsyncTask } from '../lib'

describe('AsyncTask Promise-like behavior', function(){
    it('resolves with first provided value', async function(){
        await expect(
            new AsyncTask<number>()
            .resolve(3)
            .resolve(10)
            .reject('error')
        ).resolves.toBe(3)
    })
    it('rejects with first provided reason', async function(){
        await expect(
            new AsyncTask<number>()
            .reject('error')
            .resolve(10)
            .reject('exception')
        ).rejects.toEqual('error')
    })
    it('resolves Promise-like before returning a value', async function(){
        await expect(
            new AsyncTask<number>()
            .resolve(new AsyncTask<number>().resolve(10))
        ).resolves.toBe(10)

        await expect(
            new AsyncTask<number>()
            .resolve(Promise.resolve(10))
        ).resolves.toBe(10)
    })
    it('resolves values in then', async function(){
        const thenMock = jest.fn().mockReturnValueOnce(25)
        await expect(
            new AsyncTask<void>()
            .resolve()
            .resolve().reject(null)
            .then(thenMock)
        ).resolves.toBe(25)

        expect(thenMock).toHaveBeenCalledTimes(1)
        expect(thenMock).toHaveBeenCalledWith(undefined)
    })
    it('resolves resolved values in then', async function(){
        const thenMock = jest.fn(() => new AsyncTask<number>().resolve(25))

        await expect(
            new AsyncTask<void>()
            .resolve()
            .resolve().reject(null)
            .then(thenMock)
        ).resolves.toBe(25)

        expect(thenMock).toHaveBeenCalledTimes(1)
        expect(thenMock).toHaveBeenCalledWith(undefined)
    })
    it('catches thrown errors in then', async function(){
        await expect(
            new AsyncTask<void>()
            .resolve()
            .then(function(){
                throw 'error'
            })
        ).rejects.toEqual('error')
    })
    it('catches rejected errors in then', async function(){
        await expect(
            new AsyncTask<void>()
            .resolve()
            .then(function(){
                return new AsyncTask<boolean>().reject('error')
            })
        ).rejects.toEqual('error')
    })
    it('rejects a list of tasks if at least one', async function(){
        await expect(AsyncTask.all([
            new AsyncTask<void>(),
            new AsyncTask<void>(),
            new AsyncTask<void>().reject('error')
        ])).rejects.toEqual('error')
    })
    it('resolves a list tasks if all of them are resolved', async function(){
        await expect(AsyncTask.all([
            new AsyncTask<number>().resolve(1),
            new AsyncTask<number>().resolve(2),
            new AsyncTask<number>().resolve(3)
        ])).resolves.toEqual([1,2,3])
    })
})

describe('AsyncTask Cancel behavior', function(){
    it('Calls reject on all chained tasks', async function(){
        const start = new AsyncTask<void>()
        const middle = new AsyncTask<void>()
        const end = start.then(() => middle)

        const onStartReject = jest.fn()
        const onStartResolve = jest.fn()
        const onMiddleReject = jest.fn()
        const onMiddleResolve = jest.fn()
        const onEndReject = jest.fn()
        const onEndResolve = jest.fn()

        start.callback(onStartResolve, onStartReject)
        middle.callback(onMiddleResolve, onMiddleReject)
        end.callback(onEndResolve, onEndReject)

        start.resolve()
        end.reject('cancel')

        expect(onStartReject).not.toHaveBeenCalled()
        expect(onStartResolve).toHaveBeenCalled()

        expect(onMiddleReject).toHaveBeenCalledWith('cancel')
        expect(onMiddleResolve).not.toHaveBeenCalled()

        expect(onEndReject).toHaveBeenCalledWith('cancel')
        expect(onEndResolve).not.toHaveBeenCalled()

        await expect(start).resolves.toBe(undefined)
        await expect(middle).rejects.toEqual('cancel')
        await expect(end).rejects.toEqual('cancel')
    })
    it('Calls reject if at least one fails', async function(){
        const taskA = new AsyncTask<void>()
        const taskB = new AsyncTask<void>()
        const taskC = new AsyncTask<void>().reject('error')

        await expect(AsyncTask.all([
            taskA, taskB, taskC
        ])).rejects.toEqual('error')

        taskA.resolve()
        taskB.reject('exception')

        await expect(taskA).rejects.toEqual('error')
        await expect(taskB).rejects.toEqual('error')
    })
})