import express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      agentId?: string;
      userEmail?: string;
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}
