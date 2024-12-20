import { Router } from 'express';
import { FamilyController } from '../controllers/familyController';
import { validateRequest } from '../middlewares/validateRequest';
import { createFamilySchema, updateFamilySchema, addFamilyMemberSchema } from '../validators/familyValidators';

const router = Router();
const familyController = new FamilyController();

// Create family
router.post(
  '/',
  validateRequest(createFamilySchema),
  familyController.createFamily.bind(familyController)
);

// Update family
router.put(
  '/:familyId',
  validateRequest(updateFamilySchema),
  familyController.updateFamily.bind(familyController)
);

// Get family
router.get(
  '/:familyId',
  familyController.getFamily.bind(familyController)
);

// Delete family
router.delete(
  '/:familyId',
  familyController.deleteFamily.bind(familyController)
);

// List families
router.get(
  '/',
  familyController.listFamilies.bind(familyController)
);

// Add family member
router.post(
  '/:familyId/members',
  validateRequest(addFamilyMemberSchema),
  familyController.addFamilyMember.bind(familyController)
);

// Remove family member
router.delete(
  '/:familyId/members/:userId',
  familyController.removeFamilyMember.bind(familyController)
);

export const familyRoutes = router; 