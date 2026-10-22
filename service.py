from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from repository import FruitRepository
from schema import FruitCreate, FruitUpdate


class FruitService:

    def __init__(self, repository: FruitRepository):
        self.repository = repository

    def create_fruit(self, db: Session, fruit: FruitCreate):
        return self.repository.create(db, fruit)

    def get_all_fruits(self, db: Session):
        return self.repository.get_all(db)

    def get_fruit(self, db: Session, fruit_id: int):
        fruit = self.repository.get_by_id(db, fruit_id)

        if fruit is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fruit not found"
            )

        return fruit

    def update_fruit(
        self,
        db: Session,
        fruit_id: int,
        fruit_data: FruitUpdate
    ):
        fruit = self.repository.update(db, fruit_id, fruit_data)

        if fruit is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fruit not found"
            )

        return fruit

    def delete_fruit(self, db: Session, fruit_id: int):
        deleted = self.repository.delete(db, fruit_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Fruit not found"
            )

        return {"message": "Fruit deleted successfully"}