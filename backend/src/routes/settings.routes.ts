import { Router, Request, Response } from 'express';
import * as settingsService from '../services/settings.service';

const route = Router();

// post /setting to create a setting with jsons
route.post('/', async (req,res) =>{
try{
    const data = req.body;
    // Incase the request is empty
    if (!data) {
        return res.status(400).json({ error: 'Cannot update with an empty request' });
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

// put /setting to create a setting with jsons
route.put('/:uid', async (req,res) =>{
    try{
        const { uid } = req.params;
        const data = req.body;

        // Incase the request is empty
        if (!data) {
            return res.status(400).json({ error: 'Cannot update with an empty request' });
          }
        // Call the service to edit a setting
        const setting = await settingsService.editSetting(uid, data);

        res.status(201).json(setting);
    }catch(error){
        // Handling any errors
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Failed to update setting' });
    }
    });
    

export default route;