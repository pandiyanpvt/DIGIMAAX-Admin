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
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
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
  createSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
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
  const [addDialogOpen, setAddDialogOpen] = useState(false)
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
        console.error('Error fetching social media links:', err)
        setError(err?.response?.data?.message || err?.message || 'Failed to load social media links')
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [])

  const handleAdd = () => {
    setSelectedLink({
      id: 0, // Temporary ID for new link
      platform: 'facebook',
      url: '',
      isActive: true,
    })
    setAddDialogOpen(true)
    setError(null)
    setSuccessMessage(null)
  }

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

      if (selectedLink.id && selectedLink.id > 0) {
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
      } else {
        // Create new link
        const backendPayload = mapFrontendToBackend(selectedLink)
        const created = await createSocialMediaLink(backendPayload)
        const newLink = mapBackendToFrontend(created)
        setLinks([...links, newLink])
        setAddDialogOpen(false)
        setSuccessMessage('Social media link created successfully!')
      }
      setSelectedLink(null)
    } catch (err: any) {
      console.error('Error saving social media link:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to save social media link')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this social media link?')) {
      return
    }

    try {
      setError(null)
      await deleteSocialMediaLink(id)
      setLinks(links.filter((l) => l.id !== id))
      setSuccessMessage('Social media link deleted successfully!')
    } catch (err: any) {
      console.error('Error deleting social media link:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to delete social media link')
    }
  }

  const handleToggleActive = async (id: number) => {
    const link = links.find((l) => l.id === id)
    if (!link) return

    const updatedLink = { ...link, isActive: !link.isActive }
    try {
      setError(null)
      const backendPayload = mapFrontendToBackend(updatedLink)
      const updated = await updateSocialMediaLink({
        id,
        ...backendPayload,
      })
      const mappedUpdated = mapBackendToFrontend(updated)
      setLinks(links.map((l) => (l.id === id ? mappedUpdated : l)))
    } catch (err: any) {
      console.error('Error toggling social media link status:', err)
      setError(err?.response?.data?.message || err?.message || 'Failed to update link status')
      // Revert on error
      setLinks(links.map((l) => (l.id === id ? link : l)))
    }
  }

  return (
    <PageContainer sx={{ p: 4 }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Social Media Links
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={loading}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Link
          </Button>
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
              No social media links found. Click "Add Link" to create one.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Platform</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Status</TableCell>
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
                    <FormControlLabel
                      control={
                        <Switch
                          checked={link.isActive}
                          onChange={() => handleToggleActive(link.id)}
                          size="small"
                        />
                      }
                      label={link.isActive ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(link)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(link.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={addDialogOpen || editDialogOpen}
        onClose={() => {
          setAddDialogOpen(false)
          setEditDialogOpen(false)
          setSelectedLink(null)
        }}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
      >
        <DialogTitle>{selectedLink?.id ? 'Edit Social Media Link' : 'Add Social Media Link'}</DialogTitle>
        <DialogContent>
          {selectedLink && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                select
                label="Platform"
                value={selectedLink.platform}
                onChange={(e) => setSelectedLink({ ...selectedLink, platform: e.target.value })}
                SelectProps={{
                  native: true,
                }}
                sx={{ mb: 2 }}
              >
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="website">Website</option>
              </TextField>
              <TextField
                fullWidth
                label="URL"
                value={selectedLink.url}
                onChange={(e) => setSelectedLink({ ...selectedLink, url: e.target.value })}
                placeholder="https://..."
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedLink.isActive}
                    onChange={(e) =>
                      setSelectedLink({ ...selectedLink, isActive: e.target.checked })
                    }
                  />
                }
                label="Active"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialogOpen(false)
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


