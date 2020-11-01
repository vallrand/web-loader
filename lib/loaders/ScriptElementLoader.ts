import { AsyncTask } from '../AsyncTask'
import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'
import { crossOrigin } from './cors'

export const ScriptElementLoader = (head: HTMLHeadElement = document.head): ILoaderModule<void, HTMLScriptElement> =>
function(material: IMaterial<void>): IMaterial<any> | AsyncTask<IMaterial<HTMLScriptElement>> {
    if(material.type !== MaterialType.SCRIPT || material.data) return material

    const task = new AsyncTask<IMaterial<HTMLScriptElement>>()

    const script = document.createElement('script')
    script.async = true
    script.crossOrigin = crossOrigin(material.path)

    script.onerror = (error: Event | string) => task.reject(error)
    script.onload = (event: Event) => task.resolve({
        ...material,
        data: script
    })
    task.callback(undefined, error => head.removeChild(script))

    script.src = encodeURI(material.path)
    head.appendChild(script)
    return task
}