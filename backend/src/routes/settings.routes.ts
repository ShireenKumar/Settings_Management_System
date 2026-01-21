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
        res.status(404).json({ error: 'Failed to update setting' });
    }
    });
    
// get /setting/uid to read one setting
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

// get /setting to read all settings
route.get('/', async(req, res) => {
    try{
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0
        // Call the service to read the settings
        const { setting_list, total } = await settingsService.readAllSetting(limit, offset);
        
        // Adding pagination settings
        res.status(200).json({
            setting_list,
            pagination: {
                total,
                limit,
                offset,
            }
        });
    }catch(error){
        // Handling any errors
        console.error('Error reading settings:', error);
        res.status(500).json({ error: 'Failed to read settings' });
    }
});

// get /setting/uid to read one setting
route.get('/:uid', async (req,res) =>{
    try{
        const { uid } = req.params;
        // Call the service to edit a setting
        const setting = await settingsService.readOneSetting(uid);

        res.status(200).json(setting);
    }catch(error){
        // Handling any errors
        console.error('Error reading one setting:', error);
        res.status(404).json({ error: 'Failed to read one setting' });
    }
    });

export default route;