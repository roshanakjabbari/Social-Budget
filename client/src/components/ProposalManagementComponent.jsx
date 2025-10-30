import { useEffect, useState } from "react";
import API from "../API/API.mjs";
import { Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import './ProposalManagementComponent.css'

export const ProposalManagementComponent = (props) => {
  const [budget, setBudget] = useState();
  const [proposals, setProposals] = useState([]);
  const [estimatedCost, setEstimatedCost] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [proposalId, setProposalId] = useState();
  useEffect(() => {
    API.getBudgets().then((budgets) => {
      setBudget(budgets.amount);
    });
    API.getProposals().then((proposals) => {
      setProposals(proposals);
    });
  }, []);

  const addProposal = (e) => {
    e.preventDefault();
    if (estimatedCost && estimatedCost>0 && description && estimatedCost <= budget) {
      if (!editMode) {
        API.addProposal(estimatedCost, description).then(() => {
          API.getProposals().then((proposals) => {
            setProposals(proposals);
          });
        });
      } else {
        API.editProposal(proposalId, estimatedCost, description).then(() => {
          API.getProposals().then((proposals) => {
            setProposals(proposals);
            setEditMode(false);
          });
        });
      }
      setEstimatedCost("");
      setDescription("");
      setError("");
    } else if (estimatedCost > budget) {
      setError("Please make sure the estimated cost is less than the budget");
    } else if (!estimatedCost || !description) {
      setError("Please make sure to fill all the fields");
    }
  };
  const onDelete = (id) => {
    API.deleteProposal(id).then(() => {
      API.getProposals().then((proposals) => {
        setProposals(proposals);
      });
    });
  };
  const onEditClick = (proposal) => {
    setEditMode(true);
    setProposalId(proposal.id);
    setEstimatedCost(proposal.cost);
    setDescription(proposal.description);
  };
  return (
    <div className="proposal-management">
      <div>
        <h1>First Phase: Proposal Submission</h1>
        <h2>You are allowed to submit up to three proposals.</h2>
        <h2>Current phase budget: {budget} Euro</h2>

        <h2>Proposals</h2>
        <table className="table">
          <thead>
            <tr>
              <th>NO</th>
              <th>Estimated Cost (Euro)</th>
              <th>Description</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal, index) => (
              <tr key={proposal.id}>
                <td>{index + 1}</td>
                <td>{proposal.cost}</td>
                <td>{proposal.description}</td>
                <td>{proposal.created_at}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(proposal.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => onEditClick(proposal)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
            {proposals.length === 0 && (
              <tr>
                <td colSpan="5">No proposals</td>
              </tr>
            )}
          </tbody>
        </table>

        {(proposals.length < 3 || editMode) && (
          <Form onSubmit={addProposal} className="mt-4">
            <Form.Group>
              <Form.Label>Estimated Cost (Euro)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter estimated cost"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <p className="text-danger">{error}</p>
            <Button variant="primary" type="submit" className="mt-4">
              {editMode ? "Edit Proposal" : "Submit Proposal"}
            </Button>
          </Form>
        )}

        {props.user && props.user.role === "admin" && (
          <div className="mt-4">
            <Button onClick={props.changePhase}>Change Phase</Button>
          </div>
        )}
      </div>
    </div>
  );
};

ProposalManagementComponent.propTypes = {
  user: PropTypes.object,
  changePhase: PropTypes.func.isRequired,
};
