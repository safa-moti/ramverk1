import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Doc from "../pages/Doc";
import * as api from "../api/docs";
import { vi } from "vitest";

// Mocka API-anrop
vi.mock("../api/docs");


vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Doc-komponenten", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("visar formulär för nytt dokument", () => {
    render(
      <MemoryRouter initialEntries={["/doc"]}>
        <Routes>
          <Route path="/doc" element={<Doc />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Skapa nytt dokument/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Titel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Innehåll/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Skapa/i })).toBeInTheDocument();
  });

  test("skickar data vid skapande av nytt dokument", async () => {
    const payload = { title: "Ny titel", content: "Nytt innehåll" };
    api.createDoc.mockResolvedValue({ id: "1", ...payload });

    render(
      <MemoryRouter initialEntries={["/doc"]}>
        <Routes>
          <Route path="/doc" element={<Doc />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Titel/i), { target: { value: payload.title } });
    fireEvent.change(screen.getByLabelText(/Innehåll/i), { target: { value: payload.content } });
    fireEvent.click(screen.getByRole("button", { name: /Skapa/i }));

    await waitFor(() => expect(api.createDoc).toHaveBeenCalledWith(payload));
  });

  test("hämtar och visar existerande dokument", async () => {
    const existing = { id: "2", title: "Test", content: "Testinnehåll" };
    api.getOne.mockResolvedValue(existing);

    render(
      <MemoryRouter initialEntries={["/doc/2"]}>
        <Routes>
          <Route path="/doc/:id" element={<Doc />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByDisplayValue(existing.title)).toBeInTheDocument());
    expect(screen.getByDisplayValue(existing.content)).toBeInTheDocument();
  });
});
