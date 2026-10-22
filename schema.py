from pydantic import BaseModel, Field, ConfigDict


class FruitCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=100)
    stock_quantity: int = Field(ge=0)
    unit_price: float = Field(ge=0)


class FruitUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=100)
    stock_quantity: int = Field(ge=0)
    unit_price: float = Field(ge=0)


class FruitResponse(BaseModel):
    id: int
    name: str
    category: str
    stock_quantity: int
    unit_price: float

    model_config = ConfigDict(from_attributes=True)