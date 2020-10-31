import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

export const StylesheetParser = (head: HTMLHeadElement = document.head): ILoaderModule<string, HTMLStyleElement> =>
function(material: IMaterial<string>): IMaterial<any> | IMaterial<HTMLStyleElement> {
    if(material.type !== MaterialType.STYLE) return material
    if(typeof material.data !== 'string') return material

    const style = document.createElement('style')
    style.innerHTML = material.data as string
    head.appendChild(style)
    return {
        ...material,
        data: style
    }
}