![](https://raw.githubusercontent.com/hongkiulam/threlte-spline/main/.github/screenshots/hero.png)

# threlte-spline

**threlte-spline** is a simple utility that lets you use your [Spline](https://spline.design/) scene with [Threlte](https://threlte.xyz/), via the Spline react-three-fiber code export.

This library is heavily inspired by [r3f-spline](https://github.com/splinetool/r3f-spline)

![](https://github.com/hongkiulam/threlte-spline/actions/workflows/main.yml/badge.svg)
![](https://github.com/hongkiulam/threlte-spline/actions/workflows/publish.yml/badge.svg)
![](https://img.shields.io/npm/v/threlte-spline?style=plastic)

While this library is written to be used in Threlte, it **can** be used in applications that aren't powered by Threlte. That's because this library simply loads, and returns the Spline scene as Three.js objects.

## Install

```bash
yarn add threlte-spline @splinetool/loader
```

or

```bash
npm install threlte-spline @splinetool/loader
```

or

```bash
pnpm add threlte-spline @splinetool/loader
```

`@types/three` is required for Typescript support

## Usage

```svelte
<script lang="ts">
  import { Canvas, T, OrbitControls } from '@threlte/core';
  import { loadSpline } from 'threlte-spline';

  let scene;
  loadSpline('https://prod.spline.design/HwAUoybfBaBCLzwO/scene.spline').then((_scene) => {
    scene = _scene;
  });
</script>

{#if scene}
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={scene.nodes['Camera 1'].position}
      fov={scene.nodes['Camera 1'].fov}
      zoom={scene.nodes['Camera 1'].zoom}
    >
      <OrbitControls />
    </T.PerspectiveCamera>

    <T.Group>
      <T.Mesh
        name="Rectangle"
        geometry={scene.nodes.Rectangle.geometry}
        material={scene.materials['Rectangle Material']}
      />
    </T.Group>
  </Canvas>
{/if}
```

## Typescript

Type information should be fairly complete as this package extends `@types/three`, however there may be certain properties which are missing. Feel free to contribute any missing types if you find any.

In the interim, you can extend the types by doing the following

```svelte
<script lang="ts">
  import { Canvas, T, OrbitControls } from '@threlte/core';
  import { loadSpline } from 'threlte-spline';

  type MissingProperties = {
    prop1: number;
  }
  let scene: ObjectMap<MissingProperties>;
  loadSpline<MissingProperties>('https://prod.spline.design/HwAUoybfBaBCLzwO/scene.spline').then((_scene) => {
    scene = _scene;
  });
</script>

{#if scene}
  <Canvas>
    ...
  </Canvas>
{/if}
```

This will add the missing props to `SceneNode`

### types-plugin

Register this Vite plugin to fetch more accurate types for your Spline scene

e.g.

```javascript
import { threlteSplineTypesPlugin } from 'threlte-spline/dist/types-plugin';

const viteConfig = {
  ...,
  plugins: [..., threlteSplineTypesPlugin()],
};
```

**Without plugin**
```javascript
scene.nodes
//      ^= { [x: string]: SceneNode }
```

**With plugin**
```javascript
scene.nodes
//      ^= { rectangle: SceneNode, camera: SceneNode }
```

## Examples

<p align="left">
  <a href="https://stackblitz.com/edit/threlte-spline-demo?file=src%2FApp.svelte" target="_blank"><img width="274" src="https://raw.githubusercontent.com/hongkiulam/threlte-spline/main/.github/screenshots/example1.png" /></a>
</p>
