# Google Drive Backup Instructions

This document provides step-by-step instructions for backing up the Saint & Summer image assets to Google Drive.

## 📁 Folder Structure

Create the following folder structure in your Google Drive:

```
Saint & Summer - Web Book Assets/
├── Story Illustrations/
│   ├── 01_compass_glow.png
│   ├── 02_island_arrival.png
│   ├── 03_summer_wanders.png
│   ├── 04_listening_shells.png
│   ├── 05_singing_tree.png
│   ├── 06_helping_creature.png
│   ├── 07_path_of_light.png
│   └── 08_return_home.png
├── Character References/
│   ├── saint_reference.png
│   ├── summer_reference.png
│   └── ensemble_reference.png
└── Documentation/
    ├── README.md
    ├── ASSETS.md
    └── GOOGLE_DRIVE_BACKUP.md
```

## 🚀 Upload Methods

### Method 1: Manual Upload via Web Interface

1. **Go to Google Drive**: https://drive.google.com
2. **Create main folder**: 
   - Click "New" → "Folder"
   - Name it "Saint & Summer - Web Book Assets"
3. **Create subfolders**:
   - Inside main folder, create "Story Illustrations"
   - Create "Character References"
   - Create "Documentation"
4. **Upload files**:
   - Navigate to each subfolder
   - Drag and drop files from your local machine
   - Files are located at: `/home/ubuntu/saint-summer-webbook/client/public/images/`

### Method 2: Using rclone (Command Line)

#### Step 1: Configure rclone

```bash
# Configure rclone with Google Drive
rclone config

# Follow the prompts:
# n) New remote
# name> gdrive
# Storage> drive (Google Drive)
# client_id> [Leave blank or use your own]
# client_secret> [Leave blank or use your own]
# scope> 1 (Full access)
# root_folder_id> [Leave blank]
# service_account_file> [Leave blank]
# Edit advanced config? n
# Use auto config? y
# [Browser will open for OAuth authentication]
# Configure this as a team drive? n
```

#### Step 2: Create folder structure

```bash
# Create main folder
rclone mkdir "gdrive:Saint & Summer - Web Book Assets"

# Create subfolders
rclone mkdir "gdrive:Saint & Summer - Web Book Assets/Story Illustrations"
rclone mkdir "gdrive:Saint & Summer - Web Book Assets/Character References"
rclone mkdir "gdrive:Saint & Summer - Web Book Assets/Documentation"
```

#### Step 3: Upload files

```bash
# Navigate to project directory
cd /home/ubuntu/saint-summer-webbook

# Upload story illustrations
rclone copy client/public/images/01_compass_glow.png "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/"
rclone copy client/public/images/02_island_arrival.png "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/"
rclone copy client/public/images/03_summer_wanders.png "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/"
rclone copy client/public/images/04_listening_shells.png "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/"
rclone copy client/public/images/05_singing_tree.png "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/"
rclone copy client/public/images/06_helping_creature.png "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/"
rclone copy client/public/images/07_path_of_light.png "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/"
rclone copy client/public/images/08_return_home.png "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/"

# Upload character references
rclone copy client/public/images/saint_reference.png "gdrive:Saint & Summer - Web Book Assets/Character References/"
rclone copy client/public/images/summer_reference.png "gdrive:Saint & Summer - Web Book Assets/Character References/"
rclone copy client/public/images/ensemble_reference.png "gdrive:Saint & Summer - Web Book Assets/Character References/"

# Upload documentation
rclone copy README.md "gdrive:Saint & Summer - Web Book Assets/Documentation/"
rclone copy ASSETS.md "gdrive:Saint & Summer - Web Book Assets/Documentation/"
rclone copy GOOGLE_DRIVE_BACKUP.md "gdrive:Saint & Summer - Web Book Assets/Documentation/"
```

#### Alternative: Bulk upload

```bash
# Upload all images at once
cd /home/ubuntu/saint-summer-webbook/client/public/images

# Story illustrations (01-08)
for i in {01..08}; do
  rclone copy ${i}_*.png "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/"
done

# Character references
rclone copy *_reference.png "gdrive:Saint & Summer - Web Book Assets/Character References/"
```

### Method 3: Using Google Drive Desktop App

1. **Install Google Drive for Desktop**: https://www.google.com/drive/download/
2. **Sign in** with your Google account
3. **Navigate to your Google Drive folder** on your computer
4. **Create the folder structure** as shown above
5. **Copy files** from `/home/ubuntu/saint-summer-webbook/client/public/images/` to the appropriate Google Drive folders
6. **Wait for sync** to complete

## 📋 File Checklist

Use this checklist to ensure all files are uploaded:

### Story Illustrations (8 files)
- [ ] 01_compass_glow.png (1.6 MB)
- [ ] 02_island_arrival.png (1.6 MB)
- [ ] 03_summer_wanders.png (1.7 MB)
- [ ] 04_listening_shells.png (1.4 MB)
- [ ] 05_singing_tree.png (1.8 MB)
- [ ] 06_helping_creature.png (1.5 MB)
- [ ] 07_path_of_light.png (1.7 MB)
- [ ] 08_return_home.png (1.4 MB)

### Character References (3 files)
- [ ] saint_reference.png (1.2 MB)
- [ ] summer_reference.png (1007 KB)
- [ ] ensemble_reference.png (913 KB)

### Documentation (3 files)
- [ ] README.md
- [ ] ASSETS.md
- [ ] GOOGLE_DRIVE_BACKUP.md

**Total**: 14 files (~16 MB)

## 🔗 After Upload

✅ **UPLOAD COMPLETE!**

Google Drive Backup Location:
https://drive.google.com/drive/folders/1miG7-pCciEJSbfB6GXNrkR5IRhBjEKCo?usp=sharing

Sharing Settings: ✅ Anyone with the link can view

Documentation Updated:
- ✅ README.md - Google Drive link added
- ✅ ASSETS.md - Google Drive link added
- ✅ GOOGLE_DRIVE_BACKUP.md - Upload confirmed

## 🔐 Sharing Settings

Recommended sharing settings for the Google Drive folder:

- **General access**: Restricted (only people added can access)
- **Add people**: Share with team members who need access
- **Role**: Viewer (to prevent accidental modifications)

For public sharing (if needed for the project):
- **General access**: Anyone with the link
- **Role**: Viewer

## 📊 Verification

After upload, verify:

1. **All 11 image files** are present
2. **All 3 documentation files** are present
3. **Folder structure** matches the template above
4. **File sizes** match the original files
5. **Files can be opened** and viewed correctly
6. **Sharing permissions** are set correctly

## 🔄 Maintenance

### Regular Backups
- Update Google Drive backup whenever new illustrations are added
- Keep documentation files in sync with GitHub repository
- Maintain version history in Google Drive

### File Naming
- Keep original filenames for consistency
- Use sequential numbering for story illustrations (01-08)
- Use descriptive names for character references

### Organization
- Don't mix story illustrations with character references
- Keep documentation separate for easy access
- Add new folders as needed for future books in the series

## 🆘 Troubleshooting

### Upload fails
- Check internet connection
- Verify Google Drive storage space (need ~16 MB free)
- Try uploading files individually instead of bulk upload
- Clear browser cache if using web interface

### Files not syncing (Desktop app)
- Check sync status in Google Drive app
- Restart Google Drive app
- Check if files are in the correct folder
- Verify you're signed in to the correct account

### Permission issues
- Ensure you have edit access to the folder
- Check if you're signed in to the correct Google account
- Verify folder sharing settings

## 📞 Support

For issues with:
- **Google Drive**: https://support.google.com/drive
- **rclone**: https://rclone.org/docs/
- **Project files**: Check GitHub repository issues

---

**Last Updated**: 2024-11-06
**Maintained By**: Saint & Summer Creative Team

## 📝 Quick Command Reference

```bash
# List files in Google Drive folder
rclone ls "gdrive:Saint & Summer - Web Book Assets"

# Check sync status
rclone check /home/ubuntu/saint-summer-webbook/client/public/images "gdrive:Saint & Summer - Web Book Assets/Story Illustrations"

# Download from Google Drive (if needed)
rclone copy "gdrive:Saint & Summer - Web Book Assets" ./backup --progress

# Delete remote files (use with caution!)
rclone delete "gdrive:Saint & Summer - Web Book Assets/Story Illustrations/filename.png"
```

---

**Remember**: Always verify uploads and maintain both local and cloud backups of all assets!
