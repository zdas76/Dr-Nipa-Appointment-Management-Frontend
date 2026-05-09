import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Fade, Backdrop } from '@mui/material';

interface Props {
    children: React.ReactNode;
    buttonLabel?: string;
    buttonVariant?: 'text' | 'outlined' | 'contained';
    title?: string;
}

export default function BasicModal({ children, buttonLabel = "Open Modal", buttonVariant = "contained" }: Props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button
                variant={buttonVariant}
                onClick={handleOpen}
                sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: buttonVariant === 'contained' ? '#3b82f6' : 'transparent',
                    '&:hover': {
                        bgcolor: buttonVariant === 'contained' ? '#2563eb' : 'rgba(59, 130, 246, 0.05)'
                    }
                }}
            >
                {buttonLabel}
            </Button>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                        sx: { backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }
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
                        {/* Close Button */}
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
                                    return React.cloneElement(child as React.ReactElement<any>, { onCancel: handleClose });
                                }
                                return child;
                            })}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}