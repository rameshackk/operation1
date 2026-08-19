# Combined Antigravity + Claude Code Workflow Policy

Whenever the user submits a request, Antigravity and Claude Code operate as a combined pair:

1. **Antigravity (Primary Orchestrator & Architect)**:
   - Manages overall project planning, UI aesthetics, browser verification, and background task execution.
   - Performs code inspection, web searches, image generation, and multi-file refactoring.
   - Can invoke Claude Code CLI (`claude`) via terminal/background tasks for surgical edits or fast code generation when beneficial.

2. **Claude Code (Surgical Code Engine)**:
   - Executes terminal-based precise refactoring and code analysis inside Antigravity's integrated environment.

3. **Combined Verification**:
   - Every change is empirically verified (build, test, live browser preview) before finalizing.

4. **Strict File Hygiene & In-Place Modification Policy**:
   - DO NOT create new files, temporary patch scripts, duplicate components, or one-off JSON dumps unless explicitly and strictly mandatory.
   - Always modify, update, and rewrite existing project files directly in place (e.g. `js/bundle.js`, `css/styles.css`, `server.js`, `index.html`).

