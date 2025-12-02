import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Edit as EditIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Language as WebsiteIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'
import {
  getAllSocialMediaLinks,
  updateSocialMediaLink,
  type SocialMediaLink,
} from '../../api/socialMedia'

const socialMediaIcons: Record<string, React.ReactNode> = {
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
  youtube: <YouTubeIcon />,
  website: <WebsiteIcon />,
}

// Frontend interface for display
interface LinkDisplay {
  id: number
  platform: string
  url: string
  isActive: boolean
}

// Map backend data to frontend display format
const mapBackendToFrontend = (backendLink: SocialMediaLink): LinkDisplay => ({
  id: backendLink.id,
  platform: backendLink.social_media,
  url: backendLink.link,
  isActive: backendLink.is_active ?? true,
})

// Map frontend display format to backend format
const mapFrontendToBackend = (frontendLink: LinkDisplay) => ({
  social_media: frontendLink.platform,
  link: frontendLink.url,
  is_active: frontendLink.isActive,
})

function SocialMediaLinks() {
  const [links, setLinks] = useState<LinkDisplay[]>([])
  const [selectedLink, setSelectedLink] = useState<LinkDisplay | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch links from backend on mount
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true)
        setError(null)
        const backendLinks = await getAllSocialMediaLinks()
        const mappedLinks = backendLinks.map(mapBackendToFrontend)
        setLinks(mappedLinks)
      } catch (err: any) {
('Error fetching social media links:', err)
        setError(err?.response?.data?.message || err?.message || 'Failed to load social media links')
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [])

  const handleEdit = (link: LinkDisplay) => {
    setSelectedLink({ ...link })
    setEditDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handleSave = async () => {
    if (!selectedLink) return

    // Validate
    if (!selectedLink.url.trim()) {
      setError('URL is required')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      // Update existing link
      const backendPayload = mapFrontendToBackend(selectedLink)
      const updated = await updateSocialMediaLink({
        id: selectedLink.id,
        ...backendPayload,
      })
      const updatedLink = mapBackendToFrontend(updated)
      setLinks(links.map((l) => (l.id === selectedLink.id ? updatedLink : l)))
      setEditDialogOpen(false)
      setSuccessMessage('Social media link updated successfully!')
      setSelectedLink(null)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save social media link')
    } finally {
      setSaving(false)
    }
  }


  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Social Media Links
          </Typography>
        </Box>

        {(error || successMessage) && (
          <Alert
            severity={error ? 'error' : 'success'}
            onClose={() => {
              setError(null)
              setSuccessMessage(null)
            }}
            sx={{ mb: 2 }}
          >
            {error || successMessage}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : links.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No social media links found.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>Platform</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {socialMediaIcons[link.platform] || <WebsiteIcon />}
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {link.platform}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {link.url}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(link)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false)
          setSelectedLink(null)
        }}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
          }
        }}
      >
        <DialogTitle>Edit Social Media Link</DialogTitle>
        <DialogContent>
          {selectedLink && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Platform"
                value={selectedLink.platform}
                disabled
                sx={{ mb: 2 }}
                helperText="Platform cannot be changed"
              />
              <TextField
                fullWidth
                label="URL"
                value={selectedLink.url}
                onChange={(e) => setSelectedLink({ ...selectedLink, url: e.target.value })}
                placeholder="https://..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditDialogOpen(false)
              setSelectedLink(null)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            sx={{ backgroundColor: 'primary.main' }}
          >
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default SocialMediaLinks


