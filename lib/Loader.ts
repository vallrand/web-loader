import { AsyncTask } from './AsyncTask'
import { IMaterial } from './IMaterial'

export interface ILoadContext<T = void> {
    readonly globalIndex: number
    readonly index: number
    readonly complete: AsyncTask<IMaterial<T>>
    readonly root: ILoaderModule
}

export type ILoaderModule<T=any,R=T> = (this: ILoadContext<T>, material: IMaterial<T>) =>
IMaterial<R> | AsyncTask<IMaterial<R>> | PromiseLike<IMaterial<R>>

let globalIndex: number = 0

export const load = (root: ILoaderModule, materials: Array<string | string[] | IMaterial>): AsyncTask<IMaterial[]> =>
AsyncTask.all(materials
    .map<IMaterial>((path: string | string[] | IMaterial) => ((path as IMaterial).path ? path : { path }) as IMaterial)
    .map(function<T>(material: IMaterial<T>, index: number){
        const complete = new AsyncTask<IMaterial<T>>()
        const context: ILoadContext<T> = { complete, root, index, globalIndex: globalIndex++ }
        complete.resolve(context.root(material))
        return complete
    })
)