import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ToastProvider } from "./ToastContext";
import { useToast } from "./useToast";

function TestConsumer() {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast("success", "Recipe created.")}>
        fire success
      </button>
      <button onClick={() => showToast("error", "Something broke.")}>
        fire error
      </button>
    </div>
  );
}

describe("ToastProvider / useToast", () => {
  it("shows a success toast after showToast is called", async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByText("fire success"));

    expect(screen.getByText("Recipe created.")).toBeInTheDocument();
  });

  it("dismisses a toast when its dismiss button is clicked", async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByText("fire error"));
    expect(screen.getByText("Something broke.")).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText("Dismiss"));

    await waitFor(() =>
      expect(screen.queryByText("Something broke.")).not.toBeInTheDocument(),
    );
  });

  it("can show multiple toasts at once", async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByText("fire success"));
    await userEvent.click(screen.getByText("fire error"));

    expect(screen.getByText("Recipe created.")).toBeInTheDocument();
    expect(screen.getByText("Something broke.")).toBeInTheDocument();
  });
});
