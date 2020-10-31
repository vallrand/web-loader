import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

export const JSONParser: ILoaderModule<string, object> =
function(material: IMaterial<string>): IMaterial<any> {
    if(material.type !== MaterialType.JSON || typeof material.data !== 'string') return material
    return {
        ...material,
        data: JSON.parse(material.data)
    }
}