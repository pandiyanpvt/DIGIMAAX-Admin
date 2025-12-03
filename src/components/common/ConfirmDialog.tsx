import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress } from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  confirmColor?: 'error' | 'primary' | 'warning'
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmColor = 'error',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: `${confirmColor}.light`,
            color: `${confirmColor}.main`,
          }}
        >
          <WarningIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          gap: 1,
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={loading}
          sx={{
            minWidth: 100,
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'text.secondary',
              backgroundColor: 'action.hover',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading}
          sx={{
            minWidth: 100,
            backgroundColor: `${confirmColor}.main`,
            '&:hover': {
              backgroundColor: `${confirmColor}.dark`,
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

