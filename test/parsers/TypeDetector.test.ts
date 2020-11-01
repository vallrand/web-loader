import { TypeDetector, load } from '../../lib'

it('detects asset type based on file extension', async function(){
    await expect(load(
        TypeDetector(),
        [
            'asset-store/textures/background.jpg',
            'asset-store/textures/character.png',
            'asset-store/sfx/explosion.mp3',
            'lib/style.css',
            'lib/framework.js',
            'lib/menu.html',
            'lib/settings.json'
        ]
    )).resolves.toEqual([
        { path: 'asset-store/textures/background.jpg', type: 'image' },
        { path: 'asset-store/textures/character.png', type: 'image' },
        { path: 'asset-store/sfx/explosion.mp3', type: 'audio' },
        { path: 'lib/style.css', type: 'style' },
        { path: 'lib/framework.js', type: 'script' },
        { path: 'lib/menu.html', type: 'xml' },
        { path: 'lib/settings.json', type: 'json' }
    ])
})