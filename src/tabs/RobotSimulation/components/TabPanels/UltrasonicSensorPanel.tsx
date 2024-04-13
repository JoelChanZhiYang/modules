import React from 'react';
import { type DefaultEv3 } from '../../../../bundles/robot_simulation/controllers/ev3/ev3/default/ev3';
import { useFetchFromSimulation } from '../../hooks/fetchFromSimulation';
import { LastUpdated } from './tabComponents/LastUpdated';
import { TabWrapper } from './tabComponents/Wrapper';

export const UltrasonicSensorPanel: React.FC<{ ev3: DefaultEv3 }> = ({
  ev3,
}) => {
  const ultrasonicSensor = ev3.get('ultrasonicSensor');

  const [timing, distanceSensed] = useFetchFromSimulation(() => {
    if (ultrasonicSensor === undefined) {
      return null;
    }
    return ultrasonicSensor.sense();
  }, 1000);

  if (timing === null) {
    return <TabWrapper>Loading color sensor</TabWrapper>;
  }

  if (distanceSensed === null) {
    return <TabWrapper>Color sensor not found</TabWrapper>;
  }

  return (
    <TabWrapper>
      <LastUpdated time={timing} />
      <div>
        <p>Distance: {distanceSensed}</p>
      </div>
    </TabWrapper>
  );
};
