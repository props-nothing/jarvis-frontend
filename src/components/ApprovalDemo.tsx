import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";

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
          <button type="button" className="btn btn--solid" onClick={() => setDecision("approved")}>
            <Check size={16} aria-hidden /> Approve
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => setDecision("denied")}>
            <X size={16} aria-hidden /> Deny
          </button>
          <span className="approval__hint">…or say “yes” / “no”</span>
        </div>
      ) : (
        <div className="approval__result" role="status">
          {decision === "approved" ? "Approved. JARVIS would send the email and record the outcome." : "Denied. JARVIS would not send the email."}
          <button type="button" className="icon-button" aria-label="Reset approval demo" title="Reset approval demo" onClick={() => setDecision("pending")}>
            <RotateCcw size={16} aria-hidden />
          </button>
        </div>
      )}
      <p className="approval__foot">Interactive demo. No email is involved.</p>
    </div>
  );
}
