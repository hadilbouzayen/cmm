import { Router } from "express";
import { listCourses, getCourseById } from "../controllers/courses.controller";
import { listCategories } from "../controllers/categories.controller";
import { listOpportunities } from "../controllers/germany.controller";
import { listPublishedTestimonials } from "../controllers/testimonials.controller";
import { getHomepage } from "../controllers/homepage.controller";
import { getSettings } from "../controllers/settings.controller";
import { submitRegistration } from "../controllers/registrations.controller";
import { submitContact } from "../controllers/contact.controller";
import { honeypot, rateLimit } from "../middleware/antispam.middleware";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.get("/courses", asyncHandler(listCourses));
router.get("/courses/:id", asyncHandler(getCourseById));
router.get("/categories", asyncHandler(listCategories));
router.get("/germany-opportunities", asyncHandler(listOpportunities));
router.get("/testimonials", asyncHandler(listPublishedTestimonials));
router.get("/homepage", asyncHandler(getHomepage));
router.get("/settings", asyncHandler(getSettings));
router.post("/registrations", rateLimit, honeypot, asyncHandler(submitRegistration));
router.post("/contact", rateLimit, honeypot, asyncHandler(submitContact));

export default router;
