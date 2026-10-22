from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import declarative_base, sessionmaker

# DATABASE_URL = URL.create(
#     drivername="mysql+pymysql",
#     username="root",
#     password="root",
#     host="localhost",
#     port=3306,
#     database="fruit_inventory"
# )

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://training_8cn2_user:D4JUFWusk4GVGqMXLDVMSZWFz2TEFybU@dpg-dbbfh061egvs73fsa060-a.oregon-postgres.render.com/training_8cn2"
engine = create_engine(SQLALCHEMY_DATABASE_URL) 

# engine = create_engine(
#     DATABASE_URL,
#     pool_pre_ping=True
# )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()