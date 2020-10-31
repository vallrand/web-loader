import { AsyncTask } from '../AsyncTask'
import { IMaterial } from '../IMaterial'
import { ILoaderModule, ILoadContext } from '../Loader'

export const Filter = <T>(module: ILoaderModule<T>, predicate: (material: IMaterial<T>) => boolean): ILoaderModule =>
function(this: ILoadContext<T>, material: IMaterial<T>): IMaterial<T> | AsyncTask<IMaterial<T>> {
    if(!predicate(material)) return material
    return module.call(this, material)
}