import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { login, me } from "../controllers/auth.controller";
import {
  listCourses, getCourseById, createCourse, updateCourse, deleteCourse,
} from "../controllers/courses.controller";
import {
  listCategories, createCategory, updateCategory, deleteCategory,
} from "../controllers/categories.controller";
import {
  listRegistrations, updateRegistrationStatus, deleteRegistration,
} from "../controllers/registrations.controller";
import {
  listMessages, updateMessageStatus, deleteMessage,
} from "../controllers/contact.controller";
import {
  listOpportunities, getOpportunity, createOpportunity, updateOpportunity, deleteOpportunity,
} from "../controllers/germany.controller";
import {
  listAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} from "../controllers/testimonials.controller";
import { getHomepage, updateHomepage } from "../controllers/homepage.controller";
import { getSettings, updateSettings } from "../controllers/settings.controller";

const router = Router();

// Auth (public)
router.post("/auth/login", login);
router.get("/auth/me", requireAuth, me);

// Protected admin routes
router.get("/admin/courses", requireAuth, listCourses);
router.get("/admin/courses/:id", requireAuth, getCourseById);
router.post("/admin/courses", requireAuth, createCourse);
router.put("/admin/courses/:id", requireAuth, updateCourse);
router.delete("/admin/courses/:id", requireAuth, deleteCourse);

router.get("/admin/categories", requireAuth, listCategories);
router.post("/admin/categories", requireAuth, createCategory);
router.put("/admin/categories/:id", requireAuth, updateCategory);
router.delete("/admin/categories/:id", requireAuth, deleteCategory);

router.get("/admin/registrations", requireAuth, listRegistrations);
router.patch("/admin/registrations/:id/status", requireAuth, updateRegistrationStatus);
router.delete("/admin/registrations/:id", requireAuth, deleteRegistration);

router.get("/admin/messages", requireAuth, listMessages);
router.patch("/admin/messages/:id/status", requireAuth, updateMessageStatus);
router.delete("/admin/messages/:id", requireAuth, deleteMessage);

router.get("/admin/germany", requireAuth, listOpportunities);
router.get("/admin/germany/:id", requireAuth, getOpportunity);
router.post("/admin/germany", requireAuth, createOpportunity);
router.put("/admin/germany/:id", requireAuth, updateOpportunity);
router.delete("/admin/germany/:id", requireAuth, deleteOpportunity);

router.get("/admin/testimonials", requireAuth, listAllTestimonials);
router.post("/admin/testimonials", requireAuth, createTestimonial);
router.put("/admin/testimonials/:id", requireAuth, updateTestimonial);
router.delete("/admin/testimonials/:id", requireAuth, deleteTestimonial);

router.get("/admin/homepage", requireAuth, getHomepage);
router.patch("/admin/homepage", requireAuth, updateHomepage);

router.get("/admin/settings", requireAuth, getSettings);
router.patch("/admin/settings", requireAuth, updateSettings);

export default router;
