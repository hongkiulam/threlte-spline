import type {
  Vector3,
  Material,
  Object3D,
  ColorRepresentation,
  Euler,
  DirectionalLightShadow,
  BufferGeometry,
} from 'three';

type Object3DOverrides = {
  position: [x: number, y: number, z: number];
  rotation: [x: number, y: number, z: number];
  scale: [x: number, y: number, z: number];

  // camera
  fov: number;
  zoom: number;
  // lights
  color: ColorRepresentation;
  intensity: number;
  shadow: DirectionalLightShadow;
  // standard mesh
  geometry: BufferGeometry;
  material: Material;
  children: GraphNode[];
};

export type GraphNode<AdditionalProps extends object = {}> = Object3D &
  Object3DOverrides &
  AdditionalProps;

export type ObjectMap<GraphNodeAdditionalProps extends object = {}> = {
  nodes: {
    [name: string]: GraphNode<GraphNodeAdditionalProps>;
  };
  materials: { [name: string]: Material };
};

const convertVector3ToArr = (v: Vector3): [x: number, y: number, z: number] => [
  v.x,
  v.y,
  v.z,
];
const convertEulerToArr = (e: Euler): [x: number, y: number, z: number] => [
  e.x,
  e.y,
  e.z,
];

// Inspired by react-three-fiber's buildGraph
// https://github.com/pmndrs/react-three-fiber/blob/cc625d2338b7d0e6b6ec9fc7564f7c706534c5cf/packages/fiber/src/core/utils.ts#L141
function buildGraph(object: Object3D): ObjectMap {
  const data: ObjectMap = { nodes: {}, materials: {} };
  if (object) {
    object.traverse((obj: any) => {
      // properties that need additional fixing
      Object.defineProperties(obj, {
        position: {
          writable: true,
        },
        scale: {
          writable: true,
        },
        rotation: {
          writable: true,
        },
      });
      obj.position = convertVector3ToArr(obj.position);
      obj.scale = convertVector3ToArr(obj.scale);
      obj.rotation = convertEulerToArr(obj.rotation);

      if (obj.name && !data.nodes[obj.name]) {
        data.nodes[obj.name] = obj;
      }
      if (obj.material && !data.materials[obj.material.name])
        data.materials[obj.material.name] = obj.material;
    });
  }

  return data;
}

import { useLoader } from '@threlte/core';
import splineLoader from '@splinetool/loader';

export function loadSpline<GraphNodeAdditionalProps extends object = {}>(
  splineUrl: `${string}spline.design/${string}`,
  onProgress?: ((event: ProgressEvent<EventTarget>) => void) | undefined
) {
  const loader = useLoader(splineLoader, () => new splineLoader());
  return new Promise<ObjectMap<GraphNodeAdditionalProps>>((resolve, reject) => {
    loader.load(
      splineUrl,
      (spline) => {
        const graph = buildGraph(spline);
        resolve(graph as ObjectMap<GraphNodeAdditionalProps>);
      },
      onProgress,
      function onError(err) {
        reject(err);
      }
    );
  });
}

/**
 * Identical to `loadSpline`
 */
export const useSpline = loadSpline;
