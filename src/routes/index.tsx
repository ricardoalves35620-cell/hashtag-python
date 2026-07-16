import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // If there's an active CAT deployment stored, always open as CAT.
    // Switching to Regular (in mode-select) clears the deployment ID,
    // so this won't incorrectly re-enter CAT mode after a manual switch.
    const deploymentId = localStorage.getItem("planner_active_deployment_id");
    if (deploymentId) {
      localStorage.setItem("planner_work_mode", JSON.stringify("cat"));
      throw redirect({ to: "/today", replace: true });
    }
    // If a mode was previously chosen (but no active deployment), go straight in
    const storedMode = localStorage.getItem("planner_work_mode");
    if (storedMode) {
      throw redirect({ to: "/today", replace: true });
    }
    // Fresh start — let the user choose
    throw redirect({ to: "/mode-select", replace: true });
  },
  component: () => null,
});
