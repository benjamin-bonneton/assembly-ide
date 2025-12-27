# Assembly - Web Assembly Simulator

An interactive assembly language interpreter and simulator built with React, TypeScript, and Vite. This project allows you to write, execute, and debug assembly code directly in your browser with an intuitive visual interface.

## 🚀 Features

- **Integrated code editor** with syntax highlighting and autocomplete
- **Step-by-step** or continuous assembly code execution
- **Registers and memory** viewable in real-time
- **Peripheral interfaces**:
  - 🖥️ Pixel screen (32x32)
  - 📝 Text display
  - 🔢 Number display (signed/unsigned)
  - 🎮 Gamepad support
  - 🎲 Random number generator
- **Label and alias system** to simplify code
- **Error handling** with detailed messages
- **Code examples** provided to get started quickly

## 📦 Installation

```bash
# Clone the project
git clone <repo-url>
cd assembly-ide

# Install dependencies
npm install
```

## 🎮 Usage

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Lint the code
npm run lint
```

## 📝 Assembly Syntax

### Basic Instructions

- **LDI** - Load Immediate: `LDI r1 42`
- **STR** - Store: `STR r1 r2`
- **CMP** - Compare: `CMP r1 r2`
- **INC/DEC** - Increment/Decrement: `INC r1`
- **JMP** - Jump: `JMP .label`
- **BRH** - Branch: `BRH EQ .label`
- **HLT** - Halt: `HLT`

### Example: Hello World

```assembly
LDI r2 247    // Function to add letter
LDI r3 248    // Function to display letter

// Display H (code 8)
LDI r1 8
STR r2 r1

// Display E (code 5)
LDI r1 5
STR r2 r1

// Push buffer to screen
STR r3 r0

HLT
```

### Example: Loop with labels

```assembly
DEFINE max_value 3
LDI r1 max_value
LDI r2 0

.loop
CMP r1 r2
BRH EQ .end
INC r2
JMP .loop

.end
HLT
```

## 🎨 Special Memory Addresses

### Screen

- **240** - Pixel X (X coordinate)
- **241** - Pixel Y (Y coordinate)
- **242** - Draw pixel
- **243** - Clear pixel
- **244** - Read pixel
- **245** - Display screen buffer
- **246** - Clear screen buffer

### Character Display

- **247** - Write character to buffer
- **248** - Display character buffer
- **249** - Clear character buffer

### Number Display

- **250** - Display number
- **251** - Clear number display
- **252** - Signed mode
- **253** - Unsigned mode

### Peripherals

- **254** - Random number generator (RNG)
- **255** - Gamepad input

## 🏗️ Project Structure

```
src/
├── components/     # React components (Editor, NavBar)
├── hooks/          # Custom hooks (assembly engine, editor)
├── panels/         # Interface panels (Editor, Interfaces, Actions)
├── providers/      # Context providers (Assembleur)
├── types/          # TypeScript types
└── utils/          # Utilities (instructions, registers, memory)
```

## 🛠️ Technologies Used

- **React 19** - UI Framework
- **TypeScript** - Typed language
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code quality linter

## 📚 Provided Examples

Check the `public/examples/` folder for code examples:

- `interface_text_hello.as` - Text display
- `register_number_loop.as` - Loops and registers
- `interface_screen_pixel.as` - Pixel manipulation
- `interface_gamepad_detect.as` - Gamepad detection
- And more...

## 📄 License

See the [LICENSE](LICENSE) file for more details.
