import express from "express";
import passport from "./passport.mjs";
import dao from "./dao/dao.mjs";

const router = express.Router();

router.post("/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: info });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json(req.user);
    });
  })(req, res, next);
});

router.get("/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.delete("/sessions/current", (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});
router.get("/current/phase", async (req, res) => {
  try {
    const phase = await dao.fetchCurrentSystemPhase();
    res.json(phase);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.patch("/current/phase", async (req, res) => {
  try {
    const phase = await dao.incrementSystemPhase();
    res.json(phase);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/admin/budget", async (req, res) => {
  try {
    const budget = await dao.createAnnualBudgetAndInitializePhase(
      req.user.id,
      req.body.amount
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/budgets", async (req, res) => {
  try {
    const budgets = await dao.fetchAllBudgets();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/proposals", async (req, res) => {
  try {
    const proposals = await dao.fetchUserProposals(req.user);
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/proposals/all", async (req, res) => {
  try {
    const proposals = await dao.fetchProposals();
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/proposals/preference", async (req, res) => {
  try {
    const proposals = await dao.fetchUserPreferenceProposals(req.user);
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/proposals", async (req, res) => {
  try {
    const proposal = await dao.createProposal(
      req.user,
      req.body.estimated_cost,
      req.body.description
    );
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/proposals/:id", async (req, res) => {
  try {
    await dao.removeProposal(req.user, req.params.id);
    res.json({});
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.patch("/proposals/:id", async (req, res) => {
  try {
    await dao.updateProposal(
      req.user,
      req.params.id,
      req.body.estimated_cost,
      req.body.description
    );
    res.json({});
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
router.post("/proposals/:id/vote", async (req, res) => {
  try {
    await dao.castUserVote(req.user, req.params.id, req.body.score);
    res.json({});
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/admin/restart-voting", async (req, res) => {
  try {
    await dao.resetVotingSystem();
    res.json({});
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
export default router;
