const testimonialService = require("../services/testimonial-service");
const fs = require("fs");
const multer = require("multer");
class TestimonialController {
  async getAllTestimonials(req, res) {
    try {
      const testimonials = await testimonialService.getAllTestimonials();
      res.status(200).json(testimonials);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTestimonialById(req, res) {
    try {
      const testimonial = await testimonialService.getTestimonialById(
        req.params.id
      );
      if (!testimonial)
        return res.status(404).json({ message: "Testimonial not found" });
      res.status(200).json(testimonial);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // async createTestimonial(req, res) {
  //     try {
  //         const testimonialData=req.body;
  //         console.log("Req file",req.file);

  //         res.status(201).json(testimonial);
  //     } catch (error) {
  //         res.status(400).json({ message: error.message });
  //     }
  // }

  async createTestimonial(req, res) {
    try {
      const testimonialData = req.body;
      console.log("Req file", req.file);

      if (req.file) {
        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);
        const fileBase64 = fileBuffer.toString("base64");
        console.log("in controller:", filePath, fileBuffer, fileBase64);
        // Add the Base64 image to testimonialData
        testimonialData.photo = fileBase64;

        // Delete the file after converting to Base64
        fs.unlinkSync(filePath);
      }

      const testimonial = await testimonialService.createTestimonial(
        testimonialData
      );
      console.log("in controller test:", testimonial);

      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateTestimonial(req, res) {
    try {
      const testimonialData = req.body;
      console.log("Req file", req.file);

      if (req.file) {
        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);
        const fileBase64 = fileBuffer.toString("base64");
        console.log("in controller:", filePath, fileBuffer, fileBase64);
        // Add the Base64 image to testimonialData
        testimonialData.photo = fileBase64;

        // Delete the file after converting to Base64
        fs.unlinkSync(filePath);
      }

      const testimonial = await testimonialService.updateTestimonial(
        req.params.id,
        testimonialData
      );
      console.log("in controller test:", testimonial);
      if (!testimonial)
        return res.status(404).json({ message: "Testimonial not found" });
      res.status(200).json(testimonial);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteTestimonial(req, res) {
    try {
      const testimonial = await testimonialService.deleteTestimonial(
        req.params.id
      );
      if (!testimonial)
        return res.status(404).json({ message: "Testimonial not found" });
      res.status(200).json({ message: "Testimonial deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TestimonialController();
