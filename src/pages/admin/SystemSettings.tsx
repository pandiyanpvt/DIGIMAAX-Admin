import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material'
import { Grid } from '@mui/material'
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import PageContainer from '../../components/common/PageContainer'

function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'DIGIMAAX',
    siteEmail: 'info@digimaax.com',
    sitePhone: '+94771234567',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@digimaax.com',
    smtpPassword: '',
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maintenanceMode: false,
    allowUserRegistration: true,
    sessionTimeout: '24',
  })

  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = () => {
    // Simulate save
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value })
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            System Settings
          </Typography>
        </Box>

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        {/* General Settings */}
        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
          General Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
            />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Site Email"
              type="email"
              value={settings.siteEmail}
              onChange={(e) => handleChange('siteEmail', e.target.value)}
            />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Site Phone"
              value={settings.sitePhone}
              onChange={(e) => handleChange('sitePhone', e.target.value)}
            />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Session Timeout (hours)"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', e.target.value)}
            />
                </Grid>
                </Grid>

        {/* Email Settings */}
        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
          Email Configuration
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="SMTP Host"
              value={settings.smtpHost}
              onChange={(e) => handleChange('smtpHost', e.target.value)}
            />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="SMTP Port"
              value={settings.smtpPort}
              onChange={(e) => handleChange('smtpPort', e.target.value)}
            />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="SMTP Username"
              value={settings.smtpUser}
              onChange={(e) => handleChange('smtpUser', e.target.value)}
            />
                </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="SMTP Password"
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => handleChange('smtpPassword', e.target.value)}
            />
                </Grid>
                </Grid>

        {/* Notification Settings */}
        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
          Notification Settings
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ mb: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableEmailNotifications}
                onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
              />
            }
            label="Enable Email Notifications"
          />
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableSMSNotifications}
                  onChange={(e) => handleChange('enableSMSNotifications', e.target.checked)}
                />
              }
              label="Enable SMS Notifications"
            />
          </Box>
        </Box>

        {/* System Options */}
        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
          System Options
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ mb: 4 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                color="warning"
              />
            }
            label="Maintenance Mode"
          />
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allowUserRegistration}
                  onChange={(e) => handleChange('allowUserRegistration', e.target.checked)}
                />
              }
              label="Allow Shop Worker Registration"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ backgroundColor: 'primary.main' }}
          >
            Save Settings
          </Button>
        </Box>
      </Card>
    </PageContainer>
  )
}

export default SystemSettings

