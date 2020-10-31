# Web Loader

> **WARNING**: This project is under development. Current use is not recommended!

Modular asset loader for web applications.

## Table of Contents

- [Installation](#installation)
- [API](#api)
- [Modules](#modules)
  - [Operators](#operators)
  - [Loaders](#loaders)
  - [Parsers](#parsers)

## Installation

With [NPM](https://www.npmjs.com/)
```sh
$ npm install --save-dev
```

## API

```javascript
import {
    load,
    Chain,
    XHRLoader,
    ImageElementLoader,
    WebAudioParser,
    TypeDetector
} from 'web-loader'

load(Chain([
    TypeDetector,
    XHRLoader(),
    ImageElementLoader,
    WebAudioParser(audioContext)
]), [
    'assets/textures/background.jpg',
    'assets/sfx/theme.mp3'
])
.then(assets => {
    //
})
.catch(error => console.error(error))
```

## Modules
Loader is composed out of different modules, each providing it's own functionality.

### Operators
| Module | Example | Description |
| ------ | ------ | ------ |
| Chain | `Chain([ ...modules ])` | Combine multiple loader modules into one. |
| Filter | `Filter(material => true/false, module)` | If block. |
| Store | `Store(internal?)` | Cache. Internal resolve assumes that no additional requests should be made. |
| Throttle | `Throttle(16)(module)` | Limit the number of concurrent requests. |
| Fallback | `Fallback()` | In case of failure will resort to fallbacks if supplied. |
| Order | `Order(module)` | Execute in strict order. |

### Loaders
| Module | Example | Description |
| ------ | ------ | ------ |
| XHRLoader | `XHRLoader()` | Load files using http request. |
| ImageElementLoader | `ImageElementLoader` | Load image into `<img>`. |
| AudioElementLoader | `AudioElementLoader` | Load audio into `<audio>`. |
| StylesheetLoader | `StylesheetLoader()` | Load CSS asynchronously. |
| ScriptLoader | `ScriptLoader()` | Load and execute javascript asynchronously. |

### Parsers
| Module | Example | Description |
| ------ | ------ | ------ |
| TypeDetector | `TypeDetector()` | Detect file extension. |
| JSONParser | `JSONParser` | Parse JSON data. |
| XMLParser | `XMLParser` | Parse XML data. |
| ScriptParser | `ScriptParser()` | Execute script. |
| StylesheetParser | `StylesheetParser()` | Apply CSS. |
| SVGParser | `SVGParser` | Convert SVG to image. |
| WebAudioDecoder | `WebAudioDecoder(audioContext)` | Decode web audio buffer. |
| Base64Unpacker | `Base64Unpacker(material => material.data)` | Unpack base64 encoded assets from json bundle. |