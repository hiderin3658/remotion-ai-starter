import { Composition } from 'remotion';
import { NewsVideo } from './NewsVideo';
import durations from './durations.json';
import './index.css';

interface DurationData {
  id: string;
  duration: number;
}

const fps = 30;
const totalDurationSec = (durations as DurationData[]).reduce((acc, d) => acc + d.duration, 0);
const totalDurationFrames = Math.ceil(totalDurationSec * fps);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NewsVideo"
        component={NewsVideo}
        durationInFrames={totalDurationFrames}
        fps={fps}
        width={1920}
        height={1080}
      />
    </>
  );
};
