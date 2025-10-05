import {Router} from 'express';
import { getUserHistory, login, register, addToHistory } from '../controllers/user.controller.js';

const router=Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/add_to_activity').post(addToHistory);
router.route('/get_all_activities').post(getUserHistory);


export default router;