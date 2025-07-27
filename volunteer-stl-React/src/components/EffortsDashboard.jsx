import EffortCard from "./EffortCard";
import EffortFilterSection from "./EffortFilterSection";

export default function EffortsDashboard({efforts}){

  return (
    <div>
      < EffortFilterSection />
      <div>
        {efforts.map((effort) =>
          <EffortCard key={effort.id} effort={effort} />
        )}
      </div>
    </div>
  );
}
