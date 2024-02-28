import { type Physics, type Renderer, ControllerMap } from '../../../engine';
import { type EntityCuboidOptions } from '../../../engine/Entity/EntityFactory';
import { type SimpleVector } from '../../../engine/Math/Vector';
import { type PIDConfig } from '../feedback_control/PidController';

import { Wheel } from '../components/Wheel';
import { Motor } from '../components/Motor';
import { ColorSensor } from '../sensor/ColorSensor';
import { Mesh, type MeshConfig } from '../components/Mesh';
import { ChassisWrapper } from '../components/Chassis';
import { UltrasonicSensor } from '../sensor/UltrasonicSensor';

type WheelControllers = {
  frontLeftWheel: Wheel;
  frontRightWheel: Wheel;
  backLeftWheel: Wheel;
  backRightWheel: Wheel;
};

type MotorControllers = {
  leftMotor: Motor;
  rightMotor: Motor;
};

type SensorControllers = {
  colorSensor: ColorSensor;
  ultrasonicSensor: UltrasonicSensor;
};

type ChassisControllers = {
  mesh: Mesh;
  chassis: ChassisWrapper;
};

type DefaultEv3Controller = WheelControllers &
MotorControllers &
SensorControllers &
ChassisControllers;

type Ev3Config = {
  chassis: EntityCuboidOptions;
  wheel: {
    displacements: Record<string, SimpleVector>;
    pid: PIDConfig;
  };
  motor: {
    displacements: Record<string, SimpleVector>;
    pid: PIDConfig;
  };
  colorSensor: {
    displacement: SimpleVector;
  };
  ultrasonicSensor: {
    displacement: SimpleVector;
    direction: SimpleVector;
    debug: boolean;
  };
  mesh: MeshConfig;
};

export type DefaultEv3 = ControllerMap<DefaultEv3Controller>;

export const createDefaultEv3 = (
  physics: Physics,
  render: Renderer,
  config: Ev3Config,
): DefaultEv3 => {
  const chassis = new ChassisWrapper(physics, config.chassis);
  const mesh = new Mesh(chassis, render, config.mesh);

  const wheelPidConfig = {
    pid: config.wheel.pid,
    debug: true,
  };

  const frontLeftWheel = new Wheel(
    chassis,
    physics,
    render,
    config.wheel.displacements.frontLeftWheel,
    wheelPidConfig,
  );

  const frontRightWheel = new Wheel(
    chassis,
    physics,
    render,
    config.wheel.displacements.frontRightWheel,
    wheelPidConfig,
  );

  const backLeftWheel = new Wheel(
    chassis,
    physics,
    render,
    config.wheel.displacements.backLeftWheel,
    wheelPidConfig,
  );
  const backRightWheel = new Wheel(
    chassis,
    physics,
    render,
    config.wheel.displacements.backRightWheel,
    wheelPidConfig,
  );

  // Motors
  const motorPidConfig = {
    pid: config.motor.pid,
  };

  const leftMotor = new Motor(
    chassis,
    physics,
    config.motor.displacements.leftMotor,
    motorPidConfig,
  );

  const rightMotor = new Motor(
    chassis,
    physics,
    config.motor.displacements.rightMotor,
    motorPidConfig,
  );

  // Sensors
  const colorSensor = new ColorSensor(
    chassis,
    render.scene(),
    config.colorSensor.displacement,
    { debug: true },
  );

  const ultrasonicSensor = new UltrasonicSensor(
    chassis,
    physics,
    render,
    config.ultrasonicSensor.displacement,
    config.ultrasonicSensor.direction,
    { debug: config.ultrasonicSensor.debug },
  );

  const ev3: DefaultEv3 = new ControllerMap<DefaultEv3Controller>({
    frontLeftWheel,
    frontRightWheel,
    backLeftWheel,
    backRightWheel,
    leftMotor,
    rightMotor,
    colorSensor,
    ultrasonicSensor,
    mesh,
    chassis,
  });

  return ev3;
};