# 🧠 Case Studies — Vault Login Demo Project  

Real-world issues and their resolutions during development of the Vault Login Demo project.  
Each entry documents the problem, cause, and implemented solution.  

---

## 🧩 Case Study 1 — App container stopped immediately after startup  

**Error Message:**  
login-app exited with code 0 after 3 seconds  

**Cause:**  
The Node.js container stopped because the command in docker-compose.yml only executed npm install and then quit.  
Docker didn’t keep the process alive since no long-running task was defined.  

**Resolution:**  
Replaced the command with a shell instruction that installs dependencies and starts the app:  
command: ["sh", "-lc", "npm ci || npm install && node app.js"]  

**Lesson Learned:**  
Always ensure a Docker container runs a persistent process — otherwise Docker treats it as finished and stops it.  

---

## 🧩 Case Study 2 — Permission denied (EACCES) on node_modules  

**Error Message:**  
npm error code EACCES  
npm error syscall unlink  
npm error path /app/node_modules/fetch-blob/from.js  

**Cause:**  
The container was mounting the host app/ folder (bind mount) where Windows file locks prevented npm from editing node_modules.  
Result: permission errors and container restarts.  

**Resolution:**  
Switched to a build-based approach:  
- Created a Dockerfile in /app  
- Installed dependencies inside the image  
- Removed the bind mount from docker-compose.yml  

This isolated node_modules from the host system and removed the file-lock conflict.  

**Lesson Learned:**  
Avoid mounting node_modules between Windows hosts and Linux containers. Build dependencies inside the image.  

---

## 🧩 Case Study 3 — additional properties 'app' not allowed  

**Error Message:**  
services.app additional properties 'app' not allowed  

**Cause:**  
app: was defined at the top level of docker-compose.yml instead of under services:.  
YAML structure was invalid because of missing indentation.  

**Resolution:**  
Corrected the file to include the required top-level key:  
version: "3.9"  
services:  
  app:  
    image: node:20-alpine  

**Lesson Learned:**  
Docker Compose requires services: as the root of your configuration. YAML indentation is critical — two spaces can make or break your setup.  

---

## 🧩 Case Study 4 — Git push rejected (remote contains work)  

**Error Message:**  
! [rejected] main -> main (fetch first)  
error: failed to push some refs  

**Cause:**  
The remote repository already contained initial commits (.gitignore, LICENSE) created via GitHub.  
Local repo didn’t have those commits, so Git refused to overwrite without merging.  

**Resolution:**  
Fetched the remote branch and merged histories:  
git pull --allow-unrelated-histories origin main  
git push origin main  

**Lesson Learned:**  
When combining a new local project with a GitHub-initialized repo, merge histories instead of force pushing.  

---

## 🧩 Case Study 5 — Mixed language content (Dutch & English)  

**Issue:**  
The app.js contained Dutch UI text (for example: “Je gegevens zijn veilig opgeslagen”) while the project’s README and purpose were in English.  

**Cause:**  
Initial prototype was written in Dutch for personal testing and later expanded for GitHub publication.  

**Resolution:**  
Translated all interface text to English and updated the success message:  
<h2>Stored Securely</h2>  
<p>Your credentials have been securely stored in Vault.</p>  

**Lesson Learned:**  
Keep project language consistent — it signals professionalism and improves accessibility for global audiences.  

---

# ✅ Summary  

Case | Problem | Resolution  
------|----------|-------------  
1 | Container stops instantly | Run persistent process (npm install && node app.js)  
2 | EACCES on node_modules | Build inside image, no host mount  
3 | Invalid YAML property | Fix indentation under services:  
4 | Push rejected | Merge histories (git pull --allow-unrelated-histories)  
5 | Dutch text in app | Translate to English for consistency  

---

**Author:**  
Kevin Mast — KAI Automation Systems  
