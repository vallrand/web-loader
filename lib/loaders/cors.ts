export function crossOrigin(url: string): 'anonymous' | '' {
    if(origin !== location.origin) return 'anonymous'
    if(url.indexOf('data:') === 0) return ''

    const link = document.createElement('a')
    link.href = url

    return (
        link.origin === location.origin ||
        (
            link.protocol === location.protocol &&
            link.hostname === location.hostname &&
            link.port === location.port
        )
    ) ? '' : 'anonymous'
}