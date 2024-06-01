const express = require( 'express' );
const router = express.Router();
const experienceController = require( '../controllers/experience/experience-controller' );

// Handles all routing for addresses using Express framework
router.get('/', experienceController.getAllExperiences);
router.post('/', experienceController.createExperience);
router.put('/:id', experienceController.updateExperience);
router.delete('/:id', experienceController.deleteExperience);
router.get('/search', experienceController.getExperienceBySearchString);

module.exports = router;
