import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Fade, Backdrop } from '@mui/material';

interface UpdateModalProps {
    children: React.ReactNode;
    open: boolean;
    handleClose: () => void;
}

/**
 * A reusable controlled modal for update operations.
 * It expects the 'open' state and 'handleClose' function to be managed by the parent.
 * It automatically passes 'onCancel={handleClose}' to its children.
 */
export default function UpdateModal({ children, open, handleClose }: UpdateModalProps) {
    return (
        <Modal
            aria-labelledby="update-modal-title"
            aria-describedby="update-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: {
                        backgroundColor: 'rgba(15, 23, 42, 0.7)',
                        backdropFilter: 'blur(4px)'
                    }
                },
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'relative',
                    width: { xs: '95%', sm: '90%', md: 700 },
                    maxWidth: '100%',
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    p: { xs: 2, md: 4 },
                    outline: 'none',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#e2e8f0',
                        borderRadius: '10px',
                    }
                }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: 16,
                            color: (theme) => theme.palette.grey[500],
                            zIndex: 10
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box sx={{ mt: 1 }}>
                        {React.Children.map(children, child => {
                            if (React.isValidElement(child)) {
                                return React.cloneElement(child as React.ReactElement<{ onCancel?: () => void }>, {
                                    onCancel: handleClose
                                });
                            }
                            return child;
                        })}
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}
