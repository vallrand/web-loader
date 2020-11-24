export function parseDataURI(dataURI: string): {
    data: string
    type: string
    encoding?: string
    subType?: string
}{
    if(dataURI.indexOf('data:') !== 0) return { data: dataURI, type: 'text' }

    const index = dataURI.indexOf(',')
    const metaData = dataURI.substring(0, index)
    const data = dataURI.substring(index + 1)
    const [ mediaType, encoding ] = metaData.replace('data:','').split(';')
    const [ type, subType ] = mediaType.split('/')

    return { data, encoding, type, subType }
}