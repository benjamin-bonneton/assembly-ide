// Styles
import "@styles/NavBar.css";

// Icons
import AppIcon from "@images/app.svg";
import CreateIcon from "@images/create.svg";
import OpenIcon from "@images/open.svg";
import SaveIcon from "@images/save.svg";
import UndoIcon from "@images/undo.svg";
import RedoIcon from "@images/redo.svg";
import NewIcon from "@images/new.svg";
import CloseIcon from "@images/close.svg";

interface NavBarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onNew?: () => void;
  onOpen?: () => void;
  onSaveAs?: () => void;
}

function NavBar({ onUndo, onRedo, onNew, onOpen, onSaveAs }: NavBarProps) {
  return (
    <nav>
      {/* Icon */}
      <img src={AppIcon} alt="App Icon" width={20} />

      {/* File Menu */}
      <div className="menu">
        <p className="title">File</p>
        <div className="options">
          <div
            className="item"
            onClick={() => {
              onNew?.();
            }}
          >
            <img src={CreateIcon} alt="New" />
            <p>New</p>
          </div>
          <div
            className="item"
            onClick={() => {
              onOpen?.();
            }}
          >
            <img src={OpenIcon} alt="Open" />
            <p>Open</p>
          </div>
          <div
            className="item"
            onClick={() => {
              onSaveAs?.();
            }}
          >
            <img src={SaveIcon} alt="Save" />
            <p>Save As</p>
          </div>
        </div>
      </div>

      {/* Edit Menu */}
      <div className="menu">
        <p className="title">Edit</p>
        <div className="options">
          <div
            className="item"
            onClick={() => {
              onUndo?.();
            }}
          >
            <img src={UndoIcon} alt="Undo" />
            <p>Undo</p>
          </div>
          <div
            className="item"
            onClick={() => {
              onRedo?.();
            }}
          >
            <img src={RedoIcon} alt="Redo" />
            <p>Redo</p>
          </div>
        </div>
      </div>

      {/* File Menu */}
      <div className="menu">
        <p className="title">Window</p>
        <div className="options">
          <div
            className="item"
            onClick={() => {
              window.open(window.location.href, "_blank");
            }}
          >
            <img src={NewIcon} alt="New" />
            <p>New</p>
          </div>
          <div
            className="item"
            onClick={() => {
              window.close();
            }}
          >
            <img src={CloseIcon} alt="Close" />
            <p>Close</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
