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

// put /setting/uid to edit a setting with jsons
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

        res.status(200).json(setting);
    }catch(error){
        // Handling any errors
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Failed to update setting' });
    }
    });
    

route.delete('/:uid', async (req,res) =>{
    try{
        const { uid } = req.params;
        const data = req.body;

        // Call the service to delete a setting
        const setting = await settingsService.deleteSetting(uid);
        res.status(204).json(setting);
    }catch(error){
        // Handling any errors
        console.error('Error deleting setting:', error);
        res.status(500).json({ error: 'Failed to delete setting' });
    }
    });

export default route;