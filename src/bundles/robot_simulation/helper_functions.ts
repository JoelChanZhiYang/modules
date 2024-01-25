import {
  chassisConfig,
  colorSensorConfig,
  meshConfig,
  motorDisplacements,
  motorPidConfig,
  physicsConfig,
  renderConfig,
  sceneCamera,
  wheelDisplacements,
  wheelPidConfig,
  ultrasonicSensorConfig,
} from './config';

import { Environment, type DefaultEv3, Program } from './controllers';
import { createDefaultEv3 } from './controllers/ev3/ev3/default';
import { type Controller, Physics, Renderer, Timer, World } from './engine';

import context from 'js-slang/context';
import { interrupt } from './interrupt';


const storedWorld = context.moduleContexts.robot_simulation.state?.world;


export function getWorldFromContext(): World {
  const world = context.moduleContexts.robot_simulation.state?.world;
  if (world === undefined) {
    throw new Error('World not initialized');
  }
  return world as World;
}

export function getEv3FromContext(): DefaultEv3 {
  const ev3 = context.moduleContexts.robot_simulation.state?.ev3;
  if (ev3 === undefined) {
    throw new Error('ev3 not initialized');
  }
  return ev3 as DefaultEv3;
}


// Initialization functions
export function createRenderer(): Renderer {
  const scene = Renderer.scene();
  const camera = Renderer.camera(sceneCamera);
  camera.translateY(2);
  camera.translateZ(-2);
  const renderer = new Renderer(scene, camera, renderConfig);
  return renderer;
}

export function createPhysics(): Physics {
  const physics = new Physics(physicsConfig);
  return physics;
}

export function createTimer(): Timer {
  const timer = new Timer();
  return timer;
}

export function createWorld(physics: Physics, renderer: Renderer, timer: Timer) {
  const world = new World(physics, renderer, timer);
  return world;
}

export function createEv3(physics: Physics, renderer: Renderer): DefaultEv3 {
  const config = {
    chassis: chassisConfig,
    motor: {
      displacements: motorDisplacements,
      pid: motorPidConfig,
    },
    wheel: {
      displacements: wheelDisplacements,
      pid: wheelPidConfig,
    },
    colorSensor: {
      displacement: colorSensorConfig.displacement,
    },
    ultrasonicSensor: ultrasonicSensorConfig,
    mesh: meshConfig,
  };

  const ev3 = createDefaultEv3(physics, renderer, config);
  return ev3;
}

export function createFloor(physics: Physics, renderer: Renderer) {
  const environment = new Environment(physics, renderer);
  return environment;
}

export function createCSE() {
  const code = context.unTypecheckedCode[0];
  const program = new Program(code);
  return program;
}

export function addControllerToWorld(controller: Controller, world:World) {
  world.addController(controller);
}

export function saveToContext(world: World, ev3: DefaultEv3) {
  context.moduleContexts.robot_simulation.state = {
    world,
    ev3,
  };
}

// Initialization
export function init_simulation(worldFactory: () => World) {
  if (storedWorld !== undefined) {
    return;
  }
  const world = worldFactory();
  world.init();
  interrupt();
}
