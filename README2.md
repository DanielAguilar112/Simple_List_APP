============================================================
ASSIGNMENT 2: CONNECTED TASKMASTER - README
============================================================

STUDENT NAME: Daniel Aguilar
COURSE:       CS 402 - Mobile Application Development
USER ID:      danielaguilar112
BASE URL:     https://mec402.boisestate.edu/csclasses/cs402/codesnips

--------------------------------------------------------------
**🚀 [View Live Demo](https://my-list-app-one.vercel.app/)**
------------------------------------------------------------
1. PROJECT DESCRIPTION
------------------------------------------------------------
This application is a high-performance task management tool 
built with React. It features full remote data persistence 
with a Boise State PHP backend and advanced list 
virtualization to ensure a smooth 60FPS scrolling experience 
regardless of list size.

------------------------------------------------------------
2. FEATURES IMPLEMENTED
------------------------------------------------------------

[CORE] REMOTE PERSISTENCE:
- Saves full list state to savejson.php via POST.
- Automatically recovers list state on launch via loadjson.php.
- Supports multi-tab organization (Personal, Work, etc).

[CORE] VIRTUALIZED LIST:
- Only renders items currently within the 400px view window.
- Calculates scroll height dynamically based on data size.
- Uses absolute positioning to keep item placement accurate.

[EXTRA CREDIT] PROXY CACHE (25pts):
- Implementation of on-demand lazy loading.
- Initial call to listsize.php determines the "Virtual" size.
- Individual getelement.php calls are fired only as items 
  scroll into view.
- Local memoization (Cache) prevents redundant network 
  requests for previously loaded items.

------------------------------------------------------------
3. TESTING REQUIREMENTS
------------------------------------------------------------
Because the Boise State server does not support CORS 
pre-flight headers, the app MUST be run in a browser with 
web security disabled:

Command: 
start chrome --disable-web-security --user-data-dir=c:\tmp

Note: Connection to Boise State VPN or Campus Network is 
required to access the mec402.boisestate.edu endpoints.

------------------------------------------------------------
4. TECHNICAL SPECIFICATIONS
------------------------------------------------------------
- Framework: React (Vite)
- State Management: React Hooks (useState, useEffect, useCallback)
- Networking: Async/Await Fetch API
- Deployment: Vercel Production Environment
============================================================
