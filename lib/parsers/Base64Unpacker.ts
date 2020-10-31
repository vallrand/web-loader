import { AsyncTask } from '../AsyncTask'
import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule, ILoadContext, load } from '../Loader'

export const Base64Unpacker = (extractor: (material: IMaterial<any>) => Record<string, string> | undefined): ILoaderModule<any, IMaterial[]> =>
function(this: ILoadContext, material: IMaterial<object>): IMaterial<any> | AsyncTask<IMaterial<IMaterial[]>> {
    if(material.type !== MaterialType.JSON || !material.data) return material
    const materials = extractor(material)
    if(!materials) return material

    return load(this.root, Object.keys(materials).map<IMaterial<any>>(path => {
        const dataURI = materials[path]

        if(typeof dataURI !== 'string') return { path, data: dataURI }
        
        const [ metaData, data ] = dataURI.split(',')
        const [ mediaType, encoding ] = metaData.replace('data:','').split(';')
        const [ type, subType ] = mediaType.split('/')

        switch(type){
            case 'image': return { path, data: dataURI, type: MaterialType.IMAGE }
            case 'audio': return { path, data: dataURI, type: MaterialType.AUDIO }
            case 'text': 
                if(subType === 'html' || subType === 'xml')
                    return { path, data, type: MaterialType.XML }
                else
                    return { path, data, type: MaterialType.TEXT }
            default: throw new Error(`Unrecognized base64 type: "${metaData}".`)
        }
    })).then(materials => ({
        ...material,
        data: materials
    }))
}