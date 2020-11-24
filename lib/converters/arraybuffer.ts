import { AsyncTask } from '../AsyncTask'

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
        const base64= data.substring(data.indexOf(',') + 1)
        const bytes = atob(base64)
        const view = new Uint8Array(bytes.length)
        for(let i = 0; i < view.length; view[i] = bytes.charCodeAt(i++));
        done.resolve(view.buffer)
    }else done.reject(null)
    return done
}
