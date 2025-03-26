import Result from "../models/result.models.js";
import { uploadOnCloudinary } from "../utils/cloudniary.js";
export const addResult = async (req, res) => {
    try {
        const { year, semester, passPercentage, totalStudents, passedStudents, failedStudents, topperName, topperPercentage, overallTopperName, overallTopperPercentage } = req.body;
    
        let imageUrl = null;
        if (req.file) {
          const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
          if (!cloudinaryResponse) {
            return res.status(500).json({ message: "Failed to upload image" });
          }
          imageUrl = cloudinaryResponse.secure_url;
        }
    
        const newResult = new Result({
          year,
          semester,
          passPercentage,
          totalStudents,
          passedStudents,
          failedStudents,
          topper: {
            name: topperName,
            percentage: topperPercentage,
            image: imageUrl, // Store the Cloudinary image URL
          },
          overallTopper: {
            name: overallTopperName,
            percentage: overallTopperPercentage,
          },
        });
    
        await newResult.save();
        res.status(201).json(newResult);
      } catch (error) {
        res.status(500).json({ message: "Error adding result" });
      }
};

export const getResults = async (req, res) => {
    try {
        const { year, semester } = req.query;
        let filter = {};
        if (year) filter.year = year;
        if (semester) filter.semester = semester;

        const results = await Result.find(filter);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching results", error });
    }
};

// Get overall department topper
export const getTopper = async (req, res) => {
    try {
        const topper = await Result.find().sort({ "overallTopper.percentage": -1 }).limit(1);
        res.status(200).json(topper);
    } catch (error) {
        res.status(500).json({ message: "Error fetching topper", error });
    }
};

// Update a result by ID (with image handling)
export const updateResult = async (req, res) => {
    try {
        const { year, semester, passPercentage, totalStudents, passedStudents, failedStudents, topperName, topperPercentage, overallTopperName, overallTopperPercentage } = req.body;
    
        let imageUrl = req.body.image; // Default to existing image
    
        if (req.file) {
          const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
          if (cloudinaryResponse) {
            imageUrl = cloudinaryResponse.secure_url;
          }
        }
    
        const updatedResult = await Result.findByIdAndUpdate(
          req.params.id,
          {
            year,
            semester,
            passPercentage,
            totalStudents,
            passedStudents,
            failedStudents,
            topper: {
              name: topperName,
              percentage: topperPercentage,
              image: imageUrl,
            },
            overallTopper: {
              name: overallTopperName,
              percentage: overallTopperPercentage,
            },
          },
          { new: true }
        );
    
        res.json(updatedResult);
      } catch (error) {
        res.status(500).json({ message: "Error updating result" });
      }
};

// Delete a result by ID
export const deleteResult = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedResult = await Result.findByIdAndDelete(id);
        if (!deletedResult) return res.status(404).json({ message: "Result not found" });
        res.status(200).json({ message: "Result deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting result", error });
    }
};