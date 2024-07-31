const express = require("express");
const router = express.Router();

const {
  officialController,
  domainController,
  resourceController,
  projectController,
  contactForumController,
  NewsController,
  TestimonialController,
  UserProfileController,
  EventController,
  CarouselController,
  ClassFeedbackController,
} = require("../../controller/index.js");
const checkDuplicateEmail = require("../../middlewares/checkDuplicateEmail");
const {
  signup,
  login,
  verify,
  passwordResetLink,
  updatePassword,
  getUserByEmail,
  updateRole,
  updateDetails,
} = require("../../controller/user-controller.js");
const { UserService } = require("../../services/index.js");
const {
  validateUserAuth,
  validateisAdminId,
} = require("../../middlewares/auth-request-validators.js");
const {
  authenticate,
  authorizeAdmin,
} = require("../../middlewares/authorization.js");

//leaderboard........

// router.post('/leaderboard', (req, res) => LeaderboardController.createLeaderboardEntry(req, res));
// router.get('/leaderboard/weekly', pagination(Leaderboard), (req, res) => LeaderBoardController.getWeeklyLeaderboard(req, res));
// router.get('/leaderboard/monthly', pagination(Leaderboard), (req, res) => LeaderBoardController.getMonthlyLeaderboard(req, res));
// router.get('/leaderboard/overall', pagination(Leaderboard), (req, res) => LeaderBoardController.getOverallLeaderboard(req, res));
// router.put('/leaderboard/:id', (req, res) => LeaderBoardController.updateLeaderboardEntry(req, res));
// router.delete('/leaderboard/:id', (req, res) => LeaderBoardController.deleteLeaderboardEntry(req, res));
// News routes
router.get("/news", NewsController.getAllNews);
router.get("/news/by/:id", NewsController.getNewsById);
router.post(
  "/create/news",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  NewsController.createNews
);
router.put(
  "/update/news/:id",
  authenticate,
  authorizeAdmin,
  NewsController.updateNews
);
router.delete(
  "/delete/news/:id",
  authenticate,
  authorizeAdmin,
  NewsController.deleteNews
);

// Testimonials routes
router.get("/testimonials", TestimonialController.getAllTestimonials);
router.get("/testimonials/by/:id", TestimonialController.getTestimonialById);

router.post(
  "/testimonials/create",
  upload.single("photo"),
  TestimonialController.createTestimonial
);
router.put(
  "/testimonials/update/:id",
  upload.single("photo"),
  TestimonialController.updateTestimonial
);

router.post(
  "/testimonials/create",
  upload.single("photo"),
  TestimonialController.createTestimonial
);
// router.post("/testimonials/create",TestimonialController.createTestimonial);
router.put("/testimonials/update/:id", TestimonialController.updateTestimonial);

router.delete(
  "/testimonials/delete/:id",
  TestimonialController.deleteTestimonial
);

// User Profile routes
router.get("/profiles", UserProfileController.getAllUserProfiles);
router.get("/profiles/:id", UserProfileController.getUserProfileById);
router.get(
  "/profiles/email/:email",
  UserProfileController.getUserProfileByEmail
);
router.post("/profiles/create", UserProfileController.createUserProfile);
router.put(
  "/profiles/update/:id",
  upload.single("image"),
  UserProfileController.updateUserProfile
);
router.delete("/profiles/delete/:id", UserProfileController.deleteUserProfile);
router.put(
  "/profiles/update/role/:id",
  authenticate,
  authorizeAdmin,
  UserProfileController.updateUserProfile
);

//event Routes...
router.post("/events", upload.array("images", 10), EventController.createEvent);
router.get("/events", EventController.getAllEvents);
router.get("/events/:id", EventController.getEventById);
router.put(
  "/events/:id",
  upload.array("images", 10),
  EventController.updateEvent
);
router.delete("/events/:id", EventController.deleteEvent);

const userService = new UserService();

//Domain Routes
router.post("/domain", authenticate, authorizeAdmin, (req, res) =>
  domainController.createDomain(req, res)
);
router.get("/domains", (req, res) => domainController.getAllDomains(req, res));
router.get("/domain/:id", (req, res) =>
  domainController.getDomainById(req, res)
);
router.put("/domain/:id", authenticate, authorizeAdmin, (req, res) =>
  domainController.updateDomain(req, res)
);
router.delete("/domain/:id", authenticate, authorizeAdmin, (req, res) =>
  domainController.deleteDomain(req, res)
);

//User Routes:

router.post("/signup", signup);
router.post("/login", validateUserAuth, login);
router.get("/verify/:token", verify);
router.get("/forgot/password/:email", passwordResetLink);
router.patch("/reset/password/:token", updatePassword);
router.get("/email/:email", authenticate, authorizeAdmin, getUserByEmail);
router.put("/update/details/:token", updateDetails);
router.put("/update/role/:id", authenticate, authorizeAdmin, updateRole);

router.post("/signup", signup);
router.post("/login", validateUserAuth, login);
router.get("/verify/:token", verify);
router.get("/forgot/password", passwordResetLink);
router.patch("/reset/password/:token", updatePassword);
router.get("/email/:email", getUserByEmail);

//Officials Routes:
router.post(
  "/officials",
  upload.single("photo"),
  checkDuplicateEmail,
  officialController.createOfficial
);
router.get("/officials", officialController.getAllOfficials);
router.get("/officials/:id", officialController.getOfficialById);
router.get("/official/:email", officialController.getOfficialByEmail);
router.put(
  "/officials/:id",
  upload.single("photo"),
  officialController.updateOfficial
);
router.delete("/officials/:id", officialController.deleteOfficial);

// Rewsources Routes
router.post("/resource", authenticate, authorizeAdmin, (req, res) =>
  resourceController.createResource(req, res)
);
router.get("/resources", (req, res) =>
  resourceController.getAllResources(req, res)
);
router.get("/resource/:id", (req, res) =>
  resourceController.getResourceById(req, res)
);
router.get("/resources/:domainId", (req, res) =>
  resourceController.getResourcesByDomain(req, res)
);
router.put("/resource/:id", authenticate, authorizeAdmin, (req, res) =>
  resourceController.updateResource(req, res)
);
router.delete("/resource/:id", authenticate, authorizeAdmin, (req, res) =>
  resourceController.deleteResource(req, res)
);

//Project Routes
router.post(
  "/project",
  upload.single("image"),
  authenticate,
  authorizeAdmin,
  projectController.createProject
);
router.get("/projects", projectController.getAllProjects);
router.get("/project/:id", projectController.getProjectById);
router.put(
  "/project/:id",
  authenticate,
  authorizeAdmin,
  projectController.updateProject
);
router.delete(
  "/project/:id",
  authenticate,
  authorizeAdmin,
  projectController.deleteProject
);
router.get("/project/:domainId", projectController.findProjectsByDomain);

//ContactForum Routes
router.post("/contact-forum", contactForumController.createContactForum);
router.get("/contact-forums", contactForumController.getAllContactForums);
router.get("/contact-forum/:id", contactForumController.getContactForumById);
router.put("/contact-forum/:id", contactForumController.updateContactForum);
router.delete("/contact-forum/:id", contactForumController.deleteContactForum);
router.get(
  "/contact-forums/:domainId",
  contactForumController.getAllContactForumsByDomain
);

router.post(
  "/carousel",
  upload.single("image"),
  CarouselController.createCarousel
);
router.get("/carousel", CarouselController.getAllCarousels);
router.put(
  "/carousel/:id",
  upload.single("image"),
  CarouselController.updateCarousel
);
router.delete("/carousel/:id", CarouselController.deleteCarousel);

router.post("/CR/feedback", ClassFeedbackController.createFeedback);
router.get("/allFeedbacks", ClassFeedbackController.getAllFeedbacks);
router.get("/feedback", ClassFeedbackController.getFeedbacksByFilter);
router.get("/feedbacks", ClassFeedbackController.getAllCollectionsData);

module.exports = router;
