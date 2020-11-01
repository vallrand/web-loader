import { AsyncTask } from '../AsyncTask'
import { IMaterial } from '../IMaterial'
import { ILoaderModule, ILoadContext, load } from '../Loader'

export const Fallback = (
    extract: (material: IMaterial) => string[] | void = function(material: IMaterial){
        if(Array.isArray(material.path)) return material.path
    }
): ILoaderModule =>
function(this: ILoadContext, material: IMaterial){
    const fallbacks = extract(material)
    if(!fallbacks || !fallbacks.length) return material
    else if(fallbacks.length == 1) return { ...material, path: fallbacks[0] }

    const task = new AsyncTask<IMaterial>()

    const tryNext = (path: string) => {
        const loading = load(this.root, [path], this.progress.bind(this))
        task.callback(undefined, error => {
            fallbacks.length = 0
            loading.reject(error)
        })
        loading.callback(materials => task.resolve(materials[0]), error => {
            if(fallbacks.length) tryNext(fallbacks.shift() as string)
            else task.reject(error)
        })
    }
    tryNext(fallbacks.shift() as string)
    return task
}