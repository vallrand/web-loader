import { AsyncTask } from '../AsyncTask'
import { IMaterial } from '../IMaterial'
import { ILoaderModule, ILoadContext } from '../Loader'

export const Store = (internal: boolean): ILoaderModule => {
    const storage: Record<string, AsyncTask<IMaterial>> = Object.create(null)
    const pending: Record<string, boolean> = Object.create(null)
    return function handle(this: ILoadContext, material: IMaterial): IMaterial | AsyncTask<IMaterial> {
        if(!storage[material.path])
            storage[material.path] = new AsyncTask<IMaterial>().callback(undefined, error => {
                pending[material.path] = false
                delete storage[material.path]
            })

        if(pending[material.path] || internal && material.consumer){
            const complete = new AsyncTask<IMaterial>()
            storage[material.path].callback(complete.resolve, error => 
                complete.resolve(handle.call(this, material))
            )
            return complete
        }else{
            pending[material.path] = true
            if(storage[material.path]) storage[material.path].resolve(this.complete)
            return material
        }
    }
}