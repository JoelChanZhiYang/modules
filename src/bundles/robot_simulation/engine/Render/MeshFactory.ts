import * as THREE from 'three';
import { type Orientation } from '../Math/Vector';

export type RenderCuboidOptions = {
  orientation: Orientation;
  width: number;
  height: number;
  length: number;
  color: THREE.Color;
  debug: boolean;
};

export function addCuboid(options: RenderCuboidOptions): THREE.Mesh {
  const { orientation, width, height, length, color } = options;
  const geometry = new THREE.BoxGeometry(width, height, length);
  const material = options.debug
    ? new THREE.MeshPhysicalMaterial({
      color,
      wireframe: true,
    })
    : new THREE.MeshPhysicalMaterial({
      color,
      side: THREE.DoubleSide,
    });


  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.copy(orientation.position);
  mesh.quaternion.copy(orientation.rotation);

  return mesh;
}
