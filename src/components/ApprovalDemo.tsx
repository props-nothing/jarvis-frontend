import { useState } from "react";

type Decision = "pending" | "approved" | "denied";

/** One yes or no, as in ADR-0136: the question is clear, the answer takes one click. */
export default function ApprovalDemo() {
  const [decision, setDecision] = useState<Decision>("pending");

  return (
    <div className={`approval approval--${decision}`}>
      <div className="approval__head">
        <span className="pill pill--amber">Approval needed</span>
        <span className="approval__risk">risk: reaches another person</span>
      </div>
      <p className="approval__ask">
        JARVIS wants to <strong>send an email</strong> to <code>dana@example.com</code>
      </p>
      <p className="approval__detail">
        Subject: “Thursday, moved to 10:00”. Drafted from your calendar change. Nothing is sent until you answer.
      </p>
      {decision === "pending" ? (
        <div className="approval__actions">
          <button className="btn btn--solid" onClick={() => setDecision("approved")}>
            Approve
          </button>
          <button className="btn btn--ghost" onClick={() => setDecision("denied")}>
            Deny
          </button>
          <span className="approval__hint">…or say “yes” / “no”</span>
        </div>
      ) : (
        <div className="approval__result" role="status">
          {decision === "approved" ? "✓ Approved. Sent, and written to the audit trail." : "✕ Denied. Nothing left your machine."}
          <button className="link" onClick={() => setDecision("pending")}>
            Try again
          </button>
        </div>
      )}
      <p className="approval__foot">Interactive demo. No email is involved.</p>
    </div>
  );
}
