export const enum MaterialType {
    TEXT = 'text',
    JSON = 'json',
    XML = 'xml',
    IMAGE = 'image',
    AUDIO = 'audio',
    VIDEO = 'video',
    SCRIPT = 'script',
    STYLE = 'style'
}

export interface IMaterial<T = any> {
    readonly path: string
    readonly consumer?: string
    readonly data: T
    readonly type?: MaterialType
    readonly meta?: any
}