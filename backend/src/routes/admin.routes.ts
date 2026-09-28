import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler as h } from "../utils/async-handler";
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
router.post("/auth/login", h(login));
router.get("/auth/me", requireAuth, h(me));

// Protected admin routes
router.get("/admin/courses", requireAuth, h(listCourses));
router.get("/admin/courses/:id", requireAuth, h(getCourseById));
router.post("/admin/courses", requireAuth, h(createCourse));
router.put("/admin/courses/:id", requireAuth, h(updateCourse));
router.delete("/admin/courses/:id", requireAuth, h(deleteCourse));

router.get("/admin/categories", requireAuth, h(listCategories));
router.post("/admin/categories", requireAuth, h(createCategory));
router.put("/admin/categories/:id", requireAuth, h(updateCategory));
router.delete("/admin/categories/:id", requireAuth, h(deleteCategory));

router.get("/admin/registrations", requireAuth, h(listRegistrations));
router.patch("/admin/registrations/:id/status", requireAuth, h(updateRegistrationStatus));
router.delete("/admin/registrations/:id", requireAuth, h(deleteRegistration));

router.get("/admin/messages", requireAuth, h(listMessages));
router.patch("/admin/messages/:id/status", requireAuth, h(updateMessageStatus));
router.delete("/admin/messages/:id", requireAuth, h(deleteMessage));

router.get("/admin/germany", requireAuth, h(listOpportunities));
router.get("/admin/germany/:id", requireAuth, h(getOpportunity));
router.post("/admin/germany", requireAuth, h(createOpportunity));
router.put("/admin/germany/:id", requireAuth, h(updateOpportunity));
router.delete("/admin/germany/:id", requireAuth, h(deleteOpportunity));

router.get("/admin/testimonials", requireAuth, h(listAllTestimonials));
router.post("/admin/testimonials", requireAuth, h(createTestimonial));
router.put("/admin/testimonials/:id", requireAuth, h(updateTestimonial));
router.delete("/admin/testimonials/:id", requireAuth, h(deleteTestimonial));

router.get("/admin/homepage", requireAuth, h(getHomepage));
router.patch("/admin/homepage", requireAuth, h(updateHomepage));

router.get("/admin/settings", requireAuth, h(getSettings));
router.patch("/admin/settings", requireAuth, h(updateSettings));

export default router;
