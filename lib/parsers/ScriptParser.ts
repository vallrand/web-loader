import { IMaterial, MaterialType } from '../IMaterial'
import { ILoaderModule } from '../Loader'

export const ScriptParser = (scope: any = window): ILoaderModule<string, HTMLScriptElement> =>
function(material: IMaterial<string>): IMaterial<any> | IMaterial<HTMLScriptElement> {
    if(material.type !== MaterialType.SCRIPT) return material
    if(typeof material.data !== 'string') return material

    const executor = new Function(material.data) //eval.call(scope, material.data)
    executor.call(scope)
    return {
        ...material
    }
}