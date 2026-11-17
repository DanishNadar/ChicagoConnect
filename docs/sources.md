# Source viability

| Source | Mechanism | Authentication | Status |
| --- | --- | --- | --- |
| Chicago InfoSec Events | Public Google Calendar ICS | None | Implemented; live feed URL is fetched at sync time |
| Ticketmaster Discovery API | Official JSON API | Free developer API key | Implemented, optional; 5,000 calls/day and 5 req/s documented by Ticketmaster |
| University of Chicago Events | Feed builder supports RSS, ICAL, JSON | None | Documented candidate; organizer/filter URL must be selected before enabling |
| Meetup | GraphQL | OAuth/access required | Not implemented |
| Eventbrite | Public event-search API discontinued | N/A | Not implemented |
| Luma | Organizer-specific/public pages vary | Varies | Not implemented |

The Chicago InfoSec calendar is the verified no-key integration. Its discovery window is 60 days. No adapter bypasses bot protection, authentication, or a site’s access restrictions.
