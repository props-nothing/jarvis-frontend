import { Check, X } from "lucide-react";

export default function ApprovalDemo({ question, detail, onApprove, onDeny }: {
  question: string;
  detail: string;
  onApprove: () => void;
  onDeny: () => void;
}) {

  return (
    <div className="approval" role="group" aria-label="Illustrative approval request">
      <div className="approval__head">
        <span className="pill pill--amber">Approval needed</span>
        <span className="approval__risk">Example policy</span>
      </div>
      <h4 className="approval__ask">{question}</h4>
      <p className="approval__detail">{detail}</p>
      <div className="approval__actions">
          <button type="button" className="btn btn--solid" onClick={onApprove}>
            <Check size={16} aria-hidden /> Approve
          </button>
          <button type="button" className="btn btn--ghost" onClick={onDeny}>
            <X size={16} aria-hidden /> Deny
          </button>
      </div>
      <p className="approval__foot">This example waits here until you decide.</p>
    </div>
  );
}
