import { Form, Button } from "react-bootstrap";
import API from "../API/API.mjs";
import { useState } from "react";
import PropTypes from "prop-types";
import './BudgetDefinitionComponent.css';

export const BudgetDefinitionComponent = (props) => {
  const [budget, setBudget] = useState();
  const defineBudget = (e) => {
    e.preventDefault();
    if(budget>0)
    API.defineBudget(budget).then(() => {
      props.phaseCheck();
    });
  };
  return (
    <div className="d-flex justify-content-center">
      <div className="budget-definition">
        <h1>Starting Phase: Budget Allocation</h1>
        {props.user && props.user.role === "admin" && (
          <div>
            <h2>Define Budget</h2>
            <p>The budget for the following phase can be established by admins.</p>
            <Form onSubmit={defineBudget}>
              <Form.Group>
                <Form.Label>Budget in Euro</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-4">
                Submit
              </Button>
            </Form>
          </div>
        )}
        {props.user && props.user.role === "member" && (
          <div>
            <h2>Waiting for the admin to define the budget</h2>
            <p>Please wait patiently for the admin to set the budget.</p>
          </div>
        )}
      </div>
    </div>
  );
};

BudgetDefinitionComponent.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
  phaseCheck: PropTypes.func.isRequired,
};
