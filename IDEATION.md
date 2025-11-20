# Insta Resource Box
One-line description: A simple tool that collects Instagram posts and their linked resources in one clean place.

# IDEATION.md

## Raw Idea  
A Next.js web app where users paste an Instagram post URL. The app fetches basic information, classifies the post, and stores it in a simple collection.  
For posts that follow the “comment X to get resource Y” pattern, the app detects it and guides the user through a semi manual workflow that handles the annoying parts.  
Future versions can include a full automated workflow using a controlled dummy account.

---

## Problem Context  
Instagram is packed with guide-style posts and “comment X to get Y” funnels.  
Users save posts or comment on them, but the final resources often get lost in DMs or mixed with unrelated content.  
There is no simple way to collect these posts, track which ones require a comment, and organize the resource links after receiving them.

---

## Target User  
- Students and workers who follow many instructional or resource-focused Instagram accounts  
- Users who comment on posts to get PDFs, templates, or tool lists  
- People who want a clean personal library of posts and the resources behind them  

---

## Key Use Cases  

### 1. Paste URL and store the post  
User inputs an Instagram post URL.  
The app validates it, fetches metadata such as caption text and creator handle, and saves it.

### 2. Automatic classification  
From the caption, the app identifies content types such as:  
- Tutorials  
- Guides  
- Templates  
- Tool lists  
- Gated content (comment-to-get-link)

### 3. Detect “comment X to get Y” pattern  
The app identifies posts that ask the user to comment a keyword.  
It extracts the keyword and marks the post as gated content.

### 4. Semi manual agent workflow (Level 1 MVP)  
Since full automation is outside MVP scope, the app will:  
- Show the extracted keyword  
- Show a “Copy comment” button for fast commenting  
- Guide the user to paste the comment manually on Instagram  
- Let the user paste the received DM link back into the app  
- Track status changes: Not requested → Requested → Resource received  

This matches real user behavior while testing the logic flow.

### 5. View collected posts  
The app shows a clean dashboard listing all saved posts with fields such as:  
- Thumbnail  
- Creator  
- Tags  
- Gated or not  
- Status  
- Final resource link (if provided)

---

## Solution Hypothesis  
If users can organize Instagram posts and their related resources with a simple paste action, they will keep better track of useful content.  
If the app detects and simplifies “comment-to-get” steps, users will spend less time hunting for links across DMs.

---

## Core Value Proposition  
- One place for Instagram posts and their linked resources  
- Simple paste-based input  
- Auto detection of comment-gate posts  
- Semi manual workflow that keeps the process fast  
- Clear view of collected resources and their states

---

## Scope Hypothesis  

### MVP (for Vibe Coding)  
Must have:  
- Next.js UI to paste an Instagram URL  
- API route that validates URL and fetches basic metadata (oEmbed or fallback)  
- Simple storage (Supabase, SQLite, or in-memory for demo)  
- Rule-based classification  
- Detection of “comment X to get Y” patterns  
- Status fields and manual updates  
- Basic dashboard view  

Nice to have:  
- Tag filters  
- Simple search  
- Suggested comment text  
- Field for user to add the final DM resource link  

Not in scope (for MVP):  
- Real Instagram login  
- Auto commenting  
- Auto DM reading  
- Multi-device sync  
- Heavy UI work

---

## Constraints  

### Time  
Only a few hours to build, so focus on the core flow:  
Paste → Save → Classify → Track.

### Tech  
- Next.js  
- API routes  
- Simple DB  
- Instagram metadata may require fallback or mock data

### Rules  
- No Instagram automation in MVP  
- All automated actions moved to future versions  
- Semi manual flow is safe and simple for demo use

---

## Benchmarking  
- Readwise Reader for content collection  
- Notion Web Clipper for fast saves  
- Google Keep for lightweight structure  
- Instagram creator funnels that use keyword-comment patterns  

These guide the structure of the app.

---

## Agentic Workflow Plan  

### Level 1 (MVP)  
Semi manual agent flow:  
- Detect keyword  
- Copy keyword  
- User comments manually  
- User pastes DM link back into the app  
- App tracks states

### Level 2 (Future)  
Automated commenting using a dummy test account:  
- Script posts the keyword  
- DM arrives  
- Link is copied manually into the app

### Level 3 (Future)  
Full automated workflow using a dummy business account:  
- Auto comment  
- Auto detect DM arrival  
- Parse link and store it  
(This depends on approved APIs or advanced automation.)

---

## PRD Writing Guide  
1. Start with a clear problem statement.  
2. Write the main flows: paste URL, classify, detect gating, track status.  
3. Mark each feature as Must, Nice, or Later.  
4. Include a simple data model.  
5. Add edge cases like private posts or missing captions.  
6. Define demo success criteria.  
7. Note the future automated workflow.

---
