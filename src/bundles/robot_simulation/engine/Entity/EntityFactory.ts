import { type Physics } from '../Physics';
import { Entity, type Orientation } from './Entity';

type RigidBodyTypes = 'fixed' | 'dynamic';

export type EntityCuboidOptions = {
  orientation: Orientation;
  width: number;
  height: number;
  length: number;
  mass: number;
  type: RigidBodyTypes;
};

export function addCuboid(
  physics: Physics,
  options: EntityCuboidOptions,
): Entity {
  const { orientation, width, height, length, type, mass } = options;

  const rigidBodyDesc = physics.RAPIER.RigidBodyDesc[type]();
  const colliderDesc = physics.RAPIER.ColliderDesc.cuboid(
    width / 2,
    height / 2,
    length / 2,
  );

  colliderDesc.mass = mass;

  const rigidBody = physics.createRigidBody(rigidBodyDesc);
  const collider = physics.createCollider(colliderDesc, rigidBody);

  const entity = new Entity({
    rapierRigidBody: rigidBody,
    rapierCollider: collider,
  });

  entity.setOrientation(orientation);

  return entity;
}
