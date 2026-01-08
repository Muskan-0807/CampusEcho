const express = require("express");
const issueRouter = express.Router();
const Issue = require("../models/Issue");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

issueRouter.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can raise issues" });
    }
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const issue = new Issue({
      title,
      description,
      category,
      studentId: req.user._id,
    });

    await issue.save();

    res.status(201).json({
      message: "Issue posted successfully",
      issue: {
        _id: issue._id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        status: issue.status,
        createdAt: issue.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating issue" });
  }
});

issueRouter.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can view their issues" });
    }

    const myIssues = await Issue.find({ studentId: req.user._id })
      .select("-studentId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: myIssues.length,
      issues: myIssues,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching your issues" });
  }
});

issueRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });

    // Always hide student identity for everyone (students and management)
    const responseIssues = issues.map((issue) => ({
      _id: issue._id,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      status: issue.status,
      adminResponse: issue.adminResponse,
      agreeCount: issue.agrees.length,
      disagreeCount: issue.disagrees.length,
      comments: issue.comments,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,

      isMyIssue:
        req.user.role === "student" &&
        issue.studentId?.toString() === req.user._id.toString(),
    }));

    res.status(200).json({
      count: responseIssues.length,
      issues: responseIssues,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching issues" });
  }
});

issueRouter.patch("/:id/status",authMiddleware, adminMiddleware,
  async (req, res) => {
    try {
      const { status, adminResponse } = req.body;

      const issue = await Issue.findById(req.params.id);

      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      if(status === undefined && adminResponse === undefined){
        return res.status(400).json({
          message:"Nothing to update",
        });
      }

      const allowedStatus = ["Pending", "In Progress", "Resolved"];

      if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }

      // Update status and response
      if (status) issue.status = status;
      if (adminResponse !== undefined) issue.adminResponse = adminResponse;

      await issue.save();
      res.json({
        message: "issue updated successfully",
        issue: {
          _id: issue._id,
          title: issue.title,
          description: issue.description,
          category: issue.category,
          status: issue.status,
          adminResponse: issue.adminResponse,
          agreesCount: issue.agrees.length,
          disagreesCount: issue.disagrees.length,
          comments: issue.comments,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        },
      });
    } catch (error) {
      console.error("Update issue error:", error);
      res
        .status(500)
        .json({ message: "Server error while updating issue" });
    }
  }
);

issueRouter.post('/:id/agree', authMiddleware, async (req, res) => {
  try {
    if(req.user.role != 'student'){
      return res.status(403).json({message:"Only Students can agree"});
    }
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    const userId = req.user._id;

    issue.disagrees = issue.disagrees.filter(id => id.toString() !== userId.toString);

    if (!issue.agrees.includes(userId)) {
      issue.agrees.push(userId);
    }

    await issue.save();

    res.json({
      message: 'Agreement recorded',
      agreeCount: issue.agrees.length,
      disagreeCount: issue.disagrees.length
    });
  } catch (error) {
    console.error('Agree error:', error);
    res.status(500).json({ message: 'Server error while recording agreement' });
  }
});

issueRouter.post('/:id/disagree', authMiddleware, async (req, res) => {
  try {
    if(req.user.role != 'student'){
      return res.status(403).json({message:"Only Students can agree"});
    }
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const userId = req.user._id;

    // Remove from agrees if present
    issue.agrees = issue.agrees.filter(id => id.toString() !== userId.toString());

    // Add to disagrees if not already present
    if (!issue.disagrees.includes(userId)) {
      issue.disagrees.push(userId);
    }

    await issue.save();

    res.json({
      message: 'Disagreement recorded',
      agreeCount: issue.agrees.length,
      disagreeCount: issue.disagrees.length
    });
  } catch (error) {
    console.error('Disagree error:', error);
    res.status(500).json({ message: 'Server error while recording disagreement' });
  }
});

issueRouter.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    if(req.user.role !== 'student'){
      return res.status(403).json({message:"Only Students can comment on issues"});
    }
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Add comment (anonymous for students in public view)
    issue.comments.push({
      userId: req.user._id,
      text: text.trim()
    });

    await issue.save();

    res.json({
      message: 'Comment added successfully',
      
    });
  } catch (error) {
    console.error('Add Comment error:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
});

issueRouter.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({ message: 'Server error while deleting issue' });
  }
});




module.exports = issueRouter;
