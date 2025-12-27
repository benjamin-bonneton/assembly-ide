// Env
import { NB_DATA_MEMORY, START_RESERVED_MEMORY } from "../vite-env.d";

// React
import React from "react";

// Providers
import { useAssembleur } from "@providers/assembleur/useAssembleur";

// Hooks
import useAssembleurEngine from "@hooks/useAssembleurEngine";

// Styles
import "@styles/ActionsAndDataPanel.css";

// Icons
import collapseIcon from "@images/collapse.svg";
import expandIcon from "@images/expand.svg";

function ActionsAndDataPanel({
  isVisible,
  setVisibility,
}: {
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
}) {
  // Assembleur Provider
  const { assembleur, setAssembleur } = useAssembleur();

  // Assembleur Engine
  const { startProgram, stopProgram, resetState } = useAssembleurEngine();

  if (!isVisible) {
    return (
      <div id="actions_and_data_closed">
        <img
          src={expandIcon}
          alt="Expand Actions & Data"
          className="action"
          title="Expand Actions & Data"
          id="actions_and_data_closed_toggle"
          onClick={() => {
            setVisibility(true);
          }}
        />
      </div>
    );
  }

  return (
    <div id="actions_and_data">
      <div className="container">
        {/*Header*/}
        <div className="header">
          <img
            src={collapseIcon}
            alt="Collapse Actions & Data"
            className="action"
            title="Collapse Actions & Data"
            id="actions_and_data_toggle"
            onClick={() => {
              setVisibility(false);
            }}
          />
          <p className="title">Actions & Data</p>
        </div>

        {/*Program Counter*/}
        <div id="program_counter" className="card center">
          <div className="content">
            <p>
              Program Counter :{" "}
              <span className="filled">{assembleur.programCounter}</span>
            </p>
          </div>
        </div>

        {/*Start/Stop*/}
        {!assembleur.isRunning ? (
          <div
            id="start"
            className="center"
            onClick={() => {
              startProgram(-1);
            }}
          >
            <div className="content">
              <button id="start_button" type="button">
                Start
              </button>
            </div>
          </div>
        ) : (
          <div
            id="stop"
            className="center"
            onClick={() => {
              stopProgram();
            }}
          >
            <div className="content">
              <button id="stop_button" type="button">
                Stop
              </button>
            </div>
          </div>
        )}

        {/*Step*/}
        <div id="step" className="center">
          <div className="content">
            <button
              id="step_button"
              type="button"
              onClick={() => {
                if (assembleur.stepLimit < 0) {
                  startProgram(1);
                  return;
                }
                startProgram(assembleur.stepLimit + 1);
              }}
            >
              Next Step
            </button>
          </div>
        </div>

        {/*Reset*/}
        <div id="reset" className="center">
          <div className="content">
            <button
              id="reset_button"
              type="button"
              onClick={() => {
                resetState();
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/*Rate*/}
        <div id="rate" className="card center">
          <div className="content">
            <p>Instructions Per Second</p>
            <input
              type="number"
              min="1"
              max="100000"
              value={assembleur.instructionsPerSecond}
              id="rate_input"
              name="rate_input"
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value > 0) {
                  setAssembleur({
                    ...assembleur,
                    instructionsPerSecond: value,
                  });
                }
              }}
            />
          </div>
        </div>

        {/*Flags*/}
        <div id="flags" className="card center">
          <div className="content">
            <p>Flags</p>
            <div className="items">
              <div className="item">
                <span className="label">Carry:</span>
                <span id="flag-carry-value" className="state">
                  {assembleur.flags.carry ? "True" : "False"}
                </span>
              </div>
              <p className="divider">|</p>
              <div className="item">
                <span className="label">Zero:</span>
                <span id="flag-zero-value" className="state">
                  {assembleur.flags.zero ? "True" : "False"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*Registers*/}
        <div id="registers" className="card center">
          <div className="content">
            <p>Registers</p>
            <table>
              <tbody>
                {Array.from({
                  length: Math.ceil(assembleur.registers.length / 4),
                }).map((_, rowIdx) => (
                  <tr key={`register-row-${String(rowIdx)}`}>
                    {Array.from({ length: 4 }).map((_, colIdx) => {
                      const regIdx = rowIdx * 4 + colIdx;
                      if (regIdx >= assembleur.registers.length) return null;
                      return (
                        <React.Fragment key={regIdx}>
                          <th>r{regIdx}:</th>
                          <td
                            style={{
                              color:
                                assembleur.registers[regIdx] !== 0
                                  ? "var(--color-primary)"
                                  : undefined,
                            }}
                          >
                            {assembleur.registers[regIdx]
                              .toString()
                              .padStart(3, "0")}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/*Memory*/}
        <div id="memory" className="card center">
          <div className="content">
            <p>RAM (Address:Value)</p>
            <table>
              <tbody>
                {Array.from({
                  length: Math.ceil(START_RESERVED_MEMORY / 4),
                }).map((_, rowIdx) => (
                  <tr key={`memory-row-${String(rowIdx)}`}>
                    {Array.from({ length: 4 }).map((_, colIdx) => {
                      const regIdx = rowIdx * 4 + colIdx;
                      if (regIdx >= assembleur.memories.length) return null;
                      return (
                        <React.Fragment key={regIdx}>
                          <th>{regIdx.toString().padStart(3, "0")}:</th>
                          <td
                            style={{
                              color:
                                assembleur.memories[regIdx] !== 0
                                  ? "var(--color-primary)"
                                  : undefined,
                            }}
                          >
                            {assembleur.memories[regIdx]
                              .toString()
                              .padStart(3, "0")}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p>{START_RESERVED_MEMORY}-{NB_DATA_MEMORY - 1} Reserved for I/O Ports</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionsAndDataPanel;
