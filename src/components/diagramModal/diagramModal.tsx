import React, { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { style } from './diagramModal.styles';
import Plot from 'react-plotly.js';
import { IGridItem } from '../../models/IGridItem';
import './diagramModal.css';

const sample = [-10, 10, 30, 50, 70, 90, 100];

interface DiagramModalProps {
    handleClose: () => void;
    visible: boolean;
    data: IGridItem[];
}

export const DiagramModal: React.FC<DiagramModalProps> = (props: DiagramModalProps) => {
    const { handleClose, visible, data } = props;

    const state = {
        line1: {
            x: [-3, -2, -1],
            y: [1, 2, 3],
            name: 'Line 1'
        },
        line2: {
            x: [1, 2, 3],
            y: [-3, -2, -1],
            name: 'Line 2'
        }
    }

    const mapValues = () => {
        const x = data.map(x => x.value);
        const y = data.map(x => x.euler);

        return {
            x: x,
            y: y,
            name: 'Точне'
        }
    }

    return (
        <Modal
            open={visible}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Plot
                    data={[
                        mapValues()
                    ]}
                    layout={{
                        datarevision: 0,
                    }}
                    revision={0}
                    style={{ width: '100%', height: '100%' }}
                />
            </Box>
        </Modal>
    );
}