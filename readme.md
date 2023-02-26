![](https://raw.githubusercontent.com/hongkiulam/threlte-spline/main/.github/screenshots/hero.png)

# threlte-spline


**threlte-spline** is a simple utility that lets you use your [Spline](https://spline.design/) scene with [threlte](https://threlte.xyz/), via the Spline react-three-fiber code export.

This library is heavily inspired by [r3f-spline](https://github.com/splinetool/r3f-spline)

![](https://github.com/hongkiulam/threlte-spline/actions/workflows/main.yml/badge.svg)
![](https://github.com/hongkiulam/threlte-spline/actions/workflows/publish.yml/badge.svg)
![](https://img.shields.io/npm/v/threlte-spline?style=plastic)

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

```svelte
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

```svelte
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

<p align="left">
  <a href="https://stackblitz.com/edit/threlte-spline-demo?file=src%2FApp.svelte" target="_blank"><img width="274" src="https://raw.githubusercontent.com/hongkiulam/threlte-spline/main/.github/screenshots/example1.png" /></a>
</p>
