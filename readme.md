![](https://raw.githubusercontent.com/hongkiulam/threlte-spline/main/.github/screenshots/hero.png)

# threlte-spline

**threlte-spline** is a simple utility that lets you use your [Spline](https://spline.design/) scene with [threlte](https://threlte.xyz/), via the Spline react-three-fiber code export.

This library is heavily inspired by [r3f-spline](https://github.com/splinetool/r3f-spline)

## Install

```bash
yarn add threlte-spline @splinetool/loader @threlte/core
```

or

```bash
npm install threlte-spline @splinetool/loader @threlte/core
```

or

```bash
pnpm add threlte-spline @splinetool/loader @threlte/core
```

`@types/three` is required for Typescript support

## Usage

```jsx
<script lang="ts">
  import { Canvas, T, OrbitControls } from '@threlte/core';
  import { loadSpline } from 'threlte-spline';

  let graph;
  loadSpline('https://prod.spline.design/HwAUoybfBaBCLzwO/scene.spline').then((_graph) => {
    graph = _graph;
  });
</script>

{#if graph}
  <Canvas>
    <T.PerspectiveCamera
      makeDefault
      position={graph.nodes['Camera 1'].position}
      fov={graph.nodes['Camera 1'].fov}
      zoom={graph.nodes['Camera 1'].zoom}
    >
      <OrbitControls />
    </T.PerspectiveCamera>

    <T.Group>
      <T.Mesh
        name="Rectangle"
        geometry={graph.nodes.Rectangle.geometry}
        material={graph.materials['Rectangle Material']}
      />
    </T.Group>
  </Canvas>
{/if}
```

For those more familiar with React hooks naming conventions, this package also exports `useSpline` which is identical to `loadSpline`

## Typescript

Type information should be fairly complete as this package extends `@types/three`, however there may be certain properties which are missing. Feel free to contribute any missing types if you find any.

In the interim, you can extend the types by doing the following

```tsx
<script lang="ts">
  import { Canvas, T, OrbitControls } from '@threlte/core';
  import { loadSpline } from 'threlte-spline';

  type MissingProps = {
    prop1: number;
  }
  let graph: ObjectMap<MissingProps>;
  loadSpline<MissingProps>('https://prod.spline.design/HwAUoybfBaBCLzwO/scene.spline').then((_graph) => {
    graph = _graph;
  });
</script>

{#if graph}
  <Canvas>
    ...
  </Canvas>
{/if}
```

This will add the missing props to `GraphNode`

## Examples

A very rough port of this [r3f-spline example](https://codesandbox.io/s/2giomw?file=/src/Scene.js) can be found [here](https://stackblitz.com/edit/vitejs-vite-uyxmpf?file=src/App.svelte)

> The materials in the example haven't been ported over 100%, but should be enough to prove the library works as intended