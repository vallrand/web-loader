import { AsyncTask } from '../AsyncTask'
import { IMaterial } from '../IMaterial'
import { ILoaderModule, ILoadContext } from '../Loader'

export const Order = (module: ILoaderModule): ILoaderModule => {
    const queue: Array<{ startIndex: number, index: number, start: AsyncTask<void> }> = []
    const progress: number[] = []
    
    return function(this: ILoadContext, material: IMaterial): IMaterial | AsyncTask<IMaterial> {
        const { index, globalIndex } = this
        const item = {
            index,
            startIndex: globalIndex - index,
            start: new AsyncTask<void>()
        }
        const end = item.start.then<IMaterial>(() => module.call(this, material))

        if((progress[item.startIndex] || 0) >= index) item.start.resolve()
        else queue.push(item)

        end.callback(function(){
            const lastIndex = progress[item.startIndex] = (progress[item.startIndex] || 0) + 1
            for(let i = queue.length - 1; i >= 0; i--){
                const task = queue[i]
                if(item.startIndex !== task.startIndex || lastIndex < task.index) continue
                queue.splice(i, 1)
                task.start.resolve() 
            }
        }, function(){
            let index = queue.indexOf(item)
            if(~index) queue.splice(index, 1)
        })

        return end
    }
}