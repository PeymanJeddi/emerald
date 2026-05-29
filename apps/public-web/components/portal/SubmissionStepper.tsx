import { cn } from "@/lib/utils";

interface SubmissionStepperProps {
  steps: string[];
  currentStep: number;
}

export function SubmissionStepper({ steps, currentStep }: SubmissionStepperProps) {
  return (
    <ol className="mb-10 flex flex-wrap gap-2 border-b border-border pb-6">
      {steps.map((step, index) => {
        const num = index + 1;
        const active = num === currentStep;
        const done = num < currentStep;
        return (
          <li
            key={step}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm",
              active
                ? "border border-emerald bg-emerald text-ivory"
                : done
                  ? "border border-emerald/30 bg-ivory text-emerald"
                  : "border border-border text-graphite/60"
            )}
          >
            <span className="font-mono">{num}</span>
            <span className="hidden sm:inline">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
