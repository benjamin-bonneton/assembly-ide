// Env
import { VERSION } from "../vite-env.d";

// Providers
import { useAssembleur } from "@providers/assembleur/useAssembleur";

// Styles
import "@styles/InterfacesPanel.css";

// Icons
import collapseIcon from "@images/collapse.svg";
import expandIcon from "@images/expand.svg";

function InterfacesPanel({
  isVisible,
  setVisibility,
}: {
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
}) {
  // Assembleur Provider
  const { assembleur } = useAssembleur();

  if (!isVisible) {
    return (
      <div id="interfaces_closed">
        <img
          src={expandIcon}
          alt="Expand Interfaces"
          className="action"
          title="Expand Interfaces"
          id="interfaces_closed_toggle"
          onClick={() => {
            setVisibility(true);
          }}
        />
      </div>
    );
  }

  return (
    <div id="interfaces">
      <div className="container">
        {/*Header*/}
        <div className="header">
          <p className="title">Interfaces</p>
          <img
            src={collapseIcon}
            alt="Collapse Interfaces"
            className="action"
            title="Collapse Interfaces"
            id="interfaces_toggle"
            onClick={() => {
              setVisibility(false);
            }}
          />
        </div>

        {/*Screen Text*/}
        <div id="screen_text" className="card center">
          <div className="content">
            <p>
              {assembleur.screenText
                .map((item) => (item === "" ? "_" : item))
                .join(" ")}
            </p>
          </div>
        </div>

        {/*Screen Number*/}
        <div id="screen_number" className="card center">
          <div className="content">
            <p>{assembleur.screenNumber}</p>
          </div>
        </div>

        {/*Screen Pixels*/}
        <div id="screen_pixels" className="card">
          <div id="screen_pixels_content" className="content">
            {assembleur.screenPixels.map((pixel, i) => (
              <div
                // eslint-disable-next-line react-x/no-array-index-key
                key={i}
                className={pixel ? "pixel-on" : "pixel-off"}
              ></div>
            ))}
          </div>
        </div>

        {/*Game Pad*/}
        <div id="game_pad" className="card center">
          <div id="game_pad_content" className="content">
            <div
              id="key-left"
              className={
                (assembleur.controllerInput & 1) !== 0 ? "key-pressed" : ""
              }
            >
              A
            </div>
            <div
              id="key-up"
              className={
                (assembleur.controllerInput & 8) !== 0 ? "key-pressed" : ""
              }
            >
              W
            </div>
            <div
              id="key-right"
              className={
                (assembleur.controllerInput & 4) !== 0 ? "key-pressed" : ""
              }
            >
              D
            </div>
            <div
              id="key-down"
              className={
                (assembleur.controllerInput & 2) !== 0 ? "key-pressed" : ""
              }
            >
              S
            </div>
            <div
              id="key-tl"
              className={
                (assembleur.controllerInput & 64) !== 0 ? "key-pressed" : ""
              }
            >
              T
            </div>
            <div
              id="key-tr"
              className={
                (assembleur.controllerInput & 128) !== 0 ? "key-pressed" : ""
              }
            >
              Y
            </div>
            <div
              id="key-bl"
              className={
                (assembleur.controllerInput & 16) !== 0 ? "key-pressed" : ""
              }
            >
              J
            </div>
            <div
              id="key-br"
              className={
                (assembleur.controllerInput & 32) !== 0 ? "key-pressed" : ""
              }
            >
              K
            </div>
          </div>
        </div>
      </div>

      {/*Version*/}
      <p id="version">
        <a
          href="https://benjamin-bonneton.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          © Benjamin Bonneton
        </a>
        - v{VERSION}
      </p>
    </div>
  );
}

export default InterfacesPanel;
