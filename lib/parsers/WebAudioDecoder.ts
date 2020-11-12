import { AsyncTask } from '../AsyncTask'
import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

export function decodeArrayBuffer(data: Blob | string): AsyncTask<ArrayBuffer> {
    const done = new AsyncTask<ArrayBuffer>()
    if(data instanceof ArrayBuffer)
        done.resolve(data)
    else if(data instanceof Blob){
        const reader = new FileReader()
        reader.onerror = done.reject
        reader.onload = (event: ProgressEvent<FileReader>) => done.resolve(reader.result as ArrayBuffer)
        reader.readAsArrayBuffer(data)
    }else if(data.indexOf('data:') === 0){
        const [ metaData, base64 ] = data.split(',')
        const bytes = atob(base64)
        const view = new Uint8Array(bytes.length)
        for(let i = 0; i < view.length; view[i] = bytes.charCodeAt(i++));
        done.resolve(view.buffer)
    }else done.reject(null)
    return done
}

export const WebAudioDecoder = (audioContext: AudioContext): ILoaderModule<string | Blob, AudioBuffer> =>
function(material: IMaterial<string | Blob>): IMaterial | AsyncTask<IMaterial> | AsyncTask<IMaterial<AudioBuffer>> {
    if(material.type !== MaterialType.AUDIO) return material

    return decodeArrayBuffer(material.data).then(function(buffer: ArrayBuffer){
        const task = new AsyncTask<IMaterial>()

        audioContext.decodeAudioData(buffer, function(buffer: AudioBuffer){
            task.resolve({
                ...material,
                data: buffer
            })
        }, task.reject)
    
        return task
    }, error => material)    
}