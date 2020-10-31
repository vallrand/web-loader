import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

export const XMLParser: ILoaderModule<string, Document> =
function(material: IMaterial<string>): IMaterial<any> {
    if(material.type !== MaterialType.XML || typeof material.data !== 'string') return material
    return {
        ...material,
        data: new DOMParser().parseFromString(material.data, 'text/xml')
    }
}