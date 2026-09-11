import { NextResponse } from "next/server";
import {
  createBooking,
  getBookingsByCustomer,
  getBookingsBySalon,
  getAllBookings,
  getSalonById,
} from "@/lib/dbService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const salonId = searchParams.get("salonId");
    const isAdmin = searchParams.get("isAdmin") === "true";

    let bookings = [];
    if (customerId) {
      bookings = await getBookingsByCustomer(customerId);
    } else if (salonId) {
      bookings = await getBookingsBySalon(salonId);
    } else if (isAdmin) {
      bookings = await getAllBookings();
    } else {
      bookings = await getAllBookings();
    }

    return NextResponse.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.salonId || !body.serviceId || !body.date || !body.timeSlot || !body.customerName || !body.customerPhone) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required booking details (salon, service, date, time slot, and customer contact information).",
        },
        { status: 400 }
      );
    }

    const salon = await getSalonById(body.salonId);
    if (!salon) {
      return NextResponse.json({ success: false, error: "Salon not found" }, { status: 404 });
    }

    // Server-side conflict check: prevent double-booking the same stylist on the same slot
    const existingBookings = await getAllBookings();
    const hasConflict = existingBookings.some(
      (b) =>
        b.salonId === body.salonId &&
        b.date === body.date &&
        b.timeSlot === body.timeSlot &&
        b.status !== "cancelled" &&
        (body.staffId === "any" || b.staffId === "any" || b.staffId === body.staffId)
    );

    if (hasConflict) {
      return NextResponse.json(
        {
          success: false,
          error: `The slot "${body.timeSlot}" on ${body.date} has just been reserved by another client. Please select another slot.`,
        },
        { status: 409 }
      );
    }

    const service = salon.services.find((s) => s.id === body.serviceId);
    const staff = salon.staff.find((st) => st.id === body.staffId) || salon.staff[0] || {
      id: "any",
      name: "Any Available Stylist",
    };

    const booking = await createBooking({
      customerId: body.customerId || "cust-guest",
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || "customer@example.com",
      salonId: salon.id,
      salonName: salon.name,
      salonAddress: salon.address,
      salonPhone: salon.contactPhone,
      serviceId: body.serviceId,
      serviceName: service ? service.name : body.serviceName || "Salon Service",
      staffId: staff.id,
      staffName: staff.name,
      date: body.date,
      timeSlot: body.timeSlot,
      price: service ? service.price : body.price || 999,
      paymentStatus: body.paymentStatus || "pay_at_salon",
      paymentMethod: body.paymentMethod || "Pay at Salon (Cash / UPI / Card)",
      notes: body.notes || "",
    });

    return NextResponse.json({
      success: true,
      message: "Appointment booked successfully!",
      data: booking,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
