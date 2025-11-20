# TODO.md

## P1: Project setup
- Set up Next.js project
- Add basic routing for main page
- Install Supabase or SQLite client
- Create simple schema for posts table

## P1: URL input and validation
- Build top input field for Instagram URL
- Add URL checker
- Add error states for invalid or private posts

## P1: Metadata fetch
- Connect to oEmbed fetch
- Fall back to basic fetch when needed
- Parse thumbnail, caption, creator name
- Save data in database

## P1: Post classification
- Write caption rule checks for type tags
- Tag posts with simple labels
- Store tags in database

## P1: Comment based post check
- Write regex to find comment cues
- Extract keyword when possible
- Store keyword and status state

## P1: Post card
- Build card UI for each post
- Show thumbnail, creator, tags, status
- Add action buttons for copy keyword and add link

## P1: Resource link flow
- Add field for user to paste resource link
- Update status to received
- Save link to database

## P1: List view
- Show all saved posts on main page
- Add sorting or simple grouping
- Error states for empty list

## P2: UX improvement
- Add loading states
- Add small success indicators
- Add basic empty state text

## P2: Style pass
- Clean card layout
- Improve spacing
- Apply simple color theme
