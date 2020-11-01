import { IMaterial } from '../IMaterial'
import { ILoaderModule, ILoadContext } from '../Loader'

export const Debug = (processing: IMaterial[] = []): ILoaderModule =>
function(this: ILoadContext, material: IMaterial): IMaterial {
    processing.push(material)
    this.complete.callback(function(){
        processing.splice(processing.indexOf(material), 1)
    }, function(){
        processing.splice(processing.indexOf(material), 1)
    })
    return material
}