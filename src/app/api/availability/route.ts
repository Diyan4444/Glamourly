import { NextResponse } from "next/server";
import { getSalonById, getAllBookings } from "@/lib/dbService";

// Helper to convert "10:00 AM" or "02:30 PM" to minutes from midnight
function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 600; // default 10:00 AM
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3].toUpperCase();
  if (meridian === "PM" && hours < 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function formatMinutesToTime(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const meridian = hours24 >= 12 ? "PM" : "AM";
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  const paddedHours = hours12 < 10 ? `0${hours12}` : `${hours12}`;
  return `${paddedHours}:${paddedMins} ${meridian}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get("salonId");
    const date = searchParams.get("date"); // YYYY-MM-DD
    const staffId = searchParams.get("staffId") || "any";
    const serviceDuration = parseInt(searchParams.get("duration") || "45", 10);

    if (!salonId || !date) {
      return NextResponse.json(
        { success: false, error: "Missing salonId or date parameter." },
        { status: 400 }
      );
    }

    const salon = await getSalonById(salonId);
    if (!salon) {
      return NextResponse.json({ success: false, error: "Salon not found." }, { status: 404 });
    }

    // Determine Day of Week for selected date
    const dateObj = new Date(`${date}T00:00:00`);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = dayNames[dateObj.getDay()];

    // 1. Check salon operating hours for this day
    const daySchedule = salon.operatingHours?.find((h) => h.day.toLowerCase() === dayOfWeek.toLowerCase());
    if (!daySchedule || daySchedule.isClosed) {
      return NextResponse.json({
        success: true,
        isClosed: true,
        reason: `${salon.name} is closed on ${dayOfWeek}s.`,
        availableSlots: [],
      });
    }

    const openMinutes = parseTimeToMinutes(daySchedule.open || "10:00 AM");
    const closeMinutes = parseTimeToMinutes(daySchedule.close || "08:30 PM");

    // 2. Check if a specific stylist was chosen and if they work on this day
    if (staffId && staffId !== "any") {
      const staffMember = salon.staff?.find((st) => st.id === staffId);
      if (staffMember && staffMember.workingDays) {
        const worksOnDay = staffMember.workingDays.some(
          (d) => d.toLowerCase() === dayOfWeek.toLowerCase()
        );
        if (!worksOnDay) {
          return NextResponse.json({
            success: true,
            isClosed: false,
            staffOffDuty: true,
            reason: `${staffMember.name} does not take appointments on ${dayOfWeek}s.`,
            availableSlots: [],
          });
        }
      }
    }

    // 3. Fetch existing confirmed bookings for this salon and date
    const allBookings = await getAllBookings();
    const existingBookings = allBookings.filter(
      (b) =>
        b.salonId === salonId &&
        b.date === date &&
        b.status !== "cancelled" &&
        (staffId === "any" || b.staffId === staffId)
    );

    // Booked time ranges in minutes: [startMin, endMin]
    const bookedIntervals = existingBookings.map((b) => {
      const start = parseTimeToMinutes(b.timeSlot);
      return { start, end: start + 45 }; // each takes 45-60 min
    });

    // 4. Generate dynamic 30-minute stepping slots between open & close
    const slots: { time: string; available: boolean; reason?: string }[] = [];
    for (let m = openMinutes; m + serviceDuration <= closeMinutes; m += 30) {
      const slotTimeStr = formatMinutesToTime(m);
      const slotEnd = m + serviceDuration;

      // Check overlap
      const hasConflict = bookedIntervals.some(
        (interval) => m < interval.end && slotEnd > interval.start
      );

      slots.push({
        time: slotTimeStr,
        available: !hasConflict,
        reason: hasConflict ? "Booked by another client" : undefined,
      });
    }

    return NextResponse.json({
      success: true,
      salonName: salon.name,
      dayOfWeek,
      operatingHours: `${daySchedule.open} - ${daySchedule.close}`,
      availableSlots: slots,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Availability check failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
