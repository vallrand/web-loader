import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

const REGEX = {
    [MaterialType.SCRIPT]: /\.js$/i,
    [MaterialType.STYLE]: /\.css$/i,
    [MaterialType.JSON]: /\.json$/i,
    [MaterialType.XML]: /\.(xml|html)$/i,
    [MaterialType.IMAGE]: /\.(png|jpe?g|tiff?|webp|tga|svg)$/i,
    [MaterialType.AUDIO]: /\.(mp3|wav|ogg)$/i,
    [MaterialType.VIDEO]: /\.(mp4|webm|mov)$/i
}

export const TypeDetector = (regex: Record<string, RegExp> = REGEX): ILoaderModule =>
function(material: IMaterial): IMaterial {
    if(!material.type) for(let type in regex)
        if(regex[type].test(material.path))
            return {
                ...material,
                type: type as MaterialType
            }
    return material
}