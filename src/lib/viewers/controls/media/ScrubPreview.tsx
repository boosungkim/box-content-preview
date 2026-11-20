import React from 'react';
import classNames from 'classnames';
import './ScrubPreview.scss';

const FILMSTRIP_FRAMES_PER_ROW = 100;
const FILMSTRIP_FRAME_HEIGHT = 90;

export type Props = {
    imageHeight: number;
    imageUrl: string;
    interval: number;
    /** Dims the frame while the real video frame for this time is still loading */
    isDimmed?: boolean;
    isVisible: boolean;
    time: number | null;
};

/**
 * Full-size, low-res stand-in for the video frame, cut from the filmstrip image. Fills its parent,
 * which the viewer sizes to the video picture.
 */
export default function ScrubPreview({
    imageHeight,
    imageUrl,
    interval,
    isDimmed = false,
    isVisible,
    time,
}: Props): JSX.Element | null {
    const lastTimeRef = React.useRef<number | null>(null);

    // Keep the last frame while fading out, after the viewer clears the time
    if (time !== null) {
        lastTimeRef.current = time;
    }
    const frameTime = lastTimeRef.current;

    if (frameTime === null) {
        return null;
    }

    const frameNumber = Math.max(0, Math.floor(frameTime / interval));
    const column = frameNumber % FILMSTRIP_FRAMES_PER_ROW;
    const rows = Math.max(1, Math.round(imageHeight / FILMSTRIP_FRAME_HEIGHT));
    const row = Math.min(Math.floor(frameNumber / FILMSTRIP_FRAMES_PER_ROW), rows - 1);

    return (
        <div
            className={classNames('bp-ScrubPreview', { 'bp-is-dimmed': isDimmed, 'bp-is-visible': isVisible })}
            data-testid="bp-ScrubPreview"
            style={{
                backgroundImage: `url('${imageUrl}')`,
                backgroundPosition: `${(column / (FILMSTRIP_FRAMES_PER_ROW - 1)) * 100}% ${
                    rows > 1 ? (row / (rows - 1)) * 100 : 0
                }%`,
                backgroundSize: `${FILMSTRIP_FRAMES_PER_ROW * 100}% ${rows * 100}%`,
            }}
        />
    );
}
