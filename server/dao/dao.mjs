import db from "../db.mjs";
const fetchCurrentSystemPhase = async () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM system_phases", [], (err, row) => {
      if (err) reject(err);
      else resolve(row || { phase_number: 0 });
    });
  });
};

const incrementSystemPhase = async () => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE system_phases SET phase_number = phase_number + ?",
      [1],
      function (err) {
        if (err) {
          reject(err);
        } else {
          db.get("SELECT * FROM system_phases", [], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        }
      }
    );
  });
};

const createAnnualBudgetAndInitializePhase = async (userId, amount) => {
  return new Promise((resolve, reject) => {
    
    db.run(
      "INSERT INTO annual_budgets (member_id,amount) VALUES (?,?)",
      [userId, amount],
      function (err) {
        if (err) reject(err);
        else
          db.run(
            "INSERT INTO system_phases (phase_number) VALUES (?)",
            [1],
            function (err) {
              if (err) {
                reject(err);
              } else {
                resolve({ id: this.lastID, amount: amount });
              }
            }
          );
      }
    );
  });
};
const fetchAllBudgets = async () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM annual_budgets", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
const fetchUserProposals = async (user) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM initiatives WHERE member_id = ?";
    db.all(sql, [user.id], (err, rows) => {
      if (err) {
        reject(err);
      } else if (!rows) {
        resolve([]);
      } else {
        resolve(rows);
      }
    });
  });
};
const fetchProposals = async () => {
  try {
    // Fetch the latest annual budget amount
    const latestBudget = await new Promise((resolve, reject) => {
      db.get(
        "SELECT amount FROM annual_budgets ORDER BY id DESC LIMIT 1",
        [],
        (err, budgetRow) => {
          if (err) {
            console.log("Error fetching budget: " + err);
            reject(new Error("Error fetching budget: " + err));
          } else {
            resolve(budgetRow ? budgetRow.amount : 0);
          }
        }
      );
    });

    if (latestBudget === 0) {
      return {
        approved: [],
        nonApproved: [],
      };
    }

    const initiatives = await new Promise((resolve, reject) => {
      db.all(
        `SELECT i.id, i.description, i.cost, i.member_id,
                COALESCE(SUM(v.score), 0) AS total_score
         FROM initiatives i
         LEFT JOIN votes v ON i.id = v.initiative_id
         GROUP BY i.id
         ORDER BY total_score DESC, i.cost ASC;`,
        [],
        (err, initiatives) => {
          if (err) {
            console.log("Error fetching initiatives: " + err);
            reject(new Error("Error fetching initiatives: " + err));
          } else {
            resolve(initiatives);
          }
        }
      );
    });

    let currentBudget = 0;
    const approved = [];
    const nonApproved = [];

    for (const initiative of initiatives) {
      if (currentBudget + initiative.cost <= latestBudget) {
        const userDetails = await new Promise((resolve, reject) => {
          db.get(
            "SELECT username, email FROM users WHERE id = ?",
            [initiative.member_id],
            (err, userRow) => {
              if (err) {
                console.log("Error fetching user details: " + err);
                reject(new Error("Error fetching user details: " + err));
              } else {
                resolve(userRow);
              }
            }
          );
        });

        initiative.proposer_username = userDetails
          ? userDetails.username
          : null;
        initiative.proposer_email = userDetails ? userDetails.email : null;

        approved.push(initiative);
        currentBudget += initiative.cost;
      } else {
        nonApproved.push({
          id: initiative.id,
          description: initiative.description,
          cost: initiative.cost,
          total_score: initiative.total_score,
        });
      }
    }

    return {
      approved,
      nonApproved,
    };
  } catch (error) {
    throw new Error("Error fetching proposals: " + error.message);
  }
};

const fetchUserPreferenceProposals = async (user) => {
  try {
    // Fetch all initiatives
    const initiatives = await new Promise((resolve, reject) => {
      const sql = "SELECT * FROM initiatives";
      db.all(sql, [], (err, initiatives) => {
        if (err) {
          reject(err);
        } else {
          resolve(initiatives || []);
        }
      });
    });

    // If no initiatives found, resolve with an empty array
    if (initiatives.length === 0) {
      return [];
    }

    // Fetch votes for each initiative for the specified user
    const fetchVoteDetails = initiatives.map((proposal) => {
      return new Promise((resolveVote, rejectVote) => {
        const votesSql =
          "SELECT * FROM votes WHERE initiative_id = ? AND member_id = ?";
        db.get(votesSql, [proposal.id, user.id], (err, vote) => {
          if (err) {
            rejectVote(err);
          } else {
            proposal.vote = vote ? vote.score : 0;
            resolveVote(proposal);
          }
        });
      });
    });

    // Resolve all vote promises and return the updated initiatives
    const updatedInitiatives = await Promise.all(fetchVoteDetails);
    return updatedInitiatives;
  } catch (error) {
    throw new Error("Error fetching preference proposals: " + error.message);
  }
};

const createProposal = async (user, estimatedCost, description) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO initiatives (member_id, cost, description, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
      [user.id, estimatedCost, description],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
};
const removeProposal = async (user, id) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM initiatives WHERE id = ? AND member_id = ?",
      [id, user.id],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const updateProposal = async (user, id, estimatedCost, description) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE initiatives SET cost = ?, description = ? WHERE id = ? AND member_id = ?",
      [estimatedCost, description, id, user.id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const castUserVote = async (user, id, score) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM votes WHERE member_id = ? AND initiative_id = ?",
      [user.id, id],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          db.run(
            "UPDATE votes SET score = ? WHERE member_id = ? AND initiative_id = ?",
            [score, user.id, id],
            function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        } else {
          db.run(
            "INSERT INTO votes (member_id, initiative_id, score) VALUES (?, ?, ?)",
            [user.id, id, score],
            function (err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        }
      }
    );
  });
};
const runQuery = (sql) => {
  return new Promise((resolve, reject) => {
    db.run(sql, [], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
const resetVotingSystem = async () => {
  try {
    await runQuery("DELETE FROM votes");

    await runQuery("DELETE FROM initiatives");

    await runQuery("DELETE FROM annual_budgets");

    await runQuery("DELETE FROM system_phases");

    await runQuery("UPDATE system_phases SET phase_number = 0");
    return;
  } catch (error) {
    throw new Error("Error restarting voting: " + error.message);
  }
};

export default {
  fetchCurrentSystemPhase,
  incrementSystemPhase,
  createAnnualBudgetAndInitializePhase,
  fetchAllBudgets,
  fetchUserProposals,
  fetchProposals,
  fetchUserPreferenceProposals,
  createProposal,
  removeProposal,
  updateProposal,
  castUserVote,
  resetVotingSystem,
};
