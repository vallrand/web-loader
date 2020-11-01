import { AsyncTask } from '../AsyncTask'
import { IMaterial } from '../IMaterial'
import { ILoaderModule, ILoadContext } from '../Loader'

/** Higher-Order module. Limits the number of parallel executions. */
export const Throttle = (limit: number) => {
    const queue: AsyncTask<void>[] = []
    let running: number = 0

    function next(){
        if(running >= limit || !queue.length) return
        running++
        const task = queue.shift() as AsyncTask<void>
        task.resolve()
    }

    return (module: ILoaderModule): ILoaderModule =>
    function(this: ILoadContext, material: IMaterial): AsyncTask<IMaterial> {
        const start = new AsyncTask<void>()
        const end = start.then<IMaterial>(() => module.call(this, material))

        function after(){
            let index = queue.indexOf(start)
            if(~index) queue.splice(index, 1)
            else{
                running--
                next()
            }
        }

        end.callback(after, after)

        queue.push(start)
        next()        

        return end
    }
}