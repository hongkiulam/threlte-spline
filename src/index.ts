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
  children: SceneNode[];
};

export type SceneNode<AdditionalProps extends object = {}> = Object3D &
  Object3DOverrides &
  AdditionalProps;

export type ObjectMap<SceneNodeAdditionalProps extends object = {}> = {
  nodes: {
    [nodeName in Nodes]: SceneNode<SceneNodeAdditionalProps>;
  };
  materials: { [materialName in Materials]: Material };
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
function buildGraph<AdditionalProps extends object = {}>(object: Object3D) {
  const data: ObjectMap<AdditionalProps> = { nodes: {}, materials: {} };
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

      if (obj.name && !data.nodes[obj.name as Nodes]) {
        data.nodes[obj.name as Nodes] = obj;
      }
      if (obj.material && !data.materials[obj.material.name as Materials])
        data.materials[obj.material.name as Materials] = obj.material;
    });
  }

  return data;
}

import { type Materials, type Nodes } from './fetched-types';

export async function loadSpline<SceneNodeAdditionalProps extends object = {}>(
  splineUrl: `${string}spline.design/${string}`,
  onProgress?: ((event: ProgressEvent<EventTarget>) => void) | undefined
): Promise<ObjectMap<SceneNodeAdditionalProps>> {
  // guard against loadSpline being used on the server
  if (typeof window == 'undefined') return { nodes: {}, materials: {} };

  const SplineLoader = (await import('@splinetool/loader')).default;
  const loader = new SplineLoader();
  return new Promise((res, rej) => {
    loader.load(
      splineUrl,
      (scene) => {
        const graph = buildGraph(scene);
        // @ts-expect-error
        if (import.meta.hot) {
          // @ts-expect-error
          import.meta.hot.send('tstp:scene', {
            nodes: Object.keys(graph.nodes),
            materials: Object.keys(graph.materials),
          });
        }

        res(buildGraph(scene));
      },
      onProgress,
      rej
    );
  });
}
