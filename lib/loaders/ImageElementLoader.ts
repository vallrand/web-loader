import { AsyncTask } from '../AsyncTask'
import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

export const ImageElementLoader: ILoaderModule<string | Blob, HTMLImageElement> =
function(material: IMaterial<string | Blob>): IMaterial<any> | AsyncTask<IMaterial<HTMLImageElement>> {
    if(material.type !== MaterialType.IMAGE) return material

    const dataURI: string = material.data instanceof Blob
    ? URL.createObjectURL(material.data)
    : material.data || encodeURI(material.path)

    if(!dataURI || typeof dataURI !== 'string') return material

    const task = new AsyncTask<IMaterial<HTMLImageElement>>()

    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onerror = (error: Event | string) => task.reject(error)
    image.onload = (event: Event) => task.resolve({
        ...material,
        data: image
    })
    task.callback(undefined, error => image.src = '')

    image.src = dataURI
    return task
}