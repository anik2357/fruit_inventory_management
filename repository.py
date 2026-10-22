from sqlalchemy.orm import Session
from models import Fruit
from schema import FruitCreate, FruitUpdate


class FruitRepository:

    def create(self, db: Session, fruit: FruitCreate):
        db_fruit = Fruit(**fruit.model_dump())

        db.add(db_fruit)
        db.commit()
        db.refresh(db_fruit)

        return db_fruit

    def get_all(self, db: Session):
        return (
            db.query(Fruit)
            .order_by(Fruit.id)
            .all()
        )

    def get_by_id(self, db: Session, fruit_id: int):
        return (
            db.query(Fruit)
            .filter(Fruit.id == fruit_id)
            .first()
        )

    def update(
        self,
        db: Session,
        fruit_id: int,
        fruit_data: FruitUpdate
    ):
        db_fruit = self.get_by_id(db, fruit_id)

        if db_fruit is None:
            return None

        for field, value in fruit_data.model_dump().items():
            setattr(db_fruit, field, value)

        db.commit()
        db.refresh(db_fruit)

        return db_fruit

    def delete(self, db: Session, fruit_id: int):
        db_fruit = self.get_by_id(db, fruit_id)

        if db_fruit is None:
            return False

        db.delete(db_fruit)
        db.commit()

        return True