import { Router, Request, Response } from 'express';
import * as settingsService from '../services/settings.service';

const route = Router();

// post /setting to create a setting with jsons
route.post('/', async (req,res) =>{
try{
    const data = req.body;
    // Incase the data is empty
    if (!data) {
        return res.status(400).json({ error: 'Can not create an empty setting' });
      }
    // Call the service to create a setting
    const setting = await settingsService.createSetting(data);
    res.status(201).json(setting);
}catch(error){
    // Handling any errors
    console.error('Error creating setting:', error);
    res.status(500).json({ error: 'Failed to create setting' });
}
});

export default route;