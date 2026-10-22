from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models
from controller import router as fruit_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fruit Inventory Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(fruit_router)


@app.get("/")
def home():
    return {"message": "Fruit Inventory API is running"}