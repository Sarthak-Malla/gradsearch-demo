import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Remote",
        "Other",
      ],
      default: "Other",
    },
    experienceLevel: {
      type: String,
      enum: ["Entry Level", "Mid Level", "Senior Level", "Not Specified"],
      default: "Not Specified",
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    postedDate: {
      type: Date,
    },
    source: {
      type: String,
      required: true,
      enum: ["LinkedIn", "Indeed", "Other"],
      default: "Other",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add text index for searching
jobSchema.index({
  title: "text",
  company: "text",
  description: "text",
  location: "text",
  skills: "text",
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
