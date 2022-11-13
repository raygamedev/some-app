/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface BarcodeModel {
  user_guid: string;
  mark: CardMarkModel;
}
export interface CardMarkModel {
  index: number;
  barcode: string;
  is_marked: boolean;
  position: Point;
}
export interface Point {
  x: number;
  y: number;
}
export interface CardColor {
  background: string;
  mark_area: string;
}
export interface UserCardModel {
  marks?: CardMarkModel[];
  colors: CardColor;
  code?: string;
}
export interface UserModel {
  _id: string;
  card?: UserCardModel;
}
