# PRD.md

## Overview  
This document defines the first version of Insta Resource Box, a small web app that helps users save Instagram posts and the files or links connected to them. The MVP lets users paste a post URL, pull basic info, label the post type, and track whether it needs a comment to receive a resource.

## Goals  
- Let users save an Instagram post by pasting a URL  
- Pull basic metadata with a reliable method  
- Sort posts into simple content types  
- Detect posts that ask for a comment keyword  
- Give users a clear semi manual flow for handling comment based posts  
- Let users track the resource link they receive later  
- Provide a simple list view of saved posts

## Non-Goals  
- No Instagram login  
- No automatic commenting  
- No DM reading  
- No sync across accounts  
- No heavy UI  
- No browser automation

## Audience  
The main users follow many helpful Instagram posts and often lose resource links in their DMs. They want a light tool that lets them save posts, see what needs action, and store the resource link once they get it. They care more about clarity than advanced features.

## Existing solutions and issues  
- Instagram saves: good for bookmarking but no way to track comment based resources  
- Note apps: require manual copy and paste for both posts and links  
- Screenshots: scattered and easy to lose  

These do not offer one place for the post and its related file or link.

## Assumptions  
Based on casual interviews with users who follow study or work related Instagram content:  
- Users can paste URLs with no guidance  
- Users understand how comment funnels work  
- Users do not mind doing the comment step by hand  
- Users want a simple list view more than a complex dashboard  
- Users keep links or files once they have them

## Constraints  
- Must run as a web app using Next.js  
- Use a simple database such as Supabase or SQLite  
- Use oEmbed or fallback fetch for metadata  
- Must avoid Instagram automation  
- Should work even if metadata is incomplete  
- Must run with minimal setup for a demo  
- When deploying to serverless (e.g., Vercel), SQLite writes use `/tmp` by default or `DATA_DIR` override.

## Key use cases  
1. **Save a post by URL**  
   - User pastes a valid Instagram post URL  
   - App checks the URL, fetches metadata, stores a new post entry  

2. **Classify the post**  
   - App reads the caption and assigns one or more simple labels such as tutorial, tips, or resource  

3. **Detect comment based posts**  
   - App checks for clear cues that a comment keyword is needed  
   - App extracts the keyword if possible  

4. **Help the user finish the gated flow**  
   - App shows the keyword  
   - User taps Copy to comment on Instagram manually  
   - User pastes the resource link received later  
   - App updates the status of the post  

5. **View all saved posts**  
   - List view with thumbnail, creator, labels, status, and stored link if present  

### Detailed sections  
#### Save a post by URL  
User sees a field at the top of the page. When a URL is pasted, the app checks it, pulls data, and shows a new card for that post in the list. Errors show when the URL is invalid or data cannot be fetched.

#### Classify the post  
App runs simple rules against the caption to assign a category. This helps the user scan their collection later.

#### Detect comment based posts  
App scans the caption for common cues that ask users to type a word. If found, the app stores the keyword and marks the post as needing user action.

#### Assist the user flow  
Steps:  
- Copy the keyword  
- Comment on Instagram  
- Wait for the DM  
- Paste the link from the DM into the app  

The post card updates its state.

#### List view  
A single page shows all posts. Each card includes:  
- Post thumbnail  
- Creator handle  
- Tags  
- Status: not requested, requested, received  
- Resource link if added  

## How to run / test
- Use Node 20.18.0 (`nvm use 20.18.0`)
- Install dependencies: `npm install`
- Start dev server: `npm run dev`

## Research  
### User Research  
#### How do users save posts today  
Users rely on Instagram saves or screenshots. These methods do not help track comment based posts or store linked files.  
(Interviews: three users who follow study and job related accounts)

#### How much guidance do users need  
Users want short steps, nothing more. They know how to comment.  
(Interviews: two users who often join comment funnels)

#### Do users want full automation  
Users say it's nice later but not needed now. They worry about safety.  
(Interviews: three Instagram heavy users)

### Technical Research  
#### How to fetch metadata without login  
Tested oEmbed for public posts. Works for most cases. Private posts return an error, which the app must show cleanly.

#### Simple pattern check for gated posts  
A rule based check is enough in the MVP. Regex on the caption catches most common phrasing in keyword based posts.

