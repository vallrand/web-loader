import { AsyncTask } from '../AsyncTask'
import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

export function decodeArrayBuffer(data: Blob | string): AsyncTask<ArrayBuffer> {
    const done = new AsyncTask<ArrayBuffer>()
    if(data instanceof Blob){
        const reader = new FileReader()
        reader.onerror = done.reject
        reader.onload = (event: ProgressEvent<FileReader>) => done.resolve(reader.result as ArrayBuffer)
        reader.readAsArrayBuffer(data)
    }else{
        const [ metaData, base64 ] = data.split(',')
        const bytes = atob(base64)
        const view = new Uint8Array(bytes.length)
        for(let i = 0; i < view.length; view[i] = bytes.charCodeAt(i++));
        done.resolve(view.buffer)
    }
	//if already arraybuffer/view return otherwise throw error
    return done
}

export const WebAudioDecoder = (audioContext: AudioContext): ILoaderModule<string | Blob, AudioBuffer> =>
function(material: IMaterial<string | Blob>): IMaterial | AsyncTask<IMaterial<AudioBuffer>> {
    if(material.type !== MaterialType.AUDIO) return material
    else if(typeof material.data !== 'string' && !(material.data instanceof Blob)) return material

    return decodeArrayBuffer(material.data).then(function(buffer: ArrayBuffer){
        const task = new AsyncTask<IMaterial>()

        audioContext.decodeAudioData(buffer, function(buffer: AudioBuffer){
            task.resolve({
                ...material,
                data: buffer
            })
        }, task.reject)
    
        return task
    })    
}