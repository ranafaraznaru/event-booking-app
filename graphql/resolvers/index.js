import { authResolvers } from "./auth.js";
import { eventsResolvers } from "./events.js";
import { bookingResolvers } from "./booking.js";

export const rootResolvers = {
  ...authResolvers,
  ...eventsResolvers,
  ...bookingResolvers,
};
