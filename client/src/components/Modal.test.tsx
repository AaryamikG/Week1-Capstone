import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Modal from "./Modal";

describe("Modal", () => {
  it("renders the title and children", () => {
    render(
      <Modal title="New recipe" onClose={vi.fn()}>
        <p>form contents</p>
      </Modal>,
    );
    expect(screen.getByText("New recipe")).toBeInTheDocument();
    expect(screen.getByText("form contents")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <Modal title="New recipe" onClose={onClose}>
        <p>form contents</p>
      </Modal>,
    );
    await userEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
