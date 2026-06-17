# hub4youth — Admin User Guide

A practical guide for staff who manage the website through the admin panel. No
coding required — everything here is done by pointing and clicking.

---

## 1. Signing in

1. Go to **`/admin`** on your site (e.g. `https://your-domain.com/admin`, or
   `http://localhost:3000/admin` during local testing).
2. Enter your email and password.
3. The first time the site is ever opened, it asks you to **create the first admin
   account** — that becomes the owner login.

Forgot your password? Use the "Forgot password" link on the login screen (works
once email is configured).

### Managing who has access
- Open **Users** in the left sidebar to invite or remove staff.
- Click **Create New**, enter their name, email, and a password, and save. Share
  the login with them and ask them to change the password.

---

## 2. The dashboard at a glance

After logging in you'll see the collections in the left sidebar:

| Section | What it's for |
|---------|---------------|
| **Courses** | Your course catalogue — the main thing you'll manage |
| **Leads → Enquiries** | Contact-form submissions from visitors |
| **Leads → Enrollments** | Paid course sign-ups (orders) |
| **Media** | Images you upload (course images, etc.) |
| **Categories** | Optional tags to group courses |
| **Pages / Posts** | Extra marketing pages and blog articles |
| **Users** | Staff admin accounts |

---

## 3. Managing courses (most common task)

### Add a new course
1. Click **Courses → Create New**.
2. Fill in the fields (see the reference below).
3. Click **Save Draft** to keep working, or **Publish** to make it live.

### Edit an existing course
1. Click **Courses**, then click the course in the list.
2. Make your changes.
3. Click **Publish** to push the changes live. Edits are auto-saved as a draft as
   you type, but they only appear on the website once you **Publish**.

### Course fields

Main area:
| Field | Notes |
|-------|-------|
| **Title** | The course name shown everywhere. |
| **Summary** | One or two lines shown on course cards and at the top of the course page. Keep it short. |
| **Overview tab → Hero image** | Optional banner image (upload or pick from Media). |
| **Overview tab → Full description** | The rich-text body of the course page. Use headings, bold, lists, etc. |
| **Curriculum tab → Modules** | Add a module, give it a title, then add lessons under it. Repeat for each module. Drag to reorder. |
| **Curriculum tab → What you'll learn** | Bullet list of outcomes shown on the course page. |
| **SEO tab** | Title/description/image for Google and social sharing. Click "Auto-generate" or write your own. |

Sidebar:
| Field | Notes |
|-------|-------|
| **Price** | The enrollment price. Enter `0` for a free course. |
| **Currency** | ₹ INR, $ USD, € EUR, or £ GBP. |
| **Duration** | Free text, e.g. "12 weeks" or "40 hours". |
| **Level** | Beginner / Intermediate / Advanced / All levels. |
| **Mode** | Live (instructor-led) / Self-paced / Hybrid. |
| **Icon** | The little icon on the course card. Choose the closest match (Code, Web, Data/chart, AI/brain, Cloud, Mobile, Security, Database, Design). |
| **Featured** | Turn ON to show the course on the **homepage**. |
| **Categories** | Optional grouping tags. |
| **Published date** | Set automatically when you first publish. |

### Two rules that decide what visitors see
- **A course only appears on the public site after you click Publish.** Drafts are
  invisible to visitors.
- **The homepage shows the courses you mark "Featured"** (up to six). If none are
  featured, it falls back to showing the most recent courses. Every published
  course always appears on the **Courses** page.

### Unpublish or delete
- To temporarily hide a course: open it and choose **Unpublish**.
- To remove it permanently: use the **⋯ / Delete** option. (Deleting can't be undone.)

---

## 4. Enquiries (contact-form leads)

Every time a visitor submits the contact form, a row appears in
**Leads → Enquiries**.

- Click a row to see the person's name, email, phone, the course they asked about,
  and their message.
- Use the **Status** field (sidebar) to track your follow-up:
  **New → Contacted → Enrolled → Closed.**
- You can't create enquiries by hand here — they only come from the website form.
  You *can* edit the status and notes.

> If staff email notifications are turned on, you'll also get an email each time a
> new enquiry arrives.

---

## 5. Enrollments (paid sign-ups)

When someone pays for a course online, a row appears in **Leads → Enrollments**.

- Shows the customer, the course, the amount paid, and a **Status**:
  - **Pending** — checkout started but payment not yet confirmed.
  - **Paid** — payment confirmed (set automatically by the payment provider).
  - **Failed / Refunded** — as applicable.
- These records are created automatically by the checkout process — you don't add
  them by hand. Use this list to see who has enrolled and reach out with joining
  details.

---

## 6. Media (images)

- Open **Media → Create New** to upload an image, or upload directly from a
  course's Hero image field.
- Always fill in the **Alt text** (a short description) — it helps accessibility
  and SEO.
- Uploaded images can be reused across courses and pages.

---

## 7. Categories

Optional. Create categories (e.g. "Programming", "Data", "Cloud") under
**Categories**, then assign them to courses in the course sidebar. Useful for
organising a large catalogue.

---

## 8. Pages & Posts (optional)

- **Pages** — extra marketing pages built from content blocks.
- **Posts** — blog articles (the site has a `/posts` blog section).

Both support drafts and a **Preview** button to see changes before publishing.
You generally won't need these for day-to-day course management.

---

## 9. Publishing & live preview tips

- **Save Draft** keeps your work private; **Publish** makes it live.
- Course pages use a short cache, so a published change appears within a minute or
  so (usually immediately).
- Use the **Preview** button (top of a course/page) to see how it will look before
  publishing.

---

## 10. Things only a developer changes

These aren't in the admin panel — ask your developer if you need them changed:

- The **brand colour theme** (Forest & Sky, Emerald, Azure, Indigo AI, Sunrise) and
  light/dark default — set via a site environment variable.
- The **logo**, site navigation links, and footer text.
- **Payment** and **email** provider keys.

---

## Quick troubleshooting

| Problem | Likely fix |
|---------|-----------|
| A new course isn't on the site | Make sure you clicked **Publish** (not just Save Draft). |
| A course isn't on the homepage | Turn on **Featured** in the course sidebar. |
| Price shows wrong | Check the **Price** and **Currency** fields. |
| Can't log in | Use "Forgot password", or ask another admin to reset your user. |
| An image looks broken | Re-upload it in **Media** and re-select it on the course. |
