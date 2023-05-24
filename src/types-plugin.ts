import fs from 'fs';
import path from 'path';
import { type PluginOption } from 'vite';

function findNearestNodeModulesWithThrelteSpline() {
  let currentDir = process.cwd();

  while (currentDir !== path.parse(currentDir).root) {
    const nodeModulesThrelteSplineDir = path.join(
      currentDir,
      'node_modules',
      'threlte-spline'
    );

    if (
      fs.existsSync(nodeModulesThrelteSplineDir) &&
      fs.statSync(nodeModulesThrelteSplineDir).isDirectory()
    ) {
      return nodeModulesThrelteSplineDir;
    }

    currentDir = path.dirname(currentDir);
  }

  return null; // No `node_modules/threlte-spline` directory found
}

export function threlteSplineTypesPlugin(): PluginOption {
  return {
    name: 'threlte-spline-types-plugin',
    configureServer(server) {
      server.ws.on('tstp:scene', (data) => {
        try {
          if (typeof data !== 'object') return;
          if (data && data.nodes && data.materials) {
            const nearestNodeModuleThrelteSplineDir =
              findNearestNodeModulesWithThrelteSpline();
            if (nearestNodeModuleThrelteSplineDir) {
              fs.writeFileSync(
                path.join(
                  nearestNodeModuleThrelteSplineDir,
                  './dist/fetched-types.d.ts'
                ),
                'export type Nodes = ' +
                  data.nodes?.map((name: string) => `'${name}'`).join(`|`) +
                  ';' +
                  '\nexport type Materials = ' +
                  data.materials?.map((name: string) => `'${name}'`).join(`|`) +
                  ';'
              );
            }
          }
        } catch (err) {
          console.error(
            `[threlte-spline-types-plugin] Error parsing message: ${
              (err as Error).message
            }`
          );
        }
      });
    },
  };
}
