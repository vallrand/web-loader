import { AsyncTask } from '../AsyncTask'
import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

const RESPONSE_TYPE: Record<string, XMLHttpRequestResponseType> = {
    [MaterialType.JSON]: 'json',
    [MaterialType.IMAGE]: 'blob',
    [MaterialType.AUDIO]: 'arraybuffer',
    [MaterialType.XML]: 'document',
    [MaterialType.TEXT]: 'text'
}

export const XHRLoader = (mapper: Record<string, XMLHttpRequestResponseType> = RESPONSE_TYPE): ILoaderModule<any> =>
function(material: IMaterial<any>): IMaterial<any> | AsyncTask<IMaterial<any>> {
    if(material.data) return material
    const task = new AsyncTask<IMaterial<any>>()

    const xhr = new XMLHttpRequest()
    xhr.open('GET', encodeURI(material.path), true)
    xhr.responseType = mapper[material.type as MaterialType] || 'text'

    xhr.onprogress = (event: ProgressEvent) => event.lengthComputable && this.progress(event.loaded / event.total)
    xhr.onreadystatechange = (event: Event) => xhr.readyState === XMLHttpRequest.DONE && (
        xhr.status === 200
        ? task.resolve({
            ...material,
            data: xhr.response
        }) : task.reject(xhr.statusText)
    )
    task.callback(undefined, error => xhr.abort())
    
    xhr.send()
    return task
}