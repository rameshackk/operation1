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
