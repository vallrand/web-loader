import { AsyncTask } from '../AsyncTask'
import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'
import { crossOrigin } from './cors'

export const AudioElementLoader: ILoaderModule<string | Blob, HTMLAudioElement> =
function(material: IMaterial<string | Blob>): IMaterial<any> | AsyncTask<IMaterial<HTMLAudioElement>> {
    if(material.type !== MaterialType.AUDIO) return material

    const dataURI: string = material.data instanceof Blob
    ? URL.createObjectURL(material.data)
    : material.data || encodeURI(material.path)

    if(!dataURI || typeof dataURI !== 'string') return material

    const task = new AsyncTask<IMaterial<HTMLAudioElement>>()

    const audio = new Audio()
    audio.crossOrigin = crossOrigin(dataURI)
    audio.preload = 'auto'
    audio.onerror = (error: Event | string) => task.reject(error)
    audio.onload = audio.oncanplaythrough = (event: Event) => task.resolve({
        ...material,
        data: audio
    })
    task.callback(undefined, error => audio.src = '')

    audio.src = dataURI
    return task
}