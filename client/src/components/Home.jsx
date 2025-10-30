import { useEffect, useState } from "react";
import API from "../API/API.mjs";
import { BudgetDefinitionComponent } from "./BudgetDefinitionComponent";
import { ProposalManagementComponent } from "./ProposalManagementComponent";
import { VotingPreferenceComponent } from "./VotingPreferenceComponent";
import { ApprovalVisibilityComponent } from "./ApprovalVisibilityComponent";
import PropTypes from "prop-types";
import './Home.css';

export const Home = ({ user }) => {
  const [phase, setPhase] = useState(null);
  useEffect(() => {
    API.currentPhase().then((phase) => {
      setPhase(phase.phase_number);
    });
  }, []);
  const phaseCheck = () => {
    API.currentPhase().then((phase) => {
      setPhase(phase.phase_number);
    });
  };
  const changePhase = () => {
    API.changePhase().then((phase) => {
      setPhase(phase.phase_number);
    });
  };
  const renderPhaseComponent = () => {
    switch (phase) {
      case 0:
        return (
          <BudgetDefinitionComponent user={user} phaseCheck={phaseCheck} />
        );
      case 1:
        return (
          <ProposalManagementComponent user={user} changePhase={changePhase} />
        );
      case 2:
        return (
          <VotingPreferenceComponent user={user} changePhase={changePhase} />
        );
      case 3:
        return (
          <ApprovalVisibilityComponent user={user} phaseCheck={phaseCheck} />
        );
      default:
        return null;
    }
  };

  return <div>{renderPhaseComponent()}</div>;
};

Home.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
};
