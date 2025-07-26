import EffortCard from "./EffortCard";
import EffortFilterSection from "./EffortFilterSection";

export default function EffortsDashboard(){

  return (
    <div>
      < EffortFilterSection />
      <div>
        <EffortCard effort={{}} />
      </div>
    </div>
  );
}
