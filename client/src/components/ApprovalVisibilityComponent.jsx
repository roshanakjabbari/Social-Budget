import { useEffect, useState } from "react";
import API from "../API/API.mjs";
import PropTypes from "prop-types";
import './ApprovalVisibilityComponent.css';

export const ApprovalVisibilityComponent = (props) => {
  const [approvedProposals, setApprovedProposals] = useState([]);
  const [unapprovedProposals, setUnapprovedProposals] = useState([]);
  useEffect(() => {
    API.getAllProposals().then((proposals) => {
      setApprovedProposals(proposals.approved);
      setUnapprovedProposals(proposals.nonApproved);
    });
  }, []);
  const handleRestart = () => {
    API.restartVoting().then(() => {
      props.phaseCheck();
    });
  };
  return (
    <div className="approval-visibility">
      <h1>Final Phase: Concluding Proposals</h1>

      <section>
        <h2>Approved Proposals</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Proposed By</th>
              <th scope="col">Estimated Cost (Euro)</th>
              <th scope="col">Total Score</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {approvedProposals.map((proposal) => (
              <tr key={proposal.id}>
                <td>{proposal.proposer_username}</td>
                <td>{proposal.cost}</td>
                <td>{proposal.total_score}</td>
                <td>{proposal.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {props.user && unapprovedProposals && unapprovedProposals.length > 0 && (
        <section>
          <h2>Unapproved Proposals</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Estimated Cost (Euro)</th>
                <th scope="col">Total Score</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {unapprovedProposals.map((proposal) => (
                <tr key={proposal.id}>
                  <td>{proposal.cost}</td>
                  <td>{proposal.total_score}</td>
                  <td>{proposal.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {props.user && props.user.role === "admin" && (
        <button className="btn btn-primary" onClick={handleRestart}>
          Begin New Voting Round
        </button>
      )}

      {!props.user && (
        <p>
         To participate in viewing and voting on proposals, please log in.
        </p>
      )}
    </div>
  );
};
ApprovalVisibilityComponent.propTypes = {
  user: PropTypes.object,
  phaseCheck: PropTypes.func,
};
