# versioned-notes
Web app allowing to save versioned notes

User Guide



Installation
Install backend
cd backend
python -m venv venv
pip install -r .\requirements.txt
python .\scripts\initdb.py

Run tests
venv\Scripts\activate.bat


Run server
venv\Scripts\activate.bat
uvicorn main:app

add option --reload in dev mode
uvicorn main:app --reload

The FastAPI backend will then be accessible at http://localhost:8000/
http://localhost:8000/docs for full API documentation


Front End
fron end relies on bun package manager, with vite bundler

cd ..\frontend
bun install
bun dev to launch dev server

bun test for tests
