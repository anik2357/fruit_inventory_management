from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from database import get_db
from repository import FruitRepository
from service import FruitService
from schema import FruitCreate, FruitUpdate, FruitResponse

router = APIRouter(prefix="/fruits", tags=["Fruits"])

repository = FruitRepository()
service = FruitService(repository)


@router.post(
    "/",
    response_model=FruitResponse,
    status_code=status.HTTP_201_CREATED
)
def create_fruit(
    fruit: FruitCreate,
    db: Session = Depends(get_db)
):
    return service.create_fruit(db, fruit)


@router.get("/", response_model=list[FruitResponse])
def get_fruits(db: Session = Depends(get_db)):
    return service.get_all_fruits(db)


@router.get("/{fruit_id}", response_model=FruitResponse)
def get_fruit(
    fruit_id: int,
    db: Session = Depends(get_db)
):
    return service.get_fruit(db, fruit_id)


@router.put("/{fruit_id}", response_model=FruitResponse)
def update_fruit(
    fruit_id: int,
    fruit: FruitUpdate,
    db: Session = Depends(get_db)
):
    return service.update_fruit(db, fruit_id, fruit)


@router.delete("/{fruit_id}")
def delete_fruit(
    fruit_id: int,
    db: Session = Depends(get_db)
):
    return service.delete_fruit(db, fruit_id)