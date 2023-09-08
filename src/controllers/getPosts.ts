import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/userModel'
import { Op } from "sequelize";

/* -----------------------------------GET ALL BLOG POST----------------------------------------*/
