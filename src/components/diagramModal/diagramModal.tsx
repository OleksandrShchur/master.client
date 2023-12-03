import React, { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { style } from './diagramModal.styles';

interface DiagramModalProps {
    handleClose: () => void;
    visible: boolean;
}

export const DiagramModal: React.FC<DiagramModalProps> = (props: DiagramModalProps) => {
    const { handleClose, visible } = props;

    return (
        <Modal
            open={visible}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Text in a modal
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
            </Box>
        </Modal>
    );
}