import { AsyncTask } from '../AsyncTask'
import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'
import { decodeArrayBuffer } from '../converters'

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