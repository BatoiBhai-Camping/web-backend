import { Router } from "express";
import { getAllPkg } from "../controller/getAllPkg.controller.js";

const appRoute = Router();

appRoute.route("/get-all-pkg").get(getAllPkg);

export { appRoute };
