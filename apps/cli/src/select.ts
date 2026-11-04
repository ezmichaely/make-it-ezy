import { stdin as input, stdout as output } from "node:process";

export type SelectChoice = {
  value: string;
  label: string;
};

/**
 * Arrow-key picker for TTY. Returns null if cancelled / non-TTY.
 */
export async function selectWithArrows(
  message: string,
  choices: SelectChoice[],
): Promise<string | null> {
  if (!choices.length) {
    return null;
  }
  if (!input.isTTY || !output.isTTY || typeof input.setRawMode !== "function") {
    return null;
  }

  let index = 0;

  const render = () => {
    output.write("\x1b[?25l"); // hide cursor
    output.write(`${message}\n`);
    choices.forEach((choice, i) => {
      const mark = i === index ? ">" : " ";
      output.write(` ${mark} ${choice.label}\n`);
    });
    output.write("  ↑/↓ move · Enter select · q cancel\n");
  };

  const clear = () => {
    const lines = choices.length + 2;
    for (let i = 0; i < lines; i++) {
      output.write("\x1b[1A\x1b[2K");
    }
  };

  return new Promise((resolve) => {
    const onData = (buf: Buffer) => {
      const s = buf.toString("utf8");
      if (s === "\u0003" || s === "q" || s === "Q") {
        cleanup();
        output.write("\n");
        resolve(null);
        return;
      }
      if (s === "\r" || s === "\n") {
        const value = choices[index]?.value ?? null;
        cleanup();
        output.write("\n");
        resolve(value);
        return;
      }
      // up
      if (s === "\u001b[A") {
        index = (index - 1 + choices.length) % choices.length;
        clear();
        render();
        return;
      }
      // down
      if (s === "\u001b[B") {
        index = (index + 1) % choices.length;
        clear();
        render();
      }
    };

    const cleanup = () => {
      input.off("data", onData);
      input.setRawMode(false);
      input.pause();
      output.write("\x1b[?25h");
    };

    input.setRawMode(true);
    input.resume();
    input.on("data", onData);
    render();
  });
}

export async function confirmYesNo(message: string): Promise<boolean> {
  if (!input.isTTY) {
    return false;
  }
  return new Promise((resolve) => {
    output.write(`${message} [y/N] `);
    input.resume();
    input.once("data", (buf) => {
      const answer = String(buf).trim().toLowerCase();
      input.pause();
      resolve(answer === "y" || answer === "yes");
    });
  });
}
