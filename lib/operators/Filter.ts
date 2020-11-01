import { AsyncTask } from '../AsyncTask'
import { IMaterial } from '../IMaterial'
import { ILoaderModule, ILoadContext } from '../Loader'

/** Higher-Order module. Calls povided module only if condition is met. */
export const Filter = <T>(
    module: ILoaderModule<T>,
    predicate: (material: IMaterial<T>) => boolean
): ILoaderModule<T> =>
function(this: ILoadContext<T>, material: IMaterial<T>): IMaterial<T> | AsyncTask<IMaterial<T>> | PromiseLike<IMaterial<T>> {
    if(!predicate(material)) return material
    return module.call(this, material)
}