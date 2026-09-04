import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("submits the entered title, tag, and ingredient", async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await userEvent.type(
      screen.getByLabelText("Search by title"),
      "Chickpea",
    );
    await userEvent.type(screen.getByLabelText("Filter by tag"), "vegan");
    await userEvent.type(
      screen.getByLabelText("Filter by ingredient"),
      "lemon",
    );
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith({
      title: "Chickpea",
      tag: "vegan",
      ingredient: "lemon",
    });
  });

  it("omits empty fields as undefined", async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith({
      title: undefined,
      tag: undefined,
      ingredient: undefined,
    });
  });

  describe("debounced live search", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("does not search immediately on keystroke, but does after the debounce delay", () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);

      fireEvent.change(screen.getByLabelText("Search by title"), {
        target: { value: "Chick" },
      });
      expect(onSearch).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(onSearch).toHaveBeenCalledWith({
        title: "Chick",
        tag: undefined,
        ingredient: undefined,
      });
    });

    it("resets the debounce timer on further typing", () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);

      fireEvent.change(screen.getByLabelText("Search by title"), {
        target: { value: "Chick" },
      });
      vi.advanceTimersByTime(200);
      fireEvent.change(screen.getByLabelText("Search by title"), {
        target: { value: "Chickpea" },
      });
      vi.advanceTimersByTime(200);
      expect(onSearch).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(onSearch).toHaveBeenCalledOnce();
      expect(onSearch).toHaveBeenCalledWith({
        title: "Chickpea",
        tag: undefined,
        ingredient: undefined,
      });
    });

    it("does not search on mount before any typing", () => {
      const onSearch = vi.fn();
      render(<SearchBar onSearch={onSearch} />);

      vi.advanceTimersByTime(1000);

      expect(onSearch).not.toHaveBeenCalled();
    });
  });
});
