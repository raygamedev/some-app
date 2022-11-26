from uuid import UUID
from pydantic import BaseModel, Field
from typing import List


# --- MongoDB Types --- #
class Point(BaseModel):
    x: int
    y: int


class wdeaog(BaseModel):
    log: str
    user_guid: str


class CardMarkModel(BaseModel):
    index: int
    barcode: str
    is_marked: bool
    position: Point


class CardColor(BaseModel):
    background: str
    mark_area: str


AVAILABLE_CARD_COLORS: List[CardColor] = [
    CardColor(background='#EAAB7E', mark_area='#F1C9AD'),
    CardColor(background='#A25E58', mark_area='#C2827C'),
    CardColor(background='#7F946C', mark_area='#ABC296'),
    CardColor(background='#CFC4AC', mark_area='#DFD0AE'),
    CardColor(background='#9EA779', mark_area='#D2DAB4'),
    CardColor(background='#7B9091', mark_area='#A5BABB'),
    CardColor(background='#AA9664', mark_area='#C6B99A'),
    CardColor(background='#BBA6BE', mark_area='#DDC7E0'),
    CardColor(background='#CA9C97', mark_area='#EAC6C2'),
]


class UserCardModel(BaseModel):
    marks: List[CardMarkModel] = []
    colors: CardColor
    code: str


class UserModel(BaseModel):
    user_id: UUID = Field(..., alias="_id")
    card: UserCardModel = None


# --- API Types --- #
class BarcodeModel(BaseModel):
    user_guid: str
    mark: CardMarkModel
