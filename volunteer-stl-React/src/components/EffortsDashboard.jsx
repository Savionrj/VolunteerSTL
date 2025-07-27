import EffortCard from "./EffortCard";
import EffortFilterSection from "./EffortFilterSection";

export default function EffortsDashboard({efforts}){

  return (
    <div>
      < EffortFilterSection />
      <div className="grid grid-cols-3 ">
        {efforts.map((effort) =>
          <EffortCard key={effort.id} effort={effort} />
        )}
      </div>
    </div>
  );
}
