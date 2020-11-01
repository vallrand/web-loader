import { AsyncTask } from './AsyncTask'
import { IMaterial } from './IMaterial'
import { Progress } from './Progress'

export interface ILoadContext<T = void> {
    readonly globalIndex: number
    readonly index: number
    readonly complete: AsyncTask<IMaterial<T>>
    readonly root: ILoaderModule
    progress(fraction: number): void
}

export type ILoaderModule<T=any,R=T> = (this: ILoadContext<T>, material: IMaterial<T>) =>
IMaterial<R> | AsyncTask<IMaterial<R>> | PromiseLike<IMaterial<R>>

let globalIndex: number = 0

/** Initiate loading
 * @param root main loading module
 * @param materials assets to load
 * @param updateProgress
 */
export function load(
    root: ILoaderModule,
    materials: Array<string | string[] | IMaterial>,
    updateProgress?: (fraction: number) => void
): AsyncTask<IMaterial[]> {
    const progressTracker = Progress(materials.length, updateProgress)
    return AsyncTask.all(materials
        .map<IMaterial>((path: string | string[] | IMaterial) => ((path as IMaterial).path ? path : { path }) as IMaterial)
        .map(function<T>(material: IMaterial<T>, index: number){
            const complete = new AsyncTask<IMaterial<T>>()
            const context: ILoadContext<T> = {
                complete, root,
                index, globalIndex: globalIndex++,
                progress: progressTracker
            }
            complete
            .callback(context.progress.bind(context, 1))
            .resolve(context.root(material))
            return complete
        })
    )
}