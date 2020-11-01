import { AsyncTask } from '../AsyncTask'
import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'
import { crossOrigin } from './cors'

export const StylesheetLoader = (head: HTMLHeadElement = document.head): ILoaderModule<void, HTMLLinkElement> =>
function(material: IMaterial<void>): IMaterial<any> | AsyncTask<IMaterial<HTMLLinkElement>> {
    if(material.type !== MaterialType.STYLE || material.data) return material

    const task = new AsyncTask<IMaterial<HTMLLinkElement>>()

    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.type = 'text/css'
    style.crossOrigin = crossOrigin(material.path)

    style.onerror = (error: Event | string) => task.reject(error)
    style.onload = (event: Event) => task.resolve({
        ...material,
        data: style
    })
    task.callback(undefined, error => head.removeChild(style))

    style.href = encodeURI(material.path)
    head.appendChild(style)
    return task
}