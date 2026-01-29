# Admin Panel - Quick User Guide 🎨

## 🚀 Getting Started

### Login
Navigate to `/admin/login` and enter your credentials.

## 📊 Dashboard Overview

### Main Sections (Sidebar Navigation)
- **📊 Статистика** - Statistics and analytics
- **📝 Заявки** - Print requests management
- **🎯 Проекты** - Projects and campaigns
- **🤝 Партнёры** - Partners management
- **💰 Сборы** - Fundraising campaigns
- **🖼️ Галерея** - Gallery of completed works
- **📰 Статьи** - Articles (with Markdown editor)
- **🎥 Видео** - Video management
- **📎 Файлы** - Downloadable files
- **🎲 3D Модели** - 3D print models
- **📚 Ресурсы** - Useful links and resources
- **📦 Материалы** - Material offers

## 💡 Key Features

### 1. Inline Editing (Double-Click)
```
Double-click on any editable field:
- Budget amounts
- Progress percentages
- Status dropdowns
- Text fields

The field becomes editable instantly!
No need to open a separate form.
```

### 2. Expandable Row Editing
```
Click the ▶ arrow button to expand a row.
The edit form appears directly under the item.
Make changes and they auto-save on blur.
Click ▼ to collapse when done.
```

### 3. Beautiful Stats Dashboard
```
View key metrics at a glance:
- Total views with trend indicators ↑↓
- Unique visitors
- Active requests
- Partner count

Interactive charts show:
- Daily views (line chart)
- Popular pages (bar chart)
```

### 4. Markdown Editor for Articles
```
Three view modes:
1. ✏️ Edit - Pure Markdown editing
2. 👁️ Preview - See rendered output
3. ⚡ Both - Side-by-side editing

Toolbar for quick formatting:
[B] Bold, [I] Italic, [H] Headers
[🔗] Links, [🖼️] Images, [</>] Code
[≡] Lists
```

### 5. Image Gallery Manager
```
Visual interface for managing images:
1. Click "+ Add Image"
2. Paste image URL
3. Add caption (optional)
4. Preview before saving

Hover over images to:
- ✏️ Edit
- 🗑️ Delete
```

### 6. Video Player Integration
```
Supported platforms:
- YouTube
- Vimeo
- RuTube

Just paste the video URL!
Automatic embedding with preview.
```

## 🎯 Common Tasks

### Adding a New Project
1. Go to **🎯 Проекты** tab
2. Click **"+ Создать проект"**
3. Fill in:
   - Title & Category
   - Short description
   - Budget & raised amount
   - Status (planned/active/completed)
4. Click **"Создать проект"**
5. Expand the row to add:
   - Full description (Markdown)
   - Image gallery
   - Additional details

### Creating an Article
1. Go to **📰 Статьи** tab
2. Click **"+ Создать статью"**
3. Enter title and author
4. Write content in Markdown editor
5. Use toolbar for formatting
6. Switch to Preview to check
7. Add image URL (optional)
8. Click **"Создать"**

### Managing Videos
1. Go to **🎥 Видео** tab
2. Click **"+ Добавить видео"**
3. Paste YouTube/Vimeo/RuTube URL
4. Add title and description
5. Set duration (optional)
6. Preview appears automatically
7. Click **"Добавить"**

### Adding Resources
1. Go to **📚 Ресурсы** tab
2. Click **"+ Добавить ресурс"**
3. Enter:
   - Title
   - URL
   - Category
4. Click **"Добавить"**
5. Resource appears in list immediately

### Updating Request Status
1. Go to **📝 Заявки** tab
2. Find the request
3. **Double-click** the status field
4. Select new status:
   - Новая (New)
   - В работе (In Progress)
   - Выполнена (Completed)
   - Отклонена (Rejected)
5. Status updates automatically

### Editing Project Budget
1. Go to **🎯 Проекты** tab
2. Find the project
3. **Double-click** the budget or raised amount
4. Enter new value
5. Press Enter or click outside
6. Value updates immediately

## 🎨 UI Elements Guide

### Badges & Tags
```css
🟢 Green badge → Completed/Active
🔵 Blue badge → In Progress
🟡 Yellow badge → Pending
🔴 Red badge → Rejected/Urgent
```

### Buttons
```
Primary (Teal gradient) → Main actions
Secondary (Gray) → Cancel/Back
Ghost (Transparent) → Minor actions
Danger (Red) → Delete/Remove
```

### Cards
```
Hover effects:
- Cards lift slightly
- Shadow increases
- Border highlights appear

Click effects:
- Smooth animations
- Visual feedback
- Instant updates
```

## ⌨️ Keyboard Shortcuts

### In Forms
- **Enter** → Save and close
- **Esc** → Cancel and close
- **Tab** → Move to next field

### In Markdown Editor
- **Ctrl+Enter** → Save (in textarea mode)
- **Esc** → Cancel editing

### In Modals
- **Esc** → Close modal
- **Click outside** → Close modal

## 📱 Mobile Usage

The admin panel is **fully responsive**:
- Sidebar collapses to horizontal scroll on mobile
- Tables adapt with horizontal scroll
- Modals take full screen on small devices
- Touch-friendly buttons and controls

## 🔒 User Roles

Different roles see different tabs:
- **Moderator** → View and edit content
- **Admin** → All moderator permissions + delete
- **Super Admin** → All permissions + user management

## 💾 Auto-Save

Most fields **auto-save** on blur:
- No need to click "Save"
- Just edit and move on
- Visual confirmation on save
- Errors show immediately

## 🎉 Tips & Tricks

1. **Use inline editing** for quick changes
2. **Expand rows** for detailed editing
3. **Use Markdown** for rich article content
4. **Preview everything** before saving
5. **Watch for trends** in statistics
6. **Check badges** for item counts
7. **Hover for tooltips** on icons

## ❓ Common Questions

**Q: How do I edit multiple fields at once?**
A: Click the ▶ arrow to expand the row and edit all fields together.

**Q: Can I undo changes?**
A: Press ESC before saving, or click outside to cancel.

**Q: How do I add images to articles?**
A: Use Markdown syntax: `![Alt text](image-url)`

**Q: What video formats are supported?**
A: YouTube, Vimeo, and RuTube URLs are automatically embedded.

**Q: Can I upload files directly?**
A: Currently, paste image/video URLs. File upload coming soon!

**Q: How do I see deleted items?**
A: Deleted items are permanently removed. Be careful!

## 🆘 Need Help?

If something isn't working:
1. **Refresh the page** (Ctrl+F5)
2. **Check your permissions** (role-based access)
3. **Look for error messages** (red text)
4. **Contact super admin** for account issues

---

**Enjoy the new beautiful admin panel!** ✨
