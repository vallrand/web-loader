import { AsyncTask } from '../AsyncTask'
import { IMaterial } from '../IMaterial'
import { ILoaderModule, ILoadContext } from '../Loader'

/** Higher-Order module. Sequentially executes provided modules. */
export const Chain = (modules: ILoaderModule[]): ILoaderModule =>
function(this: ILoadContext, material: IMaterial): AsyncTask<IMaterial> {
    return modules.reduce(
        (prev: AsyncTask<IMaterial>, next: ILoaderModule): AsyncTask<IMaterial> =>
        prev.then<IMaterial>(material => next.call(this, material)),
        new AsyncTask<IMaterial>().resolve(material)
    )
}