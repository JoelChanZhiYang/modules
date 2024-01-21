import { useRef, type CSSProperties, useEffect, useState } from 'react';
import type { DebuggerContext } from '../../../../typings/type_helpers';

import { type SimulationStates } from '../../../../bundles/robot_simulation/simulation/world';
import { type World } from '../../../../bundles/robot_simulation/engine';
import { type DefaultEv3 } from '../../../../bundles/robot_simulation/controllers';
import { Tab, Tabs } from '@blueprintjs/core';
import { WheelPidPanel } from '../TabPanels/WheelPidPanel';
import { MotorPidPanel } from '../TabPanels/MotorPidPanel';
import { ColorSensorPanel } from '../TabPanels/ColorSensorPanel';
import { MonitoringPanel } from '../TabPanels/MonitoringPanel';

const WrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
};

const CanvasStyle: CSSProperties = {
  width: 900,
  height: 500,
  borderRadius: 3,
  overflow: 'hidden',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
};

const bottomPanelStyle: CSSProperties = {
  width: 900,
  height: 200,
  backgroundColor: '#1a2530',
  borderRadius: 3,
  overflow: 'hidden',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
};

export default function SimulationCanvas({
  context,
  isOpen,
}: {
  context: DebuggerContext;
  isOpen: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sensorRef = useRef<HTMLDivElement>(null);
  const [currentState, setCurrentState]
    = useState<SimulationStates>('unintialized');
  const world = context.context.moduleContexts.robot_simulation.state
    .world as World;

  const ev3 = context.context.moduleContexts.robot_simulation.state
    .ev3 as DefaultEv3;

  useEffect(() => {
    const startThreeAndRapierEngines = async () => {
      setCurrentState(world.state);
    };

    const attachRenderDom = () => {
      if (ref.current) {
        ref.current.replaceChildren(world.render.getElement());
      }

      if (sensorRef.current) {
        sensorRef.current.replaceChildren(ev3.get('colorSensor')
          .getElement());
      }
    };

    if (currentState === 'unintialized') {
      startThreeAndRapierEngines();
    }

    if (currentState === 'ready' || currentState === 'running') {
      attachRenderDom();
    }
    if (currentState === 'loading') {
      setTimeout(() => {
        setCurrentState('unintialized');
      }, 500);
    }
  }, [currentState]);

  useEffect(() => {
    if (isOpen) {
      world.start();
    } else {
      world.pause();
    }
  }, [isOpen]);

  return (
    <div style={WrapperStyle}>
      <div style={CanvasStyle}>
        <div ref={ref}>{currentState}</div>
      </div>
      <div style={bottomPanelStyle}>
        <Tabs id="TabsExample">
          <Tab id="monitoring" title="Monitoring" panel={<MonitoringPanel ev3={ev3}/>} />
          <Tab id="suspensionPid" title="Suspension PID" panel={<WheelPidPanel ev3={ev3}/>} />
          <Tab id="motorPid" title="Motor PID" panel={<MotorPidPanel ev3={ev3}/>} />
          <Tab id="colorSensor" title="Color Sensor" panel={<ColorSensorPanel ev3={ev3}/>}/>
        </Tabs>
      </div>
    </div>
  );
}
