import express from 'express';
const router = express.Router()

import { admin, adminLogin, adminRegister, login, logout, me, refresh, register } from './controllers/auth';
import { createOrder, getMessBill, getTransaction, verifyOrder, addBill } from './controllers/messBill';
import { getFile, uploadFile } from './controllers/fileUpload';
import { addRebate, adminGetRebate, getRebate } from './controllers/rebate';
import { updateProfilePhotoId, updateProfilePhotoIdAdmin } from './controllers/profile';
import auth from './middleware/auth';
import adminAuth from './middleware/adminAuth';

/******   AUTH   *******/
router.post("/auth/login",login)
router.post("/auth/admin-login",adminLogin)
router.post("/auth/register",register)
router.post("/auth/admin-register",adminRegister)
router.post("/auth/refresh",refresh)
router.get("/auth/logout",logout)
router.get("/auth/me",auth,me)
router.get("/auth/admin",adminAuth,admin)

/******   MESS BILL   *******/
router.get("/messBill/get",auth,getMessBill)
router.post("/messBill/createOrder",auth, createOrder)
router.post("/messBill/verifyOrder",auth, verifyOrder)
router.get("/messBill/getTransaction",auth,getTransaction)
router.post("/messBill/addBill",adminAuth,addBill)

/*******   FILE UPLOAD  *******/
router.post("/file/upload",auth,uploadFile)
router.get("/file/get/:fileName",getFile)

/***********  REBATE  ***************/
router.post("/rebate/addRebate",auth,addRebate)
router.get("/rebate/getRebate",auth,getRebate)
router.get("/rebate/admin-getRebate",adminAuth,adminGetRebate)

/***********  PROFILE  ***************/
router.post("/profile/update/profilePhotoId",auth,updateProfilePhotoId)
router.post("/profile/update/profilePhotoId/admin",adminAuth,updateProfilePhotoIdAdmin)


export default router