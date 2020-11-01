import { AsyncTask } from '../AsyncTask'
import { IMaterial } from '../IMaterial'
import { ILoaderModule, ILoadContext } from '../Loader'

/** Higher-Order module. Handles errors. */
export const Catch = <T>(
    module: ILoaderModule<T>,
    errorHandler: (error: any, material: IMaterial<T>) => IMaterial<T> = (error, material) => material
): ILoaderModule<T> =>
function(this: ILoadContext<T>, material: IMaterial<T>): IMaterial<T> | AsyncTask<IMaterial<T>> | PromiseLike<IMaterial<T>> {
    return new AsyncTask<IMaterial<T>>()
    .resolve(material)
    .then(material => module.call(this, material))
    .catch(error => errorHandler(error, material))
}