from sqlalchemy import Column, Integer, String, Float
from database import Base


class Fruit(Base):
    __tablename__ = "fruits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    category = Column(String(100), nullable=False)
    stock_quantity = Column(Integer, nullable=False, default=0)
    unit_price = Column(Float, nullable=False, default=0.0)