import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Doc from "./Doc";
import * as api from "../api/docs";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("../api/docs");

describe("Doc-komponenten", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderWithRouter = (initialEntries = ["/doc"]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/doc/:id?" element={<Doc />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("visar formulär för nytt dokument", () => {
    renderWithRouter();

    expect(screen.getByLabelText(/Titel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Innehåll/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Skapa/i })).toBeInTheDocument();
  });

  it("skickar data vid skapande av nytt dokument", async () => {
    const payload = { title: "Ny titel", content: "Nytt innehåll" };
    api.createDoc.mockResolvedValue({ id: "1", ...payload });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/Titel/i), { target: { value: payload.title } });
    fireEvent.change(screen.getByLabelText(/Innehåll/i), { target: { value: payload.content } });
    fireEvent.click(screen.getByRole("button", { name: /Skapa/i }));

    await waitFor(() => expect(api.createDoc).toHaveBeenCalledWith(payload));
    // valfritt: kontrollera att navigate har kallats, om du mockar useNavigate
  });

  it("hämtar och visar existerande dokument", async () => {
    const existingDoc = { id: "2", title: "Existerande", content: "Innehåll" };
    api.getOne.mockResolvedValue(existingDoc);

    renderWithRouter(["/doc/2"]);

    await waitFor(() => {
      expect(screen.getByDisplayValue(existingDoc.title)).toBeInTheDocument();
      expect(screen.getByDisplayValue(existingDoc.content)).toBeInTheDocument();
    });
  });
});
