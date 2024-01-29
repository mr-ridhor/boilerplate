import express from "express";

export interface RequestType extends express.Request {
  userId: number;
}
