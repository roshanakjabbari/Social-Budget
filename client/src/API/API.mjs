const baseURL = "http://localhost:3000/api/";
async function login(username, password) {
  let response = await fetch(baseURL + "sessions", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;

    throw new Error("Something went wrong");
  }
}

async function logOut() {
  await fetch(baseURL + "sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
}

async function getUserInfo() {
  const response = await fetch(baseURL + "sessions/current", {
    credentials: "include",
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

async function currentPhase() {
  const response = await fetch(baseURL + "current/phase", {
    credentials: "include",
  });
  if (response.ok) {
    const phase = await response.json();
    return phase;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

async function changePhase() {
  const response = await fetch(baseURL + "current/phase", {
    method: "PATCH",
    credentials: "include",
  });
  if (response.ok) {
    const phase = await response.json();
    return phase;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

async function defineBudget(amount) {
  const response = await fetch(baseURL + "admin/budget", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount: amount }),
  });
  if (response.ok) {
    const budget = await response.json();
    return budget;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

const getBudgets = async () => {
  const response = await fetch(baseURL + "budgets", {
    credentials: "include",
  });
  if (response.ok) {
    const budgets = await response.json();
    return budgets;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
};
const getProposals = async () => {
  const response = await fetch(baseURL + "proposals", {
    credentials: "include",
  });
  if (response.ok) {
    const proposals = await response.json();
    return proposals;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
};

const getAllProposals = async () => {
  const response = await fetch(baseURL + "proposals/all", {
    credentials: "include",
  });
  if (response.ok) {
    const proposals = await response.json();
    return proposals;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
};

const getPreferenceProposals = async () => {
  const response = await fetch(baseURL + "proposals/preference", {
    credentials: "include",
  });
  if (response.ok) {
    const proposals = await response.json();
    return proposals;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
};

const addProposal = async (estimatedCost, description) => {
  const response = await fetch(baseURL + "proposals", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      estimated_cost: estimatedCost,
      description: description,
    }),
  });
  if (response.ok) {
    const proposal = await response.json();
    return proposal;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
};
const deleteProposal = async (id) => {
  const response = await fetch(baseURL + "proposals/" + id, {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
};

const editProposal = async (id, estimatedCost, description) => {
  const response = await fetch(baseURL + "proposals/" + id, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      estimated_cost: estimatedCost,
      description: description,
    }),
  });
  if (response.ok) {
    return;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
};

const votePreference = async (proposal_id, vote) => {
  const response = await fetch(baseURL + "proposals/" + proposal_id + "/vote", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score: vote }),
  });
  if (response.ok) {
    return;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
};

const restartVoting = async () => {
  const response = await fetch(baseURL + "admin/restart-voting", {
    method: "POST",
    credentials: "include",
  });
  if (response.ok) {
    return;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
};
const API = {
  login,
  logOut,
  getUserInfo,
  currentPhase,
  changePhase,
  defineBudget,
  getBudgets,
  getProposals,
  getAllProposals,
  getPreferenceProposals,
  addProposal,
  deleteProposal,
  editProposal,
  votePreference,
  restartVoting,
};
export default API;
