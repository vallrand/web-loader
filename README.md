# Web Loader

[![Build](https://github.com/vallrand/web-loader/workflows/publish/badge.svg)](https://github.com/vallrand/web-loader/actions)
[![npm version](https://badge.fury.io/js/@wault%2Fweb-loader.svg)](https://www.npmjs.com/package/@wault/web-loader)

> **WARNING**: This project is under development. Current use is not recommended!

Modular asset loader for web applications.

## Table of Contents

- [Installation](#installation)
- [API](#api)
- [Modules](#modules)
  - [Operators](#operators)
  - [Loaders](#loaders)
  - [Parsers](#parsers)
  - [Custom](#custom)

## Installation

With [NPM](https://www.npmjs.com/)
```sh
$ npm install --save @wault/web-loader
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
} from '@wault/web-loader'

load(Chain([
    TypeDetector,
    XHRLoader(),
    ImageElementLoader,
    WebAudioParser(audioContext)
]), [
    'assets/textures/background.jpg',
    'assets/sfx/theme.mp3'
], progress => console.log(`Loading ${100 * progress}%`))
.then(assets => {
    const image = assets[0].data
    const music = assets[1].data
})
.catch(error => console.error(error))
```

## Modules
Loader is composed out of different modules, each providing it's own functionality.

### Operators
| Module | Example | Description |
| ------ | ------ | ------ |
| Chain | `Chain([ ...modules ])` | `For each` block. |
| Filter | `Filter(module, material => true/false)` | `If` block. |
| Catch | `Catch(module, (error, material) => material)` | `Try catch` block. |
| Throttle | `Throttle(16)(module)` | Limit the number of concurrent requests. |
| Store | `Store(internal?)` | Cache. Internal resolve assumes that no additional requests should be made. |
| Fallback | `Fallback()` | In case of failure will resort to fallbacks if supplied. |
| Order | `Order(module)` | Execute in strict order. |

### Loaders
| Module | Example | Description |
| ------ | ------ | ------ |
| XHRLoader | `XHRLoader()` | Load files using http request. |
| ImageElementLoader | `ImageElementLoader` | Load image into `<img>`. |
| AudioElementLoader | `AudioElementLoader` | Load audio into `<audio>`. |
| ScriptElementLoader | `ScriptElementLoader()` | Load and execute javascript asynchronously into `<script>`. |
| StylesheetLoader | `StylesheetLoader()` | Load CSS asynchronously into `<link>`. |

### Parsers
| Module | Example | Description |
| ------ | ------ | ------ |
| TypeDetector | `TypeDetector()` | Detect file extension. |
| JSONParser | `JSONParser` | Parse JSON data. |
| XMLParser | `XMLParser` | Parse XML data. |
| ScriptExecutor | `ScriptExecutor()` | Execute script. |
| StylesheetParser | `StylesheetParser()` | Apply CSS. |
| SVGParser | `SVGParser` | Convert SVG to image. |
| WebAudioDecoder | `WebAudioDecoder(audioContext)` | Decode web audio buffer. |
| Base64Unpacker | `Base64Unpacker(material => material.data)` | Unpack base64 encoded assets from json bundle. |

### Custom

Any function or async function can be used as a loading module.
```javascript
async function customLoader(material){
    const response = await fetch(material.path)
    const data = await response.json()
    return { ...material, data }
}
```