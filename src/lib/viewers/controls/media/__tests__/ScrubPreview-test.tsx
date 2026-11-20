import React from 'react';
import { render, screen } from '@testing-library/react';
import ScrubPreview from '../ScrubPreview';

describe('ScrubPreview', () => {
    // 3 rows of 90px frames
    const getProps = (props = {}) => ({
        imageHeight: 270,
        imageUrl: 'blob:filmstrip',
        interval: 1,
        isVisible: true,
        time: 0,
        ...props,
    });

    test('should render nothing before a time is previewed', () => {
        render(<ScrubPreview {...getProps({ time: null })} />);

        expect(screen.queryByTestId('bp-ScrubPreview')).not.toBeInTheDocument();
    });

    test('should position the background on the tile for the previewed time', () => {
        render(<ScrubPreview {...getProps({ time: 123 })} />);

        const preview = screen.getByTestId('bp-ScrubPreview');
        // Frame 123 is column 23 of row 1, in a 100 x 3 grid
        expect(preview).toHaveStyle({
            backgroundImage: "url('blob:filmstrip')",
            backgroundPosition: `${(23 / 99) * 100}% 50%`,
            backgroundSize: '10000% 300%',
        });
        expect(preview).toHaveClass('bp-is-visible');
    });

    test('should use the filmstrip interval and clamp to the last row', () => {
        render(<ScrubPreview {...getProps({ interval: 2, time: 1000 })} />);

        // Frame 500 would be row 5, past the 3 rows in the image
        expect(screen.getByTestId('bp-ScrubPreview')).toHaveStyle({ backgroundPosition: '0% 100%' });
    });

    test('should dim only while the real frame is loading', () => {
        const { rerender } = render(<ScrubPreview {...getProps()} />);

        expect(screen.getByTestId('bp-ScrubPreview')).not.toHaveClass('bp-is-dimmed');

        rerender(<ScrubPreview {...getProps({ isDimmed: true })} />);

        expect(screen.getByTestId('bp-ScrubPreview')).toHaveClass('bp-is-dimmed');
    });

    test('should keep the last frame while fading out', () => {
        const { rerender } = render(<ScrubPreview {...getProps({ time: 5 })} />);

        rerender(<ScrubPreview {...getProps({ isVisible: false, time: null })} />);

        const preview = screen.getByTestId('bp-ScrubPreview');
        expect(preview).not.toHaveClass('bp-is-visible');
        expect(preview).toHaveStyle({ backgroundPosition: `${(5 / 99) * 100}% 0%` });
    });
});
