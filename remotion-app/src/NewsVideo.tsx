import React from 'react';
import {
    AbsoluteFill,
    Img,
    interpolate,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    staticFile,
    Audio,
} from 'remotion';
import newsData from './news-data.json';
import durations from './durations.json';
import config from '../video-config.json';

interface NewsItem {
    id: string;
    text: string;
    subtitle: string;
}

interface DurationData {
    id: string;
    duration: number;
}

export const NewsVideo: React.FC = () => {
    const { fps } = useVideoConfig();
    const useNanoBanana = config.tts.useNanoBanana;

    let currentFrame = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: '#111' }}>
            {(newsData as NewsItem[]).map((item) => {
                const durationData = (durations as DurationData[]).find(d => d.id === item.id);
                const durationSec = durationData ? durationData.duration : 5;
                const durationInFrames = Math.ceil(durationSec * fps);
                const startFrame = currentFrame;
                currentFrame += durationInFrames;

                const audioPath = staticFile(`audio/${item.id}.mp3`);

                return (
                    <Sequence
                        key={item.id}
                        from={startFrame}
                        durationInFrames={durationInFrames}
                    >
                        <NewsSlide
                            item={item}
                            useNanoBanana={useNanoBanana}
                            durationInFrames={durationInFrames}
                        />
                        <Audio src={audioPath} />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};

const NewsSlide: React.FC<{
    item: NewsItem,
    useNanoBanana: boolean,
    durationInFrames: number
}> = ({ item, useNanoBanana, durationInFrames }) => {
    const frame = useCurrentFrame();

    const opacity = interpolate(
        frame,
        [0, 15, durationInFrames - 15, durationInFrames],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const scale = interpolate(
        frame,
        [0, durationInFrames],
        [1, 1.03],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill style={{ opacity, display: 'flex', flexDirection: 'column' }}>
            {/* Top Area: Slide (AI Image or React Slide) */}
            <div style={{
                flex: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                backgroundColor: '#000',
                borderBottom: '2px solid #333',
                position: 'relative'
            }}>
                {useNanoBanana ? (
                    <Img
                        src={staticFile(`slides/${item.id}.png`)}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            transform: `scale(${scale})`,
                        }}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '80px',
                        color: 'white',
                        transform: `scale(${scale})`,
                    }}>
                        <div style={{ fontSize: 24, marginBottom: 20, opacity: 0.8, fontWeight: 'bold', borderLeft: '4px solid white', paddingLeft: 20 }}>
                            MAJOR NEWS / 2026.01.31
                        </div>
                        <div style={{
                            fontSize: 64,
                            fontWeight: 'bold',
                            lineHeight: '1.2',
                            textShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }}>
                            {item.text}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Area: Subtitle */}
            <div style={{
                flex: 1,
                backgroundColor: '#1a1a1a',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 40px'
            }}>
                <div
                    style={{
                        color: 'white',
                        fontSize: 32,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        lineHeight: '1.3',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        maxWidth: '90%'
                    }}
                >
                    {item.subtitle}
                </div>
            </div>
        </AbsoluteFill>
    );
};
