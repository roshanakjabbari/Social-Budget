import { useEffect, useState } from "react";
import API from "../API/API.mjs";
import { ApprovalVisibilityComponent } from "./ApprovalVisibilityComponent";
import './GuestsHome.css'

export const GuestsHome = () => {
  const [phase, setPhase] = useState(null);
  useEffect(() => {
    API.currentPhase().then((phase) => {
      setPhase(phase.phase_number);
    });
  }, []);
  return (
    <div className="GuestsHome">
      <h1>Home</h1>
      {phase !== null && (
        <div>
          {(() => {
            switch (phase) {
              case 0:
                return <p>Phase {phase} is currently active.</p>;
              case 1:
                return <p>Phase {phase} is currently active.</p>;
              case 2:
                return <p>Phase {phase} is currently active.</p>;
              case 3:
                return <ApprovalVisibilityComponent />;
              default:
                return null;
            }
          })()}
        </div>
      )}
    </div>
  );
};