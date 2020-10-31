import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

export const SVGParser: ILoaderModule =
function(material: IMaterial<Document>): IMaterial<any> {
    if(material.type !== MaterialType.XML && !(material.data instanceof Document)) return material
    const root = material.data.firstElementChild as Element
    if(root.tagName.toLowerCase() !== 'svg') return material

    const xml = new XMLSerializer().serializeToString(root)
    return {
        ...material,
        type: MaterialType.IMAGE,
        data: `data:image/svg+xml;base64,${btoa(xml)}`
    }
}