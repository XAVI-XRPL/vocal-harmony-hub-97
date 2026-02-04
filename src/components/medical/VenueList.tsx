import { Venue } from "@/types";
import { VenueCard } from "./VenueCard";

interface VenueListProps {
  venues: Venue[];
}

export function VenueList({ venues }: VenueListProps) {
  if (venues.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground text-sm">No venues found in this area</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
      <div className="flex gap-3 pb-2">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
