import { useEffect, useState } from "react";
import API from "../API/API.mjs";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import './VotingPreferenceComponent.css'

export const VotingPreferenceComponent = (props) => {
  const [proposals, setProposals] = useState([]);
  useEffect(() => {
    API.getPreferenceProposals().then((proposals) => {
      setProposals(proposals);
    });
  }, []);
  const handleVote = (proposal_id, vote) => {
    API.votePreference(proposal_id, vote).then(() => {
      API.getPreferenceProposals().then((proposals) => {
        setProposals(proposals);
      });
    });
  };
  const renderVoteButtons = (proposal) => {
    const voteOptions = [1, 2, 3];

    return (
      <>
        {voteOptions.map((option) => (
          <Button
            key={option}
            variant={proposal.vote === option ? "success" : "outline-success"}
            onClick={() => handleVote(proposal.id, option)}
            disabled={
              props.user.id == proposal.member_id || proposal.vote === option
            }
          >
            {option}
          </Button>
        ))}
        <Button
          variant="outline-danger"
          onClick={() => handleVote(proposal.id, 0)}
          disabled={props.user.id == proposal.member_id || proposal.vote === 0}
        >
          Revoke
        </Button>
      </>
    );
  };

  return (
    <div>
      <h1>Second Phase: Setting Voting Preferences</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Estimated Cost</th>
            <th scope="col">Description</th>
            <th scope="col">Your Preference</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal) => (
            <tr key={proposal.id}>
              <td>{proposal.cost}</td>
              <td>{proposal.description}</td>
              <td>{proposal.vote}</td>
              <td>
                <div className="d-flex justify-content-around">
                  {renderVoteButtons(proposal)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.user && props.user.role === "admin" && (
        <div>
          <Button onClick={props.changePhase}>Change Phase</Button>
        </div>
      )}
    </div>
  );
};

VotingPreferenceComponent.propTypes = {
  user: PropTypes.object,
  changePhase: PropTypes.func.isRequired,
};
