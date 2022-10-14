export type CapacityModification = {
  amount: number;
  entityId: string;
  guestReferenceId: string;
  bookingReferenceId?: string;
  teamMemberBooking: boolean;
};
