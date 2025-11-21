import { useState } from 'react'
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

const socialMediaIcons: Record<string, React.ReactNode> = {
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
  youtube: <YouTubeIcon />,
  website: <WebsiteIcon />,
}

const sampleLinks = [
  {
    id: 1,
    platform: 'facebook',
    url: 'https://facebook.com/digimaax',
    isActive: true,
  },
  {
    id: 2,
    platform: 'twitter',
    url: 'https://twitter.com/digimaax',
    isActive: true,
  },
  {
    id: 3,
    platform: 'instagram',
    url: 'https://instagram.com/digimaax',
    isActive: true,
  },
  {
    id: 4,
    platform: 'linkedin',
    url: 'https://linkedin.com/company/digimaax',
    isActive: false,
  },
]

function SocialMediaLinks() {
  const [links, setLinks] = useState(sampleLinks)
  const [selectedLink, setSelectedLink] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const handleAdd = () => {
    setSelectedLink({
      platform: 'facebook',
      url: '',
      isActive: true,
    })
    setAddDialogOpen(true)
  }

  const handleEdit = (link: any) => {
    setSelectedLink({ ...link })
    setEditDialogOpen(true)
  }

  const handleSave = () => {
    if (selectedLink) {
      if (selectedLink.id) {
        setLinks(links.map((l) => (l.id === selectedLink.id ? selectedLink : l)))
        setEditDialogOpen(false)
      } else {
        const newLink = {
          ...selectedLink,
          id: Date.now(),
        }
        setLinks([...links, newLink])
        setAddDialogOpen(false)
      }
      setSelectedLink(null)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this social media link?')) {
      setLinks(links.filter((l) => l.id !== id))
    }
  }

  const handleToggleActive = (id: number) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l)))
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
            sx={{ backgroundColor: 'primary.main' }}
          >
            Add Link
          </Button>
        </Box>

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
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: 'primary.main' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}

export default SocialMediaLinks

