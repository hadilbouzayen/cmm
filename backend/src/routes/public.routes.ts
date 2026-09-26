import { Router } from "express";
import { listCourses, getCourseById } from "../controllers/courses.controller";
import { listCategories } from "../controllers/categories.controller";
import { listOpportunities } from "../controllers/germany.controller";
import { listPublishedTestimonials } from "../controllers/testimonials.controller";
import { getHomepage } from "../controllers/homepage.controller";
import { getSettings } from "../controllers/settings.controller";
import { submitRegistration } from "../controllers/registrations.controller";
import { submitContact } from "../controllers/contact.controller";

const router = Router();

router.get("/courses", listCourses);
router.get("/courses/:id", getCourseById);
router.get("/categories", listCategories);
router.get("/germany-opportunities", listOpportunities);
router.get("/testimonials", listPublishedTestimonials);
router.get("/homepage", getHomepage);
router.get("/settings", getSettings);
router.post("/registrations", submitRegistration);
router.post("/contact", submitContact);

export default router;
